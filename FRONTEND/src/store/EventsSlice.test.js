import { describe, it, expect } from 'vitest';
import eventsReducer, {
  fetchEvents,
  fetchMyEvents,
  deleteEvent,
} from './EventsSlice';

describe('EventsSlice Reducer', () => {
  const initialState = {
    events: [],
    myEvents: [],
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(eventsReducer(undefined, { type: 'unknown' })).toMatchObject({
      events: [],
      myEvents: [],
      loading: false,
      error: null,
    });
  });

  it('should handle fetchEvents.pending', () => {
    const actual = eventsReducer(initialState, fetchEvents.pending());
    expect(actual.loading).toBe(true);
  });

  it('should handle fetchEvents.fulfilled', () => {
    const payload = [{ id: 1, title: 'Music Concert' }];
    const actual = eventsReducer(initialState, fetchEvents.fulfilled(payload));
    expect(actual.loading).toBe(false);
    expect(actual.events).toEqual(payload);
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
    const actual = eventsReducer(stateWithMyEvents, deleteEvent.fulfilled(1));
    expect(actual.myEvents).toHaveLength(1);
    expect(actual.myEvents[0].id).toBe(2);
  });
});
