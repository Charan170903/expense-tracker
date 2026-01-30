# CHECK Frontend

React + Vite frontend application for CHECK expense tracker.

## Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **HTTP Client**: Axios 1.13.4
- **Icons**: React Icons 5.5.0
- **Date Library**: DayJS 1.11.19
- **Styling**: Vanilla CSS3

## Installation

```bash
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

## Scripts

```bash
npm run dev      # Development server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api  # Development
VITE_API_URL=https://your-api.com/api   # Production
```

## Project Structure

```
expense-tracker/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header/
│   │   ├── AuthModal/
│   │   ├── BalanceCard/
│   │   ├── TransactionsList/
│   │   ├── AddTransactionModal/
│   │   ├── InsightsCard/
│   │   └── MonthSelector/
│   ├── services/
│   │   └── api.js       # API service layer
│   ├── App.jsx          # Main component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── .env.example
├── vite.config.js
├── package.json
└── README.md
```

## Features

- ✅ User authentication (register/login)
- ✅ Transaction management (add/delete)
- ✅ Month-wise filtering (last 12 months)
- ✅ Real-time balance calculations
- ✅ Category-based organization (14 categories)
- ✅ Financial insights & analytics
- ✅ Responsive design (mobile-first)
- ✅ Professional UI/UX
- ✅ Form validation
- ✅ Empty states

## Design System

See [BRAND_PALETTE.md](../BRAND_PALETTE.md) for:
- Color palette (light theme)
- Typography (Inter font)
- Spacing & layout
- Component styles

## Components

All components are self-contained with their own CSS modules:
- `Header` - Navigation and authentication
- `BalanceCard` - Current balance display
- `TransactionsList` - Transaction history
- `AddTransactionModal` - Add new transactions
- `InsightsCard` - Financial insights
- `MonthSelector` - Month filtering

## Deployment

Deployed on Vercel: https://expense-tracker-indol-eight-74.vercel.app

See main [DEPLOYMENT.md](../DEPLOYMENT.md) for details.

## License

MIT
