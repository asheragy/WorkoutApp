import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {AccessoryView} from './Accessories';
import {LogBox} from 'react-native';
import {Lift, PersistedLift, PersistedSet, NormalizedSet} from '../types/types';
import {Workout} from '../data/Repository';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '@react-navigation/native';
import {Modal} from 'react-native';
import Utils from './Utils';
import LiftRepository from '../data/LiftRepository';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

export function WorkoutScreen({route, navigation}: Props) {
  console.log(route.params);
  console.log('workout = ' + route.params.workout);
  const workout = route.params.workout;

  const onComplete = async (index: number) => {
    await LiftRepository.addAllHistory(workout.node);
    route.params.onComplete(index);
  };

  function onViewLog(lift: PersistedLift) {
    navigation.navigate('Lift', {lift: lift});
  }

  return (
    <ScrollView style={styles.container}>
      <WorkoutItem workout={workout} onViewLog={onViewLog}></WorkoutItem>
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

function WorkoutItem(props: {
  workout: Workout;
  onViewLog: (lift: PersistedLift) => void;
}) {
  const {colors} = useTheme();

  return (
    <View style={styles.workoutItem}>
      {props.workout.node.lifts.map((lift, index) => (
        <LiftItem
          lift={lift}
          onViewLog={props.onViewLog}
          key={index}></LiftItem>
      ))}
    </View>
  );
}

function LiftItem(props: {
  lift: Lift | PersistedLift;
  onViewLog: (lift: PersistedLift) => void;
}) {
  const showHeader = props.lift.sets != undefined;
  const persisted = 'key' in props.lift;
  const [lift, setLift] = useState<Lift | PersistedLift>(props.lift);
  const [editing, setEditing] = useState(false);
  const {colors} = useTheme();

  const onSetChange = (index: number, set: PersistedSet) => {
    var updatedLift = {...(lift as PersistedLift)};
    updatedLift.sets[index] = set;
    setLift(updatedLift);
    LiftRepository.saveLift(updatedLift);
  };

  if (persisted) {
    useEffect(() => {
      LiftRepository.getLift((lift as PersistedLift).key).then(result => {
        if (result != null) {
          result.step = (lift as PersistedLift).step;
          setLift(result);
        }
      });
    }, []);
  }

  return (
    <View style={{marginVertical: 0}}>
      <View
        style={{
          marginVertical: 8,
          flexDirection: 'row',
        }}>
        <Text style={{width: '20%'}}></Text>
        <Text style={[styles.liftText, {color: colors.text, width: '60%'}]}>
          {props.lift.name}
        </Text>
        <View
          style={{
            width: '20%',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          {persisted && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Image style={{}} source={require('../icons/edit.png')} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showHeader && <SetHeader></SetHeader>}
      <View>
        {Utils.normalizeSets(lift.sets).map((set, index) => (
          <SetItem number={index + 1} set={set} key={index}></SetItem>
        ))}
      </View>
      {persisted && (
        <View>
          <LiftEditorModal
            editing={editing}
            lift={lift as PersistedLift}
            onSetChange={onSetChange}
            onViewLog={() => props.onViewLog(lift as PersistedLift)}
            onFinish={() => setEditing(false)}></LiftEditorModal>
        </View>
      )}
    </View>
  );
}

function LiftEditorModal(props: {
  editing: boolean;
  lift: PersistedLift;
  onFinish: () => void;
  onViewLog: () => void;
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
          <Text
            style={[styles.liftText, {color: colors.text, marginBottom: 8}]}>
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

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button
                title="Log"
                onPress={() => {
                  props.onFinish(); // TODO temp to workaround broken button issue after using
                  props.onViewLog();
                }}></Button>
            </View>

            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button title="Done" onPress={() => props.onFinish()}></Button>
            </View>
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
  //console.log(props.set.weight + ' ' + stepSize);

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
