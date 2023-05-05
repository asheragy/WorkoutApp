import React, {useEffect, useState} from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import { Button, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../App";
import DropDownPicker from 'react-native-dropdown-picker';
import { LiftDef, LiftType } from '../../types/types';
import LiftDefRepository from '../../data/LiftDefRepository';
import { lifts } from '../../data/LiftDatabase';


type Props = StackScreenProps<RootStackParamList, 'LiftDefEdit'>;


export function LiftDefEditScreen({route, navigation}: Props) {
    const items = Object.values(LiftType)
        .filter(value => typeof value !== 'number')
        .map(value => {
            const result = {label: value.toString(), value: LiftType[value]}
            return result
            })

    const [def, setDef] = useState(route.params.def == undefined ? {
        id: "",
        name: "",
        type: LiftType.Machine
    } : route.params.def)

    console.log(def)

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(def.type)

    async function onSave() {
        def.type = selected

        await LiftDefRepository.upsert(def)
        route.params.onChanged()
        navigation.goBack()
    }

    return <View>
        <View>
            <Text>Name:</Text>
            <TextInput onChangeText={newName => setDef(prevState => ({
                ...prevState,
                name: newName
            }))}>{def.name}</TextInput>
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