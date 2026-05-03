import travelCompanionReducer, { fetchTravelCompanions, fetchMyTravelCompanions, deleteTravelCompanion } from './TravelCompanionSlice';

describe('TravelCompanionSlice Reducer', () => {
  const initialState = {
    travelCompanions: [],
    travelers: [],
    myTravelCompanions: [],
    error: null,
    loading: false,
  };

  it('should return initial state', () => {
    const state = travelCompanionReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle fetchTravelCompanions.pending', () => {
    const actual = travelCompanionReducer(initialState, fetchTravelCompanions.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchTravelCompanions.fulfilled', () => {
    const payload = [{ id: 1, destination: 'NYC' }];
    const actual = travelCompanionReducer(initialState, fetchTravelCompanions.fulfilled(payload));
    expect(actual.travelCompanions).toEqual(payload);
  });

  it('should handle fetchMyTravelCompanions.fulfilled', () => {
    const payload = [{ id: 2, destination: 'LA' }];
    const actual = travelCompanionReducer(initialState, fetchMyTravelCompanions.fulfilled(payload));
    expect(actual.myTravelCompanions).toEqual(payload);
  });

  it('should handle deleteTravelCompanion.fulfilled', () => {
    const stateWithMyPosts = {
      ...initialState,
      myTravelCompanions: [{ id: 1 }, { id: 2 }]
    };
    const actual = travelCompanionReducer(stateWithMyPosts, deleteTravelCompanion.fulfilled(1, 'reqId', 1));
    expect(actual.myTravelCompanions).toHaveLength(1);
    expect(actual.myTravelCompanions[0].id).toBe(2);
  });
});
