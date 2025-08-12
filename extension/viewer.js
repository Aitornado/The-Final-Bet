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
