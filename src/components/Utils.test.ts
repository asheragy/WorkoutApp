import {LiftSet} from '../types/types';
import Utils from './Utils';

export {};

test('normalizeSets repeated lifts', () => {
  var sets: LiftSet[] = [
    {
      weight: {
        value: 100,
      },
      reps: {
        value: 5,
      },
    },
    {
      weight: {
        value: 110,
      },
      reps: {
        value: 10,
      },
    },
    {
      weight: {
        value: 110,
      },
      reps: {
        value: 10,
      },
    },
    {
      weight: {
        value: 110,
      },
      reps: {
        value: 10,
      },
    },
  ];

  var normalized = Utils.normalizeSets(sets);
  expect(normalized.length).toBe(4);
  expect(normalized[0].weight).toBe('100lb');
  expect(normalized[1].weight).toBe('110lb');
  expect(normalized[2].weight).toBe('110lb');
  expect(normalized[3].weight).toBe('110lb');
});
