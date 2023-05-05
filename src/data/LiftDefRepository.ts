import AsyncStorage from '@react-native-async-storage/async-storage';
import { LiftDef } from '../types/types';
import Utils from '../components/Utils';

const keyPrefix = 'liftdef:';

export default class LiftDefRepository {

    static async insert(def: LiftDef) {
        if (def.id.length != 0)
            throw new Error("id should not be set on insert")

        def.id = Utils.generate_uuidv4()
        console.log(def)

        await AsyncStorage.setItem(keyPrefix + def.id, JSON.stringify(def));
    }
}