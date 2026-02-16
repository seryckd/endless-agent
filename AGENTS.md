# Design Document

Read the design specs in the /spec folder.

# Tool & Technology Choices

## Project Overview
**Endless Auto-Shooter** is a desktop browser-based, vertical-scrolling shooter game built with HTML5 Canvas. The game is client-only with no server backend, focusing on responsive gameplay, persistent high scores, and a scalable entity/collision system.

## Core Technology Stack

### Rendering Engine
- **HTML5 Canvas 2D API** — Direct choice for this project.
  - **Why:** Suitable for 2D sprite-based games with straightforward rendering needs. Provides pixel-perfect control and good performance at 60 FPS target with typical entity counts (100–500 entities on modest hardware).
  - **Alternative considered:** WebGL would be overkill for this non-3D, 2D-only scope and would complicate asset pipelines.

### Game Loop & Timing
- **requestAnimationFrame (rAF)** — Browser's native frame scheduling.
  - **Why:** Syncs rendering to the monitor refresh rate, eliminates tearing, and is energy-efficient. Decouples render rate from game state updates via delta-time (dt) in the update loop.
  - **Pattern:** `update(dt)` for logic, `render()` for graphics; ensures frame-rate independence.

### Language
- **JavaScript (or TypeScript)** — Flexible, widely supported in browsers; types optional.
  - **Why:** Direct DOM integration, localStorage API access, and dev tooling maturity.
  - **Recommendation:** Start with plain JS for MVP speed; migrate to TS later if codebase grows beyond ~3K LOC.

### Input Handling
- **Keyboard events (keydown/keyup)** — Native browser event model.
  - **Why:** Simple, low-latency, and meets the keyboard-only input requirement. No gamepad/touch in scope.
  - **Implementation pattern:** State-based key tracking (e.g., `keysPressed` object) for responsive, frame-synchronized input.

### Persistence
- **localStorage API** — Built-in browser storage for high scores, settings, unlocks.
  - **Why:** No server required; meets the client-only constraint. Simple key-value API; ~5–10 MB quota per origin on most browsers.
  - **Use cases:** `highScore`, `settings` (volume, colorblind mode), `unlockedPowerups`.

### Audio
- **Web Audio API** or **HTML Audio Elements** — Native browser audio.
  - **Why:** Low-latency audio for SFX (shoot, hit, powerup). Web Audio is preferred for precise timing; HTML Audio is simpler for music loops.
  - **Scope:** SFX cues (explosion, hit, pickup); optional background music with mute toggle.

### Asset Management
- **Static sprite/font files** in `assets/` folder.
  - **Images:** PNG/WebP for sprites and backgrounds; programmatic shapes (canvas primitives) for prototypes.
  - **Audio:** MP3 or OGG for SFX and music.
  - **Fonts:** Web Fonts (Google Fonts or bundled TTF) for HUD text and UI.

### Collision Detection
- **Axis-Aligned Bounding Box (AABB)** or **Circle collisions** — Simple geometric checks.
  - **Why:** Sufficient for a prototype; fast enough for 100–500 entities. No physics engine needed.
  - **Optimization (if needed):** Spatial grid/quadtree for broad-phase filtering when entity count exceeds 500.

### Entity System
- **Base `Entity` class** with `update()`, `render()`, `bounds` properties.
  - **Why:** Provides a scalable pattern for Player, Enemy, Bullet, PowerUp, Particle.
  - **Pattern:** Composition over inheritance; mixins or component-based approach for complex behaviors (e.g., HomingAI, ShieldBehavior).

### Performance Targets
- **60 FPS on typical desktop browsers** (Chrome, Firefox, Safari, Edge).
- **Graceful degradation to 30 FPS** on heavy load.
- **Delta-time-based updates** ensure gameplay remains consistent across frame rates.
- **Particle cap** (e.g., 200 particles max) and spatial partitioning to prevent runaway CPU usage.

## Build & Bundling (Optional)
- **No bundler required for MVP.** Single `index.html` with inline or linked `<script>` tags.
- **Future consideration:** Vite or Webpack if TypeScript, modules, or large asset pipelines become necessary.

## Testing
- **Unit tests** for movement math, collision logic, power-up timers (Jest or Vitest).
- **Visual/manual playtesting** for feel, difficulty balance, and edge cases.
- **Performance profiling** via Chrome DevTools Performance tab to verify 60 FPS and memory usage.

## Development Workflow
- **Version control:** Git (already in use; sync with `bd sync`).
- **Issue tracking:** `bd` (beads) for task management.
- **Local server (optional):** `python -m http.server 8000` or VS Code Live Server extension for development.

---

**Summary:** This stack prioritizes simplicity, browser compatibility, and direct access to the DOM and Canvas APIs. No heavy frameworks or external dependencies are required for the MVP, keeping the project lightweight and fast-moving.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
