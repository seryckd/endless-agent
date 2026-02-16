/* ============================================================================
   Main Game Initialization and Loop
   ============================================================================ */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.isRunning = true;
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = 0;
        
        // Game entities
        this.entities = [];
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.particles = [];
        
        // Enemy manager
        this.enemyManager = null;
        
        // Power-up manager
        this.powerUpManager = null;
        
        // Collision manager
        this.collisionManager = null;
        
        // Scoring system
        this.scoringSystem = null;
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        
        // Input handling
        this.setupInputHandling();
        
        // UI
        this.setupUI();
        
        // Initialize game entities
        this.initializeGame();
        
        // Start the game loop
        this.start();
    }
    
    setupInputHandling() {
        // Input handler manages all keyboard state
        // Access via global 'input' object created in InputHandler.js
        this.input = window.input;
    }
    
    setupUI() {
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }
    }
    
    initializeGame() {
        // Create player at center-bottom of screen
        const playerX = this.width / 2 - 15; // Center (player is 30px wide)
        const playerY = this.height - 60;
        const player = new Player(playerX, playerY);
        this.addEntity(player);
        
        // Create scoring system
        this.scoringSystem = new ScoringSystem(this);
        
        // Create enemy manager
        this.enemyManager = new EnemyManager(this.width, this.height, this);
        
        // Create power-up manager
        this.powerUpManager = new PowerUpManager(this);
        
        // Create collision manager
        this.collisionManager = new CollisionManager(this);
    }
    
    start() {
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    gameLoop(timestamp) {
        // Calculate delta time
        if (this.lastFrameTime === 0) {
            this.lastFrameTime = timestamp;
        }
        
        this.deltaTime = Math.min((timestamp - this.lastFrameTime) / 1000, 0.016); // Cap at 60 FPS
        this.lastFrameTime = timestamp;
        
        // Update
        this.update(this.deltaTime);
        
        // Render
        this.render();
        
        // Update FPS every 100ms
        this.frameCount++;
        if (timestamp - this.lastFpsUpdate >= 100) {
            this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = timestamp;
        }
        
        // Continue loop
        if (this.isRunning) {
            requestAnimationFrame((ts) => this.gameLoop(ts));
        }
    }
    
    update(dt) {
        if (this.gameOver) return;
        
        // Clear per-frame input state
        this.input.clearFrameInput();
        
        // Update scoring system
        if (this.scoringSystem) {
            this.scoringSystem.update(dt);
        }
        
        // Update enemy manager to spawn new enemies
        if (this.enemyManager) {
            this.enemyManager.update(dt);
        }
        
        // Update power-up manager to spawn new power-ups
        if (this.powerUpManager) {
            this.powerUpManager.update(dt);
        }
        
        // Update player with input and canvas bounds
        if (this.player && !this.player.isDead) {
            this.player.update(dt, this.input, this.width, this.height);
            
            // Add player bullets to bullets list
            for (let bullet of this.player.bullets) {
                this.addEntity(bullet);
            }
            this.player.bullets = [];
        }
        
        // Update all enemies
        for (let enemy of this.enemies) {
            if (!enemy.isDead) {
                enemy.update(dt, this.width, this.height);
                
                // Add enemy bullets to game
                for (let bullet of enemy.bullets) {
                    this.addEntity(bullet);
                }
                enemy.bullets = [];
            }
        }
        
        // Update all other entities
        for (let entity of this.entities) {
            if (entity !== this.player && entity.type !== 'enemy' && entity.update) {
                if (entity.type === 'bullet' || entity.type === 'enemyBullet') {
                    entity.update(dt);
                } else {
                    entity.update(dt);
                }
            }
        }
        
        // Remove off-screen bullets
        this.bullets = this.bullets.filter(b => !b.isOffScreen(this.height));
        this.entities = this.entities.filter(e => !(e.type === 'bullet' && e.isOffScreen(this.height)));
        
        // Remove off-screen enemy bullets
        this.entities = this.entities.filter(e => !(e.type === 'enemyBullet' && e.isOffScreen(this.height)));
        
        // Check collisions
        if (this.collisionManager) {
            this.collisionManager.checkCollisions();
        }
        
        // Check if player is dead
        if (this.player && this.player.isDead) {
            this.gameOverState();
        }
        
        // Remove dead entities
        this.entities = this.entities.filter(e => !e.isDead);
        this.enemies = this.enemies.filter(e => !e.isDead);
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0f3460';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Render all entities
        for (let entity of this.entities) {
            if (entity.render) {
                entity.render(this.ctx);
            }
        }
        
        // Update HUD
        this.updateHUD();
    }
    
    updateHUD() {
        const scoreElement = document.getElementById('score');
        const multiplierElement = document.getElementById('multiplier');
        const healthElement = document.getElementById('health');
        const fpsElement = document.getElementById('fps');
        
        if (scoreElement && this.scoringSystem) {
            scoreElement.textContent = `Score: ${this.scoringSystem.getScore()}`;
        }
        
        if (multiplierElement && this.scoringSystem) {
            multiplierElement.textContent = `Multiplier: ${this.scoringSystem.getMultiplier()}x`;
        }
        
        if (healthElement && this.player) {
            healthElement.textContent = `Health: ${Math.ceil(this.player.health)}`;
        }
        
        if (fpsElement) {
            fpsElement.textContent = `FPS: ${this.fps}`;
        }
    }
    
    addEntity(entity) {
        this.entities.push(entity);
        
        if (entity.type === 'player') {
            this.player = entity;
        } else if (entity.type === 'enemy') {
            this.enemies.push(entity);
        } else if (entity.type === 'bullet') {
            this.bullets.push(entity);
        } else if (entity.type === 'powerup') {
            this.powerUps.push(entity);
        } else if (entity.type === 'particle') {
            this.particles.push(entity);
        }
    }
    
    removeEntity(entity) {
        entity.isDead = true;
    }
    
    gameOverState() {
        this.gameOver = true;
        const gameOverOverlay = document.getElementById('gameOver');
        const finalScoreElement = document.getElementById('finalScore');
        
        if (gameOverOverlay && finalScoreElement) {
            const finalScore = this.scoringSystem ? this.scoringSystem.getScore() : this.score;
            finalScoreElement.textContent = `Final Score: ${finalScore}`;
            gameOverOverlay.classList.remove('hidden');
        }
    }
    
    restart() {
        // Reset game state
        this.entities = [];
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.particles = [];
        this.score = 0;
        this.gameOver = false;
        this.lastFrameTime = 0;
        
        // Hide game over screen
        const gameOverOverlay = document.getElementById('gameOver');
        if (gameOverOverlay) {
            gameOverOverlay.classList.add('hidden');
        }
        
        // Reinitialize game and managers
        this.scoringSystem = null;
        this.enemyManager = null;
        this.powerUpManager = null;
        this.collisionManager = null;
        this.initializeGame();
    }
    
    stop() {
        this.isRunning = false;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
