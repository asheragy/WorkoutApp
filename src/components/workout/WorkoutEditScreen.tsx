import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RootStackParamList} from '../../App';
import {GlobalSettings, LiftDef, LiftType} from '../../types/types';
import {useTheme} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {Style_LiftText} from './Common';
import {Lift, LiftSet, Workout} from '../../types/workout';
import {PersistedSetRow} from './SetRows';
import {useSelector} from 'react-redux';
import Utils from '../Utils';
import Log from '../../utils/Log';
import WorkoutRepository from '../../repository/WorkoutRepository';

type Props = StackScreenProps<RootStackParamList, 'WorkoutEdit'>;

export function WorkoutEditScreen({route, navigation}: Props) {
  const existing = route.params.workout;

  const [title, setTitle] = useState(
    existing ? existing.name : 'Workout Title',
  );
  const [lifts, setLifts] = useState<Lift[]>(existing ? existing.lifts : []);

  async function onSave() {
    const workout: Workout = {
      id: existing ? existing.id : undefined,
      name: title,
      lifts: lifts,
    };

    await WorkoutRepository.upsert(workout);
    route.params.onChanged();
    navigation.pop();
  }

  function onSelectExercise() {
    navigation.navigate('LiftDefList', {onSelect: onExerciseAdded});
  }

  function onExerciseAdded(def: LiftDef) {
    const lift: Lift = {
      def: def,
      sets: [],
    };
    setLifts(prevState => [...prevState, lift]);
  }

  function onSetsChanged(index: number, sets: LiftSet[]) {
    var updatedLifts = [...lifts];
    updatedLifts[index].sets = sets;
    setLifts(updatedLifts);
  }

  const renderItem = (item: ListRenderItemInfo<Lift>) => (
    <LiftItem
      lift={item.item}
      index={item.index}
      onChange={onSetsChanged}></LiftItem>
  );

  return (
    <View>
      <TextInput onChangeText={setTitle}>{title}</TextInput>
      <Text>
        {'Last Completed: ' +
          (existing?.lastCompleted
            ? existing?.lastCompleted.toLocaleDateString()
            : 'Never')}
      </Text>
      <FlatList
        data={lifts}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}></FlatList>
      <Button title="Add Exercise" onPress={() => onSelectExercise()}></Button>
      <Button title="Save" onPress={() => onSave()}></Button>
    </View>
  );
}

interface LiftItemProps {
  lift: Lift;
  index: number;
  onChange: (index: number, sets: LiftSet[]) => void;
}

function LiftItem(props: LiftItemProps) {
  const {colors} = useTheme();
  const [sets, setSets] = useState<LiftSet[]>(props.lift.sets);
  const settings: GlobalSettings = useSelector((store: any) => store.settings);
  const labels = Utils.normalizeSets(sets).map(set => set.label);

  function addSet() {
    var set: LiftSet = {weight: 0, reps: 0};

    props.onChange(props.index, [...sets, set]);
    setSets(prevState => [...prevState, set]);
  }

  function onSetChange(index: number, updatedSet: LiftSet) {
    var updatedSets: LiftSet[] = [...sets];
    updatedSets[index] = updatedSet;
    setSets(updatedSets);

    props.onChange(props.index, updatedSets);
  }

  return (
    <View style={{padding: 8}}>
      <Text style={[styles.liftText, {color: colors.text, marginBottom: 8}]}>
        {props.lift.def.name}
      </Text>
      {sets.map((set, index) => (
        <PersistedSetRow
          index={index}
          set={set}
          label={labels[index]}
          settings={settings}
          liftType={props.lift.def.type}
          key={index}
          onChange={onSetChange}></PersistedSetRow>
      ))}
      <Button title="Add Set" onPress={addSet}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  liftText: Style_LiftText,
});
