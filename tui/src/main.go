package main

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/lithammer/fuzzysearch/fuzzy"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"gopkg.in/alecthomas/kingpin.v2"
)

var (
	app     = kingpin.New("benq-control", "BenQ Projector Control REPL")
	server  = app.Flag("server", "Projector IP address").Default("192.168.1.80").String()
	port    = app.Flag("port", "Projector port").Default("8234").Int()
	timeout = app.Flag("timeout", "Connection timeout in seconds").Default("5").Int()
	dataDir = app.Flag("data-dir", "Path to data directory").Default("../data").String()
	logpath = app.Flag("logpath", "Path to log file (optional)").String()
	verbose = app.Flag("verbose", "Enable verbose logging").Short('v').Bool()
)

type CommandMap map[string]map[string]string

type Command struct {
	Key         string
	Description string
}

type HistoryEntry struct {
	Time     string
	Command  string
	Response string
}

type model struct {
	input       textinput.Model
	commands    []Command
	commandMap  map[string]string
	matches     []Command
	suggestions []Command
	selected    int
	history     []HistoryEntry
	lastCommand string
	mode        string
	server      string
	port        int
	timeout     time.Duration
	loading     bool
	err         error
}

var (
	titleStyle    = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("86"))
	dimStyle      = lipgloss.NewStyle().Foreground(lipgloss.Color("240"))
	selectedStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("170")).Bold(true)
	errorStyle    = lipgloss.NewStyle().Foreground(lipgloss.Color("196")).Bold(true)
	successStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("82"))
	boldStyle     = lipgloss.NewStyle().Bold(true)
	cyanStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("86"))
)

func loadCommands(filename string) ([]Command, map[string]string, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, nil, err
	}

	var cmdMap CommandMap
	if err := json.Unmarshal(data, &cmdMap); err != nil {
		return nil, nil, err
	}

	var commands []Command
	lookupMap := make(map[string]string)

	for _, cmds := range cmdMap {
		for key, desc := range cmds {
			display := fmt.Sprintf("%s (%s)", key, desc)
			commands = append(commands, Command{Key: display, Description: desc})
			lookupMap[display] = key
		}
	}

	log.Info().Msgf("Loaded %d commands", len(commands))
	return commands, lookupMap, nil
}

func sendCommand(server string, port int, timeout time.Duration, cmd string) (string, error) {
	log.Trace().Str("server", server).Int("port", port).Str("command", cmd).Msg("Connecting")

	conn, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", server, port), timeout)
	if err != nil {
		log.Error().Err(err).Msg("Connection failed")
		return "", err
	}
	defer conn.Close()

	conn.SetDeadline(time.Now().Add(timeout))

	if _, err := conn.Write([]byte(fmt.Sprintf("\r*%s#\r", cmd))); err != nil {
		log.Error().Err(err).Msg("Send failed")
		return "", err
	}

	buf := make([]byte, 1024)
	n, err := conn.Read(buf)
	if err != nil {
		log.Error().Err(err).Msg("Read failed")
		return "", err
	}

	log.Trace().Str("response", string(buf[:n])).Msg("Received")
	return strings.TrimSpace(string(buf[:n])), nil
}

type sendCommandMsg struct {
	response string
	err      error
}

func (m model) sendCommandCmd(cmd string) tea.Cmd {
	return func() tea.Msg {
		resp, err := sendCommand(m.server, m.port, m.timeout, cmd)
		return sendCommandMsg{response: resp, err: err}
	}
}

func initialModel(server string, port int, timeout int) model {
	ti := textinput.New()
	ti.Placeholder = "Search commands (type '.' to repeat last)..."
	ti.Focus()
	ti.CharLimit = 156
	ti.Width = 50

	commands, cmdMap, err := loadCommands(fmt.Sprintf("%s/commands.json", *dataDir))
	if err != nil {
		log.Error().Err(err).Msg("Failed to load commands")
	}

	return model{
		input:      ti,
		commands:   commands,
		commandMap: cmdMap,
		mode:       "input",
		server:     server,
		port:       port,
		timeout:    time.Duration(timeout) * time.Second,
		err:        err,
	}
}

