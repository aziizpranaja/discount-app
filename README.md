# Discount Management Application

A Vue.js 3 application for managing discount data with CRUD operations, built with Vite.

## Features

- **Create Discounts**: Add new percentage or fixed amount discounts
- **Read Discounts**: View all discounts in a sortable, searchable table
- **Update Discounts**: Edit existing discount details
- **Delete Discounts**: Remove individual or multiple discounts
- **Real-time Notifications**: Toast notifications for all operations
- **Responsive Design**: Mobile-friendly interface
- **Search & Filter**: Real-time search and sorting capabilities
- **API Integration**: External API integration with configurable endpoints

## Technology Stack

### Frontend
- **Vue 3**: Progressive JavaScript framework with Composition API
- **Vite**: Fast build tool and development server
- **JavaScript ES6+**: Modern JavaScript features
- **CSS3**: Scoped CSS with modern styling

### Architecture
- **Composition API**: Using `setup()` script with `ref`, `computed`, `watch`
- **Component-based**: Modular, reusable Vue components
- **Custom Composables**: Business logic separation with `useNotification`, `useDiscountManagement`, `useDiscountValidation`

## Project Structure

```
discount-app-ref/
├── public/                 # Static assets
│   └── empty-discount.png
├── src/
│   ├── assets/           # Application assets
│   │   └── vue.svg
│   ├── components/        # Vue components
│   │   ├── AppFooter.vue
│   │   ├── BaseNotification.vue
│   │   ├── DeleteConfirmModal.vue
│   │   ├── DiscountModal.vue
│   │   ├── DiscountTable.vue
│   │   └── EmptyState.vue
│   ├── composables/      # Reusable composition functions
│   │   ├── useDiscountManagement.js
│   │   ├── useDiscountValidation.js
│   │   └── useNotification.js
│   ├── views/           # Page components
│   │   └── DiscountList.vue
│   ├── App.vue           # Root component
│   ├── main.js           # Application entry point
│   └── style.css         # Global styles
├── .gitignore           # Git ignore rules
├── index.html           # HTML template
├── package.json          # Dependencies and scripts
├── README.md             # This file
└── vite.config.js         # Build configuration
```

## Components

### Core Components

#### DiscountList (Main View)
- **Purpose**: Main application container
- **Features**: State management, API integration, CRUD operations
- **Props**: Uses composables for data, notifications, and validation
- **Events**: Handles all discount operations

#### DiscountTable
- **Purpose**: Display discount data in tabular format
- **Features**: Search, sorting, bulk operations, checkbox selection
- **Props**: `discounts`, `isLoading`, `searchQuery`, `selectedIds`, etc.

#### DiscountModal
- **Purpose**: Create/edit discount form
- **Features**: Dual input types (percentage/fixed amount), validation
- **Events**: Emits form data for create/update operations

#### BaseNotification
- **Purpose**: Toast notification system
- **Features**: Auto-hide, click to close, dual types (success/error)
- **Styling**: Fixed positioning with animations

#### EmptyState
- **Purpose**: Empty state when no data exists
- **Features**: API configuration, outlet management
- **Interaction**: Triggers add discount action

## Composables (Business Logic)

### useDiscountManagement
- **Purpose**: CRUD operations and data fetching
- **Methods**: `fetchDiscounts`, `createDiscount`, `updateDiscount`, `deleteDiscount`
- **Features**: Loading states, error handling, API integration

### useNotification
- **Purpose**: Toast notification management
- **Methods**: `showNotification`, `hideNotification`
- **Features**: Auto-dismiss, message types, reactive state

### useDiscountValidation
- **Purpose**: Form validation logic
- **Methods**: `validateDiscountForm`, `isDiscountNameUnique`
- **Features**: Real-time validation, error messages

## API Integration

### Configuration
```javascript
const DEFAULT_API_URL = 'https://crudcrud.com/api/{api-key}/unicorns'
```

### Data Structure
```javascript
{
  "_id": "unique_id",
  "discount_name": "Discount Name",
  "discount": "10%" // or "Rp 5000"
}
```

### Operations
- **GET**: Fetch all discounts
- **POST**: Create new discount
- **PUT**: Update existing discount
- **DELETE**: Remove discount(s)

## Features Implementation

### Search & Filtering
- Real-time search across discount names
- Case-insensitive matching
- Automatic deselection on search change

### Sorting
- Sortable columns (Name, Discount Value)
- Bidirectional sort (ascending/descending)
- Visual indicators for sort direction

### Bulk Operations
- Multi-select with checkboxes
- Select all functionality
- Bulk delete with confirmation

### Input Handling
- Dual input modes: Percentage (%) and Fixed Amount (Rp)
- Real-time formatting for currency display
- Input validation and sanitization

### Responsive Design
- Mobile-optimized layout
- Touch-friendly interactions
- Adaptive table display

## Development

### Getting Started
```bash
npm install
npm run dev
```

### Build Process
```bash
npm run build
npm run preview
```

### Environment
- **Development**: `npm run dev` - Hot reload development server
- **Production**: `npm run build` - Optimized build output

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile: Responsive design support

## Performance Features
- Component lazy loading
- Efficient reactivity system
- Optimized API calls
- Minimal re-renders

## Security Considerations
- Input sanitization
- XSS prevention
- CORS handling for API calls
- Validation before operations

## Future Enhancements
- Pagination for large datasets
- Export functionality
- Advanced filtering options
- Real-time updates with WebSockets
