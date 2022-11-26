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
  value?: number;
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
    // Fix floating point issues by rounding to digits
    var strValue = value.toFixed(digits);
    props.onChange(parseFloat(strValue));
  }

  var currValue = props.value || 0;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        style={styles.counterButtonContainer}
        onPress={() => setValue(currValue - props.decrementBy())}>
        <Text style={styles.counterButtonText}>-</Text>
      </TouchableOpacity>

      <TextInput
        style={{color: colors.text, paddingVertical: 0, textAlign: 'center'}}
        onChangeText={onInput}>
        {props.value}
      </TextInput>
      <TouchableOpacity
        style={styles.counterButtonContainer}
        onPress={() => setValue(currValue + props.incrementBy())}>
        <Text style={styles.counterButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
