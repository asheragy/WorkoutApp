import { LiftDef } from '../core/types/types';
import Utils from '../components/Utils';
import {
  assignDisplayNames,
  LiftDefBase,
  SystemLifts,
} from '../core/LiftDatabase.ts';
import { AppDispatch, updateLiftDefs } from '../state/store.ts';
import { db, dbReady } from './db.ts';

export default class LiftDefRepository {
  private readonly dispatch: AppDispatch;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  async init(): Promise<void> {
    await dbReady();

    const data = await LiftDefRepository.getLookupMap();
    this.dispatch(updateLiftDefs(data));
  }

  async upsert(def: LiftDef): Promise<LiftDef> {
    if (def.id.length == 0) return await this.insert(def);
    else return await this.update(def);
  }

  async delete(id: string) {
    await LiftDefRepository.deleteRow(id);
    await this.init();
  }

  private async insert(def: LiftDef): Promise<LiftDef> {
    const defToInsert: LiftDef = {
      ...def,
      id: Utils.generate_uuidv4(),
    };

    await LiftDefRepository.upsertRow(defToInsert);
    await this.init();

    return defToInsert;
  }

  private async update(def: LiftDef): Promise<LiftDef> {
    const persistedDef: LiftDef = {
      ...def,
    };

    const existing = await LiftDefRepository.getById(persistedDef.id);
    const systemDef = SystemLifts.find(item => item.id == persistedDef.id);

    if (!systemDef) {
      if (!existing) {
        throw new Error(
          `Unable to find def '${persistedDef.id}', this should never happen `,
        );
      }
      console.log('Updating existing CustomDef');
      await LiftDefRepository.upsertRow(persistedDef);
    } else if (
      LiftDefRepository.matchesSystemDefault(persistedDef, systemDef)
    ) {
      if (existing) {
        console.log('Update matches SystemDef, removing');
        await LiftDefRepository.deleteRow(persistedDef.id);
      } else console.log('SystemDef unmodified, no-op');
    } else {
      console.log(
        existing ? 'Updating systemDef' : 'Adding modified SystemDef',
      );
      await LiftDefRepository.upsertRow(persistedDef);
    }

    await this.init();

    return persistedDef;
  }

  private static matchesSystemDefault(
    def: LiftDef,
    systemDef: LiftDefBase,
  ): boolean {
    return (
      JSON.stringify(def.muscleGroups) ===
        JSON.stringify(systemDef.muscleGroups) &&
      JSON.stringify(def.goal) === JSON.stringify(systemDef.goal) &&
      LiftDefRepository.optionalNumber(def.baseWeight) ===
        LiftDefRepository.optionalNumber(systemDef.baseWeight)
    );
  }

  private static optionalNumber(value: number | undefined): number {
    return value ?? 0;
  }

  static async getAll(): Promise<LiftDef[]> {
    const rows = await db.executeRaw('SELECT id, data_json FROM lift_defs');

    return rows.map(([id, dataJson]) =>
      LiftDefRepository.fromRow(id as string, dataJson as string),
    );
  }

  private static async getById(id: string): Promise<LiftDef | undefined> {
    const rows = await db.executeRaw(
      'SELECT id, data_json FROM lift_defs WHERE id = ?',
      [id],
    );
    if (rows.length == 0) return undefined;

    const [rowId, dataJson] = rows[0];
    return LiftDefRepository.fromRow(rowId as string, dataJson as string);
  }

  private static async upsertRow(def: LiftDef): Promise<void> {
    // id is stored in its own column, everything else goes in data_json.
    // displayName is derived on load and never persisted.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, displayName, ...data } = def;

    await db.execute(
      `INSERT INTO lift_defs (id, data_json, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         data_json = excluded.data_json,
         updated_at = excluded.updated_at`,
      [id, JSON.stringify(data), Date.now()],
    );
  }

  private static async deleteRow(id: string): Promise<void> {
    await db.execute('DELETE FROM lift_defs WHERE id = ?', [id]);
  }

  private static fromRow(id: string, dataJson: string): LiftDef {
    return { ...JSON.parse(dataJson), id };
  }

  private static async getLookupMap(): Promise<Record<string, LiftDef>> {
    const customDefs = await this.getAll();
    const result: Record<string, LiftDefBase> = {};

    customDefs.forEach(def => (result[def.id] = def));
    SystemLifts.forEach(def => {
      if (result[def.id]) {
        // Use hardcoded name for system lifts
        const entry = result[def.id];
        entry.name = def.name;
        // For backwards compatability also type
        entry.type = def.type;
        entry.muscleGroups = def.muscleGroups;

        result[def.id] = entry;
      } else {
        result[def.id] = def;
      }
    });

    return assignDisplayNames(result);
  }
}
