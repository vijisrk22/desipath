import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, { fetchPhotographers, deletePhotographer, updatePhotographer } from './PhotographySlice';
import api from '../utils/api';

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  },
}));

describe('PhotographySlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      photographers: [],
      loading: false,
      error: null,
    };
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchPhotographers', () => {
    it('sets loading to true on pending', () => {
      const state = reducer(initialState, { type: fetchPhotographers.pending.type });
      expect(state.loading).toBe(true);
    });

    it('sets photographers and loading to false on fulfilled', () => {
      const mockData = [{ id: 1, name: 'John Doe' }];
      const state = reducer(initialState, {
        type: fetchPhotographers.fulfilled.type,
        payload: mockData,
      });
      expect(state.loading).toBe(false);
      expect(state.photographers).toEqual(mockData);
    });

    it('sets error on rejected', () => {
      const state = reducer(initialState, {
        type: fetchPhotographers.rejected.type,
        error: { message: 'Network error' },
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });
});
