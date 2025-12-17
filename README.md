# BenQ Projector Control

A clean, modern TUI for controlling BenQ projectors over TCP.

## Features

- 🎨 **Beautiful TUI** powered by Bubbletea
- 🔍 **Fuzzy search** for commands
- ⚡ **Live typeahead** - suggestions as you type
- 📝 **Tab autocomplete** - complete with first suggestion
- 📜 **Command history** (last 5 commands shown)
- 🔄 **Repeat last command** with `.`
- 📋 **Logging** to `benq_control.log` with zerolog
- ⌨️  **Keyboard navigation** (↑/↓, Enter, Esc, Tab)
- 🎯 **Simple CLI** with kingpin

## Usage

```bash
# Run with defaults
./benq-control

# Custom server/port
./benq-control --server 192.168.1.100 --port 8234

# Verbose logging
./benq-control --verbose

# See all options
./benq-control --help
```

## Development

```bash
# Enter nix shell
nix-shell

# Run directly
go run main.go

# Build binary
go build -o benq-control main.go
```

## Keyboard Shortcuts

- **Input mode:**
  - Type to search commands (live suggestions with fuzzy matching)
  - `Tab` to autocomplete with first suggestion
  - `.` to repeat last command
  - `Ctrl+L` to clear history
  - `Esc` to clear input
  - `Enter` to search and select
  - `q` to quit (when input is empty)

- **Selection mode:**
  - `↑/↓` to navigate
  - `Enter` to select and execute
  - `Esc` to cancel

## Architecture

- **Bubbletea**: Modern TUI framework (Elm architecture)
- **Lipgloss**: Styling and colors
- **Kingpin**: CLI argument parsing
- **Zerolog**: Structured logging
- **Fuzzy search**: Command matching

## Why Go + Bubbletea?

✅ Clean, predictable state management (Elm architecture)
✅ Proper async command execution
✅ Beautiful rendering with lipgloss
✅ No janky terminal handling
✅ Type-safe, compiled binary
✅ Fast and lightweight
