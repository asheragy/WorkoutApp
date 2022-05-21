import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../App";


type Props = StackScreenProps<RootStackParamList, 'Weight'>;

export function WeightScreen({ route, navigation }: Props) {

    const [current, setCurrent] = useState<number>(1800);

    return <View>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
        }}>
            <TouchableOpacity
                style={styles.counterButtonContainer}
                onPress={() => setCurrent(current - 2)
                }>
                <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>

            <TextInput style={styles.inputText}>{current / 10}</TextInput>
            <TouchableOpacity
                style={styles.counterButtonContainer}
                onPress={() => setCurrent(current + 2)
                }>
                <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
        </View>

        <Button
            title="Add"
            onPress={() => console.log("TODO")}>
            Text
        </Button>


    </View>

}


const styles = StyleSheet.create({
    addButton: {

    },
    inputText: {
        color: '#000',
    },
    counterButtonContainer: {
        elevation: 8,
        backgroundColor: '#009688',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 8,
        margin: 1,
    },
    counterButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
