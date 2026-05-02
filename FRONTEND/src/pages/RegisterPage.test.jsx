import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RegisterPage from './RegisterPage';
import userReducer from '../store/UserSlice';

// Mock the UserSlice actions
vi.mock('../store/UserSlice', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    registerUser: vi.fn().mockImplementation((data) => ({
      type: 'user/registerUser/fulfilled',
      payload: data,
    })),
  };
});

describe('RegisterPage', () => {
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

  it('renders the registration form correctly', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole('heading', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
  });

  it('allows user to type in form fields', async () => {
    renderWithProviders(<RegisterPage />);
    
    const firstNameInput = screen.getByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');

    const lastNameInput = screen.getByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    expect(lastNameInput.value).toBe('Doe');
  });
});
