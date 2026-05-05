import { describe, it, expect, beforeEach } from 'vitest';
import reducer, { clearLocations, setCurrentLocation, fetchLocations, reverseGeocode } from './LocationSlice';

describe('LocationSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
        locations: [],
        currentLocation: null,
        loading: false,
        error: null,
    };
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Standard Reducers', () => {
    it('handles clearLocations', () => {
      const state = { ...initialState, locations: [{ city: 'New York' }] };
      expect(reducer(state, clearLocations()).locations).toEqual([]);
    });

    it('handles setCurrentLocation', () => {
      const location = { lat: 40.7128, lng: -74.0060, address: 'New York' };
      expect(reducer(initialState, setCurrentLocation(location)).currentLocation).toEqual(location);
    });
  });

  describe('Async Thunks', () => {
    describe('fetchLocations', () => {
      it('handles pending', () => {
        const state = reducer(initialState, { type: fetchLocations.pending.type });
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('handles fulfilled', () => {
        const payload = [{ id: 1, name: 'Boston' }];
        const state = reducer(initialState, { type: fetchLocations.fulfilled.type, payload });
        expect(state.loading).toBe(false);
        expect(state.locations).toEqual(payload);
      });

      it('handles rejected', () => {
        const state = reducer(initialState, { type: fetchLocations.rejected.type, payload: 'API Error' });
        expect(state.loading).toBe(false);
        expect(state.error).toBe('API Error');
      });
    });

    describe('reverseGeocode', () => {
      it('handles pending', () => {
        const state = reducer(initialState, { type: reverseGeocode.pending.type });
        expect(state.loading).toBe(true);
      });

      it('handles fulfilled', () => {
        const payload = { address: '123 Main St' };
        const state = reducer(initialState, { type: reverseGeocode.fulfilled.type, payload });
        expect(state.loading).toBe(false);
        expect(state.currentLocation).toEqual(payload);
      });

      it('handles rejected gracefully', () => {
        const state = reducer(initialState, { type: reverseGeocode.rejected.type, payload: 'Geocode Error' });
        expect(state.loading).toBe(false);
        // LocationSlice specifically ignores the error for reverse geocoding
        expect(state.error).toBeNull();
      });
    });
  });
});
