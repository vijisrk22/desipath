import { describe, it, expect } from 'vitest';
import rentalHomesReducer, {
  fetchRentalHomes,
  fetchMyRentalHomes,
  deleteRentalHome,
} from './RentalHomesSlice';

describe('RentalHomesSlice Reducer', () => {
  const initialState = {
    rentalHomes: [],
    myRentalHomes: [],
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(rentalHomesReducer(undefined, { type: 'unknown' })).toMatchObject({
      rentalHomes: [],
      myRentalHomes: [],
      loading: false,
      error: null,
    });
  });

  it('should handle fetchRentalHomes.pending', () => {
    const actual = rentalHomesReducer(initialState, fetchRentalHomes.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchRentalHomes.fulfilled', () => {
    const payload = [{ id: 1, title: 'Cozy Apartment' }];
    const actual = rentalHomesReducer(initialState, fetchRentalHomes.fulfilled(payload));
    expect(actual.loading).toBe(false);
    expect(actual.rentalHomes).toEqual(payload);
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
    const actual = rentalHomesReducer(stateWithMyHomes, deleteRentalHome.fulfilled(1));
    expect(actual.myRentalHomes).toHaveLength(1);
    expect(actual.myRentalHomes[0].id).toBe(2);
  });
});
