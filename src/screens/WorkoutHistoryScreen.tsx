import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import {RootStackParamList} from '../App';
import {Lift, Workout} from '../types/workout';
import WorkoutRepository from '../repository/WorkoutRepository';
import WorkoutHistoryRepository from '../repository/WorkoutHistoryRepository';
import LiftHistoryRepository from '../repository/LiftHistoryRepository';
import {LiftDef, PersistedSet} from '../types/types';
import Utils from '../components/Utils';
import LiftDefRepository from '../repository/LiftDefRepository';
import {SystemLifts} from '../repository/LiftDatabase';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';

type Props = StackScreenProps<RootStackParamList, 'WorkoutHistory'>;

const Tab = createMaterialTopTabNavigator();

type LiftHistoryEntry = {
  timestamp: Date;
  liftId: string;
  sets: PersistedSet[];
};

type LiftEntry = {
  liftId: string;
  name: string;
  sets: PersistedSet[];
};

type WorkoutEntry = {
  timestamp: Date;
  lifts: LiftEntry[];
};

export function WorkoutHistoryScreen({route, navigation}: Props) {
  const workoutId = route.params.workoutId;
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);

  function loadState() {
    buildHistory().then(history => setEntries(history));
  }

  async function buildHistory(): Promise<WorkoutEntry[]> {
    var history = await WorkoutHistoryRepository.get(workoutId);

    // Lookup history for each lift and add it to history of this workout
    var liftIds = Array.from(
      new Set(history.map(item => item.liftIds).flat(1)),
    );
    var allLifts: LiftHistoryEntry[] = [];

    for (var i = 0; i < liftIds.length; i++) {
      var liftHistory = await (
        await LiftHistoryRepository.get(liftIds[i])
      ).filter(lift => lift.workoutId == workoutId);

      liftHistory.forEach(hist => {
        var entry: LiftHistoryEntry = {
          timestamp: hist.timestamp,
          liftId: liftIds[i],
          sets: hist.sets,
        };
        allLifts.push(entry);
      });
    }

    // Build list of workouts from timestamp
    var result: WorkoutEntry[] = history.map(hist => {
      var lifts: LiftEntry[] = hist.liftIds.map(id => {
        var match = allLifts.find(
          x =>
            x.liftId == id && x.timestamp.getTime() == hist.timestamp.getTime(),
        );

        return {
          liftId: id,
          sets: match != undefined ? match.sets : [],
          name: defs.get(id)!.name,
        };
      });

      return {
        timestamp: hist.timestamp,
        lifts: lifts,
      };
    });

    result.forEach(x => {
      console.log(x.timestamp);
      x.lifts.forEach(lift => {
        console.log('  ' + lift.liftId);
        lift.sets.forEach(set =>
          console.log('    ' + set.weight + ' x ' + set.reps),
        );
      });
    });

    result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return result;
  }

  useEffect(loadState, []);

  const renderItem = (item: ListRenderItemInfo<WorkoutEntry>) => (
    <WorkoutHistoryListItem entry={item.item}></WorkoutHistoryListItem>
  );

  return (
    <FlatList
      style={{backgroundColor: colors.background}}
      data={entries}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}></FlatList>
  );
}

function WorkoutHistoryListItem(props: {entry: WorkoutEntry}) {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.card, margin: 4, padding: 4}}>
      <Text>{Utils.lastCompleted(props.entry.timestamp)}</Text>
      {props.entry.lifts.map((lift, index) => {
        return (
          <View style={{paddingTop: 4}} key={index.toString()}>
            <Text style={{fontWeight: 'bold'}}>{lift.name}</Text>
            {lift.sets.map(set => {
              return (
                <Text>
                  {set.weight + ' x ' + set.reps + (set.warmup ? ' (W)' : '')}
                </Text>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
