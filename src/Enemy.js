/* ============================================================================
   Enemy - Base class for all enemy types
   ============================================================================ */

class Enemy extends Entity {
    constructor(x, y, width, height, type = 'enemy') {
        super(x, y, width, height, type);
        
        // Health
        this.maxHealth = 25;
        this.health = this.maxHealth;
        
        // Speed
        this.speed = 150; // pixels per second
        
        // Behavior
        this.shootRate = 1; // Seconds between shots
        this.shootCooldown = 0;
        this.bullets = [];
        
        // Scoring
        this.scoreValue = 100;
        
        // Movement pattern
        this.waveX = 0; // For sine wave movement
        this.baseY = y; // Starting Y position
        this.direction = 1; // 1 for right, -1 for left
        this.color = '#FF0000';
    }
    
    /**
     * Update enemy position and state
     * @param {number} dt - Delta time in seconds
     * @param {number} canvasWidth - Canvas width for boundary checking
     * @param {number} canvasHeight - Canvas height for boundary checking
     */
    update(dt, canvasWidth, canvasHeight) {
        // Simple downward movement with side-to-side drift
        this.waveX += this.speed * this.direction * dt;
        
        // Bounce off sides
        if (this.x + this.waveX < 0 || this.x + this.waveX + this.width > canvasWidth) {
            this.direction *= -1;
        }
        
        this.x += this.waveX * dt;
        this.y += this.speed * 0.5 * dt; // Move down slowly
        
        // Remove if off-screen (below)
        if (this.y > canvasHeight) {
            this.isDead = true;
        }
        
        // Update shooting cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown -= dt;
        }
        
        // Shoot occasionally
        if (this.shootCooldown <= 0) {
            this.shoot();
            this.shootCooldown = this.shootRate;
        }
    }
    
    /**
     * Shoot a bullet downward
     */
    shoot() {
        const bulletX = this.x + this.width / 2 - 2;
        const bulletY = this.y + this.height;
        const bullet = new EnemyBullet(bulletX, bulletY);
        this.bullets.push(bullet);
    }
    
    /**
     * Apply damage to enemy
     * @param {number} damage - Damage amount
     */
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isDead = true;
        }
    }
    
    /**
     * Get enemy's bounding box for collision detection
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
     * Check if a point intersects with enemy
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @returns {boolean}
     */
    containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y && py <= this.y + this.height;
    }
    
    /**
     * Render enemy to canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        
        // Draw enemy as a square
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw health indicator if damaged
        if (this.health < this.maxHealth) {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y - 5, this.width, 3);
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(this.x, this.y - 5, (this.width * this.health) / this.maxHealth, 3);
        }
        
        ctx.restore();
    }
}

/**
 * Grunt - Basic enemy type
 */
class Grunt extends Enemy {
    constructor(x, y) {
        super(x, y, 25, 25, 'enemy');
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.speed = 150;
        this.shootRate = 2; // Shoots less frequently
        this.scoreValue = 100;
        this.color = '#FF0000';
    }
}
