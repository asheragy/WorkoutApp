import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import ChartUtils, {HistoryEntry} from './ChartUtils.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {LiftDef, MuscleGroup} from '../types/types.ts';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

test('progress by week', () => {
  const start = new Date('2025-11-01'); // November 1, 2025
  const dates = Array.from({length: 10}, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i * 5);
    return d;
  });

  const result = new Map<string, HistoryEntry[]>();
  result.set(
    Lifts.squat_barbell.id,
    dates.map((date, index) => {
      return {
        value: 100 + index,
        timestamp: date,
      };
    }),
  );
  result.set(
    Lifts.deadlift_barbell.id,
    dates.map((date, index) => {
      return {
        value: 200 + index,
        timestamp: date,
      };
    }),
  );
  // only 2 entries
  result.set(Lifts.lunge.id, [
    {timestamp: dates[1], value: 50},
    {timestamp: dates[7], value: 55},
  ]);

  const defs: Record<string, LiftDef> = {
    [Lifts.squat_barbell.id]: Lifts.squat_barbell,
    [Lifts.deadlift_barbell.id]: Lifts.deadlift_barbell,
    [Lifts.lunge.id]: Lifts.lunge,
  };

  const data = ChartUtils.toProgressByWeek(MuscleGroup.Quads, result, defs);
  expect(data).toEqual([
    0, 0.02064758714677438, 0.03303613943483901, 0.04129517429354876,
    0.07221023594896803, 0.06607227886967802,
  ]);
});
