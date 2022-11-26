import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Modal, View, Text, Button, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import GoalRepository from '../../data/GoalRepository';
import {
  Lift,
  GlobalSettings,
  LiftSet,
  PersistedSet,
  LiftDef,
} from '../../types/types';
import Utils from '../Utils';
import {Style_LiftText} from './Common';
import {SetHeader, PersistedSetRow, GoalSetRow} from './SetRows';

export default function LiftEditorModal(props: {
  editing: boolean;
  lift: Lift;
  onFinish: () => void;
  onViewLog: () => void;
  onSetChange: (index: number, updatedSet: LiftSet) => void;
}) {
  const {colors} = useTheme();
  const [goals, setGoals] = useState<PersistedSet[]>([]);

  console.log(props.lift);
  const settings: GlobalSettings = useSelector((store: any) => store.settings);
  const warmups = props.lift.sets.filter(x => x.warmup == true).length;

  useEffect(() => {
    GoalRepository.getGoal(props.lift.def.id).then(result => setGoals(result));
  }, []);

  function addGoal() {
    // Default to last goal OR last item in lifts
    var newGoal: PersistedSet;
    if (goals.length > 0) newGoal = goals[goals.length - 1];
    else {
      var lastLift = props.lift.sets[props.lift.sets.length - 1];
      newGoal = {
        weight: lastLift.weight || 0,
        reps: lastLift.reps || 0,
      };
    }

    setGoals([
      ...goals,
      {
        weight: newGoal.weight,
        reps: newGoal.reps,
      },
    ]);
  }

  function removeGoal() {
    setGoals(prev => prev.slice(0, -1));
  }

  function onGoalChanged(index: number, updatedSet: PersistedSet) {
    console.log('onChanged');
    var updatedGoals = [...goals];
    updatedGoals[index] = updatedSet;

    setGoals(updatedGoals);
  }

  async function onDone() {
    await GoalRepository.saveGoal(props.lift.def, goals);
    props.onFinish();
  }

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
              warmupOffset={warmups}
              settings={settings}
              liftType={props.lift.def.type}
              key={index}
              onChange={props.onSetChange}></PersistedSetRow>
          ))}

          {goals.length > 0 && (
            <Text
              style={[styles.liftText, {color: colors.text, marginBottom: 8}]}>
              {'Goals ' +
                goalPercentage(props.lift.def, goals, props.lift.sets) +
                '%'}
            </Text>
          )}
          {goals.length > 0 && <SetHeader></SetHeader>}

          {goals.map((set, index) => (
            <GoalSetRow
              index={index}
              set={set}
              settings={settings}
              liftType={props.lift.def.type}
              key={index}
              onChange={onGoalChanged}></GoalSetRow>
          ))}

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button
                disabled={goals.length == 0}
                title="Remove Goal"
                onPress={() => removeGoal()}></Button>
            </View>

            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button title="Add Goal" onPress={() => addGoal()}></Button>
            </View>
          </View>

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
              <Button title="Done" onPress={onDone}></Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function goalPercentage(
  def: LiftDef,
  goals: PersistedSet[],
  current: LiftSet[],
): string {
  // Sort with highest first
  var goal1rm = goals
    .map(set => Utils.calculate1RM(def, set))
    .sort((a, b) => b - a);
  var current1rm = current
    .filter(set => set.warmup != true)
    .map(set => Utils.calculate1RM(def, set))
    .sort((a, b) => b - a);

  const size = Math.min(goal1rm.length, current1rm.length);
  var sum = 0;
  for (var i = 0; i < size; i++) {
    sum += current1rm[i] / goal1rm[i];
  }

  return ((100 * sum) / size).toFixed(1);
}

const styles = StyleSheet.create({
  liftText: Style_LiftText,
});
