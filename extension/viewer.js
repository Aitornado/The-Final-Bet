// Twitch Extension Viewer JavaScript
class FinalBetExtension {
    constructor() {
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.auth = null;
        this.context = null;
        this.activePrediction = null;
        this.userBet = null;
        this.selectedOption = null;
        
        // Mock data for development
        this.mockData = {
            predictions: [
                {
                    id: 'pred_1',
                    question: 'Will streamer win this round?',
                    options: [
                        { id: 'yes', text: 'YES', odds: 2.1 },
                        { id: 'no', text: 'NO', odds: 1.8 }
                    ],
                    timeLeft: 150, // seconds
                    status: 'active'
                }
            ],
            results: [
                { question: 'Previous round win?', outcome: 'YES', result: 'win', bits: 50 },
                { question: '10+ eliminations?', outcome: 'NO', result: 'loss', bits: 25 }
            ],
            leaderboard: [
                { rank: 1, username: 'ProGamer2024', points: 1250 },
                { rank: 2, username: 'BetMaster', points: 980 },
                { rank: 3, username: 'LuckyViewer', points: 750 }
            ]
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing The Final Bet Extension...');
        
        if (this.twitch) {
            // Real Twitch environment
            this.twitch.onAuthorized((auth) => {
                this.auth = auth;
                this.loadExtension();
            });
            
            this.twitch.onContext((context, delta) => {
                this.context = context;
                this.updateTheme();
            });
            
            // Listen for configuration changes
            this.twitch.configuration.onChanged(() => {
                this.loadPredictions();
            });
            
            // Listen for PubSub messages
            this.twitch.listen('broadcast', (target, contentType, body) => {
                this.handleBroadcastMessage(JSON.parse(body));
            });
        } else {
            // Development mode - use mock data
            console.log('Running in development mode with mock data');
            this.loadMockData();
        }
        
        this.setupEventListeners();
    }
    
    loadExtension() {
        this.hideLoading();
        this.loadPredictions();
        this.loadLeaderboard();
        this.loadRecentResults();
    }
    
    loadMockData() {
        // Simulate loading delay
        setTimeout(() => {
            this.hideLoading();
            this.displayPrediction(this.mockData.predictions[0]);
            this.displayRecentResults(this.mockData.results);
            this.displayLeaderboard(this.mockData.leaderboard);
        }, 1500);
    }
    
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-interface').style.display = 'block';
    }
    
