# Claude Commands

This directory contains custom Claude Code slash commands for this project.

## Available Commands

### `/commit [optional message]`

Creates git commits following the project's Git commit guidelines from `docs/processes/GIT_COMMITS.md`.

**Usage:**
- `/commit` - Analyzes changes and creates appropriate commit(s) with generated messages
- `/commit "feat: add new feature"` - Creates a commit with the specified message

**Features:**
- Follows project commit message format (`<type>: <subject>`)
- Batches changes into logical commits
- Handles staging and unstaging appropriately
- Chains git operations to minimize conflicts
- Leaves codebase in working state after each commit
- Safety checks to prevent destructive operations

**Behavior:**
1. Shows current git status, staged/unstaged changes, and recent commit history
2. Analyzes changes and suggests appropriate batching
3. Creates commit(s) with proper formatting
4. Confirms success with recent commit log

**Safety Features:**
- Never performs destructive operations
- Asks user if encountering conflicts or issues
- Quotes file paths with special characters
- Chains operations to minimize interference

## Command Development

Commands are defined in Markdown files with frontmatter specifying:
- `allowed-tools`: Git operations permitted
- `description`: Command purpose
- `argument-hint`: Usage hint for arguments

See `commit.md` for implementation details.