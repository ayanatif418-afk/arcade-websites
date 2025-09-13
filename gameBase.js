// Base class for all games
class GameBase {
    constructor(canvasId, game) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.game = game;
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        this.highScore = parseInt(WebcadeUtils.getHighScore(game)) || 0;
        
        this.setupCanvas();
        this.attachBaseEventListeners();
    }

    setupCanvas() {
        // Set default canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Make canvas responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Maintain aspect ratio
        const aspectRatio = this.canvas.width / this.canvas.height;
        let newWidth = Math.min(containerWidth - 40, 800);
        let newHeight = newWidth / aspectRatio;
        
        if (newHeight > containerHeight - 100) {
            newHeight = containerHeight - 100;
            newWidth = newHeight * aspectRatio;
        }
        
        this.canvas.style.width = newWidth + 'px';
        this.canvas.style.height = newHeight + 'px';
    }

    attachBaseEventListeners() {
        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            WebcadeUtils.playSound(440, 0.1);
            window.location.href = 'index.html';
        });

        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            WebcadeUtils.playSound(660, 0.1);
            this.restart();
            this.hideGameOver();
        });

        // Home button
        document.getElementById('homeBtn').addEventListener('click', () => {
            WebcadeUtils.playSound(440, 0.1);
            window.location.href = 'index.html';
        });

        // Pause/Resume with spacebar
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameOver) {
                e.preventDefault();
                this.togglePause();
            }
        });
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            this.drawPauseScreen();
        }
    }

    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = '32px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText('Press SPACE to resume', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    updateScore(newScore) {
        this.score = newScore;
        document.getElementById('scoreValue').textContent = this.score;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            document.getElementById('highScoreValue').textContent = this.highScore;
        }
    }

    showGameOver() {
        const gameOverDiv = document.getElementById('gameOver');
        const finalScoreSpan = document.getElementById('finalScore');
        const newHighScore = WebcadeUtils.saveScore(this.game, this.score);
        
        finalScoreSpan.textContent = this.score;
        
        if (newHighScore) {
            document.getElementById('newHighScore').style.display = 'block';
            WebcadeUtils.playSound(880, 0.3);
        } else {
            document.getElementById('newHighScore').style.display = 'none';
            WebcadeUtils.playSound(220, 0.5);
        }
        
        gameOverDiv.classList.remove('hidden');
        this.gameOver = true;
    }

    hideGameOver() {
        document.getElementById('gameOver').classList.add('hidden');
        this.gameOver = false;
    }

    // Abstract methods to be implemented by each game
    init() {
        throw new Error('init() method must be implemented');
    }

    update() {
        throw new Error('update() method must be implemented');
    }

    draw() {
        throw new Error('draw() method must be implemented');
    }

    restart() {
        throw new Error('restart() method must be implemented');
    }
}