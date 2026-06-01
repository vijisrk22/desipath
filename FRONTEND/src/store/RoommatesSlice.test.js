import roommatesReducer, { fetchRooms, fetchMyRooms, deleteRoom } from './RoommatesSlice';

describe('RoommatesSlice Reducer', () => {
  const initialState = {
    rooms: [],
    pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 9
    },
    roomDetails: null,
    myRooms: [],
    error: null,
    loading: false,
    lastSearchQuery: null,
  };

  it('should return initial state', () => {
    const state = roommatesReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle fetchRooms.pending', () => {
    const actual = roommatesReducer(initialState, fetchRooms.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchRooms.fulfilled', () => {
    const payload = [{ id: 1, title: 'Looking for Roommate in NY' }];
    const actual = roommatesReducer(initialState, fetchRooms.fulfilled(payload));
    expect(actual.rooms).toEqual(payload);
  });

  it('should handle fetchMyRooms.fulfilled', () => {
    const payload = [{ id: 2, title: 'My Roommate Listing' }];
    const actual = roommatesReducer(initialState, fetchMyRooms.fulfilled(payload));
    expect(actual.myRooms).toEqual(payload);
  });

  it('should handle deleteRoom.fulfilled', () => {
    const stateWithMyRooms = {
      ...initialState,
      myRooms: [{ id: 1 }, { id: 2 }]
    };
    const actual = roommatesReducer(stateWithMyRooms, deleteRoom.fulfilled({ success: true }, 'reqId', 1));
    expect(actual.myRooms).toHaveLength(1);
    expect(actual.myRooms[0].id).toBe(2);
  });
});
