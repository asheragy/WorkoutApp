import React, {useState} from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import { Button, FlatList, ListRenderItemInfo, Text, View } from "react-native";
import { RootStackParamList } from "../../App";
import { LiftDef, LiftType } from '../../types/types';
import { useTheme } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';


type Props = StackScreenProps<RootStackParamList, 'WorkoutEdit'>;


export function WorkoutEditScreen({route, navigation}: Props) {

    const [title, setTitle] = useState("Workout Title")
    const [lifts, setLifts] = useState<LiftDef[]>([])

    function onSave() {
        // TODO
    }

    function onSelectExercise() {
        navigation.navigate('LiftDefList', { onSelect: onExerciseAdded })
    }

    function onExerciseAdded(def: LiftDef) {
        setLifts(prevState => [...prevState, def])
    }

    const renderItem = (item: ListRenderItemInfo<LiftDef>) => (
        <DefListItem def={item.item}></DefListItem>
      );

    return (
    <View>
        <TextInput onChangeText={setTitle}>{title}</TextInput>
        <FlatList
            data={lifts}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}>
        </FlatList>
        <Button title='Add Exercise' onPress={() => onSelectExercise()}></Button>
        <Button title='Save' onPress={() => onSave()}></Button>
    </View>
    )

}

interface DefItemProps {
    def: LiftDef;
  }
  
function DefListItem(props: DefItemProps) {
    const {colors} = useTheme();


    return (<View style={{padding: 8}}>
        <Text>{props.def.name + " (" + LiftType[props.def.type] + ")"}</Text>
    </View>)

}