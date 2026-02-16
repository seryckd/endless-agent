/* ============================================================================
   ScoringSystem - Manages score, multipliers, and combo tracking
   ============================================================================ */

class ScoringSystem {
    constructor(gameInstance) {
        this.game = gameInstance;
        
        // Scoring
        this.score = 0;
        this.multiplier = 1;
        this.multiplierThreshold = 5; // Kills needed to increase multiplier
        this.comboCounter = 0;
        this.comboTimer = 0;
        this.comboWindow = 2; // Seconds to keep multiplier
        
        // Multiplier levels
        this.maxMultiplier = 10;
    }
    
    /**
     * Update combo and multiplier timers
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                // Combo window expired, reset
                this.comboCounter = 0;
                this.multiplier = 1;
            }
        }
    }
    
    /**
     * Add score from an enemy kill
     * @param {number} baseScore - Base score for the enemy
     */
    addKillScore(baseScore) {
        const adjustedScore = Math.ceil(baseScore * this.multiplier);
        this.score += adjustedScore;
        
        // Update combo
        this.comboCounter++;
        this.comboTimer = this.comboWindow;
        
        // Increase multiplier based on combo
        if (this.comboCounter >= this.multiplierThreshold) {
            if (this.multiplier < this.maxMultiplier) {
                this.multiplier += 1;
                this.comboCounter = 0; // Reset combo counter for next multiplier level
            }
        }
        
        return adjustedScore;
    }
    
    /**
     * Get current multiplier display
     * @returns {number} Current multiplier
     */
    getMultiplier() {
        return this.multiplier;
    }
    
    /**
     * Get current score
     * @returns {number} Current score
     */
    getScore() {
        return this.score;
    }
    
    /**
     * Reset for new game
     */
    reset() {
        this.score = 0;
        this.multiplier = 1;
        this.comboCounter = 0;
        this.comboTimer = 0;
    }
    
    /**
     * Bonus points for clearing waves or time milestones
     * @param {number} bonus - Bonus points
     */
    addBonus(bonus) {
        this.score += bonus;
    }
}
