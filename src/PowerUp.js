/* ============================================================================
   PowerUp - Base class for all power-up types
   ============================================================================ */

class PowerUp extends Entity {
    constructor(x, y, type) {
        super(x, y, 20, 20, 'powerup');
        
        this.powerUpType = type;
        this.speed = 150; // pixels per second (falling speed)
        this.vy = this.speed;
        this.vx = 0;
        this.color = '#FFFF00';
        this.duration = 10; // Seconds for temporary power-ups
    }
    
    /**
     * Update power-up position
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.y += this.vy * dt;
    }
    
    /**
     * Check if power-up is off-screen
     * @param {number} canvasHeight - Canvas height
     * @returns {boolean} True if below canvas
     */
    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }
    
    /**
     * Get power-up's bounding box for collision detection
     * @returns {Object} {x, y, width, height}
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    /**
     * Apply this power-up's effect to the player
     * @param {Player} player - Player object to apply effect to
     */
    applyEffect(player) {
        switch (this.powerUpType) {
            case 'health':
                player.heal(30);
                break;
            case 'spreadShot':
                player.applySpreadShot(this.duration);
                break;
            case 'rapidFire':
                player.applyRapidFire(this.duration);
                break;
            case 'shield':
                player.applyShield(this.duration);
                break;
            case 'piercingRounds':
                player.applyPiercingRounds(this.duration);
                break;
            case 'bomb':
                // Handled by game (clears nearby enemies)
                break;
        }
    }
    
    /**
     * Render power-up to canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // Draw based on type
        switch (this.powerUpType) {
            case 'health':
                this.renderHealthPack(ctx);
                break;
            case 'spreadShot':
                this.renderSpreadShot(ctx);
                break;
            case 'rapidFire':
                this.renderRapidFire(ctx);
                break;
            case 'shield':
                this.renderShield(ctx);
                break;
            case 'piercingRounds':
                this.renderPiercingRounds(ctx);
                break;
            case 'bomb':
                this.renderBomb(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    renderHealthPack(ctx) {
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + 8, this.y + 3, 4, 14); // Vertical line of cross
        ctx.fillRect(this.x + 3, this.y + 8, 14, 4); // Horizontal line of cross
    }
    
    renderSpreadShot(ctx) {
        ctx.fillStyle = '#FF00FF';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y);
        ctx.lineTo(this.x + 15, this.y + 10);
        ctx.lineTo(this.x + 10, this.y + 20);
        ctx.lineTo(this.x + 5, this.y + 10);
        ctx.closePath();
        ctx.fill();
    }
    
    renderRapidFire(ctx) {
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Draw arrows to indicate speed
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 10);
        ctx.lineTo(this.x + 15, this.y + 10);
        ctx.moveTo(this.x + 12, this.y + 7);
        ctx.lineTo(this.x + 15, this.y + 10);
        ctx.lineTo(this.x + 12, this.y + 13);
        ctx.stroke();
    }
    
    renderShield(ctx) {
        ctx.strokeStyle = '#0088FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y);
        ctx.lineTo(this.x + 20, this.y + 8);
        ctx.lineTo(this.x + 18, this.y + 20);
        ctx.lineTo(this.x + 2, this.y + 20);
        ctx.lineTo(this.x, this.y + 8);
        ctx.closePath();
        ctx.stroke();
    }
    
    renderPiercingRounds(ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + 2, this.y + 2, 16, 16);
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 10, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderBomb(ctx) {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 12, 8, 0, Math.PI * 2);
        ctx.fill();
        // Fuse
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 4);
        ctx.quadraticCurveTo(this.x + 8, this.y + 7, this.x + 10, this.y + 8);
        ctx.stroke();
    }
}

/**
 * PowerUpManager - Spawns and manages power-ups
 */
class PowerUpManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.spawnRate = 0.5; // Power-ups per second
        this.spawnCooldown = 0;
    }
    
    /**
     * Update power-up spawning
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        if (this.spawnCooldown <= 0) {
            this.spawnPowerUp();
            this.spawnCooldown = 1 / this.spawnRate;
        }
        this.spawnCooldown -= dt;
    }
    
    /**
     * Spawn a random power-up at top of screen
     */
    spawnPowerUp() {
        const powerUpTypes = ['health', 'spreadShot', 'rapidFire', 'shield', 'piercingRounds', 'bomb'];
        const weights = [0.3, 0.2, 0.2, 0.15, 0.1, 0.05]; // Relative spawn chances
        
        // Weighted random selection
        let random = Math.random();
        let cumulativeWeight = 0;
        let selectedType = powerUpTypes[0];
        
        for (let i = 0; i < powerUpTypes.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                selectedType = powerUpTypes[i];
                break;
            }
        }
        
        const x = Math.random() * (this.game.width - 20);
        const y = -20;
        const powerUp = new PowerUp(x, y, selectedType);
        this.game.addEntity(powerUp);
    }
    
    /**
     * Reset for new game
     */
    reset() {
        this.spawnCooldown = 0;
    }
}
