import rentalHomesReducer, { fetchRentalHomes, fetchMyRentalHomes, deleteRentalHome } from './RentalHomesSlice';

describe('RentalHomesSlice Reducer', () => {
  const initialState = {
    rentalHomes: [],
    pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 9
    },
    rentalHomeDetails: null,
    myRentalHomes: [],
    error: null,
    loading: false,
    lastSearchQuery: null,
  };

  it('should return initial state', () => {
    const state = rentalHomesReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle fetchRentalHomes.pending', () => {
    const actual = rentalHomesReducer(initialState, fetchRentalHomes.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchMyRentalHomes.fulfilled', () => {
    const payload = [{ id: 2, title: 'My Condo' }];
    const actual = rentalHomesReducer(initialState, fetchMyRentalHomes.fulfilled(payload));
    expect(actual.myRentalHomes).toEqual(payload);
  });

  it('should handle deleteRentalHome.fulfilled', () => {
    const stateWithMyHomes = {
      ...initialState,
      myRentalHomes: [{ id: 1 }, { id: 2 }]
    };
    const actual = rentalHomesReducer(stateWithMyHomes, deleteRentalHome.fulfilled({ success: true }, 'reqId', 1));
    expect(actual.myRentalHomes).toHaveLength(1);
    expect(actual.myRentalHomes[0].id).toBe(2);
  });
});
