import {PreLoadedRoutines} from './RoutineRepository.ts';

test('no duplicate uuid', () => {
  const ids = PreLoadedRoutines.map(x => x[0].id);
  const distinct = new Set(ids);
  expect(ids.length).toBe(distinct.size);
});
