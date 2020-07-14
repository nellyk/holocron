import reducer from '../../src/ducks/registry';

describe('reducer', () => {
  test('returns immutable initialState', () => {
    const state = reducer(undefined, {});

    expect(state).toBeDefined();
  });
});
