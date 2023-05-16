import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {Button, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../../App';
import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import {LiftType, TrainingMax} from '../../types/types';
import LiftDefRepository from '../../repository/LiftDefRepository';
import TrainingMaxRepository from '../../repository/TrainingMaxRepository';

type Props = StackScreenProps<RootStackParamList, 'LiftDefEdit'>;

export function LiftDefEditScreen({route, navigation}: Props) {
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
  const [tm, setTM] = useState(0.0);

  function loadState() {
    TrainingMaxRepository.getInstance()
      .get(def.id)
      .then(result => {
        if (result !== undefined) setTM(result.max);
      });
  }

  useEffect(loadState, []);

  async function onSave() {
    def.type = type;

    var liftDef = await LiftDefRepository.upsert(def);
    await TrainingMaxRepository.getInstance().upsert({
      id: liftDef.id,
      max: tm,
    });
    route.params.onChanged();
    navigation.goBack();
  }

  async function onDelete() {
    await LiftDefRepository.delete(def.id);
    route.params.onChanged();
    navigation.goBack();
  }

  return (
    <View>
      <View>
        <Text>Name:</Text>
        <TextInput
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
