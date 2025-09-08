import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useTheme} from '@react-navigation/native';
import {Dataset} from 'react-native-chart-kit/dist/HelperTypes';

export function ProgressChart(props: {
  title?: string;
  dates: Date[];
  values: number[] | number[][];
  legend?: string[];
}) {
  if (props.dates.length == 0) return <View></View>;

  const datasets: Dataset[] = Array.isArray(props.values[0])
    ? (props.values as number[][]).map(x => ({data: x}))
    : [{data: props.values as number[]}];

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
          legend: props.legend,
          datasets: datasets,
        }}
        width={Dimensions.get('window').width} // from react-native
        height={Dimensions.get('window').height / 3}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
