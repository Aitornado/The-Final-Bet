// Twitch Extension Configuration JavaScript
class FinalBetConfig {
    constructor() {
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.auth = null;
        this.currentPrediction = null;
        
        // Default templates
        this.defaultTemplates = [
            {
                id: 'round-win',
                name: 'Round Victory',
                question: 'Will I win this round?',
                type: 'yes-no',
                game: 'General'
            },
            {
                id: 'match-win',
                name: 'Match Victory',
                question: 'Will I win this match?',
                type: 'yes-no',
                game: 'General'
            },
            {
                id: 'elimination-count',
                name: '10+ Eliminations',
                question: 'Will I get 10+ eliminations this round?',
                type: 'yes-no',
                game: 'FPS'
            },
            {
                id: 'finals-specific',
                name: 'Finals - Cashout Win',
                question: 'Will my team win this Cashout match?',
                type: 'yes-no',
                game: 'The Finals'
            }
        ];
        
        this.init();
    }
    
    init() {
        console.log('Initializing The Final Bet Configuration...');
        
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                this.auth = auth;
                this.loadConfiguration();
            });
            
            this.twitch.configuration.onChanged(() => {
                this.loadConfiguration();
            });
        }
        
        this.setupEventListeners();
        this.loadTemplates();
        this.loadCurrentSettings();
    }
    
    setupEventListeners() {
        // Prediction form submission
        document.getElementById('prediction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startPrediction();
        });
        
        // Settings auto-save
        ['min-bits', 'max-bits', 'auto-resolve'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.saveSettings();
            });
        });
    }
    
    loadConfiguration() {
        if (this.twitch && this.twitch.configuration) {
            const config = this.twitch.configuration.broadcaster || {};
            
            // Load current prediction if any
            if (config.currentPrediction) {
                this.currentPrediction = JSON.parse(config.currentPrediction);
                this.updateUIForActivePrediction();
            }
            
            // Load settings
            if (config.settings) {
                const settings = JSON.parse(config.settings);
                this.applySettings(settings);
            }
        }
    }
    
    updatePredictionOptions() {
        const type = document.getElementById('prediction-type').value;
        const container = document.getElementById('options-container');
        
        switch (type) {
            case 'yes-no':
                container.innerHTML = `
                    <div class="form-group">
                        <label class="form-label">Options</label>
                        <div class="button-group">
                            <input type="text" class="form-input" placeholder="YES" style="width: 150px;" readonly>
                            <input type="text" class="form-input" placeholder="NO" style="width: 150px;" readonly>
                        </div>
                    </div>
                `;
                break;
                
            case 'multiple-choice':
                container.innerHTML = `
                    <div class="form-group">
                        <label class="form-label">Options</label>
                        <div id="choice-options">
                            <div class="button-group" style="margin-bottom: 8px;">
                                <input type="text" class="form-input" placeholder="Option 1" style="width: 200px;">
                                <button type="button" class="btn btn-secondary btn-small" onclick="removeOption(this)">Remove</button>
                            </div>
                            <div class="button-group" style="margin-bottom: 8px;">
                                <input type="text" class="form-input" placeholder="Option 2" style="width: 200px;">
                                <button type="button" class="btn btn-secondary btn-small" onclick="removeOption(this)">Remove</button>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary btn-small" onclick="addOption()">+ Add Option</button>
                    </div>
                `;
                break;
                
            case 'number-range':
                container.innerHTML = `
                    <div class="form-group">
                        <label class="form-label">Number Range</label>
                        <div class="button-group">
                            <div>
                                <label class="form-label">Minimum</label>
                                <input type="number" class="form-input" placeholder="0" style="width: 100px;">
                            </div>
                            <div>
                                <label class="form-label">Maximum</label>
                                <input type="number" class="form-input" placeholder="20" style="width: 100px;">
                            </div>
                            <div>
                                <label class="form-label">Step</label>
                                <input type="number" class="form-input" placeholder="1" style="width: 80px;">
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
    }
    
    async startPrediction() {
        const question = document.getElementById('prediction-question').value.trim();
        const duration = parseInt(document.getElementById('prediction-duration').value);
        const type = document.getElementById('prediction-type').value;
        
        if (!question) {
            alert('Please enter a prediction question!');
            return;
        }
        
        if (this.currentPrediction) {
            if (!confirm('There is already an active prediction. End it and start a new one?')) {
                return;
            }
            await this.endCurrentPrediction();
        }
        
        const prediction = {
            id: `pred_${Date.now()}`,
            question: question,
            type: type,
            duration: duration,
            startTime: Date.now(),
            endTime: Date.now() + (duration * 60 * 1000),
            status: 'active',
            options: this.getPredictionOptions(type)
        };
        
        try {
            await this.savePrediction(prediction);
            await this.broadcastPrediction(prediction);
            
            this.currentPrediction = prediction;
            this.updateUIForActivePrediction();
            this.showNotification('Prediction started successfully!', 'success');
            
            // Clear the form
            document.getElementById('prediction-form').reset();
            
        } catch (error) {
            console.error('Error starting prediction:', error);
            alert('Failed to start prediction. Please try again.');
        }
    }
    
    getPredictionOptions(type) {
        switch (type) {
            case 'yes-no':
                return [
                    { id: 'yes', text: 'YES', odds: 2.0 },
                    { id: 'no', text: 'NO', odds: 2.0 }
                ];
                
            case 'multiple-choice':
                const options = [];
                const inputs = document.querySelectorAll('#choice-options input');
                inputs.forEach((input, index) => {
                    if (input.value.trim()) {
                        options.push({
                            id: `option_${index}`,
                            text: input.value.trim(),
                            odds: 2.0
                        });
                    }
                });
                return options;
                
            case 'number-range':
                // For number range, create options based on the range
                return [
                    { id: 'under', text: 'Under Target', odds: 2.0 },
                    { id: 'over', text: 'Over Target', odds: 2.0 }
                ];
                
            default:
                return [];
        }
    }
    
    async endCurrentPrediction() {
        if (!this.currentPrediction) {
            alert('No active prediction to end!');
            return;
        }
        
        try {
            // Update prediction status
            this.currentPrediction.status = 'ended';
            this.currentPrediction.endTime = Date.now();
            
            await this.savePrediction(this.currentPrediction);
            await this.broadcastPredictionEnd(this.currentPrediction);
            
            this.currentPrediction = null;
            this.updateUIForActivePrediction();
            this.showNotification('Prediction ended successfully!', 'success');
            
        } catch (error) {
            console.error('Error ending prediction:', error);
            alert('Failed to end prediction. Please try again.');
        }
    }
    
    updateUIForActivePrediction() {
        const quickActions = document.querySelector('.quick-actions');
        const hasActive = !!this.currentPrediction;
        
        // Update quick action states
        const newPredBtn = quickActions.children[0];
        const endPredBtn = quickActions.children[1];
        
        if (hasActive) {
            newPredBtn.style.opacity = '0.5';
            newPredBtn.style.cursor = 'not-allowed';
            endPredBtn.style.opacity = '1';
            endPredBtn.style.cursor = 'pointer';
        } else {
            newPredBtn.style.opacity = '1';
            newPredBtn.style.cursor = 'pointer';
            endPredBtn.style.opacity = '0.5';
            endPredBtn.style.cursor = 'not-allowed';
        }
        
        // Show current prediction info if active
        if (hasActive) {
            const timeLeft = Math.max(0, this.currentPrediction.endTime - Date.now());
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            
            if (!document.getElementById('active-prediction-banner')) {
                const banner = document.createElement('div');
                banner.id = 'active-prediction-banner';
                banner.style.cssText = `
                    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                `;
                
                banner.innerHTML = `
                    <div style="font-weight: 600; margin-bottom: 5px;">Active Prediction</div>
                    <div style="font-size: 14px; margin-bottom: 5px;">${this.currentPrediction.question}</div>
                    <div style="font-size: 12px; opacity: 0.9;">Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}</div>
                `;
                
                document.body.insertBefore(banner, document.querySelector('.config-section'));
            }
        } else {
            const banner = document.getElementById('active-prediction-banner');
            if (banner) {
                banner.remove();
            }
        }
    }
    
    loadTemplates() {
        const templatesList = document.getElementById('templates-list');
        templatesList.innerHTML = '';
        
        this.defaultTemplates.forEach(template => {
            const templateElement = document.createElement('div');
            templateElement.className = 'prediction-template';
            
            templateElement.innerHTML = `
                <div class="template-header">
                    <div class="template-name">${template.name}</div>
                    <div class="template-actions">
                        <button class="btn btn-primary btn-small" onclick="useTemplate('${template.id}')">Use</button>
                        <button class="btn btn-secondary btn-small" onclick="editTemplate('${template.id}')">Edit</button>
                    </div>
                </div>
                <div style="font-size: 12px; color: #adadb8; margin-bottom: 5px;">${template.game}</div>
                <div style="font-size: 13px; color: #efeff1;">${template.question}</div>
            `;
            
            templatesList.appendChild(templateElement);
        });
    }
    
    async saveSettings() {
        const settings = {
            minBits: parseInt(document.getElementById('min-bits').value),
            maxBits: parseInt(document.getElementById('max-bits').value),
            autoResolve: document.getElementById('auto-resolve').value
        };
        
        try {
            if (this.twitch && this.twitch.configuration) {
                this.twitch.configuration.set('broadcaster', '', JSON.stringify({
                    settings: JSON.stringify(settings),
                    currentPrediction: this.currentPrediction ? JSON.stringify(this.currentPrediction) : null
                }));
            }
            
            this.showNotification('Settings saved!', 'success');
            
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        }
    }
    
    loadCurrentSettings() {
        // Set default values
        document.getElementById('min-bits').value = 1;
        document.getElementById('max-bits').value = 10000;
        document.getElementById('auto-resolve').value = 'manual';
    }
    
    applySettings(settings) {
        document.getElementById('min-bits').value = settings.minBits || 1;
        document.getElementById('max-bits').value = settings.maxBits || 10000;
        document.getElementById('auto-resolve').value = settings.autoResolve || 'manual';
    }
    
    async savePrediction(prediction) {
        try {
            if (this.twitch && this.twitch.configuration) {
                const currentConfig = this.twitch.configuration.broadcaster || {};
                const settings = currentConfig.settings || '{}';
                
                this.twitch.configuration.set('broadcaster', '', JSON.stringify({
                    settings: settings,
                    currentPrediction: JSON.stringify(prediction)
                }));
            }
            
            // TODO: Save to backend database
            console.log('Prediction saved:', prediction);
            
        } catch (error) {
            console.error('Error saving prediction:', error);
            throw error;
        }
    }
    
    async broadcastPrediction(prediction) {
        try {
            if (this.twitch && this.twitch.send) {
                this.twitch.send('broadcast', 'application/json', JSON.stringify({
                    type: 'new_prediction',
                    data: prediction
                }));
            }
            
            console.log('Prediction broadcasted:', prediction);
            
        } catch (error) {
            console.error('Error broadcasting prediction:', error);
            throw error;
        }
    }
    
    async broadcastPredictionEnd(prediction) {
        try {
            if (this.twitch && this.twitch.send) {
                this.twitch.send('broadcast', 'application/json', JSON.stringify({
                    type: 'prediction_ended',
                    data: prediction
                }));
            }
            
            console.log('Prediction end broadcasted:', prediction);
            
        } catch (error) {
            console.error('Error broadcasting prediction end:', error);
            throw error;
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#00f593' : type === 'error' ? '#ff6b6b' : '#9146ff',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease-out'
        });
        
        document.body.appendChild(notification);
        
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

// Global functions for template actions
function useTemplate(templateId) {
    const config = window.finalBetConfig;
    const template = config.defaultTemplates.find(t => t.id === templateId);
    
    if (template) {
        document.getElementById('prediction-question').value = template.question;
        document.getElementById('prediction-type').value = template.type;
        updatePredictionOptions();
        
        // Scroll to form
        document.getElementById('prediction-form').scrollIntoView({ behavior: 'smooth' });
        config.showNotification('Template loaded!', 'success');
    }
}

function editTemplate(templateId) {
    alert('Template editing will be available in a future update!');
}

function addNewTemplate() {
    alert('Custom templates will be available in a future update!');
}

function createPrediction() {
    const form = document.getElementById('prediction-form');
    form.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('prediction-question').focus();
}

function endCurrentPrediction() {
    if (window.finalBetConfig) {
        window.finalBetConfig.endCurrentPrediction();
    }
}

function viewResults() {
    alert('Results viewer will be available in a future update!');
}

function saveAsTemplate() {
    const question = document.getElementById('prediction-question').value.trim();
    if (!question) {
        alert('Please enter a prediction question first!');
        return;
    }
    
    alert('Save as template functionality will be available in a future update!');
}

function saveSettings() {
    if (window.finalBetConfig) {
        window.finalBetConfig.saveSettings();
    }
}

function resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
        document.getElementById('min-bits').value = 1;
        document.getElementById('max-bits').value = 10000;
        document.getElementById('auto-resolve').value = 'manual';
        saveSettings();
    }
}

function addOption() {
    const container = document.getElementById('choice-options');
    const optionDiv = document.createElement('div');
    optionDiv.className = 'button-group';
    optionDiv.style.marginBottom = '8px';
    
    optionDiv.innerHTML = `
        <input type="text" class="form-input" placeholder="New Option" style="width: 200px;">
        <button type="button" class="btn btn-secondary btn-small" onclick="removeOption(this)">Remove</button>
    `;
    
    container.appendChild(optionDiv);
}

function removeOption(button) {
    const container = document.getElementById('choice-options');
    if (container.children.length > 2) {
        button.parentElement.remove();
    } else {
        alert('You must have at least 2 options!');
    }
}

// Add the same notification animations
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
`;
document.head.appendChild(style);

// Initialize the configuration when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.finalBetConfig = new FinalBetConfig();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBetConfig;
}
