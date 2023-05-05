import React, {useEffect, useState} from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import { Button, Text, View } from "react-native";
import { RootStackParamList } from "../../App";


type Props = StackScreenProps<RootStackParamList, 'LiftDefList'>;


export function LiftDefListScreen({route, navigation}: Props) {

    function onRefresh() {

        console.log("refresh...")
    }

    function onEdit() {
        navigation.navigate('LiftDefEdit', { onChanged: onRefresh});
      }




    return <View>
        <Text>List Screen</Text>
        <Button title='Edit' onPress={() => onEdit()}></Button>
    </View>
}