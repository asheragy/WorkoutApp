import {WorkoutNode} from '../../types/types';
import getProgram from '../data/programs/me';
import Storage from './Storage';

export type Workout = {
  node: WorkoutNode;
  position: number;
  completed: Boolean;
};

export default class Repository {
  static async getWorkouts(): Promise<Workout[]> {
    return Storage.getLastCompletedIndex().then(completedIndex => {
      var program = getProgram();

      return program.workouts.map((wo, index) => {
        return {
          node: wo,
          position: index,
          completed: completedIndex >= index,
        };
      });
    });
  }

  static async complete(index: number): Promise<boolean> {
    return Storage.complete(index);
  }

  static async undoComplete(): Promise<boolean> {
    return Storage.undoComplete();
  }
}
