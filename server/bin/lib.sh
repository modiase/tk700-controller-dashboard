#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
# shellcheck disable=SC2034
PURPLE='\033[0;35m'
# shellcheck disable=SC2034
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'

log_error() {
  local padded_label
  local padded_level
  padded_label="$(_pad_center "develop" 20)"
  padded_level="$(_pad_center "error" 7)"
  echo -e "$(date '+%H:%M:%S') | ${GRAY}${padded_label}${NC} | ${RED}${padded_level}${NC} | $1" >&2
}

log_warn() {
  local padded_label
  local padded_level
  padded_label="$(_pad_center "develop" 20)"
  padded_level="$(_pad_center "warn" 7)"
  echo -e "$(date '+%H:%M:%S') | ${GRAY}${padded_label}${NC} | ${YELLOW}${padded_level}${NC} | $1"
}

log_info() {
  local padded_label
  local padded_level
  padded_label="$(_pad_center "develop" 20)"
  padded_level="$(_pad_center "info" 7)"
  echo -e "$(date '+%H:%M:%S') | ${GRAY}${padded_label}${NC} | ${WHITE}${padded_level}${NC} | $1"
}

log_success() {
  local padded_label
  local padded_level
  padded_label="$(_pad_center "develop" 20)"
  padded_level="$(_pad_center "success" 7)"
  echo -e "$(date '+%H:%M:%S') | ${GRAY}${padded_label}${NC} | ${GREEN}${padded_level}${NC} | $1"
}

_pad_center() {
  local str="$1"
  local width="$2"
  local len=${#str}
  local padding=$((width - len))
  local left=$((padding / 2))
  local right=$((padding - left))

  printf "%*s%s%*s" $left "" "$str" $right ""
}
