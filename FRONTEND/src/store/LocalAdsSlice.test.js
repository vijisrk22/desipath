import { describe, it, expect } from 'vitest';
import localAdsReducer, {
  fetchLocalAds,
  fetchMyLocalAds,
  deleteLocalAd,
} from './LocalAdsSlice';

describe('LocalAdsSlice Reducer', () => {
  const initialState = {
    ads: [],
    myAds: [],
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(localAdsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchLocalAds.pending', () => {
    const actual = localAdsReducer(initialState, fetchLocalAds.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchLocalAds.fulfilled', () => {
    const payload = { data: [{ id: 1, title: 'Test Ad' }] };
    const actual = localAdsReducer(initialState, fetchLocalAds.fulfilled(payload));
    expect(actual.loading).toBe(false);
    expect(actual.ads).toEqual(payload.data);
  });

  it('should handle fetchLocalAds.rejected', () => {
    const actual = localAdsReducer(initialState, fetchLocalAds.rejected(new Error('Failed')));
    expect(actual.loading).toBe(false);
    expect(actual.error).toBe('Failed');
  });

  it('should handle fetchMyLocalAds.fulfilled (My Ads search/list)', () => {
    const payload = [{ id: 2, title: 'My Ad' }];
    const actual = localAdsReducer(initialState, fetchMyLocalAds.fulfilled(payload));
    expect(actual.myAds).toEqual(payload);
  });

  it('should handle deleteLocalAd.fulfilled', () => {
    const stateWithMyAds = {
      ...initialState,
      myAds: [{ id: 1, title: 'Ad to delete' }, { id: 2, title: 'Ad to keep' }]
    };
    const actual = localAdsReducer(stateWithMyAds, deleteLocalAd.fulfilled(1));
    expect(actual.myAds).toHaveLength(1);
    expect(actual.myAds[0].id).toBe(2);
  });
});
