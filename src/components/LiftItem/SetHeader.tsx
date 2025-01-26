import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

export default function SetHeader(props: {showPlateCount: boolean}) {
  const {colors} = useTheme();
  const weightWidth = props.showPlateCount ? '30%' : '60%';

  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Set
      </Text>
      <Text
        style={[styles.liftHeader, {width: weightWidth, color: colors.text}]}>
        Weight
      </Text>
      {props.showPlateCount && (
        <Text
          style={[
            styles.liftHeader,
            {width: '30%', color: colors.text},
          ]}></Text>
      )}
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Reps
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  liftHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
