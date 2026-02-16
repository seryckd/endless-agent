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
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        
        // Input handling
        this.setupInputHandling();
        
        // UI
        this.setupUI();
        
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
        
        // Update all entities
        for (let entity of this.entities) {
            if (entity.update) {
                entity.update(dt);
            }
        }
        
        // Remove dead entities
        this.entities = this.entities.filter(e => !e.isDead);
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
        const fpsElement = document.getElementById('fps');
        
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
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
            finalScoreElement.textContent = `Final Score: ${this.score}`;
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
    }
    
    stop() {
        this.isRunning = false;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
