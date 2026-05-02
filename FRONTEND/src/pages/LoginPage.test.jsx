import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from './LoginPage';
import userReducer from '../store/UserSlice';

vi.mock('../store/UserSlice', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    loginUser: vi.fn().mockImplementation((data) => ({
      type: 'user/loginUser/fulfilled',
      payload: data,
    })),
  };
});

describe('LoginPage', () => {
  const renderWithProviders = (ui, { preloadedState = {} } = {}) => {
    const store = configureStore({
      reducer: {
        user: userReducer,
      },
      preloadedState,
    });
    return render(
      <Provider store={store}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders the login form correctly', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your password/i)).toBeInTheDocument();
  });

  it('allows user to type in login form', () => {
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/Your email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByPlaceholderText(/Your password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });
});
