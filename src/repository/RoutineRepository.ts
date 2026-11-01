import { DEFAULT_ROUTINE, Routine } from '../core/types/workout';
import { RoutineTemplate } from '../core/types/template.ts';

// Every routine saved by the web editor as src/core/routines/<id>.json.
// require.context is resolved by Metro at bundle time, so the files do not
// need to be listed by hand.
const context = require.context('../core/routines', false, /\.json$/);

export const PreLoadedRoutines: RoutineTemplate[] = context
  .keys()
  .sort()
  .map(key => context(key) as RoutineTemplate);

export default class RoutineRepository {
  static async getAll(): Promise<Routine[]> {
    return [
      { id: DEFAULT_ROUTINE, title: 'Default' },
      ...PreLoadedRoutines.map(x => x.routine),
    ];
  }
}
