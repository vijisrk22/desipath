import eventsReducer, { fetchEvents, fetchMyEvents, deleteEvent } from './EventsSlice';

describe('EventsSlice Reducer', () => {
  const initialState = {
    events: [],
    myEvents: [],
    eventDetails: null,
    error: null,
    loading: false,
    loadingList: false,
    loadingDetails: false,
  };

  it('should return initial state', () => {
    const state = eventsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle fetchEvents.pending', () => {
    const actual = eventsReducer(initialState, fetchEvents.pending());
    expect(actual.loading).toBe(true);
    expect(actual.loadingList).toBe(true);
  });

  it('should handle fetchEvents.fulfilled', () => {
    const payload = { data: [{ id: 1, title: 'Music Concert' }] };
    const actual = eventsReducer(initialState, fetchEvents.fulfilled(payload));
    expect(actual.events).toEqual(payload.data);
  });

  it('should handle fetchMyEvents.fulfilled', () => {
    const payload = [{ id: 2, title: 'My Hosted Event' }];
    const actual = eventsReducer(initialState, fetchMyEvents.fulfilled(payload));
    expect(actual.myEvents).toEqual(payload);
  });

  it('should handle deleteEvent.fulfilled', () => {
    const stateWithMyEvents = {
      ...initialState,
      myEvents: [{ id: 1 }, { id: 2 }]
    };
    const actual = eventsReducer(stateWithMyEvents, deleteEvent.fulfilled(1, 'reqId', 1));
    expect(actual.myEvents).toHaveLength(1);
    expect(actual.myEvents[0].id).toBe(2);
  });
});
