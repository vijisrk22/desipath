import { describe, it, expect } from 'vitest';
import carsReducer, {
  fetchCars,
  fetchMyCars,
  deleteCar,
} from './CarsSlice';

describe('CarsSlice Reducer', () => {
  const initialState = {
    cars: [],
    myCars: [],
    makes: [],
    models: [],
    loading: false,
    error: null,
    activeSearchFilters: {},
    isSearchActive: false,
  };

  it('should handle initial state', () => {
    expect(carsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchCars.pending', () => {
    const actual = carsReducer(initialState, fetchCars.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchCars.fulfilled', () => {
    const payload = { data: [{ id: 1, title: 'Toyota Camry' }] };
    const actual = carsReducer(initialState, fetchCars.fulfilled(payload));
    expect(actual.loading).toBe(false);
    expect(actual.cars).toEqual(payload.data); // Assuming the reducer extracts payload.data
  });

  it('should handle fetchMyCars.fulfilled', () => {
    const payload = [{ id: 2, title: 'My Honda' }];
    const actual = carsReducer(initialState, fetchMyCars.fulfilled(payload));
    expect(actual.myCars).toEqual(payload);
  });

  it('should handle deleteCar.fulfilled', () => {
    const stateWithMyCars = {
      ...initialState,
      myCars: [{ id: 1 }, { id: 2 }]
    };
    const actual = carsReducer(stateWithMyCars, deleteCar.fulfilled(1));
    expect(actual.myCars).toHaveLength(1);
    expect(actual.myCars[0].id).toBe(2);
  });
});
