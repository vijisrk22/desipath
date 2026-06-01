import { describe, it, expect, beforeEach } from 'vitest';
import reducer, { setSelectedChat, clearSelectedChat, fetchChatList, fetchChatMessages, sendMessage } from './ChatSlice';

describe('ChatSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
        userMessages: [],
        conversation: [],
        error: null,
        loading: false,
        selectedChatId: null,
    };
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Standard Reducers', () => {
    it('handles setSelectedChat', () => {
      expect(reducer(initialState, setSelectedChat(1)).selectedChatId).toBe(1);
    });

    it('handles clearSelectedChat', () => {
      const state = { ...initialState, selectedChatId: 1, conversation: [{ id: 1 }] };
      const nextState = reducer(state, clearSelectedChat());
      expect(nextState.selectedChatId).toBeNull();
      expect(nextState.conversation).toEqual([]);
    });
  });

  describe('Async Thunks', () => {
    describe('fetchChatList', () => {
      it('handles pending', () => {
        const state = reducer(initialState, { type: fetchChatList.pending.type });
        expect(state.loading).toBe(true);
      });

      it('handles fulfilled', () => {
        const payload = [{ id: 1, text: 'Hello' }];
        const state = reducer(initialState, { type: fetchChatList.fulfilled.type, payload });
        expect(state.loading).toBe(false);
        expect(state.userMessages).toEqual(payload);
      });

      it('handles rejected', () => {
        const state = reducer(initialState, { type: fetchChatList.rejected.type, payload: 'API Error' });
        expect(state.loading).toBe(false);
        expect(state.error).toBe('API Error');
      });
    });

    describe('fetchChatMessages', () => {
      it('handles pending', () => {
        const state = reducer(initialState, { type: fetchChatMessages.pending.type });
        expect(state.loading).toBe(true);
      });

      it('handles fulfilled', () => {
        const payload = [{ id: 1, message: 'Hi' }];
        const state = reducer(initialState, { type: fetchChatMessages.fulfilled.type, payload });
        expect(state.loading).toBe(false);
        expect(state.conversation).toEqual(payload);
      });

      it('handles rejected with 404', () => {
        const state = reducer(initialState, { type: fetchChatMessages.rejected.type, payload: { status: 404 } });
        expect(state.loading).toBe(false);
        expect(state.conversation).toEqual([]);
        expect(state.error).toBeNull();
      });

      it('handles rejected generic', () => {
        const state = reducer(initialState, { type: fetchChatMessages.rejected.type, payload: { message: 'Error fetching' } });
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Error fetching');
      });
    });

    describe('sendMessage', () => {
      it('handles pending', () => {
        const state = reducer(initialState, { type: sendMessage.pending.type });
        expect(state.loading).toBe(true);
      });

      it('handles fulfilled for new message', () => {
        const payload = { id: 1, ad_id: 1, message: 'New text' };
        const state = reducer(initialState, { type: sendMessage.fulfilled.type, payload });
        expect(state.loading).toBe(false);
        expect(state.conversation).toContainEqual(payload);
        expect(state.userMessages).toContainEqual(payload);
      });

      it('handles rejected', () => {
        const state = reducer(initialState, { type: sendMessage.rejected.type, payload: { message: 'Send fail' } });
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Send fail');
      });
    });
  });
});
