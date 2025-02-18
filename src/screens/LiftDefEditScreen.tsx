import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../App';
import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import {LiftDef, LiftType, MuscleGroup} from '../types/types';
import LiftDefRepository from '../repository/LiftDefRepository';
import {useDispatch} from 'react-redux';

type Props = StackScreenProps<RootStackParamList, 'LiftDefEdit'>;

export function LiftDefEditScreen({route, navigation}: Props) {
  const systemDef = route.params.def?.system == true;
  const dispatch = useDispatch();
  const repo = new LiftDefRepository(dispatch);

  const items = Object.values(LiftType)
    .filter(value => typeof value === 'string')
    .map(value => {
      const result: ItemType<LiftType> = {
        label: value.toString(),
        value: LiftType[value as keyof typeof LiftType],
      };
      return result;
    });

  const muscleGroupItems = Object.values(MuscleGroup)
    .filter(value => typeof value === 'string')
    .sort()
    .map(value => {
      const result: ItemType<MuscleGroup> = {
        label: value.toString(),
        value: MuscleGroup[value as keyof typeof MuscleGroup],
      };
      return result;
    });

  const [def, setDef] = useState<LiftDef>(
    route.params.def == undefined
      ? {
          id: '',
          name: '',
          type: LiftType.Barbell,
        }
      : JSON.parse(JSON.stringify(route.params.def)),
  );

  const [open, setOpen] = useState(false);

  const [primaryOpen, setPrimaryOpen] = useState(false);
  const [primary, setPrimary] = useState<MuscleGroup | null>(
    def.muscleGroups?.[0] ?? null,
  );
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const [secondary, setSecondary] = useState<MuscleGroup[]>(
    def.muscleGroups?.slice(1) ?? [],
  );

  const [type, setType] = useState(def.type);
  const [tm, setTM] = useState(def.trainingMax ? def.trainingMax : 0.0);

  async function onSave() {
    console.log('primary = ' + primary);
    console.log('secondary = ' + secondary);
    def.muscleGroups =
      primary != undefined ? [primary, ...secondary] : undefined;
    console.log(def);
    if (tm > 0) def.trainingMax = tm;
    else def.trainingMax = undefined;

    await repo.upsert(def);

    navigation.goBack();
  }

  async function onDelete() {
    if (!systemDef) await repo.delete(def.id);

    navigation.goBack();
  }

  return (
    <View>
      <View style={styles.viewGroup}>
        <Text>{def.id}</Text>
        <Text>Name:</Text>
        <TextInput
          editable={!systemDef}
          onChangeText={newName =>
            setDef(prevState => ({
              ...prevState,
              name: newName,
            }))
          }>
          {def.name}
        </TextInput>
      </View>

      <View style={[styles.viewGroup, {zIndex: 90}]}>
        <Text>Type:</Text>
        <DropDownPicker
          disabled={systemDef}
          items={items}
          open={open}
          value={type}
          setOpen={setOpen}
          setValue={setType}
        />
      </View>

      <View style={[styles.viewGroup, {zIndex: 80}]}>
        <Text>Primary:</Text>
        <DropDownPicker
          items={muscleGroupItems}
          open={primaryOpen}
          setOpen={setPrimaryOpen}
          value={primary}
          setValue={setPrimary}
        />
      </View>

      <View style={[styles.viewGroup, {zIndex: 70}]}>
        <Text>{'Secondary: ' + secondary.map(i => MuscleGroup[i])}</Text>
        <DropDownPicker
          disabled={primary == undefined}
          disabledStyle={{
            opacity: 0.5,
          }}
          items={muscleGroupItems}
          open={secondaryOpen}
          setOpen={setSecondaryOpen}
          multiple={true}
          value={secondary}
          setValue={setSecondary}
        />
      </View>

      <View style={styles.viewGroup}>
        <Text>Training Max:</Text>
        <TextInput
          keyboardType="numeric"
          onChangeText={newText => {
            const parsed = parseFloat(newText);
            if (!Number.isNaN(parsed)) setTM(parseFloat(newText));
          }}>
          {tm}
        </TextInput>
      </View>

      {def.id.length > 0 && !def.system && (
        <Button title="Delete" onPress={onDelete}></Button>
      )}
      <Button
        title="Save"
        onPress={onSave}
        disabled={def.name.length == 0}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  viewGroup: {
    padding: 4,
  },
});
