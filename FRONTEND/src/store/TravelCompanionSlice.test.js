import travelCompanionReducer, { fetchTravelCompanions } from './TravelCompanionSlice';

describe('TravelCompanionSlice Reducer', () => {
  it('should return initial state', () => {
    const state = travelCompanionReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('loading', false);
  });

  it('should handle fetchTravelCompanions.pending', () => {
    const actual = travelCompanionReducer(undefined, fetchTravelCompanions.pending());
    expect(actual.loading).toBe(true);
  });
});
