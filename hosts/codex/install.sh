#!/usr/bin/env sh
# Install the Introspection Agent Builder adapter for OpenAI Codex CLI.
# Copies the shared core skills and the custom prompts into ~/.codex, and
# prints the MCP config left for the user to merge (config edits and
# credentials stay manual on purpose).
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"

mkdir -p "$CODEX_HOME/prompts" "$CODEX_HOME/introspection"

cp -R "$REPO_ROOT/core" "$CODEX_HOME/introspection/"
for f in "$SCRIPT_DIR"/prompts/*.md; do
  cp "$f" "$CODEX_HOME/prompts/introspection-$(basename "$f")"
done

echo "Installed:"
echo "  core skills -> $CODEX_HOME/introspection/core/skills/"
echo "  prompts     -> $CODEX_HOME/prompts/introspection-{new-agent,deploy,run,routine}.md"
echo
echo "Next steps (manual):"
echo "  1. Merge $SCRIPT_DIR/config.toml.example into $CODEX_HOME/config.toml"
echo "  2. Set INTROSPECTION_MCP_URL and INTROSPECTION_API_TOKEN in your shell profile"
