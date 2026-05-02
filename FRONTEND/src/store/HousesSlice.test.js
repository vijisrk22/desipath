import { describe, it, expect } from 'vitest';
import housesReducer, {
  fetchHouses,
  fetchMyHouses,
  deleteHouse,
} from './HousesSlice';

describe('HousesSlice Reducer', () => {
  const initialState = {
    houses: [],
    myHouses: [],
    activeSearchFilters: {},
    isSearchActive: false,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(housesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchHouses.pending', () => {
    const actual = housesReducer(initialState, fetchHouses.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchHouses.fulfilled', () => {
    const payload = [{ id: 1, title: 'Beautiful House' }];
    const actual = housesReducer(initialState, fetchHouses.fulfilled(payload));
    expect(actual.loading).toBe(false);
    expect(actual.houses).toEqual(payload);
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
    const actual = housesReducer(stateWithMyHouses, deleteHouse.fulfilled(1));
    expect(actual.myHouses).toHaveLength(1);
    expect(actual.myHouses[0].id).toBe(2);
  });
});
