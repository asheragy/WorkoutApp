import {PreLoadedRoutines} from './RoutineRepository.ts';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

test('no duplicate uuid', () => {
  const ids = PreLoadedRoutines.map(x => x[0].id);
  const distinct = new Set(ids);
  expect(ids.length).toBe(distinct.size);
});
