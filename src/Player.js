/* ============================================================================
   Player - Player entity with movement and auto-fire
   ============================================================================ */

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 30, 40, 'player');
        
        // Player-specific properties
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.speed = 300; // pixels per second
        this.color = '#00FF00';
        
        // Shooting
        this.shootCooldown = 0;
        this.shootRate = 0.1; // Seconds between shots
        this.bullets = [];
        
        // Collision
        this.collidingWith = [];
        
        // Power-up effects
        this.hasSpreadShot = false;
        this.spreadShotTimer = 0;
        this.hasRapidFire = false;
        this.rapidFireTimer = 0;
        this.hasShield = false;
        this.shieldTimer = 0;
        this.hasPiercingRounds = false;
        this.piercingRoundsTimer = 0;
    }
    
    /**
     * Update player position and state
     * @param {number} dt - Delta time in seconds
     * @param {InputHandler} input - Input handler instance
     * @param {number} canvasWidth - Canvas width for boundary checking
     * @param {number} canvasHeight - Canvas height for boundary checking
     */
    update(dt, input, canvasWidth, canvasHeight) {
        // Get movement input (arrow keys or WASD)
        const arrows = input.getArrowKeys();
        const wasd = input.getWASDKeys();
        const up = arrows.up || wasd.up;
        const down = arrows.down || wasd.down;
        const left = arrows.left || wasd.left;
        const right = arrows.right || wasd.right;
        
        // Calculate velocity based on input
        this.vx = 0;
        this.vy = 0;
        
        if (left) this.vx = -this.speed;
        if (right) this.vx = this.speed;
        if (up) this.vy = -this.speed;
        if (down) this.vy = this.speed;
        
        // Update position
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Boundary checking - keep player within canvas
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
        
        // Update power-up timers
        if (this.hasSpreadShot) {
            this.spreadShotTimer -= dt;
            if (this.spreadShotTimer <= 0) {
                this.hasSpreadShot = false;
            }
        }
        
        if (this.hasRapidFire) {
            this.rapidFireTimer -= dt;
            if (this.rapidFireTimer <= 0) {
                this.hasRapidFire = false;
            }
        }
        
        if (this.hasShield) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) {
                this.hasShield = false;
            }
        }
        
        if (this.hasPiercingRounds) {
            this.piercingRoundsTimer -= dt;
            if (this.piercingRoundsTimer <= 0) {
                this.hasPiercingRounds = false;
            }
        }
        
        // Update shooting cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown -= dt;
        }
        
        // Auto-fire (always shooting)
        if (this.shootCooldown <= 0) {
            this.shoot();
            this.shootCooldown = this.hasRapidFire ? 0.05 : this.shootRate; // Rapid fire doubles rate
        }
    }
    
    /**
     * Create a bullet at player position
     */
    shoot() {
        if (this.hasSpreadShot) {
            // Spread shot fires 3 bullets at different angles
            const centerX = this.x + this.width / 2 - 2;
            const centerY = this.y - 5;
            
            // Center bullet
            const bullet1 = new Bullet(centerX, centerY);
            this.bullets.push(bullet1);
            
            // Left bullet (at 30 degree angle)
            const bullet2 = new SpreadBullet(centerX - 8, centerY, -100);
            this.bullets.push(bullet2);
            
            // Right bullet (at 30 degree angle)
            const bullet3 = new SpreadBullet(centerX + 8, centerY, 100);
            this.bullets.push(bullet3);
        } else {
            // Normal single bullet
            const bulletX = this.x + this.width / 2 - 2; // 4px wide bullet
            const bulletY = this.y - 5; // Slightly above player
            const bullet = new Bullet(bulletX, bulletY);
            this.bullets.push(bullet);
        }
    }
    
    /**
     * Apply damage to player
     * @param {number} damage - Damage amount
     */
    takeDamage(damage) {
        this.health -= damage;
        if (this.health < 0) this.health = 0;
        if (this.health <= 0) {
            this.isDead = true;
        }
    }
    
    /**
     * Heal the player
     * @param {number} amount - Heal amount
     */
    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
    }
    
    /**
     * Get player's bounding box for collision detection
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
     * Check if a point intersects with player
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @returns {boolean}
     */
    containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y && py <= this.y + this.height;
    }
    
    /**
     * Render player to canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.alpha = this.alpha;
        
        // Draw player as a triangle pointing up
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y); // Top point
        ctx.lineTo(this.x + this.width, this.y + this.height); // Bottom right
        ctx.lineTo(this.x, this.y + this.height); // Bottom left
        ctx.closePath();
        ctx.fill();
        
        // Draw shield if active
        if (this.hasShield) {
            ctx.strokeStyle = '#0088FF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 25, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw health indicator
        if (this.health < this.maxHealth) {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y - 10, this.width, 5);
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(this.x, this.y - 10, (this.width * this.health) / this.maxHealth, 5);
        }
        
        ctx.restore();
    }
    
    /**
     * Apply Spread Shot power-up
     * @param {number} duration - Duration in seconds
     */
    applySpreadShot(duration) {
        this.hasSpreadShot = true;
        this.spreadShotTimer = duration;
    }
    
    /**
     * Apply Rapid Fire power-up
     * @param {number} duration - Duration in seconds
     */
    applyRapidFire(duration) {
        this.hasRapidFire = true;
        this.rapidFireTimer = duration;
    }
    
    /**
     * Apply Shield power-up
     * @param {number} duration - Duration in seconds
     */
    applyShield(duration) {
        this.hasShield = true;
        this.shieldTimer = duration;
    }
    
    /**
     * Apply Piercing Rounds power-up
     * @param {number} duration - Duration in seconds
     */
    applyPiercingRounds(duration) {
        this.hasPiercingRounds = true;
        this.piercingRoundsTimer = duration;
    }
}
