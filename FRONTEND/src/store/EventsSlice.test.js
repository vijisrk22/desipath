import eventsReducer, { fetchEvents } from './EventsSlice';

describe('EventsSlice Reducer', () => {
  it('should return initial state', () => {
    const state = eventsReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('events');
    expect(state).toHaveProperty('loading', false);
  });

  it('should handle fetchEvents.pending', () => {
    const actual = eventsReducer(undefined, fetchEvents.pending());
    expect(actual.loading).toBe(true);
  });
});
