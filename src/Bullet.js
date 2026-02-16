/* ============================================================================
   Bullet - Projectile fired by player
   ============================================================================ */

class Bullet extends Entity {
    constructor(x, y) {
        super(x, y, 4, 10, 'bullet');
        
        this.speed = 500; // pixels per second
        this.vy = -this.speed; // Bullets move upward
        this.vx = 0;
        this.color = '#FFFF00';
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
     * @returns {boolean} True if bullet is above canvas
     */
    isOffScreen(canvasHeight) {
        return this.y + this.height < 0;
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
