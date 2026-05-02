import roommatesReducer, { fetchRooms } from './RoommatesSlice';

describe('RoommatesSlice Reducer', () => {
  it('should return initial state', () => {
    const state = roommatesReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('loading', false);
  });

  it('should handle fetchRooms.pending', () => {
    const actual = roommatesReducer(undefined, fetchRooms.pending());
    expect(actual.loading).toBe(true);
  });
});
