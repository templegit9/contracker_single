import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import '@testing-library/jest-dom';

// Mock localforage
jest.mock('localforage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}));

// Test component that uses the auth context
function TestComponent() {
  const { currentUser, login, register, logout, isInitialized } = useAuth();
  
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div data-testid="status">{currentUser ? 'Logged In' : 'Logged Out'}</div>
      <div data-testid="user-name">{currentUser?.name || 'No User'}</div>
      <button 
        data-testid="login-button" 
        onClick={() => login('test@example.com', 'password123', false)}
      >
        Login
      </button>
      <button 
        data-testid="register-button" 
        onClick={() => register('Test User', 'new@example.com', 'password456')}
      >
        Register
      </button>
      <button 
        data-testid="logout-button" 
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup localforage mock implementations
    const mockUsers = JSON.stringify([
      {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', // 'password123' hashed
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ]);
    
    require('localforage').getItem.mockImplementation((key) => {
      if (key === 'users') {
        return Promise.resolve(mockUsers);
      }
      return Promise.resolve(null);
    });
    
    require('localforage').setItem.mockImplementation(() => Promise.resolve());
    require('localforage').removeItem.mockImplementation(() => Promise.resolve());
  });

  test('initializes with no current user', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    expect(screen.getByTestId('status')).toHaveTextContent('Logged Out');
    expect(screen.getByTestId('user-name')).toHaveTextContent('No User');
  });

  test('logs in a user successfully', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    await act(async () => {
      await user.click(screen.getByTestId('login-button'));
    });
    
    expect(screen.getByTestId('status')).toHaveTextContent('Logged In');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
  });

  test('logs out a user successfully', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    // First log in
    await act(async () => {
      await user.click(screen.getByTestId('login-button'));
    });
    
    expect(screen.getByTestId('status')).toHaveTextContent('Logged In');
    
    // Then log out
    await act(async () => {
      await user.click(screen.getByTestId('logout-button'));
    });
    
    expect(screen.getByTestId('status')).toHaveTextContent('Logged Out');
    expect(screen.getByTestId('user-name')).toHaveTextContent('No User');
    expect(require('localforage').removeItem).toHaveBeenCalledWith('rememberedUser');
  });

  test('registers a new user', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    await act(async () => {
      await user.click(screen.getByTestId('register-button'));
    });
    
    expect(screen.getByTestId('status')).toHaveTextContent('Logged In');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(require('localforage').setItem).toHaveBeenCalledWith(
      'users',
      expect.any(String)
    );
  });
}); 