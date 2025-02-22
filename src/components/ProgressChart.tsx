import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useTheme} from '@react-navigation/native';

export function ProgressChart(props: {
  title: string;
  dates: Date[];
  values: number[];
}) {
  if (props.dates.length == 0) return <View></View>;

  const {colors} = useTheme();

  // https://www.npmjs.com/package/react-native-chart-kit
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: colors.text}}>{props.title}</Text>
      <LineChart
        data={{
          labels: props.dates.map(x => x.getMonth() + 1 + '/' + x.getDate()),
          datasets: [
            {
              data: props.values,
            },
          ],
        }}
        width={Dimensions.get('window').width} // from react-native
        height={Dimensions.get('window').height / 3}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 0,
          },
          propsForDots: {
            r: '2',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 0,
          borderRadius: 0,
          padding: 40,
          paddingRight: 40,
        }}
      />
    </View>
  );
}
