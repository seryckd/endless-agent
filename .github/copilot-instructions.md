## Issue Tracking

This project uses **bd (beads)** for issue tracking.
Run `bd prime` for workflow context.

**Quick reference:**
- `bd ready` - Find unblocked work
- `bd create "Title" --type task --priority 2` - Create issue
- `bd close <id>` - Complete work
- `bd sync` - Sync with git (run at session end)

### Task Execution Strategy
- **⚠️ IMPORTANT:** When starting work on a task from the tracker, first evaluate its scope.
- **If the task is large:** Break it down into smaller, concrete subtasks and **add all subtasks to the tracker BEFORE beginning any implementation work** then sync with `bd sync` and **STOP** to watch for the next instruction.
- **Goal:** Maintain visibility into work progress and avoid context-switching surprises.
- **Example:** "Implement audio system" → Subtasks: "Setup Web Audio API wrapper", "Create SFX loader", "Implement mute toggle", "Add background music loop".