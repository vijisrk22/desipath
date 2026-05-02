import { describe, it, expect } from 'vitest';
import roommatesReducer, {
  fetchRoommates,
  fetchMyRoommates,
  deleteRoommate,
} from './RoommatesSlice';

describe('RoommatesSlice Reducer', () => {
  const initialState = {
    roommates: [],
    myRoommates: [],
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(roommatesReducer(undefined, { type: 'unknown' })).toMatchObject({
      roommates: [],
      myRoommates: [],
      loading: false,
      error: null,
    });
  });

  it('should handle fetchRoommates.pending', () => {
    const actual = roommatesReducer(initialState, fetchRoommates.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchRoommates.fulfilled', () => {
    const payload = [{ id: 1, title: 'Looking for Roommate in NY' }];
    const actual = roommatesReducer(initialState, fetchRoommates.fulfilled(payload));
    expect(actual.loading).toBe(false);
    expect(actual.roommates).toEqual(payload);
  });

  it('should handle fetchMyRoommates.fulfilled', () => {
    const payload = [{ id: 2, title: 'My Roommate Listing' }];
    const actual = roommatesReducer(initialState, fetchMyRoommates.fulfilled(payload));
    expect(actual.myRoommates).toEqual(payload);
  });

  it('should handle deleteRoommate.fulfilled', () => {
    const stateWithMyRoommates = {
      ...initialState,
      myRoommates: [{ id: 1 }, { id: 2 }]
    };
    const actual = roommatesReducer(stateWithMyRoommates, deleteRoommate.fulfilled(1));
    expect(actual.myRoommates).toHaveLength(1);
    expect(actual.myRoommates[0].id).toBe(2);
  });
});
