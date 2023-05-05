import React, {useEffect, useState} from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import { Button, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../App";
import DropDownPicker from 'react-native-dropdown-picker';
import { LiftDef, LiftType } from '../../types/types';
import LiftDefRepository from '../../data/LiftDefRepository';


type Props = StackScreenProps<RootStackParamList, 'LiftDefEdit'>;


export function LiftDefEditScreen({route, navigation}: Props) {
    const items = Object.values(LiftType).map(value => {
        const result = {label: value.toString(), value: value.toString()}
        return result
        })

    const [name, setName] = useState("")
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(items[0].value)

    async function onSave() {
        var item = items.find(item => item.value == selected)
        var index = items.indexOf(item)
        var type = Object.values(LiftType)[index] as LiftType

        const def: LiftDef = {
            id: "",
            name: name,
            type: type
        }
        
        await LiftDefRepository.insert(def)
        route.params.onChanged()
        navigation.goBack()
    }

    return <View>
        <View>
            <Text>Name:</Text>
            <TextInput onChangeText={setName}></TextInput>
        </View>

        <View>
            <Text>Type:</Text>

            <DropDownPicker
                items={items}
                open={open}
                value={selected}
                setOpen={setOpen}
                setValue={setSelected}
            />
        </View>

        <Button title='Save' onPress={onSave}></Button>

    </View>
}