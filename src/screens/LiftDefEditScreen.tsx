import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {Button, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../App';
import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import {LiftType} from '../types/types';
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

  const [def, setDef] = useState(
    route.params.def == undefined
      ? {
          id: '',
          name: '',
          type: LiftType.Barbell,
        }
      : route.params.def,
  );

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(def.type);
  const [tm, setTM] = useState(def.trainingMax ? def.trainingMax : 0.0);

  async function onSave() {
    def.type = type;
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
      <View>
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

      <View>
        <Text>Type:</Text>

        <DropDownPicker
          disabled={systemDef}
          items={items}
          open={open}
          value={type}
          setOpen={setOpen}
          setValue={setType}
        />
        <Text>Training Max:</Text>
        <TextInput
          keyboardType="numeric"
          onChangeText={newText => {
            var parsed = parseFloat(newText);
            if (!Number.isNaN(parsed)) setTM(parseFloat(newText));
          }}>
          {tm}
        </TextInput>
      </View>

      {def.id.length > 0 && <Button title="Delete" onPress={onDelete}></Button>}
      <Button
        title="Save"
        onPress={onSave}
        disabled={def.name.length == 0}></Button>
    </View>
  );
}
