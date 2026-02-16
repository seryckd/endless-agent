/* ============================================================================
   Entity - Base class for all game objects
   ============================================================================ */

class Entity {
    constructor(x, y, width, height, type = 'entity') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        
        // Physics
        this.vx = 0; // Velocity X
        this.vy = 0; // Velocity Y
        this.ax = 0; // Acceleration X
        this.ay = 0; // Acceleration Y
        
        // State
        this.isDead = false;
        this.isActive = true;
        
        // Rendering
        this.rotation = 0;
        this.alpha = 1;
        this.color = '#fff';
    }
    
    /**
     * Update entity state each frame
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        // Apply acceleration
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        
        // Apply velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Reset acceleration (for forces like gravity that apply each frame)
        this.ax = 0;
        this.ay = 0;
    }
    
    /**
     * Render entity to canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // Translate to position and rotation
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width / 2, -this.height / 2);
        
        // Draw rectangle (override in subclasses for custom rendering)
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.restore();
    }
    
    /**
     * Get entity bounds for collision detection
     * @returns {Object} Bounding box {x, y, width, height}
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }
    
    /**
     * Check AABB (Axis-Aligned Bounding Box) collision with another entity
     * @param {Entity} other - Other entity to check collision with
     * @returns {boolean} True if colliding
     */
    collidesWith(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        return a.left < b.right &&
               a.right > b.left &&
               a.top < b.bottom &&
               a.bottom > b.top;
    }
    
    /**
     * Check if point is inside this entity
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @returns {boolean} True if point is inside
     */
    containsPoint(px, py) {
        return px >= this.x &&
               px <= this.x + this.width &&
               py >= this.y &&
               py <= this.y + this.height;
    }
    
    /**
     * Calculate distance to another entity
     * @param {Entity} other - Other entity
     * @returns {number} Distance between centers
     */
    distanceTo(other) {
        const bounds = this.getBounds();
        const otherBounds = other.getBounds();
        
        const dx = bounds.centerX - otherBounds.centerX;
        const dy = bounds.centerY - otherBounds.centerY;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Set velocity with magnitude and direction
     * @param {number} angle - Angle in radians
     * @param {number} speed - Speed magnitude
     */
    setVelocityFromAngle(angle, speed) {
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }
    
    /**
     * Get angle to another entity
     * @param {Entity} other - Other entity
     * @returns {number} Angle in radians
     */
    getAngleTo(other) {
        const bounds = this.getBounds();
        const otherBounds = other.getBounds();
        
        const dx = otherBounds.centerX - bounds.centerX;
        const dy = otherBounds.centerY - bounds.centerY;
        
        return Math.atan2(dy, dx);
    }
    
    /**
     * Mark entity as dead (will be removed next frame)
     */
    kill() {
        this.isDead = true;
    }
    
    /**
     * Clone this entity
     * @returns {Entity} Cloned entity
     */
    clone() {
        const clone = new Entity(this.x, this.y, this.width, this.height, this.type);
        clone.vx = this.vx;
        clone.vy = this.vy;
        clone.ax = this.ax;
        clone.ay = this.ay;
        clone.rotation = this.rotation;
        clone.alpha = this.alpha;
        clone.color = this.color;
        return clone;
    }
}
