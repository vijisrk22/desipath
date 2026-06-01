import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, { 
    setLearningPaths, clearLearningPaths, setSearchResults, clearSearchResults, setCourseDetails, clearCourseDetails,
    fetchLearningPaths, postQuery, fetchCourseDetails 
} from './ITTrainingsSlice';

describe('ITTrainingsSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
        learningPaths: [],
        searchResults: [],
        courseDetails: null,
        error: null,
        loading: false,
    };
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Standard Reducers', () => {
    it('handles setLearningPaths', () => {
      const data = [{ id: 1, name: 'React' }];
      expect(reducer(initialState, setLearningPaths(data)).learningPaths).toEqual(data);
    });

    it('handles clearLearningPaths', () => {
      const state = { ...initialState, learningPaths: [{ id: 1 }] };
      expect(reducer(state, clearLearningPaths()).learningPaths).toEqual([]);
    });

    it('handles setSearchResults', () => {
      const data = [{ id: 1, title: 'Course 1' }];
      expect(reducer(initialState, setSearchResults(data)).searchResults).toEqual(data);
    });

    it('handles clearSearchResults', () => {
      const state = { ...initialState, searchResults: [{ id: 1 }] };
      expect(reducer(state, clearSearchResults()).searchResults).toEqual([]);
    });

    it('handles setCourseDetails', () => {
      const data = { id: 1, details: 'Full stack course' };
      expect(reducer(initialState, setCourseDetails(data)).courseDetails).toEqual(data);
    });

    it('handles clearCourseDetails', () => {
      const state = { ...initialState, courseDetails: { id: 1 } };
      expect(reducer(state, clearCourseDetails()).courseDetails).toBeNull();
    });
  });

  describe('Async Thunks', () => {
    describe('fetchLearningPaths', () => {
      it('handles pending', () => {
        const state = reducer(initialState, { type: fetchLearningPaths.pending.type });
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('handles fulfilled', () => {
        const payload = { learningPaths: [{ id: 1, path: 'Frontend' }] };
        const state = reducer(initialState, { type: fetchLearningPaths.fulfilled.type, payload });
        expect(state.loading).toBe(false);
        expect(state.learningPaths).toEqual(payload.learningPaths);
      });

      it('handles rejected', () => {
        const state = reducer(initialState, { type: fetchLearningPaths.rejected.type, payload: 'Error' });
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Error');
      });
    });

    describe('postQuery', () => {
      it('handles pending', () => {
        const state = reducer(initialState, { type: postQuery.pending.type });
        expect(state.loading).toBe(true);
      });

      it('handles fulfilled', () => {
        const payload = { data: [{ id: 1, name: 'Search Result' }] };
        const state = reducer(initialState, { type: postQuery.fulfilled.type, payload });
        expect(state.loading).toBe(false);
        expect(state.searchResults).toEqual(payload.data);
      });

      it('handles rejected', () => {
        const state = reducer(initialState, { type: postQuery.rejected.type, payload: 'Search Failed' });
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Search Failed');
      });
    });

    describe('fetchCourseDetails', () => {
      it('handles pending', () => {
        const state = reducer(initialState, { type: fetchCourseDetails.pending.type });
        expect(state.loading).toBe(true);
      });

      it('handles fulfilled', () => {
        const payload = { courseDetails: { id: 1, description: 'Desc' } };
        const state = reducer(initialState, { type: fetchCourseDetails.fulfilled.type, payload });
        expect(state.loading).toBe(false);
        expect(state.courseDetails).toEqual(payload.courseDetails);
      });

      it('handles rejected', () => {
        const state = reducer(initialState, { type: fetchCourseDetails.rejected.type, payload: 'Fetch Failed' });
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Fetch Failed');
      });
    });
  });
});
