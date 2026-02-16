/* ============================================================================
   EnemyManager - Spawns and manages enemies
   ============================================================================ */

class EnemyManager {
    constructor(canvasWidth, canvasHeight, gameInstance) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.game = gameInstance;
        
        // Spawn configuration
        this.spawnRate = 2; // Enemies per second
        this.spawnCooldown = 0;
        this.waveCount = 0;
        this.enemyCount = 0;
        this.maxEnemies = 20; // Maximum enemies on screen
        
        // Difficulty scaling
        this.difficultyMultiplier = 1;
        this.timeElapsed = 0;
    }
    
    /**
     * Update enemy spawning and difficulty
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.timeElapsed += dt;
        
        // Increase difficulty over time (every 30 seconds)
        if (this.timeElapsed > 30) {
            this.timeElapsed = 0;
            this.difficultyMultiplier += 0.1;
            this.spawnRate += 0.5;
        }
        
        // Spawn new enemies
        if (this.spawnCooldown <= 0 && this.game.enemies.length < this.maxEnemies) {
            this.spawnEnemy();
            this.spawnCooldown = 1 / this.spawnRate;
        }
        
        this.spawnCooldown -= dt;
    }
    
    /**
     * Spawn a random enemy at the top of the screen
     */
    spawnEnemy() {
        const x = Math.random() * (this.canvasWidth - 25);
        const y = -30;
        const enemy = new Grunt(x, y);
        
        // Scale difficulty
        enemy.health *= this.difficultyMultiplier;
        enemy.maxHealth *= this.difficultyMultiplier;
        enemy.speed *= (1 + this.difficultyMultiplier * 0.1);
        enemy.scoreValue = Math.ceil(100 * this.difficultyMultiplier);
        
        this.game.addEntity(enemy);
        this.enemyCount++;
    }
    
    /**
     * Reset for a new game
     */
    reset() {
        this.spawnCooldown = 0;
        this.waveCount = 0;
        this.enemyCount = 0;
        this.difficultyMultiplier = 1;
        this.timeElapsed = 0;
        this.spawnRate = 2;
    }
}
