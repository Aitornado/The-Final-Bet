// Simplified viewer.js for testing
document.addEventListener('DOMContentLoaded', function() {
    console.log('The Final Bet Extension Loading...');
    
    // Hide loading, show interface immediately for testing
    setTimeout(function() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-interface').style.display = 'block';
        
        // Show a sample prediction
        showSamplePrediction();
        showSampleData();
    }, 1000);
    
    // Set up button listeners
    setupEventListeners();
});

function showSamplePrediction() {
    // Show the prediction card
    document.getElementById('active-prediction').style.display = 'block';
    document.getElementById('no-predictions').style.display = 'none';
    
    // Set the question
    document.getElementById('prediction-question').textContent = 'Will I win this Cashout round?';
    
    // Set static timer (no countdown for now)
    document.getElementById('prediction-timer').textContent = 'BETTING OPEN';
}

function showSampleData() {
    // Sample recent results
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = `
        <div class="result-item">
            <span>Previous round win?</span>
            <span class="result-outcome win">YES (50 Bits)</span>
        </div>
        <div class="result-item">
            <span>20+ eliminations?</span>
            <span class="result-outcome loss">NO (75 Bits)</span>
        </div>
    `;
    
    // Sample leaderboard
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = `
        <div class="leaderboard-item">
            <span class="rank">#1</span>
            <span class="username">ProGamer2024</span>
            <span class="points">1,250</span>
        </div>
        <div class="leaderboard-item">
            <span class="rank">#2</span>
            <span class="username">BetMaster</span>
            <span class="points">980</span>
        </div>
        <div class="leaderboard-item">
            <span class="rank">#3</span>
            <span class="username">ViewerFan</span>
            <span class="points">750</span>
        </div>
    `;
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
        
        if (selectedOption && bitsAmount >= 1 && bitsAmount <= 10000) {
            placeBetBtn.disabled = false;
        } else {
            placeBetBtn.disabled = true;
        }
    }
    
    function placeBet() {
        const bitsAmount = parseInt(document.getElementById('bits-amount').value);
        const option = selectedOption.toUpperCase();
        
        if (!selectedOption || !bitsAmount) {
            alert('Please select an option and enter Bits amount!');
            return;
        }
        
        // Show user bet
        document.getElementById('user-bet-details').textContent = `${bitsAmount} Bits on ${option}`;
        document.getElementById('user-bet').style.display = 'block';
        
        // Disable betting
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        });
        document.getElementById('place-bet').disabled = true;
        document.getElementById('bits-amount').disabled = true;
        
        // Show confirmation
        showNotification(`Bet placed: ${bitsAmount} Bits on ${option}!`, 'success');
        
        // Update timer to show waiting
        document.getElementById('prediction-timer').textContent = 'WAITING FOR RESULT';
    }
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
