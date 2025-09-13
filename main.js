// Main JavaScript for The Webcade
class Webcade {
    constructor() {
        this.isMuted = false;
        this.games = ['snake', 'tetris', 'flappy', 'pong', 'breakout', 'minesweeper', 'invaders', 'asteroids', 'pacman', '2048', 'geometry', 'colorblind', 'racing'];
        this.init();
    }

    init() {
        this.loadHighScores();
        this.attachEventListeners();
        this.createAudioContext();
    }

    createAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playSound(frequency, duration, type = 'square') {
        if (this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    attachEventListeners() {
        // Game card clicks
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameName = card.dataset.game;
                this.playSound(440, 0.1);
                this.openGame(gameName);
            });
        });

        // Random game button
        document.getElementById('randomGame').addEventListener('click', () => {
            this.playSound(660, 0.15);
            const randomGame = this.games[Math.floor(Math.random() * this.games.length)];
            this.openGame(randomGame);
        });

        // Mute toggle
        document.getElementById('muteToggle').addEventListener('click', () => {
            this.toggleMute();
        });
    }

    openGame(gameName) {
        // Navigate to game page
        window.location.href = `${gameName}.html`;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const muteButton = document.getElementById('muteToggle');
        muteButton.textContent = this.isMuted ? '🔇' : '🔊';
        
        if (!this.isMuted) {
            this.playSound(880, 0.1);
        }
        
        localStorage.setItem('webcade_muted', this.isMuted);
    }

    loadHighScores() {
        this.games.forEach(game => {
            const score = localStorage.getItem(`webcade_${game}_highscore`) || 0;
            const scoreElement = document.getElementById(`${game}-score`);
            if (scoreElement) {
                scoreElement.textContent = score;
            }
        });

        // Load mute preference
        const savedMuted = localStorage.getItem('webcade_muted');
        if (savedMuted === 'true') {
            this.isMuted = true;
            document.getElementById('muteToggle').textContent = '🔇';
        }
    }

    static saveHighScore(game, score) {
        const currentHigh = localStorage.getItem(`webcade_${game}_highscore`) || 0;
        if (score > currentHigh) {
            localStorage.setItem(`webcade_${game}_highscore`, score);
            return true;
        }
        return false;
    }

    static getHighScore(game) {
        return localStorage.getItem(`webcade_${game}_highscore`) || 0;
    }
}

// Initialize the Webcade
document.addEventListener('DOMContentLoaded', () => {
    new Webcade();
});

// Global utility functions for games
window.WebcadeUtils = {
    playSound: function(frequency, duration, type = 'square') {
        // This will be called from individual games
        if (window.webcadeInstance && !window.webcadeInstance.isMuted) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        }
    },
    
    saveScore: function(game, score) {
        return Webcade.saveHighScore(game, score);
    },
    
    getHighScore: function(game) {
        return Webcade.getHighScore(game);
    }
};