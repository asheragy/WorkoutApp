import React, {Fragment, useEffect, useState} from 'react';
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {AccessoryView} from './Accessories';
import {LogBox} from 'react-native';
import {
  Lift,
  LiftSet,
  PersistedLift,
  PersistedSet,
  AccessoryGroup,
  NormalizedSet,
} from '../types/types';
import Repository, {Workout} from '../data/Repository';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '@react-navigation/native';
import {Modal} from 'react-native';
import Utils from './Utils';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

type SavedData = {
  index: number;
  date: Date;
};

export function WorkoutScreen({route, navigation}: Props) {
  console.log(route.params);
  console.log('workout = ' + route.params.workout);
  const workout = route.params.workout;

  const onComplete = async (index: number) => {
    //console.log('onComplete ' + index);
    route.params.onComplete(index);
  };

  return (
    <ScrollView style={styles.container}>
      <WorkoutItem workout={workout}></WorkoutItem>
      {workout.node.accessories != null && (
        <AccessoryView accessories={workout.node.accessories}></AccessoryView>
      )}
      <View style={styles.bottom}>
        <Button
          title="Complete"
          onPress={() => onComplete(route.params.workout.position)}></Button>
      </View>
    </ScrollView>
  );
}

function WorkoutItem(props: {workout: Workout}) {
  const {colors} = useTheme();

  return (
    <View style={styles.workoutItem}>
      <Text style={[styles.titleText, {color: colors.text}]}>
        {props.workout.node?.name}
      </Text>
      {props.workout.node.lifts.map((lift, index) => (
        <LiftItem lift={lift} key={index}></LiftItem>
      ))}
    </View>
  );
}

function LiftItem(props: {lift: Lift | PersistedLift}) {
  const showHeader = props.lift.sets != undefined;
  const persisted = 'id' in props.lift;
  const [lift, setLift] = useState<Lift | PersistedLift>(props.lift);
  const {colors} = useTheme();

  const onLiftUpdated = (lift: PersistedLift) => {
    setLift(lift);
  };

  return (
    <View style={{marginVertical: 4}}>
      <Text style={[styles.liftText, {color: colors.text}]}>
        {props.lift.name}
      </Text>
      {showHeader && <SetHeader></SetHeader>}
      <View>
        {Utils.normalizeSets(lift.sets).map((set, index) => (
          <SetItem number={index + 1} set={set} key={index}></SetItem>
        ))}
      </View>
      {persisted && (
        <PersistedLiftItem
          updateLift={lift => onLiftUpdated(lift)}
          lift={lift as PersistedLift}></PersistedLiftItem>
      )}
    </View>
  );
}

function PersistedLiftItem(props: {
  lift: PersistedLift;
  updateLift: (lift: PersistedLift) => void;
}) {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    Repository.getLift(props.lift.id).then(result => {
      if (result != null) {
        result.step = props.lift.step;
        props.updateLift(result);
      }
    });
  }, []);

  const onSetChange = (index: number, set: PersistedSet) => {
    var updatedLift = {...props.lift};
    updatedLift.sets[index] = set;
    props.updateLift(updatedLift);
    Repository.saveLift(updatedLift);
  };

  return (
    <View>
      <LiftEditorModal
        editing={editing}
        lift={props.lift}
        onSetChange={onSetChange}
        onFinish={() => setEditing(false)}></LiftEditorModal>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Button title="Edit" onPress={() => setEditing(true)}></Button>
      </View>
    </View>
  );
}

// TODO move this and PersistedSetRow to another file
function LiftEditorModal(props: {
  editing: boolean;
  lift: PersistedLift;
  onFinish: () => void;
  onSetChange: (index: number, set: PersistedSet) => void;
}) {
  const {colors} = useTheme();

  return (
    <Modal visible={props.editing} transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.75)',
        }}>
        <View
          style={{
            margin: 10,
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 15,
            alignItems: 'center',

            elevation: 5,
          }}>
          <Text style={[styles.liftText, {color: colors.text}]}>
            {props.lift.name}
          </Text>
          <SetHeader></SetHeader>
          {props.lift.sets.map((set, index) => (
            <PersistedSetRow
              index={index}
              set={set}
              key={index}
              step={props.lift.step}
              onChange={props.onSetChange}></PersistedSetRow>
          ))}
          <View style={{marginTop: 10}}>
            <Button title="Done" onPress={() => props.onFinish()}></Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SetHeader() {
  const {colors} = useTheme();
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Set
      </Text>
      <Text style={[styles.liftHeader, {width: '60%', color: colors.text}]}>
        Weight
      </Text>
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Reps
      </Text>
    </View>
  );
}

function SetItem(props: {number: Number; set: NormalizedSet}) {
  const {colors} = useTheme();

  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{width: '20%', textAlign: 'center', color: colors.text}}>
        {props.number.toString()}
      </Text>
      <Text style={{width: '60%', textAlign: 'center', color: colors.text}}>
        {props.set.weight}
      </Text>
      <Text style={{width: '20%', textAlign: 'center', color: colors.text}}>
        {props.set.reps}
      </Text>
    </View>
  );
}

function PersistedSetRow(props: {
  index: number;
  set: PersistedSet;
  onChange: (index: number, set: PersistedSet) => void;
  step?: number;
}) {
  const {colors} = useTheme();
  const stepSize = props.step == undefined ? 5 : props.step;
  console.log(props.set.weight + ' ' + stepSize);

  return (
    <View style={{flexDirection: 'row', marginVertical: 4}}>
      <Text
        style={{
          width: '20%',
          textAlign: 'center',
          textAlignVertical: 'center',
          color: colors.text,
        }}>
        {props.index + 1}
      </Text>
      <View
        style={{
          width: '60%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={styles.counterButtonContainer}
          onPress={() =>
            props.onChange(props.index, {
              weight: props.set.weight - stepSize,
              reps: props.set.reps,
            })
          }>
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'right',
            textAlignVertical: 'center',
            marginRight: 4,
            color: colors.text,
          }}>
          {props.set.weight + 'lb'}
        </Text>
        <TouchableOpacity
          style={styles.counterButtonContainer}
          onPress={() =>
            props.onChange(props.index, {
              weight: props.set.weight + stepSize,
              reps: props.set.reps,
            })
          }>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={{width: '20%', flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.counterButtonContainer}
          onPress={() =>
            props.onChange(props.index, {
              weight: props.set.weight,
              reps: props.set.reps - 1,
            })
          }>
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            width: '40%',
            textAlignVertical: 'center',
            color: colors.text,
          }}>
          {props.set.reps}
        </Text>
        <TouchableOpacity
          style={styles.counterButtonContainer}
          onPress={() =>
            props.onChange(props.index, {
              weight: props.set.weight,
              reps: props.set.reps + 1,
            })
          }>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  titleText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  liftHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  liftText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  workoutItem: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    opacity: 0.8,
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
