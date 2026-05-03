import housesReducer, { fetchHouses, fetchMyHouses, deleteHouse } from './HousesSlice';

describe('HousesSlice Reducer', () => {
  const initialState = {
    houses: [],
    pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 12,
        from: 0,
        to: 0
    },
    houseDetails: null,
    myHouses: [],
    error: null,
    loading: false,
    lastSearchQuery: null,
  };

  it('should return initial state', () => {
    const state = housesReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle fetchHouses.pending', () => {
    const actual = housesReducer(initialState, fetchHouses.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchHouses.fulfilled', () => {
    const payload = { data: [{ id: 1, title: 'Beautiful House' }], current_page: 1, last_page: 1, total: 1, per_page: 12, from: 1, to: 1 };
    const actual = housesReducer(initialState, fetchHouses.fulfilled(payload));
    expect(actual.houses).toEqual(payload.data);
  });

  it('should handle fetchMyHouses.fulfilled', () => {
    const payload = [{ id: 2, title: 'My House' }];
    const actual = housesReducer(initialState, fetchMyHouses.fulfilled(payload));
    expect(actual.myHouses).toEqual(payload);
  });

  it('should handle deleteHouse.fulfilled', () => {
    const stateWithMyHouses = {
      ...initialState,
      myHouses: [{ id: 1 }, { id: 2 }]
    };
    const actual = housesReducer(stateWithMyHouses, deleteHouse.fulfilled({ success: true }, 'reqId', 1));
    expect(actual.myHouses).toHaveLength(1);
    expect(actual.myHouses[0].id).toBe(2);
  });
});
