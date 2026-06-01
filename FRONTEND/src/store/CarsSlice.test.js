import carsReducer, { fetchCars, fetchMyCars, deleteCar } from './CarsSlice';

describe('CarsSlice Reducer', () => {
  const initialState = {
    cars: [],
    pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 9
    },
    car_make:[],
    car_model: [],
    car_attributes: { fuel_types: [], transmissions: [], conditions: [] },
    carDetails: null,
    myCars: [],
    error: null,
    loading: false,
    lastSearchQuery: null,
  };

  it('should return initial state', () => {
    const state = carsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle fetchCars.pending', () => {
    const actual = carsReducer(initialState, fetchCars.pending());
    expect(actual.loading).toBe(true);
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
    const actual = carsReducer(stateWithMyCars, deleteCar.fulfilled({ success: true }, 'reqId', 1));
    expect(actual.myCars).toHaveLength(1);
    expect(actual.myCars[0].id).toBe(2);
  });
});
