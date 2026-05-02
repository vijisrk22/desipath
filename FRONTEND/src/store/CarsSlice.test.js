import carsReducer, { fetchCars } from './CarsSlice';

describe('CarsSlice Reducer', () => {
  it('should return initial state', () => {
    const state = carsReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('cars');
    expect(state).toHaveProperty('loading', false);
  });

  it('should handle fetchCars.pending', () => {
    const actual = carsReducer(undefined, fetchCars.pending());
    expect(actual.loading).toBe(true);
  });
});
