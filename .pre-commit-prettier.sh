#!/bin/bash
set -e

cd server

files=()
for file in "$@"; do
  # Remove server/ prefix if present
  file="${file#server/}"
  files+=("$file")
done

pnpm exec prettier --write "${files[@]}"
