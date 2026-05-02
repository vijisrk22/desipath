import housesReducer, { fetchHouses } from './HousesSlice';

describe('HousesSlice Reducer', () => {
  it('should return initial state', () => {
    const state = housesReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('houses');
    expect(state).toHaveProperty('loading', false);
  });

  it('should handle fetchHouses.pending', () => {
    const actual = housesReducer(undefined, fetchHouses.pending());
    expect(actual.loading).toBe(true);
  });
});
