import rentalHomesReducer, { fetchRentalHomes } from './RentalHomesSlice';

describe('RentalHomesSlice Reducer', () => {
  it('should return initial state', () => {
    const state = rentalHomesReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('rentalHomes');
    expect(state).toHaveProperty('loading', false);
  });

  it('should handle fetchRentalHomes.pending', () => {
    const actual = rentalHomesReducer(undefined, fetchRentalHomes.pending());
    expect(actual.loading).toBe(true);
  });
});
