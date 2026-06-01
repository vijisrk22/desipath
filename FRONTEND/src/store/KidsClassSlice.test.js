import { describe, it, expect, beforeEach } from 'vitest';
import reducer, { deleteKidsClass, updateKidsClass } from './KidsClassSlice';

describe('KidsClassSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      loading: false,
      error: null,
    };
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('deleteKidsClass', () => {
    it('handles pending', () => {
      const state = reducer(initialState, { type: deleteKidsClass.pending.type });
      expect(state.loading).toBe(true);
    });

    it('handles fulfilled', () => {
      const state = reducer({ ...initialState, loading: true }, { type: deleteKidsClass.fulfilled.type });
      expect(state.loading).toBe(false);
    });

    it('handles rejected', () => {
      const state = reducer(initialState, { 
        type: deleteKidsClass.rejected.type, 
        payload: 'Delete failed' 
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Delete failed');
    });
  });

  describe('updateKidsClass', () => {
    // updateKidsClass doesn't have extraReducers defined in the slice currently,
    // but we can test that the reducer doesn't crash if these actions are dispatched.
    it('handles pending gracefully', () => {
      const state = reducer(initialState, { type: updateKidsClass.pending.type });
      expect(state).toEqual(initialState);
    });

    it('handles fulfilled gracefully', () => {
      const state = reducer(initialState, { type: updateKidsClass.fulfilled.type });
      expect(state).toEqual(initialState);
    });
  });
});
