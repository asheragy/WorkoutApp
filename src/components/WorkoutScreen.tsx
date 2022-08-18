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
import {
  Lift,
  NormalizedSet,
  LiftType,
  LiftSet,
  GlobalSettings,
} from '../types/types';
import {Workout} from '../data/Repository';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '@react-navigation/native';
import {Modal} from 'react-native';
import Utils from './Utils';
import LiftRepository from '../data/LiftRepository';
import {lifts} from '../data/LiftDatabase';

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

  function onViewLog(lift: Lift) {
    navigation.navigate('Lift', {lift: lift});
  }

  return (
    <ScrollView style={styles.container}>
      <WorkoutItem
        workout={workout}
        settings={route.params.settings}
        onViewLog={onViewLog}></WorkoutItem>
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
  settings: GlobalSettings;
  onViewLog: (lift: Lift) => void;
}) {
  const {colors} = useTheme();

  return (
    <View style={styles.workoutItem}>
      {props.workout.node.lifts.map((lift, index) => (
        <LiftItem
          lift={lift}
          settings={props.settings}
          onViewLog={props.onViewLog}
          key={index}></LiftItem>
      ))}
    </View>
  );
}

function LiftItem(props: {
  lift: Lift;
  onViewLog: (lift: Lift) => void;
  settings: GlobalSettings;
}) {
  const showHeader = props.lift.sets.length > 0;
  const [lift, setLift] = useState<Lift>(props.lift);
  const [editing, setEditing] = useState(false);
  const {colors} = useTheme();

  const onSetChange = (index: number, weight: number, reps: number) => {
    // TODO temp logging
    console.log('onSetChange index=' + index);
    var updatedLift = {...lift};
    updatedLift.sets.forEach(x =>
      console.log('  ' + x.weight.value + ' x ' + x.reps.value),
    );

    var updatedSets = lift.sets.map((set, idx) => {
      if (index == idx) {
        set.reps.value = reps;
        set.weight.value = weight;
      }

      return set;
    });
    //updatedLift.sets[index].weight.value = weight;
    //updatedLift.sets[index].reps.value = reps;
    console.log('after value changes');
    updatedLift.sets.forEach(x =>
      console.log('  ' + x.weight.value + ' x ' + x.reps.value),
    );

    setLift(prevState => ({
      ...prevState,
      sets: updatedSets,
    }));

    LiftRepository.saveLift(updatedLift);
  };

  if (lift.persisted) {
    useEffect(() => {
      LiftRepository.getLift(lift.def.id).then(result => {
        if (result != null) {
          // TODO this loses the range
          lift.sets = Utils.persistedToSets(result);
          setLift(lift);
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
          {props.lift.def.name}
        </Text>
        <View
          style={{
            width: '20%',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          {lift.persisted && (
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
      {lift.persisted && (
        <View>
          <LiftEditorModal
            editing={editing}
            lift={lift}
            settings={props.settings}
            onSetChange={onSetChange}
            onViewLog={() => props.onViewLog(lift)}
            onFinish={() => setEditing(false)}></LiftEditorModal>
        </View>
      )}
    </View>
  );
}

function LiftEditorModal(props: {
  editing: boolean;
  lift: Lift;
  settings: GlobalSettings;
  onFinish: () => void;
  onViewLog: () => void;
  onSetChange: (index: number, weight: number, reps: number) => void;
}) {
  const {colors} = useTheme();
  const goal = props.lift.goal != undefined;
  console.log(props.lift);
  const type = props.lift.def.type;

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
            {props.lift.def.name}
          </Text>
          <SetHeader></SetHeader>
          {props.lift.sets.map((set, index) => (
            <PersistedSetRow
              index={index}
              set={set}
              settings={props.settings}
              liftType={props.lift.def.type}
              key={index}
              onChange={props.onSetChange}></PersistedSetRow>
          ))}

          {goal && (
            // TODO unsure if this should go here or the main workout screen
            <View style={{flexDirection: 'row', marginVertical: 8}}>
              <Text
                style={{width: '20%', color: colors.text, textAlign: 'center'}}>
                Goal
              </Text>
              <Text
                style={{width: '60%', color: colors.text, textAlign: 'center'}}>
                {props.lift.goal}
              </Text>
              <Text style={{width: '20%'}}></Text>
            </View>
          )}

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
  set: LiftSet;
  settings: GlobalSettings;
  liftType: LiftType;
  onChange: (index: number, weight: number, reps: number) => void;
}) {
  const {colors} = useTheme();

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
            props.onChange(
              props.index,
              Utils.decrementWeight(
                props.set.weight.value,
                props.liftType,
                props.settings,
              ),
              props.set.reps.value,
            )
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
          {props.set.weight.value + 'lb'}
        </Text>
        <TouchableOpacity
          style={styles.counterButtonContainer}
          onPress={() =>
            props.onChange(
              props.index,
              Utils.incrementWeight(
                props.set.weight.value,
                props.liftType,
                props.settings,
              ),
              props.set.reps.value,
            )
          }>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={{width: '20%', flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.counterButtonContainer}
          onPress={() =>
            props.onChange(
              props.index,
              props.set.weight.value,
              props.set.reps.value - 1,
            )
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
          {props.set.reps.value}
        </Text>
        <TouchableOpacity
          style={styles.counterButtonContainer}
          onPress={() =>
            props.onChange(
              props.index,
              props.set.weight.value,
              props.set.reps.value + 1,
            )
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
