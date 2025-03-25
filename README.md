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

## Demo Account

You can use the following credentials to log in to the application:
- **Email:** demo@example.com
- **Password:** password

## API Configuration

This application can integrate with the following external APIs:
- YouTube Data API
- ServiceNow API
- LinkedIn API

You can configure your API keys in the Settings page after logging in. Note that the application will work with mock data even without API keys.

## Deployment

### Deploying to Netlify

You can deploy this application to Netlify with a few simple steps:

#### Option 1: Using the Netlify CLI

1. Install the Netlify CLI if you haven't already:
   ```
   npm install netlify-cli -g
   ```

2. Build the application:
   ```
   npm run build
   ```

3. Deploy to Netlify (this will create a draft URL):
   ```
   npm run deploy
   ```

4. To deploy to production:
   ```
   npm run deploy:prod
   ```

#### Option 2: Using the Netlify UI

1. Create a new site from Git on the Netlify dashboard.

2. Connect to your GitHub/GitLab/Bitbucket repository.

3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

4. Deploy the site.

The application already includes the necessary configuration files for Netlify:
- `netlify.toml` - Configures build settings and redirects
- `public/_redirects` - Ensures proper routing for the SPA

## Troubleshooting

### Dependency Resolution Errors

If you encounter `npm ERR! ERESOLVE unable to resolve dependency tree` errors, try the following:

1. Use the `--legacy-peer-deps` flag when installing:
   ```
   npm install --legacy-peer-deps
   ```

2. Run the reset script:
   ```
   node reset-dependencies.js
   ```

3. Check that your `.npmrc` file contains:
   ```
   legacy-peer-deps=true
   engine-strict=false
   ```

### Build Errors

If you encounter build errors, try clearing your cache and node_modules:

```
npm run clean
npm run install:legacy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.