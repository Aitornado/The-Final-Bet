# The Final Bet

**Interactive Prediction Extension for Twitch**

Transform every gaming moment into engaging viewer experiences. The Final Bet allows streamers to create real-time predictions while viewers place bets using Twitch Bits, creating an interactive and monetized engagement platform.

## 🎯 What is The Final Bet?

The Final Bet is a Twitch Extension that enables streamers to:
- Create custom predictions during gameplay ("Will I win this match?")
- Allow viewers to bet Twitch Bits on prediction outcomes
- Automatically calculate and distribute fair payouts to winners
- Track engagement statistics and viewer leaderboards

### Key Features

✅ **Multi-Platform Support** - Mobile, Panel, Video Overlay, and Configuration views  
✅ **Twitch Bits Integration** - Secure monetization with 6 betting tiers (10-1000+ Bits)  
✅ **Real-Time Updates** - Live bet totals and vote percentages  
✅ **Fair Payouts** - Proportional distribution system ensures equitable rewards  
✅ **State Management** - Robust prediction lifecycle (Open → Locked → Resolved)  
✅ **Responsive Design** - Optimized for all screen sizes and Twitch themes  

## 🚀 Quick Start

### For Developers

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### For Streamers
1. Install the extension from the Twitch Extensions directory
2. Configure prediction settings in your Extension dashboard
3. Create predictions during gameplay ("Will I win this round?")
4. Engage viewers with real-time Bits betting
5. Resolve predictions and distribute payouts automatically

## 📚 Documentation

Complete technical documentation is available in the [`docs/`](docs/) directory:

- **[📋 Documentation Index](docs/README.md)** - Start here for navigation
- **[🏗️ Technical Overview](docs/TECHNICAL-OVERVIEW.md)** - System architecture and status
- **[⚙️ Developer Setup](docs/DEVELOPER-SETUP.md)** - Local development guide
- **[🎨 Frontend Architecture](docs/FRONTEND-ARCHITECTURE.md)** - Component structure
- **[🔌 API Specification](docs/API-SPECIFICATION.md)** - Backend requirements
- **[📺 Twitch Integration](docs/TWITCH-INTEGRATION.md)** - Platform integration
- **[🚀 Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment

## 🛠 Technology Stack

**Frontend** (✅ Complete)
- React 18 with TypeScript
- Next.js 15 with App Router  
- Tailwind CSS for styling
- Vanilla JavaScript for extension files

**Demo & Testing** (✅ Complete)
- Full local demo mode with mock data
- Twitch Extension integration ready
- Production Bits transactions supported
- Comprehensive testing interface

**Platform**
- Twitch Extension SDK
- Twitch Bits monetization
- Multi-view responsive design

## 📊 Current Status

| Component | Status | Description |
|-----------|--------|-------------|
| **Frontend UI** | ✅ Complete | React components and vanilla JS extension files |
| **State Management** | ✅ Complete | Prediction lifecycle and UI state handling |
| **Twitch Integration** | ✅ Ready | SDK integration and Bits configuration |
| **Demo Mode** | ✅ Complete | Full functionality available for local testing |
| **Deployment** | ✅ Ready | Production deployment to Vercel |

## 🎮 How It Works

### For Streamers
1. **Create Prediction** - "Will I win this boss fight?"
2. **Open Betting** - Viewers place Bits bets (Yes/No)  
3. **Lock Betting** - Start the game/challenge
4. **Resolve** - Mark outcome and distribute payouts

### For Viewers
1. **View Prediction** - See streamer's challenge
2. **Place Bet** - Choose outcome and Bits amount
3. **Watch Live** - See real-time vote totals  
4. **Receive Payout** - Get proportional winnings if correct

### Payout System
- **Proportional Distribution** - Winnings based on bet size relative to winning side
- **Fair Algorithm** - Larger bets get proportionally larger payouts
- **Remainder Handling** - Ensures 100% of pot is distributed
- **No House Edge** - All Bits go to winners

## 🔒 Security & Compliance

- **JWT Authentication** - Secure user identification
- **Server-Side Verification** - All transactions validated on backend
- **Rate Limiting** - Prevents spam and abuse
- **Privacy Compliant** - GDPR and CCPA friendly
- **Twitch Guidelines** - Full platform compliance

## 🤝 Contributing

We welcome contributions! Please see our [Developer Setup Guide](docs/DEVELOPER-SETUP.md) for:
- Local development environment
- Testing procedures  
- Code style guidelines
- Submission process

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Technical Issues**: Review [documentation](docs/) or open an issue
- **Feature Requests**: Submit via GitHub issues
- **Security Concerns**: Contact maintainers directly

---

**Built with ❤️ for the Twitch community**

*Ready to turn every gaming moment into an interactive prediction experience? Let's make streaming more engaging together!*