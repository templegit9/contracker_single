# Platform Engagement Tracker

A React application to track and monitor content engagement across various platforms like YouTube, ServiceNow, and LinkedIn.

## Features

- User authentication with secure password hashing
- Dark mode support
- Responsive design
- Content management across multiple platforms
- Engagement metrics tracking and visualization
- Data import/export functionality
- API integrations for content platforms
- Comprehensive testing

## Project Structure

This project follows modern React best practices with a component-based architecture:

```
src/
  ├── api/            # API integration modules
  ├── components/     # Reusable UI components
  ├── contexts/       # React context providers
  ├── pages/          # Page components
  ├── styles/         # CSS and styling
  ├── tests/          # Test files
  ├── utils/          # Utility functions
  ├── App.js          # Main App component
  └── index.js        # Application entry point
```

## Technologies Used

- **React** - Frontend library
- **React Router** - Navigation and routing
- **Chart.js** - Data visualization
- **Localforage** - Client-side data storage
- **Crypto-js** - Password hashing
- **Tailwind CSS** - Styling
- **Jest & Testing Library** - Testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/platform-engagement-tracker.git
   cd platform-engagement-tracker
   ```

2. Install dependencies
   ```
   npm install --legacy-peer-deps
   ```

   If you encounter dependency resolution errors, run the reset script:
   ```
   node reset-dependencies.js
   ```

3. Start the development server
   ```
   npm start
   ```

4. The application will be available at http://localhost:3000

## Troubleshooting

### Dependency Resolution Errors

If you encounter `npm ERR! ERESOLVE unable to resolve dependency tree` errors, try the following:

1. Use the reset script:
   ```
   node reset-dependencies.js
   ```

2. Or manually perform these steps:
   ```
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. For specific React-related errors, you may need to:
   ```
   npm install --save --legacy-peer-deps react-dom@^18.2.0 react@^18.2.0
   ```

## Testing

Run the test suite with:

```
npm test
```

### Testing Strategy

- Unit tests for individual components
- Context API tests
- Integration tests for key user flows
- API mocking for external services

## API Configuration

To use platform integrations, configure the APIs in the Settings section:

- **YouTube**: Requires a Google API key with YouTube Data API v3 enabled
- **ServiceNow**: Requires instance URL, username, and password
- **LinkedIn**: Requires client ID and client secret

## Demo Account

For testing purposes, you can use the following demo account:
- Email: demo@example.com
- Password: password

## License

This project is licensed under the MIT License - see the LICENSE file for details.