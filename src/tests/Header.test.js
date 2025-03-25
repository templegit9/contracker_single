import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { AuthProvider } from '../contexts/AuthContext';
import { UIProvider } from '../contexts/UIContext';
import '@testing-library/jest-dom';

// Mock localforage
jest.mock('localforage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Header Component', () => {
  // Mock functions for props
  const mockToggleSidebar = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup localforage mock implementations
    const mockUsers = JSON.stringify([
      {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ]);
    
    require('localforage').getItem.mockImplementation((key) => {
      if (key === 'users') {
        return Promise.resolve(mockUsers);
      } else if (key === 'rememberedUser') {
        return Promise.resolve('123'); // Set the remembered user to be logged in
      }
      return Promise.resolve(null);
    });
  });

  test('renders without crashing', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <UIProvider>
              <Header onToggleSidebar={mockToggleSidebar} onLogout={mockLogout} />
            </UIProvider>
          </AuthProvider>
        </BrowserRouter>
      );
    });
    
    // Check if logo/title is present
    expect(screen.getByText('Platform Engagement Tracker')).toBeInTheDocument();
  });

  test('displays user name when logged in', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <UIProvider>
              <Header onToggleSidebar={mockToggleSidebar} onLogout={mockLogout} />
            </UIProvider>
          </AuthProvider>
        </BrowserRouter>
      );
    });
    
    // Wait for auth to initialize and show user name
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('calls toggleSidebar when menu button is clicked', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <UIProvider>
              <Header onToggleSidebar={mockToggleSidebar} onLogout={mockLogout} />
            </UIProvider>
          </AuthProvider>
        </BrowserRouter>
      );
    });
    
    // Find the menu button (might be hidden on desktop, but present in the DOM)
    const menuButton = screen.getByText('menu').closest('button');
    
    await act(async () => {
      await user.click(menuButton);
    });
    
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  test('opens user dropdown when clicked', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <UIProvider>
              <Header onToggleSidebar={mockToggleSidebar} onLogout={mockLogout} />
            </UIProvider>
          </AuthProvider>
        </BrowserRouter>
      );
    });
    
    // Initially dropdown is closed
    expect(screen.queryByText('Your Profile')).not.toBeInTheDocument();
    
    // Click the user dropdown button
    const userMenuButton = screen.getByText('Test User').closest('button');
    
    await act(async () => {
      await user.click(userMenuButton);
    });
    
    // Dropdown should be open now
    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  test('calls logout function when sign out is clicked', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <UIProvider>
              <Header onToggleSidebar={mockToggleSidebar} onLogout={mockLogout} />
            </UIProvider>
          </AuthProvider>
        </BrowserRouter>
      );
    });
    
    // Click the user dropdown button to open it
    const userMenuButton = screen.getByText('Test User').closest('button');
    
    await act(async () => {
      await user.click(userMenuButton);
    });
    
    // Click the sign out button
    const signOutButton = screen.getByText('Sign out');
    
    await act(async () => {
      await user.click(signOutButton);
    });
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('toggles dark mode when dark mode button is clicked', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <UIProvider>
              <Header onToggleSidebar={mockToggleSidebar} onLogout={mockLogout} />
            </UIProvider>
          </AuthProvider>
        </BrowserRouter>
      );
    });
    
    // Find the dark mode toggle button (icon might vary depending on current mode)
    const darkModeButton = document.querySelector('button[class*="p-1 rounded-full"]');
    
    await act(async () => {
      await user.click(darkModeButton);
    });
    
    // Check that localStorage was updated (the UIContext handles the theme toggling)
    expect(localStorage.setItem).toHaveBeenCalled();
  });
}); 