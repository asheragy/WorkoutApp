import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Modal, View, Text, Button, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import GoalRepository from '../../repository/GoalRepository';
import {GlobalSettings, PersistedSet} from '../../types/types';
import Utils from '../Utils';
import {Style_LiftText} from './Common';
import {SetHeader, PersistedSetRow, GoalSetRow} from './SetRows';
import {Lift, LiftSet} from '../../types/workout';

export default function LiftEditorModal(props: {
  editing: boolean;
  lift: Lift;
  onFinish: () => void;
  onViewLog: () => void;
  onSetsChanged: (sets: LiftSet[]) => void;
}) {
  const {colors} = useTheme();
  const [goals, setGoals] = useState<PersistedSet[]>([]);

  const settings: GlobalSettings = useSelector((store: any) => store.settings);
  const labels = Utils.normalizeSets(props.lift.sets).map(set => set.label);

  useEffect(() => {
    GoalRepository.getGoal(props.lift.def.id).then(result => setGoals(result));
  }, []);

  function onSetChange(index: number, updatedSet: LiftSet) {
    //console.log('onSetChange index=' + index);
    var updatedSets: LiftSet[] = props.lift.sets;

    updatedSets[index] = updatedSet;

    props.onSetsChanged(updatedSets);
  }

  function onSetRemove() {
    var sets = props.lift.sets;
    props.onSetsChanged(sets.slice(0, sets.length - 1));
  }

  function onSetAdd() {
    var sets = props.lift.sets;
    var addedSet: LiftSet =
      sets.length > 0
        ? sets[sets.length - 1]
        : {
            weight: 0,
            reps: 0,
          };

    props.onSetsChanged(sets.concat(addedSet));
  }

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
          justifyContent: 'flex-start',
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
              label={labels[index]}
              settings={settings}
              liftType={props.lift.def.type}
              key={index}
              onChange={onSetChange}></PersistedSetRow>
          ))}

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button
                disabled={goals.length == 0}
                title="Remove Set"
                onPress={() => onSetRemove()}></Button>
            </View>

            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button title="Add Set" onPress={() => onSetAdd()}></Button>
            </View>
          </View>

          {goals.length > 0 && (
            <Text
              style={[styles.liftText, {color: colors.text, marginBottom: 8}]}>
              {'Goals ' +
                Utils.goalPercentage(props.lift.def, goals, props.lift.sets) +
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

const styles = StyleSheet.create({
  liftText: Style_LiftText,
});
