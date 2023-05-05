import React, {useEffect, useState} from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import { Button, FlatList, ListRenderItemInfo, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../App";
import { LiftDef, LiftType } from '../../types/types';
import LiftDefRepository from '../../data/LiftDefRepository';
import { useTheme } from '@react-navigation/native';


type Props = StackScreenProps<RootStackParamList, 'LiftDefList'>;


export function LiftDefListScreen({route, navigation}: Props) {

    const [lifts, setLifts] = useState<LiftDef[]>([])

    function onRefresh() {
        console.log("loading")
        LiftDefRepository.getAll().then(lifts => setLifts(lifts))
    }

    function onAdd() {
        navigation.navigate('LiftDefEdit', { onChanged: onRefresh});
      }

      function onEdit(def: LiftDef) {
        navigation.navigate('LiftDefEdit', { onChanged: onRefresh, def: def});
      }

    useEffect(onRefresh, []);

    const renderItem = (item: ListRenderItemInfo<LiftDef>) => (
        <TouchableOpacity onPress={() => onEdit(item.item)}>
          <DefListItem def={item.item}></DefListItem>
        </TouchableOpacity>
      );


    return <View>
    <FlatList
      data={lifts}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}></FlatList>
      
        <Button title='Add' onPress={() => onAdd()}></Button>
    </View>
}


interface DefItemProps {
    def: LiftDef;
  }
  
function DefListItem(props: DefItemProps) {
    const {colors} = useTheme();


    return (<View>
        <Text>{props.def.name + " (" + LiftType[props.def.type] + ")"}</Text>
    </View>)

}