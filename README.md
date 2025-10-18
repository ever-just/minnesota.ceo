# MINNESOTA.CEO

A modern platform celebrating Minnesota's business leaders and innovators.

## Overview

Minnesota.CEO is a Next.js 14 application that showcases Minnesota's top executives, entrepreneurs, and leaders across various industries. The platform features a waitlist system, leader nominations, and an upcoming mobile app preview.

## Features

- 🏆 **Leader Showcase** - Highlighting Minnesota's top CEOs and executives
- 📱 **Mobile App Preview** - Preview the upcoming mobile platform
- 📝 **Waitlist System** - Join the exclusive early access list
- 🎯 **Nomination System** - Nominate outstanding Minnesota leaders
- 🎨 **Modern UI/UX** - Beautiful purple gradient theme with smooth animations
- 📊 **Analytics Dashboard** - Track platform engagement (admin only)
- 🔔 **Push Notifications** - Stay updated with platform news
- 🍪 **Cookie Consent** - GDPR-compliant cookie management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom purple gradient theme
- **Animations**: Framer Motion
- **3D Graphics**: Three.js with React Three Fiber
- **Database**: PostgreSQL (optional, uses mock data if not configured)
- **Icons**: Lucide React & React Icons
- **Deployment**: DigitalOcean App Platform

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/minnesota-ceo.git
cd minnesota-ceo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Initialize database (optional):
```bash
npm run init-db
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
minnesota-ceo/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── preview/           # Mobile app preview
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── 3d/               # Three.js components
│   ├── animations/       # Animation components
│   ├── icons/            # Custom icons
│   ├── ui/               # UI components
│   └── visuals/          # Visual elements
├── lib/                   # Utility libraries
├── public/                # Static assets
├── scripts/               # Utility scripts
├── docs/                  # Documentation
└── __tests__/            # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) - How to deploy to production
- [DNS Setup](docs/DNS_SETUP.md) - Configure custom domain
- [Implementation Details](docs/IMPLEMENTATION.md) - Feature implementation status

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@minnesota.ceo or open an issue in this repository.

---

<!-- Verification test: This is a dummy change to verify PR creation workflow -->
