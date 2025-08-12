// Updated config.js for manual resolution workflow
class FinalBetConfig {
    constructor() {
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.auth = null;
        this.currentPrediction = null;
        this.predictionState = 'none'; // 'none', 'betting', 'locked', 'resolved'
        
        // Updated templates for different game modes
        this.gameTemplates = {
            'the-finals': [
                { id: 'cashout-win', question: 'Will my team win this Cashout match?', type: 'yes-no' },
                { id: 'bank-it-win', question: 'Will my team win this Bank It match?', type: 'yes-no' },
                { id: 'power-shift-win', question: 'Will my team win this Power Shift match?', type: 'yes-no' },
                { id: 'survival-time', question: 'Will I survive longer than 5 minutes?', type: 'yes-no' },
                { id: 'elimination-count', question: 'Will I get 15+ eliminations this match?', type: 'yes-no' }
            ],
            'fps-general': [
                { id: 'round-win', question: 'Will I win this round?', type: 'yes-no' },
                { id: 'match-win', question: 'Will I win this match?', type: 'yes-no' },
                { id: 'kill-count-10', question: 'Will I get 10+ kills this round?', type: 'yes-no' },
                { id: 'kill-count-20', question: 'Will I get 20+ kills this match?', type: 'yes-no' },
                { id: 'first-blood', question: 'Will I get first blood?', type: 'yes-no' }
            ],
            'battle-royale': [
                { id: 'top-placement', question: 'Will I finish in top 3?', type: 'yes-no' },
                { id: 'victory-royale', question: 'Will I win this match?', type: 'yes-no' },
                { id: 'early-elimination', question: 'Will I survive past 5 minutes?', type: 'yes-no' },
                { id: 'kill-threshold', question: 'Will I get 5+ eliminations?', type: 'yes-no' }
            ],
            'general': [
                { id: 'objective-complete', question: 'Will I complete the objective?', type: 'yes-no' },
                { id: 'challenge-success', question: 'Will I succeed at this challenge?', type: 'yes-no' },
                { id: 'time-limit', question: 'Will I finish within the time limit?', type: 'yes-no' }
            ]
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing Manual Resolution Config...');
        this.setupEventListeners();
        this.loadGameTemplates();
        this.updateInterface();
    }
    
    setupEventListeners() {
        // Prediction form
        document.getElementById('prediction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startBettingWindow();
        });
        
        // Game mode selector
        const gameModeSelect = document.getElementById('game-mode');
        if (gameModeSelect) {
            gameModeSelect.addEventListener('change', () => {
                this.loadTemplatesForGameMode();
            });
        }
    }
    
    updateInterface() {
        this.updateQuickActions();
        this.updatePredictionStatus();
    }
    
    updateQuickActions() {
        const quickActions = document.querySelector('.quick-actions');
        
        // Clear existing actions
        quickActions.innerHTML = '';
        
        if (this.predictionState === 'none') {
            // No active prediction
            quickActions.innerHTML = `
                <div class="quick-action" onclick="scrollToCreatePrediction()">
                    <div class="quick-action-title">🎯 Start New Prediction</div>
                    <div class="quick-action-desc">Begin 60-second betting window</div>
                </div>
                <div class="quick-action" onclick="viewPastResults()">
                    <div class="quick-action-title">📊 Past Results</div>
                    <div class="quick-action-desc">View previous predictions</div>
                </div>
            `;
        } else if (this.predictionState === 'betting') {
            // Betting window open
            quickActions.innerHTML = `
                <div class="quick-action active-prediction" onclick="closeBetting()">
                    <div class="quick-action-title">⏸️ Close Betting</div>
                    <div class="quick-action-desc">End betting window, start game</div>
                </div>
                <div class="quick-action" onclick="cancelPrediction()">
                    <div class="quick-action-title">❌ Cancel Prediction</div>
                    <div class="quick-action-desc">Cancel and refund all bets</div>
                </div>
            `;
        } else if (this.predictionState === 'locked') {
            // Game in progress, waiting for result
            quickActions.innerHTML = `
                <div class="quick-action resolve-success" onclick="resolvePrediction('yes')">
                    <div class="quick-action-title">✅ Mark as SUCCESS</div>
                    <div class="quick-action-desc">I completed the challenge</div>
                </div>
                <div class="quick-action resolve-fail" onclick="resolvePrediction('no')">
                    <div class="quick-action-title">❌ Mark as FAILED</div>
                    <div class="quick-action-desc">I did not complete the challenge</div>
                </div>
                <div class="quick-action" onclick="cancelPrediction()">
                    <div class="quick-action-title">🔄 Cancel & Refund</div>
                    <div class="quick-action-desc">Something went wrong, refund all</div>
                </div>
            `;
        }
    }
    
