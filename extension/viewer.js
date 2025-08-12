// Updated viewer.js with pot tracking and no dummy data
document.addEventListener('DOMContentLoaded', function() {
    console.log('The Final Bet Extension Loading...');
    
    // Extension state
    let predictionState = 'idle'; // 'idle', 'betting_open', 'betting_locked', 'resolved'
    let currentPrediction = null;
    let userBet = null;
    let selectedOption = null;
    
    // Mock pot data (this would come from backend in production)
    let potData = {
        totalBits: 0,
        totalBets: 0,
        options: {
            yes: { bits: 0, bets: 0 },
            no: { bits: 0, bets: 0 }
        }
    };
    
    // Initialize interface
    setTimeout(function() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-interface').style.display = 'block';
        
        // Start in idle state (no dummy data)
        showIdleState();
        setupEventListeners();
    }, 1000);
    
    function showIdleState() {
        // Show no predictions message
        document.getElementById('active-prediction').style.display = 'none';
        document.getElementById('game-in-progress').style.display = 'none';
        document.getElementById('no-predictions').style.display = 'block';
        
        // Clear recent results and leaderboard (no dummy data)
        document.getElementById('results-list').innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No recent predictions</div>';
        document.getElementById('leaderboard-list').innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No leaderboard data yet</div>';
    }
    
    function showBettingOpen(prediction) {
        predictionState = 'betting_open';
        currentPrediction = prediction;
        
        // Show betting interface
        document.getElementById('no-predictions').style.display = 'none';
        document.getElementById('game-in-progress').style.display = 'none';
        document.getElementById('active-prediction').style.display = 'block';
        
        // Set prediction details
        document.getElementById('prediction-question').textContent = prediction.question;
        document.getElementById('prediction-timer').textContent = 'BETTING OPEN';
        
        // Reset betting form
        resetBettingForm();
        enableBetting();
    }
    
    function showGameInProgress(prediction, pot) {
        predictionState = 'betting_locked';
        
        // Hide betting interface, show game progress
        document.getElementById('active-prediction').style.display = 'none';
        document.getElementById('no-predictions').style.display = 'none';
        document.getElementById('game-in-progress').style.display = 'block';
        
        // Update game progress display
        updateGameProgressDisplay(prediction, pot);
    }
    
    function updateGameProgressDisplay(prediction, pot) {
        document.getElementById('game-question').textContent = prediction.question;
        document.getElementById('total-pot').textContent = pot.totalBits;
        document.getElementById('total-bets').textContent = pot.totalBets;
        
        // Update vote breakdown
        const yesPercentage = pot.totalBets > 0 ? Math.round((pot.options.yes.bets / pot.totalBets) * 100) : 0;
        const noPercentage = 100 - yesPercentage;
        
        document.getElementById('yes-votes').textContent = pot.options.yes.bets;
        document.getElementById('yes-bits').textContent = pot.options.yes.bits;
        document.getElementById('yes-percentage').textContent = yesPercentage;
        document.getElementById('yes-bar').style.width = yesPercentage + '%';
        
        document.getElementById('no-votes').textContent = pot.options.no.bets;
        document.getElementById('no-bits').textContent = pot.options.no.bits;
        document.getElementById('no-percentage').textContent = noPercentage;
        document.getElementById('no-bar').style.width = noPercentage + '%';
        
        // Show user's bet if they placed one
        if (userBet) {
            const userBetDisplay = document.getElementById('user-bet-status');
            const potentialPayout = calculatePotentialPayout(userBet, pot);
            
            userBetDisplay.innerHTML = `
                <div class="user-bet-card">
                    <div class="bet-details">
                        <span class="bet-option">${userBet.option.toUpperCase()}</span>
                        <span class="bet-amount">${userBet.amount} Bits</span>
                    </div>
                    <div class="potential-payout">
                        Potential payout: <strong>${potentialPayout} Bits</strong>
                    </div>
                </div>
            `;
            userBetDisplay.style.display = 'block';
        }
    }
    
    function calculatePotentialPayout(bet, pot) {
        const userOption = bet.option;
        const oppositeOption = userOption === 'yes' ? 'no' : 'yes';
        
        const userSideBits = pot.options[userOption].bits;
        const oppositeSideBits = pot.options[oppositeOption].bits;
        
        if (userSideBits === 0) return bet.amount;
        
        // Simple payout calculation: (opposite side bits / user side bits) * user bet + user bet
        const multiplier = oppositeSideBits > 0 ? (oppositeSideBits / userSideBits) : 1;
        return Math.floor(bet.amount * (1 + multiplier));
    }
    
    function setupEventListeners() {
        let selectedOption = null;
        
        // Option buttons
        document.getElementById('option-yes').addEventListener('click', function() {
            selectOption('yes');
        });
        
        document.getElementById('option-no').addEventListener('click', function() {
            selectOption('no');
        });
        
        // Place bet button
        document.getElementById('place-bet').addEventListener('click', function() {
            placeBet();
        });
        
        // Bits input validation
        document.getElementById('bits-amount').addEventListener('input', function() {
            validateBetting();
        });
        
        function selectOption(option) {
            if (predictionState !== 'betting_open') return;
            
            // Remove previous selection
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selection
            document.getElementById('option-' + option).classList.add('selected');
            selectedOption = option;
            
            validateBetting();
        }
        
        function validateBetting() {
            const bitsAmount = parseInt(document.getElementById('bits-amount').value);
            const placeBetBtn = document.getElementById('place-bet');
            
            if (selectedOption && bitsAmount >= 1 && bitsAmount <= 10000 && predictionState === 'betting_open') {
                placeBetBtn.disabled = false;
            } else {
                placeBetBtn.disabled = true;
            }
        }
        
        function placeBet() {
            if (predictionState !== 'betting_open') {
                alert('Betting is not currently open!');
                return;
            }
            
            const bitsAmount = parseInt(document.getElementById('bits-amount').value);
            const option = selectedOption;
            
            if (!option || !bitsAmount) {
                alert('Please select an option and enter Bits amount!');
                return;
            }
            
            // Record user bet
            userBet = {
                option: option,
                amount: bitsAmount,
                prediction: currentPrediction?.id
            };
            
            // Update pot data (mock - would be real API call)
            potData.totalBits += bitsAmount;
            potData.totalBets += 1;
            potData.options[option].bits += bitsAmount;
            potData.options[option].bets += 1;
            
            // Show user bet confirmation
            document.getElementById('user-bet-details').textContent = `${bitsAmount} Bits on ${option.toUpperCase()}`;
            document.getElementById('user-bet').style.display = 'block';
            
            // Disable betting for this user
            disableBetting();
            showNotification(`Bet placed: ${bitsAmount} Bits on ${option.toUpperCase()}!`, 'success');
        }
    }
    
    function resetBettingForm() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('bits-amount').value = '50';
        document.getElementById('user-bet').style.display = 'none';
        selectedOption = null;
    }
    
    function enableBetting() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
        document.getElementById('place-bet').disabled = true;
        document.getElementById('bits-amount').disabled = false;
    }
    
    function disableBetting() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        });
        document.getElementById('place-bet').disabled = true;
        document.getElementById('bits-amount').disabled = true;
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00f593' : '#9146ff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // Simulate state changes for testing
    // These would be real Twitch messages in production
    window.testBettingOpen = function() {
        showBettingOpen({
            id: 'test_pred',
            question: 'Will my team win this match?'
        });
    };
    
    window.testGameInProgress = function() {
        // Simulate some bets being placed
        potData = {
            totalBits: 350,
            totalBets: 8,
            options: {
                yes: { bits: 200, bets: 5 },
                no: { bits: 150, bets: 3 }
            }
        };
        
        showGameInProgress({
            id: 'test_pred',
            question: 'Will my team win this match?'
        }, potData);
    };
    
    window.testBackToIdle = function() {
        showIdleState();
        userBet = null;
        potData = {
            totalBits: 0,
            totalBets: 0,
            options: {
                yes: { bits: 0, bets: 0 },
                no: { bits: 0, bets: 0 }
            }
        };
    };
});
