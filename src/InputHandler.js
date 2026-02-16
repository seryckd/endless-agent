/* ============================================================================
   Input Handler - Manages keyboard state and input handling
   ============================================================================ */

class InputHandler {
    constructor() {
        this.keys = {};
        this.pressedThisFrame = {};
        this.releasedThisFrame = {};
        this.setupListeners();
    }
    
    setupListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    handleKeyDown(e) {
        if (!this.keys[e.key]) {
            this.pressedThisFrame[e.key] = true;
        }
        this.keys[e.key] = true;
    }
    
    handleKeyUp(e) {
        this.keys[e.key] = false;
        this.releasedThisFrame[e.key] = true;
    }
    
    /**
     * Check if a key is currently held down
     * @param {string} key - Key name (e.g., 'ArrowUp', 'w', 'Enter')
     * @returns {boolean} True if key is held
     */
    isKeyHeld(key) {
        return this.keys[key] || false;
    }
    
    /**
     * Check if a key was just pressed this frame
     * @param {string} key - Key name
     * @returns {boolean} True if key was just pressed
     */
    isKeyPressed(key) {
        return this.pressedThisFrame[key] || false;
    }
    
    /**
     * Check if a key was just released this frame
     * @param {string} key - Key name
     * @returns {boolean} True if key was just released
     */
    isKeyReleased(key) {
        return this.releasedThisFrame[key] || false;
    }
    
    /**
     * Check if any of the arrow keys are held
     * @returns {Object} {up, down, left, right} boolean state
     */
    getArrowKeys() {
        return {
            up: this.isKeyHeld('ArrowUp'),
            down: this.isKeyHeld('ArrowDown'),
            left: this.isKeyHeld('ArrowLeft'),
            right: this.isKeyHeld('ArrowRight')
        };
    }
    
    /**
     * Check if WASD keys are held (alternative movement)
     * @returns {Object} {up, down, left, right} boolean state
     */
    getWASDKeys() {
        return {
            up: this.isKeyHeld('w') || this.isKeyHeld('W'),
            down: this.isKeyHeld('s') || this.isKeyHeld('S'),
            left: this.isKeyHeld('a') || this.isKeyHeld('A'),
            right: this.isKeyHeld('d') || this.isKeyHeld('D')
        };
    }
    
    /**
     * Get combined movement input (arrows + WASD)
     * @returns {Object} {up, down, left, right} boolean state
     */
    getMovementInput() {
        const arrows = this.getArrowKeys();
        const wasd = this.getWASDKeys();
        
        return {
            up: arrows.up || wasd.up,
            down: arrows.down || wasd.down,
            left: arrows.left || wasd.left,
            right: arrows.right || wasd.right
        };
    }
    
    /**
     * Clear per-frame input state (call at end of each frame)
     */
    clearFrameInput() {
        this.pressedThisFrame = {};
        this.releasedThisFrame = {};
    }
}

// Create global input handler
const input = new InputHandler();
