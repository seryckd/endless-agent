<!--
Design spec for the Endless Auto-Shooter (HTML Canvas, Keyboard-only)
Generated: 2026-02-15
-->
# Endless Auto-Shooter — Design Specification

## Summary

An endless, vertical-scrolling shooter for desktop browsers using HTML5 Canvas. The player controls lateral movement (left/right) via keyboard and automatically fires. Enemies continuously spawn from the top and descend. Power-ups appear mixed among enemies and can be collected to upgrade the player's weapons or grant temporary effects. The objective is to survive as long as possible and maximize score via combos and pickups.

## Project Contract

- Inputs: Keyboard only (Left / Right, optionally A/D). Pause = `P` or `Space`.
- Outputs: Canvas-rendered visuals, audio SFX, localStorage persistence for high score/unlocks.
- Platform: Desktop browsers (Chrome, Firefox, Safari, Edge). No mobile/touch or gamepad support in this scope.
- Success criteria: responsive controls, stable 60 FPS on typical desktop browsers, meaningful power-ups, and a playable MVP.

## Scope & Constraints

- Client-only; no server required. Use localStorage for persistence.
- Art: programmatic shapes or placeholder sprites for prototype; replaceable later.
- Input: keyboard only (no touch/gamepad).
- Performance: 60 FPS target; degrade gracefully to 30 FPS on heavy load.

## High-level Gameplay Loop

1. Player spawns near bottom-center.
2. Enemies spawn continuously from top and follow behavior patterns.
3. Player moves left/right and auto-fires bullets at a fixed cadence.
4. Collisions resolve between bullets/enemies, enemies/player, and player/power-ups.
5. Difficulty scales over time; new enemy types introduced at thresholds.
6. Run ends when player health reaches zero.

## Core Mechanics & Rules

Player
- Movement: X-axis only, keyboard Left/Right. Default is arcade instantaneous movement (configurable to acceleration model).
- Shooting: Auto-fire at base fireRate (e.g., 6 shots/sec). Bullets travel upward and despawn off-screen.
- Stats (default): maxHealth = 3, speed = 320 px/s, fireRate = 6 shots/sec, bulletDamage = 1.

Enemies & Spawn
- Controlled by spawn parameters: spawnRate, spawnVariance, spawn patterns, activeEnemyCap.
- Movement: descending with possible lateral motion or homing for advanced types.

Collision & Physics
- Use simple circle or AABB collisions. Broad-phase spatial partitioning if entity counts grow.
- Update logic must be frame-rate independent (use delta time).

Scoring & Multiplier
- Points per enemy type. Multiplier increases with consecutive kills within a time window; decays otherwise.

Power-ups
- Delivery: drop as falling pickup objects or released from destructible crates.
- Collection: collision with player.
- Duration model: temporary timers (collect again to refresh/upgrade) and persistent unlocks stored in localStorage.

## Power-up Examples

- Spread Shot (temporary): multi-bullet spread for N seconds.
- Rapid Fire (temporary): higher fireRate for N seconds.
- Piercing Rounds (temporary): bullets pass through enemies.
- Shield (temporary): absorb one hit.
- Health Pack (instant): restore 1 health.
- Bomb (instant): clear nearby enemies.

Rarity tiers: Common, Rare, Epic. Drop chances tuned to balance risk/reward.

## Enemy Archetypes

- Grunt: straight descent, HP=1, low points.
- ZigZag: sine lateral motion while descending.
- Shooter: fires downward bullets periodically.
- Kamikaze: homes in on player's X and dives.
- Splitter: splits into smaller enemies on death.
- Shielded: has shield that must be broken first.
- Mini-boss: rare, higher HP and multi-pattern attacks.

## Difficulty Scaling

- Time-based difficulty curve used to modify spawnRate and enemySpeed.
- Introduce new enemy types and spawn waves at thresholds.
- Cap active enemy count for performance and fairness.

## UI / HUD

- Display Score, Multiplier, Run Time, Health/Lives, Active Power-ups with timers.
- Pause overlay (`P` / `Space`).
- Accessibility: colorblind palette and scalable fonts.

## Audio & VFX

- SFX for shooting, hits, pickups; optional music with mute toggle.
- Particle explosions (capped) for performance.

## Technical Architecture

- Entry: `index.html` loads JS bundle or script.
- Rendering: HTML5 Canvas; game loop via `requestAnimationFrame`.
- Update: use delta time in update(dt) for frame-rate independence.
- Entity system: base `Entity` class with `update`, `render`, `bounds`.
- Collision: circle/AABB; spatial grid for heavy loads.
- Input: keyboard state tracking for left/right.
- Persistence: localStorage keys for `highScore`, `settings`, `unlocks`.

Suggested File Layout

- `index.html` — canvas host and UI shell
- `src/` — source files
  - `main.ts` / `main.js` — bootstrap
  - `engine/` — `gameLoop`, `input`, `entity`, `collision`, `audio`
  - `entities/` — `player`, `bullet`, `enemy`, `powerup`, `particle`
  - `ui/` — HUD and settings
  - `assets/` — images and sfx

## MVP Requirements

- Player left/right movement and auto-fire.
- One enemy type (Grunt) spawning at a constant rate.
- One power-up (Spread Shot) that drops occasionally and is collectible.
- Score HUD and health display. Pause and restart.

## Initial Tuning Parameters

- Player: maxHealth=3, speed=320 px/s, fireRate=6/s, bulletSpeed=700 px/s.
- Enemy (Grunt): spawnRateBase=0.8/s (~1.25s spawn), speed=120 px/s, HP=1, points=10.
- Difficulty growth: spawnRateIncrease=+0.02/s, speedMultiplierIncrease=+0.005/s.
- Power-up dropChance=0.06 per enemy destroyed; spreadDuration=8s.

## Balancing & Edge Cases

- Guard against power-up spam via rarity and timers.
- Pause on window blur and large resizes.
- Cap particle counts and perform spatial partitioning for collisions.

## Testing Strategy

- Unit tests for movement math, collision logic, and power-up timers.
- Visual/manual tests for playthrough flows.
- Performance stress test for entity/particle counts.

## Acceptance Criteria

- Player responds to left/right keys and auto-fires at configured rate.
- Bullets collide and destroy Grunt enemies, awarding points and occasional power-ups.
- Spread Shot power-up modifies shooting behavior for its duration.
- Game maintains near-60 FPS with modest active entities.
- High score persists to localStorage.

## Next Steps

1. Implement MVP scaffold (index + main + game loop + player + grunt + spread power-up).
2. Playtest and tune spawn/HP/score parameters.
3. Add more enemies, UI polish, audio, and persistent unlocks.

---

*Spec generated and saved to `spec/spec.md`. For changes, edit this file and update tuning tables as playtests produce new data.*
