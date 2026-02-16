/* ============================================================================
   EnemyBullet - Projectile fired by enemies
   ============================================================================ */

class EnemyBullet extends Entity {
    constructor(x, y) {
        super(x, y, 4, 8, 'enemyBullet');
        
        this.speed = 300; // pixels per second
        this.vy = this.speed; // Bullets move downward
        this.vx = 0;
        this.color = '#FF6600';
        this.damage = 10;
    }
    
    /**
     * Update bullet position
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        // Bullets only move vertically
        this.y += this.vy * dt;
    }
    
    /**
     * Check if bullet is off-screen
     * @param {number} canvasHeight - Canvas height
     * @returns {boolean} True if bullet is below canvas
     */
    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }
    
    /**
     * Get bullet's bounding box for collision detection
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
     * Render bullet to canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}
