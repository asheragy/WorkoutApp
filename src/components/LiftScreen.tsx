import {useLinkProps, useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {RootStackParamList} from '../App';
import LiftRepository from '../data/LiftRepository';
import {PersistedLift, PersistedLiftHistory} from '../types/types';

type Props = StackScreenProps<RootStackParamList, 'Lift'>;

export function LiftScreen({route, navigation}: Props) {
  const [entries, setEntries] = useState<PersistedLiftHistory[]>([]);
  const {colors} = useTheme();

  function loadState() {
    LiftRepository.getHistory(route.params.lift.key).then(result => {
      setEntries(result);
    });
  }

  useEffect(loadState, []);

  var dates = entries.map(x => x.date);
  var values = entries.map(x => calculateEstimated1RM(x.lift));

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TestChart dates={dates} values={values}></TestChart>
    </View>
  );
}

function calculateEstimated1RM(lift: PersistedLift): number {
  var sum = 0;
  for (var i = 0; i < lift.sets.length; i++) {
    var set = lift.sets[i];
    sum += set.weight + set.weight * 0.0333 * set.reps;
  }

  return Math.round(sum / lift.sets.length);
}

function TestChart(props: {dates: Date[]; values: number[]}) {
  if (props.dates.length == 0) return <View></View>;

  // https://www.npmjs.com/package/react-native-chart-kit
  return (
    <View>
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
        height={220}
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

const styles = StyleSheet.create({
  entryRow: {
    flexDirection: 'row',
  },
});
