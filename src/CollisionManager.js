/* ============================================================================
   CollisionManager - Detects and resolves collisions between game entities
   ============================================================================ */

class CollisionManager {
    constructor(gameInstance) {
        this.game = gameInstance;
    }
    
    /**
     * Check all collisions and resolve them
     */
    checkCollisions() {
        // Player bullets vs enemies
        this.checkPlayerBulletsVsEnemies();
        
        // Enemy bullets vs player
        this.checkEnemyBulletsVsPlayer();
        
        // Enemies vs player
        this.checkEnemiesVsPlayer();
        
        // Player vs power-ups
        this.checkPowerUpCollection();
    }
    
    /**
     * Check collision between player bullets and enemies
     */
    checkPlayerBulletsVsEnemies() {
        for (let bullet of this.game.bullets) {
            if (bullet.type !== 'bullet' || bullet.isDead) continue;
            
            for (let enemy of this.game.enemies) {
                if (enemy.isDead) continue;
                
                if (this.checkAABBCollision(bullet.getBounds(), enemy.getBounds())) {
                    // Bullet hits enemy
                    enemy.takeDamage(bullet.damage);
                    bullet.isDead = true;
                    
                    // Add score for hit
                    if (enemy.isDead && this.game.scoringSystem) {
                        this.game.scoringSystem.addKillScore(enemy.scoreValue);
                    }
                    
                    break; // Bullet can only hit one enemy per frame
                }
            }
        }
    }
    
    /**
     * Check collision between enemy bullets and player
     */
    checkEnemyBulletsVsPlayer() {
        if (!this.game.player || this.game.player.isDead) return;
        
        for (let bullet of this.game.entities) {
            if (bullet.type !== 'enemyBullet' || bullet.isDead) continue;
            
            if (this.checkAABBCollision(bullet.getBounds(), this.game.player.getBounds())) {
                // Enemy bullet hits player
                this.game.player.takeDamage(bullet.damage);
                bullet.isDead = true;
            }
        }
    }
    
    /**
     * Check if a point intersects with enemy
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @returns {boolean}
     */
    checkEnemiesVsPlayer() {
        if (!this.game.player || this.game.player.isDead) return;
        
        for (let enemy of this.game.enemies) {
            if (enemy.isDead) continue;
            
            if (this.checkAABBCollision(enemy.getBounds(), this.game.player.getBounds())) {
                // Enemy touches player
                this.game.player.takeDamage(20); // Large damage from collision
                enemy.isDead = true;
            }
        }
    }
    
    /**
     * Check player vs power-ups
     */
    checkPowerUpCollection() {
        if (!this.game.player || this.game.player.isDead) return;
        
        for (let entity of this.game.entities) {
            if (entity.type !== 'powerup' || entity.isDead) continue;
            
            if (this.checkAABBCollision(entity.getBounds(), this.game.player.getBounds())) {
                // Power-up collected
                entity.applyEffect(this.game.player);
                entity.isDead = true;
            }
        }
    }
    
    /**
     * Check AABB (Axis-Aligned Bounding Box) collision between two rectangles
     * @param {Object} bounds1 - {x, y, width, height}
     * @param {Object} bounds2 - {x, y, width, height}
     * @returns {boolean} True if rectangles overlap
     */
    checkAABBCollision(bounds1, bounds2) {
        return bounds1.x < bounds2.x + bounds2.width &&
               bounds1.x + bounds1.width > bounds2.x &&
               bounds1.y < bounds2.y + bounds2.height &&
               bounds1.y + bounds1.height > bounds2.y;
    }
    
    /**
     * Check circular collision between two points/radii
     * @param {number} x1 - Center X of circle 1
     * @param {number} y1 - Center Y of circle 1
     * @param {number} r1 - Radius of circle 1
     * @param {number} x2 - Center X of circle 2
     * @param {number} y2 - Center Y of circle 2
     * @param {number} r2 - Radius of circle 2
     * @returns {boolean} True if circles overlap
     */
    checkCircleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = r1 + r2;
        return distanceSquared < radiusSum * radiusSum;
    }
}