func (m model) Init() tea.Cmd {
	return textinput.Blink
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q":
			if m.mode == "input" && m.input.Value() == "" {
				log.Info().Msg("User quit")
				return m, tea.Quit
			}

		case "ctrl+l":
			log.Info().Msg("Clearing history")
			m.history = []HistoryEntry{}
			m.err = nil
			return m, nil

		case "tab":
			if m.mode == "input" && len(m.suggestions) > 0 {
				m.input.SetValue(m.suggestions[0].Key)
				m.input.CursorEnd()
				return m, nil
			}

		case "esc":
			if m.mode == "select" {
				m.mode = "input"
				m.matches = []Command{}
				m.selected = 0
			} else if m.mode == "input" {
				m.suggestions = []Command{}
				m.input.SetValue("")
			}
			return m, nil

		case "enter":
			if m.mode == "input" {
				query := strings.TrimSpace(m.input.Value())
				if query == "" {
					return m, nil
				}

				if query == "." {
					if m.lastCommand != "" {
						log.Info().Str("command", m.lastCommand).Msg("Repeating last command")
						m.input.SetValue("")
						m.loading = true
						return m, m.sendCommandCmd(m.lastCommand)
					}
					return m, nil
				}

				log.Debug().Str("query", query).Msg("Searching commands")

				var matches []Command
				for _, cmd := range m.commands {
					if fuzzy.MatchFold(query, cmd.Key) {
						matches = append(matches, cmd)
					}
				}

				if len(matches) == 0 {
					log.Debug().Msg("No matches found")
					m.err = fmt.Errorf("no matching commands found")
					return m, nil
				}

				log.Debug().Int("count", len(matches)).Msg("Found matches")
				m.matches = matches
				m.mode = "select"
				m.selected = 0
				m.err = nil
				return m, nil

			} else if m.mode == "select" && m.selected < len(m.matches) {
				actualCmd := m.commandMap[m.matches[m.selected].Key]
				log.Info().Str("command", actualCmd).Msg("User selected command")

				m.lastCommand = actualCmd
				m.mode = "input"
				m.matches = []Command{}
				m.selected = 0
				m.input.SetValue("")
				m.loading = true
				return m, m.sendCommandCmd(actualCmd)
			}

		case "up":
			if m.mode == "select" && m.selected > 0 {
				m.selected--
			}

		case "down":
			if m.mode == "select" && m.selected < len(m.matches)-1 {
				m.selected++
			}
		}

	case sendCommandMsg:
		m.loading = false
		response := msg.response
		if msg.err != nil {
			m.err = msg.err
			response = fmt.Sprintf("Error: %v", msg.err)
		} else {
			m.err = nil
		}

		m.history = append(m.history, HistoryEntry{
			Time:     time.Now().Format("15:04:05"),
			Command:  m.lastCommand,
			Response: response,
		})
		return m, nil
	}

	oldValue := m.input.Value()
	var cmd tea.Cmd
	m.input, cmd = m.input.Update(msg)

	if m.mode == "input" && oldValue != m.input.Value() {
		m.suggestions = []Command{}
		newValue := m.input.Value()
		if newValue != "" && newValue != "." {
			for _, c := range m.commands {
				if fuzzy.MatchFold(newValue, c.Key) {
					m.suggestions = append(m.suggestions, c)
					if len(m.suggestions) >= 5 {
						break
					}
				}
			}
		}
	}

	return m, cmd
}

func (m model) View() string {
	if m.err != nil && len(m.commands) == 0 {
		return errorStyle.Render("Error: commands.json not found\n")
	}

	var s strings.Builder

	s.WriteString(titleStyle.Render("BenQ Projector Control REPL") + "\n")
	s.WriteString(dimStyle.Render(fmt.Sprintf("Connected to %s:%d", m.server, m.port)) + "\n")
	s.WriteString(dimStyle.Render(strings.Repeat("=", 50)) + "\n\n")

	if len(m.history) > 0 {
		s.WriteString(boldStyle.Render("Command History:") + "\n")
		s.WriteString(dimStyle.Render(strings.Repeat("-", 50)) + "\n")

		start := 0
		if len(m.history) > 5 {
			start = len(m.history) - 5
		}

		for _, entry := range m.history[start:] {
			s.WriteString(dimStyle.Render(entry.Time) + " ")
			s.WriteString(cyanStyle.Render(entry.Command) + "\n  ")
			if strings.HasPrefix(entry.Response, "Error:") {
				s.WriteString(errorStyle.Render(entry.Response))
			} else {
				s.WriteString(successStyle.Render("✓ " + entry.Response))
			}
			s.WriteString("\n")
		}
		s.WriteString("\n")
	}

	if m.mode == "input" {
		s.WriteString("Enter command (fuzzy search) or 'q' to quit:\n")
		s.WriteString(dimStyle.Render("Examples: power on, keystone, hdmi, brightness, lamp") + "\n")
		s.WriteString(dimStyle.Render("Type '.' to repeat last command • Tab to autocomplete • Ctrl+L to clear") + "\n\n")
		s.WriteString(m.input.View() + "\n")

		if m.loading {
			s.WriteString("\n" + dimStyle.Render(fmt.Sprintf("⏳ Sending: %s...", m.lastCommand)))
		}

		if len(m.suggestions) > 0 {
			s.WriteString("\n" + dimStyle.Render("Suggestions:") + "\n")
			for i, suggestion := range m.suggestions {
				if i >= 5 {
					break
				}
				s.WriteString(dimStyle.Render(fmt.Sprintf("  %s", suggestion.Key)) + "\n")
			}
		}

		if m.err != nil {
			s.WriteString("\n" + errorStyle.Render(m.err.Error()))
		}

	} else if m.mode == "select" {
		s.WriteString(boldStyle.Render("Matching commands:") + "\n\n")

		for i, cmd := range m.matches {
			if i >= 10 {
				break
			}

			if i == m.selected {
				s.WriteString(selectedStyle.Render(fmt.Sprintf("▶ %s", cmd.Key)))
			} else {
				s.WriteString(fmt.Sprintf("  %s", cmd.Key))
			}
			s.WriteString("\n")
		}

		s.WriteString("\n" + dimStyle.Render("↑/↓: navigate • Enter: select • Esc: cancel"))
	}

	return s.String()
}

func main() {
	kingpin.MustParse(app.Parse(os.Args[1:]))

	if *verbose {
		zerolog.SetGlobalLevel(zerolog.TraceLevel)
	} else {
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	}

	if *logpath != "" {
		logFile, err := os.OpenFile(*logpath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to open log file: %v\n", err)
			os.Exit(1)
		}
		defer logFile.Close()
		log.Logger = zerolog.New(logFile).With().Timestamp().Logger()
	} else {
		log.Logger = zerolog.Nop()
	}

	log.Info().
		Str("server", *server).
		Int("port", *port).
		Int("timeout", *timeout).
		Bool("verbose", *verbose).
		Msg("Starting BenQ Control")

	if _, err := tea.NewProgram(initialModel(*server, *port, *timeout)).Run(); err != nil {
		log.Error().Err(err).Msg("Program error")
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	log.Info().Msg("Program ended")
}
