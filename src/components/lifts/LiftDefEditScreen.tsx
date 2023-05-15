import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {Button, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../../App';
import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import {LiftType} from '../../types/types';
import LiftDefRepository from '../../repository/LiftDefRepository';

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

  async function onSave() {
    def.type = type;

    await LiftDefRepository.upsert(def);
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
      </View>

      {def.id.length > 0 && <Button title="Delete" onPress={onDelete}></Button>}
      <Button
        title="Save"
        onPress={onSave}
        disabled={def.name.length == 0}></Button>
    </View>
  );
}
