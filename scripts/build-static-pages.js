const fs = require('fs')
const path = require('path')

// Simple script to create standalone HTML files for Twitch Extension
const createStaticHTML = (title, bodyContent, additionalStyles = '', additionalScripts = '') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'bet-red': {
                            500: '#dc2626',
                            600: '#ef4444',
                        },
                    }
                }
            }
        }
    </script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: #030712;
            color: #ffffff;
            line-height: 1.5;
        }
        ${additionalStyles}
    </style>
</head>
<body class="min-h-screen bg-gray-950 text-white">
    ${bodyContent}
    ${additionalScripts}
</body>
</html>`
}

// Config page content
const configHTML = createStaticHTML(
    'The Final Bet - Config',
    `
    <div class="min-h-screen text-white">
        <div class="max-w-5xl mx-auto p-6">
            <!-- Header -->
            <div class="flex items-center justify-center mb-8">
                <div class="w-14 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                    <div class="w-4 h-4 bg-white rounded"></div>
                </div>
                <h1 class="text-2xl font-bold text-white">The Final Bet Configuration</h1>
            </div>

            <!-- Demo Message -->
            <div class="bg-blue-900/20 border border-blue-600 rounded-lg p-4 mb-6">
                <div class="flex items-center">
                    <div class="text-blue-400 mr-3">🎮</div>
                    <div>
                        <h3 class="text-blue-300 font-medium">Demo Configuration</h3>
                        <p class="text-blue-200 text-sm">This is a demo of the configuration interface. In the actual extension, you'll be able to create and manage predictions.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Left Column: Quick Actions -->
                <div class="space-y-6">
                    <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
                        <h2 class="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <button class="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 text-left transition-colors">
                                <div class="flex items-center mb-2">
                                    <div class="w-6 h-6 bg-red-600 rounded mr-3 flex items-center justify-center">
                                        <span class="text-white text-xs">+</span>
                                    </div>
                                    <span class="font-medium text-white">New Prediction</span>
                                </div>
                                <p class="text-gray-400 text-sm">Start a new betting round</p>
                            </button>
                            
                            <button class="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 text-left transition-colors">
                                <div class="flex items-center mb-2">
                                    <div class="w-6 h-6 bg-blue-600 rounded mr-3 flex items-center justify-center">
                                        <span class="text-white text-xs">📊</span>
                                    </div>
                                    <span class="font-medium text-white">Past Results</span>
                                </div>
                                <p class="text-gray-400 text-sm">View prediction history</p>
                            </button>
                        </div>
                    </div>

                    <!-- How It Works -->
                    <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
                        <h2 class="text-lg font-semibold text-white mb-4">How The Final Bet Works</h2>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <div class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">1</div>
                                <div>
                                    <h3 class="text-white font-medium">Start New Prediction</h3>
                                    <p class="text-gray-400 text-sm">Create prediction question - Status: BETTING</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">2</div>
                                <div>
                                    <h3 class="text-white font-medium">Close Betting</h3>
                                    <p class="text-gray-400 text-sm">Lock in bets when ready - Status: LOCKED</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">3</div>
                                <div>
                                    <h3 class="text-white font-medium">Resolve Prediction</h3>
                                    <p class="text-gray-400 text-sm">Click Yes or No to declare winner - Status: RESOLVED</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">4</div>
                                <div>
                                    <h3 class="text-white font-medium">Payouts Distributed</h3>
                                    <p class="text-gray-400 text-sm">Winners automatically receive their Bits</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Create Prediction -->
                <div>
                    <div class="bg-gray-900 rounded-lg p-6 border border-gray-800 h-full flex flex-col">
                        <h2 class="text-lg font-semibold text-white mb-4">Create New Prediction</h2>
                        
                        <!-- Quick Templates -->
                        <div class="mb-6">
                            <h3 class="text-white font-medium mb-3">Quick Templates</h3>
                            <div class="space-y-2">
                                <button class="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 text-left transition-colors">
                                    <span class="text-white">Will my team win this match?</span>
                                </button>
                                <button class="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 text-left transition-colors">
                                    <span class="text-white">Will I get a clutch play?</span>
                                </button>
                                <button class="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 text-left transition-colors">
                                    <span class="text-white">Will I get 10+ kills?</span>
                                </button>
                            </div>
                        </div>

                        <!-- Custom Prediction -->
                        <div class="flex-grow flex flex-col justify-between">
                            <div>
                                <h3 class="text-white font-medium mb-3">Custom Prediction</h3>
                                <input type="text" placeholder="e.g., Will my team win this match?" 
                                       class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none" />
                            </div>
                            <button class="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors mt-4">
                                Start Betting Window
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Extension Settings -->
            <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 class="text-lg font-semibold text-white mb-4">Extension Settings</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-white font-medium mb-2">Minimum Bits per Bet</label>
                        <input type="number" value="1" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-white font-medium mb-2">Maximum Bits per Bet</label>
                        <input type="number" value="10000" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
                    </div>
                </div>
                <div class="flex gap-4 mt-6">
                    <button class="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                        Save Settings
                    </button>
                    <button class="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                        Reset to Defaults
                    </button>
                </div>
            </div>
        </div>
    </div>`,
    '',
    `
    <script>
        // Basic Twitch Extension integration for config
        if (window.Twitch && window.Twitch.ext) {
            window.Twitch.ext.onAuthorized(function(auth) {
                console.log('Config authorized:', auth);
            });
            
            window.Twitch.ext.onContext(function(context) {
                console.log('Config context:', context);
            });
        }
        
        // Send ready message to parent if in iframe
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'EXTENSION_CONFIG_READY'
            }, '*');
        }
    </script>`
)

// Viewer page content
const viewerHTML = createStaticHTML(
    'The Final Bet - Viewer',
    `
    <div class="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div class="max-w-md w-full">
            <!-- Header -->
            <div class="text-center mb-6">
                <div class="flex items-center justify-center mb-3">
                    <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                        <div class="w-4 h-4 bg-white rounded"></div>
                    </div>
                    <h1 class="text-xl font-bold text-white">The Final Bet</h1>
                </div>
                <p class="text-gray-400 text-sm">Interactive Gaming Predictions</p>
            </div>

            <!-- Demo Prediction Card -->
            <div class="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <!-- Header -->
                <div class="bg-gray-800 px-4 py-3 border-b border-gray-700">
                    <div class="flex items-center justify-between">
                        <h3 class="text-white font-medium">Will my team win this match?</h3>
                        <span class="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full font-medium">
                            ACTIVE
                        </span>
                    </div>
                </div>

                <!-- Betting Options -->
                <div class="p-4">
                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <button class="bg-green-700 hover:bg-green-600 text-white p-3 rounded-lg transition-colors flex flex-col items-center">
                            <span class="font-medium">YES</span>
                            <span class="text-xs opacity-80">2.1x payout</span>
                        </button>
                        <button class="bg-red-700 hover:bg-red-600 text-white p-3 rounded-lg transition-colors flex flex-col items-center">
                            <span class="font-medium">NO</span>
                            <span class="text-xs opacity-80">1.8x payout</span>
                        </button>
                    </div>

                    <!-- Bits Selection -->
                    <div class="mb-4">
                        <label class="block text-gray-300 text-sm mb-2">Select Bits Amount:</label>
                        <div class="grid grid-cols-3 gap-2">
                            <button class="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-2 rounded transition-colors">
                                10
                            </button>
                            <button class="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-2 rounded transition-colors">
                                50
                            </button>
                            <button class="bg-purple-700 hover:bg-purple-600 border border-purple-600 text-white py-2 rounded transition-colors">
                                100
                            </button>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="bg-gray-800 rounded-lg p-3">
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-gray-400">Total Pool:</span>
                            <span class="text-white font-medium">2,450 Bits</span>
                        </div>
                        <div class="flex justify-between text-sm mb-3">
                            <span class="text-gray-400">Total Bets:</span>
                            <span class="text-white font-medium">47 predictions</span>
                        </div>
                        
                        <!-- Progress bars -->
                        <div class="space-y-2">
                            <div class="flex justify-between text-xs">
                                <span class="text-green-400">YES: 60%</span>
                                <span class="text-red-400">NO: 40%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-2">
                                <div class="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full" style="background: linear-gradient(to right, #10b981 0%, #10b981 60%, #ef4444 60%, #ef4444 100%);"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Demo notification -->
                    <div class="mt-4 bg-blue-900/20 border border-blue-600 rounded-lg p-3">
                        <div class="flex items-center">
                            <div class="text-blue-400 mr-2 text-sm">🎮</div>
                            <p class="text-blue-200 text-xs">
                                This is a demo. In the live extension, you'll place real Bits bets!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Game Progress -->
            <div class="mt-4 bg-gray-900 rounded-lg border border-gray-800 p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-white font-medium">Current Game</h4>
                    <span class="text-yellow-400 text-sm">In Progress</span>
                </div>
                <div class="flex items-center text-sm text-gray-400">
                    <span class="mr-2">🎯</span>
                    <span>The Finals - Tournament Match</span>
                </div>
            </div>
        </div>
    </div>`,
    '',
    `
    <script>
        // Basic Twitch Extension integration for viewer
        if (window.Twitch && window.Twitch.ext) {
            window.Twitch.ext.onAuthorized(function(auth) {
                console.log('Viewer authorized:', auth);
            });
            
            window.Twitch.ext.onContext(function(context) {
                console.log('Viewer context:', context);
            });
            
            // Handle Bits transactions
            if (window.Twitch.ext.bits) {
                window.Twitch.ext.bits.onTransactionComplete(function(transaction) {
                    console.log('Bits transaction completed:', transaction);
                    // Handle successful transaction
                });
                
                window.Twitch.ext.bits.onTransactionCancelled(function(transaction) {
                    console.log('Bits transaction cancelled:', transaction);
                });
            }
        }
        
        // Send ready message to parent if in iframe  
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'EXTENSION_VIEWER_READY'
            }, '*');
        }
        
        // Demo interaction handlers
        document.addEventListener('DOMContentLoaded', function() {
            // Handle bet option clicks
            document.querySelectorAll('button').forEach(button => {
                if (button.textContent.includes('YES') || button.textContent.includes('NO')) {
                    button.addEventListener('click', function() {
                        const option = this.textContent.includes('YES') ? 'yes' : 'no';
                        console.log('Demo bet placed:', option);
                        
                        // Show demo notification
                        const notification = document.createElement('div');
                        notification.className = 'fixed top-4 right-4 bg-green-900 border border-green-600 text-green-300 px-4 py-2 rounded-lg z-50';
                        notification.textContent = 'Demo bet placed for ' + option.toUpperCase() + '!';
                        document.body.appendChild(notification);
                        
                        setTimeout(() => {
                            notification.remove();
                        }, 3000);
                    });
                }
            });
        });
    </script>`
)

// Write the files
fs.writeFileSync(path.join(__dirname, '../public/config.html'), configHTML)
fs.writeFileSync(path.join(__dirname, '../public/viewer.html'), viewerHTML)

console.log('✅ Static HTML files generated successfully!')
console.log('📁 Config: public/config.html')
console.log('📁 Viewer: public/viewer.html')