    updatePredictionStatus() {
        // Remove existing status banner
        const existingBanner = document.getElementById('prediction-status-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        if (this.predictionState !== 'none' && this.currentPrediction) {
            const banner = document.createElement('div');
            banner.id = 'prediction-status-banner';
            
            let statusInfo = '';
            let statusColor = '';
            
            if (this.predictionState === 'betting') {
                statusInfo = `
                    <div style="font-weight: 600; margin-bottom: 5px;">🟢 BETTING OPEN</div>
                    <div style="font-size: 14px; margin-bottom: 5px;">${this.currentPrediction.question}</div>
                    <div style="font-size: 12px; opacity: 0.9;">Viewers can place bets - Close when ready to start game</div>
                `;
                statusColor = '#00f593';
            } else if (this.predictionState === 'locked') {
                statusInfo = `
                    <div style="font-weight: 600; margin-bottom: 5px;">🔒 GAME IN PROGRESS</div>
                    <div style="font-size: 14px; margin-bottom: 5px;">${this.currentPrediction.question}</div>
                    <div style="font-size: 12px; opacity: 0.9;">Betting closed - Resolve when game ends</div>
                `;
                statusColor = '#ff9500';
            }
            
            banner.style.cssText = `
                background: linear-gradient(135deg, ${statusColor}22 0%, ${statusColor}11 100%);
                border: 1px solid ${statusColor}55;
                color: ${statusColor};
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
            `;
            banner.innerHTML = statusInfo;
            
            document.body.insertBefore(banner, document.querySelector('.config-section'));
        }
    }
    
    startBettingWindow() {
        const question = document.getElementById('prediction-question').value.trim();
        
        if (!question) {
            alert('Please enter a prediction question!');
            return;
        }
        
        if (this.predictionState !== 'none') {
            if (!confirm('There is already an active prediction. Cancel it and start new one?')) {
                return;
            }
        }
        
        this.currentPrediction = {
            id: `pred_${Date.now()}`,
            question: question,
            startTime: Date.now(),
            status: 'betting'
        };
        
        this.predictionState = 'betting';
        this.updateInterface();
        this.showNotification('Betting window opened! Viewers can now place bets.', 'success');
        
        // Clear form
        document.getElementById('prediction-form').reset();
    }
    
    closeBetting() {
        if (this.predictionState !== 'betting') return;
        
        this.predictionState = 'locked';
        this.currentPrediction.bettingClosedTime = Date.now();
        this.updateInterface();
        this.showNotification('Betting closed! Game starting - resolve when finished.', 'info');
    }
    
    resolvePrediction(outcome) {
        if (this.predictionState !== 'locked') return;
        
        const outcomeText = outcome === 'yes' ? 'SUCCESS' : 'FAILED';
        
        if (!confirm(`Resolve prediction as ${outcomeText}?`)) {
            return;
        }
        
        this.currentPrediction.outcome = outcome;
        this.currentPrediction.resolvedTime = Date.now();
        this.currentPrediction.status = 'resolved';
        
        this.predictionState = 'none';
        this.currentPrediction = null;
        
        this.updateInterface();
        this.showNotification(`Prediction resolved as ${outcomeText}! Payouts distributed.`, 'success');
    }
    
    cancelPrediction() {
        if (!confirm('Cancel prediction and refund all bets?')) {
            return;
        }
        
        this.predictionState = 'none';
        this.currentPrediction = null;
        this.updateInterface();
        this.showNotification('Prediction cancelled. All bets refunded.', 'info');
    }
    
    loadGameTemplates() {
        const container = document.getElementById('game-templates-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="form-group">
                <label class="form-label" for="game-mode">Game Mode</label>
                <select id="game-mode" class="form-select">
                    <option value="the-finals">The Finals</option>
                    <option value="fps-general">FPS General</option>
                    <option value="battle-royale">Battle Royale</option>
                    <option value="general">General Gaming</option>
                </select>
            </div>
            <div id="templates-for-mode"></div>
        `;
        
        this.loadTemplatesForGameMode();
    }
    
    loadTemplatesForGameMode() {
        const gameMode = document.getElementById('game-mode')?.value || 'the-finals';
        const container = document.getElementById('templates-for-mode');
        if (!container) return;
        
        const templates = this.gameTemplates[gameMode] || [];
        
        container.innerHTML = `
            <div class="form-group">
                <label class="form-label">Quick Templates</label>
                <div class="template-grid">
                    ${templates.map(template => `
                        <button type="button" class="template-btn" onclick="useTemplate('${template.id}', '${gameMode}')">
                            ${template.question}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    useTemplate(templateId, gameMode) {
        const template = this.gameTemplates[gameMode]?.find(t => t.id === templateId);
        if (template) {
            document.getElementById('prediction-question').value = template.question;
            this.showNotification('Template loaded!', 'success');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00f593' : type === 'error' ? '#ff6b6b' : '#9146ff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Global functions
function scrollToCreatePrediction() {
    document.getElementById('prediction-form').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('prediction-question').focus();
}

function closeBetting() {
    if (window.finalBetConfig) {
        window.finalBetConfig.closeBetting();
    }
}

function resolvePrediction(outcome) {
    if (window.finalBetConfig) {
        window.finalBetConfig.resolvePrediction(outcome);
    }
}

function cancelPrediction() {
    if (window.finalBetConfig) {
        window.finalBetConfig.cancelPrediction();
    }
}

function useTemplate(templateId, gameMode) {
    if (window.finalBetConfig) {
        window.finalBetConfig.useTemplate(templateId, gameMode);
    }
}

function viewPastResults() {
    alert('Past results viewer coming in future update!');
}

// Add CSS for new elements
const style = document.createElement('style');
style.textContent = `
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
    
    .quick-action.active-prediction {
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
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.finalBetConfig = new FinalBetConfig();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBetConfig;
}
