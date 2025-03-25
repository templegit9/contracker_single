import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UIProvider, useUI } from '../contexts/UIContext';
import '@testing-library/jest-dom';

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

// Test component that uses the UI context
function TestComponent() {
  const { 
    darkMode, 
    toggleDarkMode, 
    sidebarOpen, 
    toggleSidebar, 
    notification, 
    showNotification, 
    hideNotification 
  } = useUI();

  return (
    <div>
      <div data-testid="dark-mode-status">{darkMode ? 'Dark' : 'Light'}</div>
      <div data-testid="sidebar-status">{sidebarOpen ? 'Open' : 'Closed'}</div>
      <div data-testid="notification">{notification ? notification.message : 'No notification'}</div>
      
      <button 
        data-testid="toggle-dark-mode" 
        onClick={toggleDarkMode}
      >
        Toggle Dark Mode
      </button>
      
      <button 
        data-testid="toggle-sidebar" 
        onClick={toggleSidebar}
      >
        Toggle Sidebar
      </button>
      
      <button 
        data-testid="show-notification" 
        onClick={() => showNotification('Test notification', 'success', 100)}
      >
        Show Notification
      </button>
      
      <button 
        data-testid="hide-notification" 
        onClick={hideNotification}
      >
        Hide Notification
      </button>
    </div>
  );
}

describe('UIContext', () => {
  beforeEach(() => {
    // Reset localStorage mock
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('initializes with light mode by default', async () => {
    await act(async () => {
      render(
        <UIProvider>
          <TestComponent />
        </UIProvider>
      );
    });
    
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('Light');
  });

  test('toggles dark mode', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <UIProvider>
          <TestComponent />
        </UIProvider>
      );
    });
    
    // Initial state
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('Light');
    
    // Toggle to dark mode
    await act(async () => {
      await user.click(screen.getByTestId('toggle-dark-mode'));
    });
    
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('Dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    
    // Toggle back to light mode
    await act(async () => {
      await user.click(screen.getByTestId('toggle-dark-mode'));
    });
    
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('Light');
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
  });

  test('toggles sidebar', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <UIProvider>
          <TestComponent />
        </UIProvider>
      );
    });
    
    // Initial state
    expect(screen.getByTestId('sidebar-status')).toHaveTextContent('Closed');
    
    // Toggle sidebar open
    await act(async () => {
      await user.click(screen.getByTestId('toggle-sidebar'));
    });
    
    expect(screen.getByTestId('sidebar-status')).toHaveTextContent('Open');
    
    // Toggle sidebar closed
    await act(async () => {
      await user.click(screen.getByTestId('toggle-sidebar'));
    });
    
    expect(screen.getByTestId('sidebar-status')).toHaveTextContent('Closed');
  });

  test('shows and auto-hides notification', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <UIProvider>
          <TestComponent />
        </UIProvider>
      );
    });
    
    // Initial state
    expect(screen.getByTestId('notification')).toHaveTextContent('No notification');
    
    // Show notification
    await act(async () => {
      await user.click(screen.getByTestId('show-notification'));
    });
    
    expect(screen.getByTestId('notification')).toHaveTextContent('Test notification');
    
    // Wait for auto-hide (timeout set to 100ms in the test component)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });
    
    expect(screen.getByTestId('notification')).toHaveTextContent('No notification');
  });

  test('manually hides notification', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <UIProvider>
          <TestComponent />
        </UIProvider>
      );
    });
    
    // Show notification with very long timeout
    await act(async () => {
      await user.click(screen.getByTestId('show-notification'));
    });
    
    expect(screen.getByTestId('notification')).toHaveTextContent('Test notification');
    
    // Manually hide notification
    await act(async () => {
      await user.click(screen.getByTestId('hide-notification'));
    });
    
    expect(screen.getByTestId('notification')).toHaveTextContent('No notification');
  });
}); 