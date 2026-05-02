import { describe, it, expect } from 'vitest';
import travelCompanionReducer, {
  fetchTravelPosts,
  fetchMyTravelPosts,
  deleteTravelPost,
} from './TravelCompanionSlice';

describe('TravelCompanionSlice Reducer', () => {
  const initialState = {
    travelPosts: [],
    myTravelPosts: [],
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(travelCompanionReducer(undefined, { type: 'unknown' })).toMatchObject({
      travelPosts: [],
      myTravelPosts: [],
      loading: false,
      error: null,
    });
  });

  it('should handle fetchTravelPosts.pending', () => {
    const actual = travelCompanionReducer(initialState, fetchTravelPosts.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchTravelPosts.fulfilled', () => {
    const payload = { data: [{ id: 1, destination: 'NYC' }] };
    const actual = travelCompanionReducer(initialState, fetchTravelPosts.fulfilled(payload));
    expect(actual.loading).toBe(false);
    expect(actual.travelPosts).toEqual(payload.data);
  });

  it('should handle fetchMyTravelPosts.fulfilled', () => {
    const payload = [{ id: 2, destination: 'LA' }];
    const actual = travelCompanionReducer(initialState, fetchMyTravelPosts.fulfilled(payload));
    expect(actual.myTravelPosts).toEqual(payload);
  });

  it('should handle deleteTravelPost.fulfilled', () => {
    const stateWithMyPosts = {
      ...initialState,
      myTravelPosts: [{ id: 1 }, { id: 2 }]
    };
    const actual = travelCompanionReducer(stateWithMyPosts, deleteTravelPost.fulfilled(1));
    expect(actual.myTravelPosts).toHaveLength(1);
    expect(actual.myTravelPosts[0].id).toBe(2);
  });
});
