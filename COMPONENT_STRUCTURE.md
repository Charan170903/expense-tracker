# Expense Tracker - Component Structure

## 📁 Project Organization

This project follows a **component-based architecture** with clear separation of concerns. Each component has its own folder containing both the JSX and CSS files.

### Directory Structure

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
│   └── TransactionsList/
│       ├── TransactionsList.jsx
│       └── TransactionsList.css
├── App.jsx         (Main application component)
├── App.css         (App layout styles)
├── index.css       (Global styles & CSS variables)
└── main.jsx        (Application entry point)
```

## 🎨 Component Overview

### 1. **Header**
- Displays the app title and date selector
- Responsive layout that stacks on mobile devices
- Contains month selection dropdown

### 2. **BalanceCard**
- Shows total balance with gradient text effect
- Displays income and expense statistics with hover effects
- Contains "Add Transaction" button
- Features modern card design with subtle shadows

### 3. **TransactionItem**
- Individual transaction display component
- Props: `name`, `amount`, `type` (income/expense)
- Visual indicators for transaction type
- Hover effects reveal delete button
- Color-coded amounts (green for income, red for expense)

### 4. **TransactionsList**
- Container for all transactions
- Displays transaction count badge
- Maps through transactions array
- Clean list layout with separators

## 🎯 Design Features

### Visual Enhancements
- **Gradients**: Subtle background gradients on cards
- **Hover Effects**: Interactive elements respond to user interaction
- **Color Indicators**: Visual dots and colors for income/expense
- **Shadows**: Layered shadows for depth
- **Border Accents**: Left border indicators on stat items
- **Smooth Transitions**: All interactive elements have smooth animations

### Responsive Design
- Mobile-first approach
- Breakpoints at: 640px, 768px, 1024px
- Grid layout adapts to screen size
- Touch-friendly button sizes on mobile

### Accessibility
- Semantic HTML elements
- ARIA labels for screen readers
- Focus states for keyboard navigation
- Reduced motion support
- High contrast mode support

## 🔧 CSS Organization

### Global Styles (index.css)
- CSS Custom Properties (variables)
- Reset and base styles
- Typography defaults
- Utility classes

### Component Styles
Each component has its own CSS file using **BEM naming convention**:
- `.component-name` (Block)
- `.component-name__element` (Element)
- `.component-name__element--modifier` (Modifier)

### Benefits of This Organization
1. **Modularity**: Easy to find and update component-specific styles
2. **Maintainability**: Clear separation makes debugging easier
3. **Reusability**: Components can be easily reused or moved
4. **Scalability**: Simple to add new components following the same pattern
5. **Team Collaboration**: Clear structure for multiple developers

## 🚀 Future Enhancements

- Add state management for transactions
- Implement add/delete functionality
- Add filter and search features
- Include data visualization (charts)
- Add dark mode support
- Implement data persistence (localStorage/API)

## 📝 Naming Conventions

- **Files**: PascalCase for components (e.g., `Header.jsx`)
- **CSS Classes**: BEM with kebab-case (e.g., `header__title`)
- **Variables**: camelCase in JavaScript, kebab-case in CSS

---

**Built with React + Vite** | Modern, Clean, and Maintainable
