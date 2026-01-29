# Expense Tracker - Full-Featured Application

A professional, corporate-style expense tracking application built with React, featuring full CRUD operations and localStorage persistence.

## 🎯 Features

### Core Functionality
- ✅ **Add Transactions** - Add income or expense transactions with detailed information
- ✅ **Delete Transactions** - Remove transactions with confirmation
- ✅ **Month Filtering** - View transactions filtered by month (last 12 months)
- ✅ **Local Storage** - All data persists in browser localStorage
- ✅ **Real-time Calculations** - Automatic balance, income, and expense calculations
- ✅ **Empty State** - User-friendly message when no transactions exist

### Transaction Details
Each transaction includes:
- **Title** - Transaction description (max 50 characters)
- **Amount** - Transaction value in INR
- **Type** - Income or Expense
- **Category** - Predefined categories with icons
- **Date** - Transaction date (cannot be in future)
- **Notes** - Optional additional information (max 200 characters)

### Categories

**Expense Categories (8):**
- Food & Dining
- Transportation
- Shopping
- Bills & Utilities
- Entertainment
- Healthcare
- Education
- Other

**Income Categories (6):**
- Salary
- Freelance
- Investment
- Business
- Gift
- Other

## 🎨 Design Features

### Professional Corporate UI
- Clean, minimalist design with neutral color palette
- Professional icon set from Material Design (react-icons)
- Subtle shadows and borders
- Smooth transitions and hover effects
- Fully responsive design

### Color Scheme
- **Primary Background**: #f8fafc (Light Gray)
- **Card Background**: #ffffff (White)
- **Primary Text**: #0f172a (Dark Slate)
- **Secondary Text**: #64748b (Slate)
- **Income**: #16a34a (Green)
- **Expense**: #dc2626 (Red)
- **Accent**: #0f172a (Dark Slate)

### Components

1. **Header**
   - Application title
   - Month selector dropdown (last 12 months)

2. **BalanceCard**
   - Total balance display (with negative state)
   - Income summary with icon
   - Expense summary with icon
   - Add transaction button
   - Currency formatting (₹)

3. **TransactionsList**
   - Transaction count badge
   - Empty state with helpful message
   - Scrollable list of transactions
   - Category icons
   - Date display
   - Delete button with hover effect

4. **AddTransactionModal**
   - Income/Expense toggle
   - Form validation
   - Category selection grid
   - Character counters
   - Date picker
   - Smooth animations

## 🔧 Technical Implementation

### State Management
- React hooks for local component state
- Centralized state in App.jsx
- Automatic localStorage sync

### Data Persistence
- Saves to localStorage on every change
- Loads from localStorage on app mount
- Error handling for corrupted data

### Data Flow
```
App.jsx (Central State)
  ├── transactions (array)
  ├── selectedMonth (string)
  ├── Filters transactions by month
  ├── Calculates totals
  └── Passes data to child components
```

### Transaction Schema
```javascript
{
  id: number,           // Unix timestamp
  type: string,         // 'income' | 'expense'
  title: string,        // Transaction description
  amount: number,       // Transaction value
  category: string,     // Category identifier
  date: string,         // YYYY-MM-DD format
  notes: string,        // Optional notes
  createdAt: string     // ISO timestamp
}
```

## 📱 Responsive Breakpoints

- **Desktop**: > 640px - Full layout
- **Mobile**: ≤ 640px - Stacked layout, adjusted spacing
- **Small Mobile**: ≤ 374px - Further optimized spacing

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📦 Dependencies

- **react**: ^19.2.0
- **react-dom**: ^19.2.0
- **dayjs**: ^1.11.x (Date handling)
- **react-icons**: ^5.x (Material Design icons)

## 💾 LocalStorage Structure

Data is stored under the key `"transactions"`:
```javascript
localStorage.setItem('transactions', JSON.stringify([
  {
    id: 1706543210000,
    type: 'income',
    title: 'Salary',
    amount: 50000,
    category: 'salary',
    date: '2026-01-29',
    notes: 'Monthly salary',
    createdAt: '2026-01-29T12:30:00.000Z'
  }
  // ... more transactions
]))
```

## 🎯 User Flow

1. **First Visit**: Empty state with "Add Transaction" prompt
2. **Add Transaction**: Click button → Modal opens → Fill form → Submit
3. **View Transactions**: List updates automatically with new transaction
4. **Filter by Month**: Select month from dropdown
5. **Delete Transaction**: Click delete icon → Confirm → Transaction removed
6. **Persistent Data**: All changes saved automatically to localStorage

## 🔐 Data Validation

- Title: Required, max 50 characters
- Amount: Required, numeric, minimum 0
- Category: Required, must select from predefined list
- Date: Cannot be in future
- Notes: Optional, max 200 characters

## ✨ Future Enhancements

Potential features for future versions:
- Export to CSV/PDF
- Data visualization (charts/graphs)
- Budget planning
- Recurring transactions
- Multi-currency support
- Dark mode
- Search and advanced filtering
- Categories customization
- Cloud sync
- Multiple accounts

## 📄 File Structure

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── Header.css
│   ├── BalanceCard/
│   │   ├── BalanceCard.jsx
│   │   └── BalanceCard.css
│   ├── TransactionItem/
│   │   ├── TransactionItem.jsx
│   │   └── TransactionItem.css
│   ├── TransactionsList/
│   │   ├── TransactionsList.jsx
│   │   └── TransactionsList.css
│   └── AddTransactionModal/
│       ├── AddTransactionModal.jsx
│       └── AddTransactionModal.css
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

**Built with React + Vite** | Professional, Corporate, and Production-Ready
