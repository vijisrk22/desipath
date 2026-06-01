import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, { clearError, loginUser, googleLogin, registerUser, logoutUser, updateUserProfile } from './UserSlice';
import api from '../utils/api';

describe('UserSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      loading: false,
      user: null,
      accessToken: null,
      error: null,
    };
    localStorage.clear();
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handles clearError', () => {
    const state = { ...initialState, error: 'Some error' };
    expect(reducer(state, clearError()).error).toBeNull();
  });

  describe('loginUser', () => {
    it('handles pending', () => {
      const state = reducer(initialState, { type: loginUser.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('handles fulfilled', () => {
      const payload = { access_token: 'token123', user: { id: 1, name: 'John' } };
      const state = reducer(initialState, { type: loginUser.fulfilled.type, payload });
      expect(state.loading).toBe(false);
      expect(state.accessToken).toBe('token123');
      expect(state.user).toEqual({ id: 1, name: 'John' });
    });

    it('handles rejected with 401', () => {
      const state = reducer(initialState, { 
        type: loginUser.rejected.type, 
        payload: { status: 401 } 
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Invalid email or password');
    });

    it('handles rejected with generic error', () => {
      const state = reducer(initialState, { 
        type: loginUser.rejected.type, 
        payload: { message: 'Server error' } 
      });
      expect(state.error).toBe('Server error');
    });
  });

  describe('googleLogin', () => {
    it('handles pending', () => {
      const state = reducer(initialState, { type: googleLogin.pending.type });
      expect(state.loading).toBe(true);
    });

    it('handles fulfilled', () => {
      const payload = { access_token: 'g-token', user: { id: 2, name: 'Jane' } };
      const state = reducer(initialState, { type: googleLogin.fulfilled.type, payload });
      expect(state.loading).toBe(false);
      expect(state.accessToken).toBe('g-token');
      expect(state.user).toEqual({ id: 2, name: 'Jane' });
    });

    it('handles rejected', () => {
      const state = reducer(initialState, { 
        type: googleLogin.rejected.type, 
        payload: { message: 'Google failed' } 
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Google failed');
    });
  });

  describe('registerUser', () => {
    it('handles pending', () => {
      const state = reducer(initialState, { type: registerUser.pending.type });
      expect(state.loading).toBe(true);
    });

    it('handles fulfilled', () => {
      const state = reducer(initialState, { type: registerUser.fulfilled.type });
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('handles rejected with 409', () => {
      const state = reducer(initialState, { type: registerUser.rejected.type, payload: { status: 409 } });
      expect(state.error).toBe('This email is already registered');
    });

    it('handles rejected with 422', () => {
      const state = reducer(initialState, { type: registerUser.rejected.type, payload: { status: 422 } });
      expect(state.error).toBe('Issue registering user');
    });
  });

  describe('logoutUser', () => {
    it('handles pending', () => {
      const state = reducer(initialState, { type: logoutUser.pending.type });
      expect(state.loading).toBe(true);
    });

    it('handles fulfilled', () => {
      const state = reducer({ ...initialState, user: {}, accessToken: 'abc' }, { type: logoutUser.fulfilled.type });
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
    });
  });

  describe('updateUserProfile', () => {
    it('handles pending', () => {
      const state = reducer(initialState, { type: updateUserProfile.pending.type });
      expect(state.loading).toBe(true);
    });

    it('handles fulfilled', () => {
      const payload = { data: { id: 1, name: 'Updated' } };
      const state = reducer(initialState, { type: updateUserProfile.fulfilled.type, payload });
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(payload.data);
    });

    it('handles rejected with 422', () => {
      const state = reducer(initialState, { type: updateUserProfile.rejected.type, payload: { status: 422 } });
      expect(state.error).toBe('Invalid data provided');
    });
  });
});