    showError() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-interface').style.display = 'none';
        document.getElementById('error-state').style.display = 'block';
    }
    
    updateTheme() {
        if (this.context && this.context.theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }
    
    setupEventListeners() {
        // Option selection
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectOption(e.currentTarget.dataset.option);
            });
        });
        
        // Place bet button
        document.getElementById('place-bet').addEventListener('click', () => {
            this.placeBet();
        });
        
        // Retry button
        document.getElementById('retry-btn').addEventListener('click', () => {
            location.reload();
        });
        
        // Bits amount validation
        document.getElementById('bits-amount').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            const placeBetBtn = document.getElementById('place-bet');
            
            if (value < 1 || value > 10000 || !this.selectedOption) {
                placeBetBtn.disabled = true;
            } else {
                placeBetBtn.disabled = false;
            }
        });
    }
    
    selectOption(option) {
        // Remove previous selection
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked option
        document.getElementById(`option-${option}`).classList.add('selected');
        this.selectedOption = option;
        
        // Enable/disable place bet button
        const bitsAmount = parseInt(document.getElementById('bits-amount').value);
        const placeBetBtn = document.getElementById('place-bet');
        
        if (bitsAmount >= 1 && bitsAmount <= 10000) {
            placeBetBtn.disabled = false;
        }
    }
    
    async placeBet() {
        if (!this.selectedOption) {
            alert('Please select an option first!');
            return;
        }
        
        const bitsAmount = parseInt(document.getElementById('bits-amount').value);
        
        if (bitsAmount < 1 || bitsAmount > 10000) {
            alert('Please enter a valid Bits amount (1-10000)!');
            return;
        }
        
        try {
            if (this.twitch && this.twitch.bits) {
                // Real Twitch Bits transaction
                this.twitch.bits.useBits('prediction-bet');
            }
            
            // Record the bet
            this.userBet = {
                option: this.selectedOption,
                amount: bitsAmount,
                prediction: this.activePrediction?.id
            };
            
            // Update UI
            this.displayUserBet();
            this.disableBetting();
            
            // Send to backend (when implemented)
            await this.sendBetToBackend(this.userBet);
            
        } catch (error) {
            console.error('Error placing bet:', error);
            alert('Failed to place bet. Please try again.');
        }
    }
    
    displayUserBet() {
        const userBetElement = document.getElementById('user-bet');
        const detailsElement = document.getElementById('user-bet-details');
        
        if (this.userBet) {
            const optionText = this.userBet.option.toUpperCase();
            detailsElement.textContent = `${this.userBet.amount} Bits on ${optionText}`;
            userBetElement.style.display = 'block';
        }
    }
    
    disableBetting() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        });
        
        document.getElementById('place-bet').disabled = true;
        document.getElementById('bits-amount').disabled = true;
    }
    
    displayPrediction(prediction) {
        if (!prediction) {
            document.getElementById('active-prediction').style.display = 'none';
            document.getElementById('no-predictions').style.display = 'block';
            return;
        }
        
        this.activePrediction = prediction;
        
        // Update question
        document.getElementById('prediction-question').textContent = prediction.question;
        
        // Update options
        prediction.options.forEach(option => {
            const btn = document.getElementById(`option-${option.id}`);
            if (btn) {
                btn.querySelector('.option-text').textContent = option.text;
                btn.querySelector('.option-odds').textContent = `${option.odds}x`;
            }
        });
        
        // Start timer
        this.startPredictionTimer(prediction.timeLeft);
        
        // Show prediction
        document.getElementById('active-prediction').style.display = 'block';
        document.getElementById('no-predictions').style.display = 'none';
    }
    
    startPredictionTimer(seconds) {
        const timerElement = document.getElementById('prediction-timer');
        let timeLeft = seconds;
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerElement.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
            
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(timer);
                timerElement.textContent = 'ENDED';
                this.disableBetting();
            }
        }, 1000);
    }
    
    displayRecentResults(results) {
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';
        
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'result-item';
            
            item.innerHTML = `
                <span>${result.question}</span>
                <span class="result-outcome ${result.result}">${result.outcome} (${result.bits} Bits)</span>
            `;
            
            resultsList.appendChild(item);
        });
    }
    
    displayLeaderboard(leaderboard) {
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        
        leaderboard.forEach(user => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            item.innerHTML = `
                <span class="rank">#${user.rank}</span>
                <span class="username">${user.username}</span>
                <span class="points">${user.points}</span>
            `;
            
            leaderboardList.appendChild(item);
        });
    }
    
    // API Methods (to be implemented with backend)
    async loadPredictions() {
        try {
            // TODO: Replace with real API call
            // const response = await fetch('/api/predictions');
            // const predictions = await response.json();
            
            // For now, use mock data
            const predictions = this.mockData.predictions;
            const activePrediction = predictions.find(p => p.status === 'active');
            this.displayPrediction(activePrediction);
            
        } catch (error) {
            console.error('Error loading predictions:', error);
            this.showError();
        }
    }
    
    async loadLeaderboard() {
        try {
            // TODO: Replace with real API call
            // const response = await fetch('/api/leaderboard');
            // const leaderboard = await response.json();
            
            // For now, use mock data
            this.displayLeaderboard(this.mockData.leaderboard);
            
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
    }
    
    async loadRecentResults() {
        try {
            // TODO: Replace with real API call
            // const response = await fetch('/api/recent-results');
            // const results = await response.json();
            
            // For now, use mock data
            this.displayRecentResults(this.mockData.results);
            
        } catch (error) {
            console.error('Error loading recent results:', error);
        }
    }
    
    async sendBetToBackend(bet) {
        try {
            // TODO: Replace with real API call
            // const response = await fetch('/api/bets', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${this.auth.token}`
            //     },
            //     body: JSON.stringify(bet)
            // });
            
            console.log('Bet placed:', bet);
            return { success: true };
            
        } catch (error) {
            console.error('Error sending bet to backend:', error);
            throw error;
        }
    }
    
    handleBroadcastMessage(message) {
        switch (message.type) {
            case 'new_prediction':
                this.displayPrediction(message.data);
                break;
                
            case 'prediction_ended':
                this.disableBetting();
                document.getElementById('prediction-timer').textContent = 'ENDED';
                break;
                
            case 'prediction_result':
                this.handlePredictionResult(message.data);
                break;
                
            case 'leaderboard_update':
                this.displayLeaderboard(message.data);
                break;
                
            default:
                console.log('Unknown message type:', message.type);
        }
    }
    
    handlePredictionResult(result) {
        // Show result notification
        if (this.userBet && this.userBet.option === result.winningOption) {
            const payout = Math.floor(this.userBet.amount * result.odds);
            this.showNotification(`You won ${payout} Bits! 🎉`, 'success');
        } else if (this.userBet) {
            this.showNotification(`Better luck next time! 😔`, 'info');
        }
        
        // Reset for next prediction
        this.userBet = null;
        this.selectedOption = null;
        this.enableBetting();
        
        // Update recent results
        this.loadRecentResults();
        this.loadLeaderboard();
    }
    
    enableBetting() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.classList.remove('selected');
        });
        
        document.getElementById('place-bet').disabled = true; // Will be enabled when option selected
        document.getElementById('bits-amount').disabled = false;
        document.getElementById('user-bet').style.display = 'none';
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#00f593' : '#9146ff',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease-out'
        });
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .light-theme {
        background: #f7f7f8;
        color: #0e0e10;
    }
    
    .light-theme .recent-results,
    .light-theme .leaderboard {
        background: #ffffff;
        border-color: #e5e5e5;
    }
    
    .light-theme .header {
        border-color: #e5e5e5;
    }
`;
document.head.appendChild(style);

// Initialize the extension when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FinalBetExtension();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBetExtension;
}
