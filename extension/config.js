// State Machine Config for The Final Bet
class PredictionStateMachine {
    constructor() {
        this.states = {
            IDLE: 'idle',
            BETTING_OPEN: 'betting_open', 
            BETTING_LOCKED: 'betting_locked',
            RESOLVED: 'resolved'
        };
        
        this.currentState = this.states.IDLE;
        this.currentPrediction = null;
        
        // Simplified templates for The Finals
        this.gameTemplates = [
            'Will my team win this match?',
            'Will my team win this round?',
            'Will I break 30 eliminations?'
        ];
        
        this.init();
    }
    
    init() {
        console.log('🎯 Initializing Prediction State Machine...');
        this.setupEventListeners();
        this.loadGameTemplates();
        this.updateUI();
    }
    
    setupEventListeners() {
        // Start prediction button
        const form = document.getElementById('prediction-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.startBettingWindow();
            });
        }
        
        // Remove game mode change listener since we don't have it anymore
        console.log('✅ Event listeners set up');
    }
    
    // STATE MACHINE TRANSITIONS
    startBettingWindow() {
        console.log('🚀 Starting betting window...');
        
        const question = document.getElementById('prediction-question')?.value?.trim();
        
        if (!question) {
            alert('Please enter a prediction question!');
            return;
        }
        
        if (this.currentState !== this.states.IDLE) {
            if (!confirm('There is already an active prediction. Cancel it and start new?')) {
                return;
            }
        }
        
        // Create new prediction
        this.currentPrediction = {
            id: `pred_${Date.now()}`,
            question: question,
            startTime: Date.now(),
            bets: []
        };
        
        // Transition to BETTING_OPEN
        this.currentState = this.states.BETTING_OPEN;
        this.updateUI();
        this.showNotification('🟢 Betting window opened! Viewers can place bets.', 'success');
        
        // Clear form
        document.getElementById('prediction-question').value = '';
    }
    
    closeBetting() {
        console.log('🔒 Closing betting window...');
        
        if (this.currentState !== this.states.BETTING_OPEN) {
            alert('No betting window is currently open!');
            return;
        }
        
        // Transition to BETTING_LOCKED
        this.currentState = this.states.BETTING_LOCKED;
        this.currentPrediction.bettingClosedTime = Date.now();
        this.updateUI();
        this.showNotification('🔒 Betting closed! Game starting - resolve when finished.', 'info');
    }
    
    resolvePrediction(outcome) {
        console.log(`✅ Resolving prediction as: ${outcome}`);
        
        if (this.currentState !== this.states.BETTING_LOCKED) {
            alert('No prediction is waiting for resolution!');
            return;
        }
        
        const outcomeText = outcome === 'yes' ? 'SUCCESS ✅' : 'FAILED ❌';
        
        if (!confirm(`Resolve prediction as ${outcomeText}?\\n\\n"${this.currentPrediction.question}"`)) {
            return;
        }
        
        // Resolve prediction
        this.currentPrediction.outcome = outcome;
        this.currentPrediction.resolvedTime = Date.now();
        
        // Transition to RESOLVED (briefly) then back to IDLE
        this.currentState = this.states.RESOLVED;
        this.updateUI();
        this.showNotification(`✅ Prediction resolved as ${outcomeText}! Payouts distributed.`, 'success');
        
        // Reset after 3 seconds
        setTimeout(() => {
            this.resetPrediction();
        }, 3000);
    }
    
    cancelPrediction() {
        console.log('❌ Cancelling prediction...');
        
        if (this.currentState === this.states.IDLE) {
            alert('No active prediction to cancel!');
            return;
        }
        
        if (!confirm('Cancel prediction and refund all bets?')) {
            return;
        }
        
        this.showNotification('❌ Prediction cancelled. All bets refunded.', 'info');
        this.resetPrediction();
    }
    
    resetPrediction() {
        this.currentState = this.states.IDLE;
        this.currentPrediction = null;
        this.updateUI();
    }
    
    // UI UPDATES
    updateUI() {
        console.log(`🔄 Updating UI for state: ${this.currentState}`);
        this.updateQuickActions();
        this.updateStatusBanner();
        this.updateFormState();
    }
    
    updateQuickActions() {
        const quickActions = document.querySelector('.quick-actions');
        if (!quickActions) return;
        
        quickActions.innerHTML = '';
        
        switch (this.currentState) {
            case this.states.IDLE:
                quickActions.innerHTML = `
                    <div class="quick-action" onclick="scrollToForm()">
                        <div class="quick-action-title">🎯 Start New Prediction</div>
                        <div class="quick-action-desc">Begin betting window</div>
                    </div>
                    <div class="quick-action" onclick="showPastResults()">
                        <div class="quick-action-title">📊 Past Results</div>
                        <div class="quick-action-desc">View previous predictions</div>
                    </div>
                `;
                break;
                
            case this.states.BETTING_OPEN:
                quickActions.innerHTML = `
                    <div class="quick-action betting-open" onclick="predictionManager.closeBetting()">
                        <div class="quick-action-title">⏸️ Close Betting</div>
                        <div class="quick-action-desc">End betting window, start game</div>
                    </div>
                    <div class="quick-action cancel" onclick="predictionManager.cancelPrediction()">
                        <div class="quick-action-title">❌ Cancel Prediction</div>
                        <div class="quick-action-desc">Cancel and refund all bets</div>
                    </div>
                `;
                break;
                
            case this.states.BETTING_LOCKED:
                quickActions.innerHTML = `
                    <div class="quick-action resolve-success" onclick="predictionManager.resolvePrediction('yes')">
                        <div class="quick-action-title">✅ Mark as SUCCESS</div>
                        <div class="quick-action-desc">I completed the challenge</div>
                    </div>
                    <div class="quick-action resolve-fail" onclick="predictionManager.resolvePrediction('no')">
                        <div class="quick-action-title">❌ Mark as FAILED</div>
                        <div class="quick-action-desc">I did not complete the challenge</div>
                    </div>
                    <div class="quick-action cancel" onclick="predictionManager.cancelPrediction()">
                        <div class="quick-action-title">🔄 Cancel & Refund</div>
                        <div class="quick-action-desc">Something went wrong, refund all</div>
                    </div>
                `;
                break;
                
            case this.states.RESOLVED:
                quickActions.innerHTML = `
                    <div class="quick-action resolved">
                        <div class="quick-action-title">✅ Prediction Resolved</div>
                        <div class="quick-action-desc">Returning to main menu...</div>
                    </div>
                `;
                break;
        }
    }
    
    updateStatusBanner() {
        // Remove existing banner
        const existingBanner = document.getElementById('status-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        if (this.currentState === this.states.IDLE) return;
        
        const banner = document.createElement('div');
        banner.id = 'status-banner';
        
        let statusInfo = '';
        let statusColor = '';
        
        switch (this.currentState) {
            case this.states.BETTING_OPEN:
                statusInfo = `
                    <div class="status-icon">🟢</div>
                    <div class="status-content">
                        <div class="status-title">BETTING OPEN</div>
                        <div class="status-question">${this.currentPrediction.question}</div>
                        <div class="status-desc">Viewers can place bets - Close when ready to start game</div>
                    </div>
                `;
                statusColor = '#00f593';
                break;
                
            case this.states.BETTING_LOCKED:
                statusInfo = `
                    <div class="status-icon">🔒</div>
                    <div class="status-content">
                        <div class="status-title">GAME IN PROGRESS</div>
                        <div class="status-question">${this.currentPrediction.question}</div>
                        <div class="status-desc">Betting closed - Resolve when game ends</div>
                    </div>
                `;
                statusColor = '#ff9500';
                break;
                
            case this.states.RESOLVED:
                const outcomeText = this.currentPrediction.outcome === 'yes' ? 'SUCCESS' : 'FAILED';
                const outcomeIcon = this.currentPrediction.outcome === 'yes' ? '✅' : '❌';
                statusInfo = `
                    <div class="status-icon">${outcomeIcon}</div>
                    <div class="status-content">
                        <div class="status-title">RESOLVED: ${outcomeText}</div>
                        <div class="status-question">${this.currentPrediction.question}</div>
                        <div class="status-desc">Payouts distributed successfully</div>
                    </div>
                `;
                statusColor = this.currentPrediction.outcome === 'yes' ? '#00f593' : '#ff6b6b';
                break;
        }
        
        banner.style.cssText = `
            background: linear-gradient(135deg, ${statusColor}22 0%, ${statusColor}11 100%);
            border: 2px solid ${statusColor}55;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: slideIn 0.3s ease-out;
        `;
        banner.innerHTML = statusInfo;
        
        // Insert at top of main content
        const firstSection = document.querySelector('.config-section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(banner, firstSection);
        }
    }
    
    updateFormState() {
        const form = document.getElementById('prediction-form');
        const questionInput = document.getElementById('prediction-question');
        const submitBtn = form?.querySelector('button[type="submit"]');
        
        if (this.currentState === this.states.IDLE) {
            if (questionInput) questionInput.disabled = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Start Betting Window';
            }
        } else {
            if (questionInput) questionInput.disabled = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Prediction Active...';
            }
        }
    }
    
    loadGameTemplates() {
        const container = document.getElementById('game-templates-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="form-group">
                <label class="form-label">Game: The Finals</label>
                <div class="game-info">Playing The Finals - Choose a quick template below or create custom prediction</div>
            </div>
            <div class="form-group">
                <label class="form-label">Quick Templates</label>
                <div class="template-grid">
                    ${this.gameTemplates.map(template => `
                        <button type="button" class="template-btn" onclick="useTemplate('${template}')">
                            ${template}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    loadTemplatesForGameMode() {
        // No longer needed - removed game mode switching
    }
    
    useTemplate(template) {
        const questionInput = document.getElementById('prediction-question');
        if (questionInput && this.currentState === this.states.IDLE) {
            questionInput.value = template;
            this.showNotification('Template loaded!', 'success');
        }
    }
    
    showNotification(message, type = 'info') {
        console.log(`📢 ${message}`);
        
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00f593' : type === 'error' ? '#ff6b6b' : '#9146ff'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
}

// Global functions
function scrollToForm() {
    document.getElementById('prediction-form')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('prediction-question')?.focus();
}

function useTemplate(template) {
    if (window.predictionManager) {
        window.predictionManager.useTemplate(template);
    }
}

function showPastResults() {
    alert('📊 Past results viewer coming in future update!');
}

// CSS for new styling
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .template-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
        margin-top: 8px;
    }
    
    .template-btn {
        background: #0e0e10;
        border: 1px solid #464649;
        color: #efeff1;
        padding: 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        text-align: left;
        transition: all 0.2s;
    }
    
    .template-btn:hover {
        border-color: #dc2626;
        background: rgba(220, 38, 38, 0.05);
    }
    
    .game-info {
        background: #0e0e10;
        border: 1px solid #464649;
        padding: 12px;
        border-radius: 6px;
        font-size: 13px;
        color: #adadb8;
        margin-top: 5px;
    }
    
    .quick-action.betting-open {
        border-color: #00f593;
        background: rgba(0, 245, 147, 0.05);
    }
    
    .quick-action.resolve-success:hover {
        border-color: #00f593;
        background: rgba(0, 245, 147, 0.1);
    }
    
    .quick-action.resolve-fail:hover {
        border-color: #ff6b6b;
        background: rgba(255, 107, 107, 0.1);
    }
    
    .quick-action.cancel {
        border-color: #666;
    }
    
    .quick-action.resolved {
        border-color: #00f593;
        background: rgba(0, 245, 147, 0.1);
        cursor: default;
    }
    
    .status-icon {
        font-size: 24px;
        min-width: 30px;
    }
    
    .status-content {
        flex: 1;
    }
    
    .status-title {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 5px;
    }
    
    .status-question {
        font-size: 14px;
        margin-bottom: 5px;
        opacity: 0.9;
    }
    
    .status-desc {
        font-size: 12px;
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page loaded, initializing Prediction Manager...');
    window.predictionManager = new PredictionStateMachine();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PredictionStateMachine;
}
