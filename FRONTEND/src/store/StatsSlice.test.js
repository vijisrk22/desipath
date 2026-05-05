import { describe, it, expect, beforeEach } from 'vitest';
import reducer, { fetchAdCounts } from './StatsSlice';

describe('StatsSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
        counts: {},
        loading: false,
        lastFetched: null,
    };
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchAdCounts', () => {
    it('handles pending', () => {
      const state = reducer(initialState, { type: fetchAdCounts.pending.type });
      expect(state.loading).toBe(true);
    });

    it('handles fulfilled', () => {
      const payload = { 'cars': 10, 'homes': 5 };
      const state = reducer(initialState, { type: fetchAdCounts.fulfilled.type, payload });
      expect(state.loading).toBe(false);
      expect(state.counts).toEqual(payload);
      expect(state.lastFetched).toBeDefined();
    });

    it('handles rejected', () => {
      const state = reducer({ ...initialState, loading: true }, { type: fetchAdCounts.rejected.type });
      expect(state.loading).toBe(false);
    });
  });
});
