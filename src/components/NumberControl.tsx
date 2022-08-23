import {useTheme} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function NumberControl(props: {
  value: number;
  precision?: number;
  decrementBy: () => number;
  incrementBy: () => number;
  onChange: (newValue: number) => void;
}) {
  const {colors} = useTheme();
  const digits = props.precision ?? 1;

  function onInput(input: string) {
    var numInput: number = parseFloat(input);
    if (!isNaN(numInput)) {
      setValue(numInput);
    }
  }

  function setValue(value: number) {
    // Correct to number of digits
    var strValue = value.toFixed(digits);
    props.onChange(parseFloat(strValue));
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        style={styles.counterButtonContainer}
        onPress={() => setValue(props.value - props.decrementBy())}>
        <Text style={styles.counterButtonText}>-</Text>
      </TouchableOpacity>

      <TextInput style={{color: colors.text}} onChangeText={onInput}>
        {props.value}
      </TextInput>
      <TouchableOpacity
        style={styles.counterButtonContainer}
        onPress={() => setValue(props.value + props.incrementBy())}>
        <Text style={styles.counterButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {},
  counterButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    margin: 1,
    height: 30,
    alignSelf: 'center',
  },
  counterButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  entryRow: {
    flexDirection: 'row',
  },
});
