import {GlobalSettings} from '../types/types';
import {Routine} from '../types/workout';

export default class RoutineRepository {
  static async getAll(): Promise<Routine[]> {
    return [
      {title: 'Default'},
      {id: '3995deca-8204-4dc9-841b-1f4db64a486f', title: 'Upper Lower'},
    ];
  }
}
