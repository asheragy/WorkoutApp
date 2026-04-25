import React from 'react';
import { Button, Image, Text, TextInput, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Lift, LiftSet } from '../../types/workout';
import { Style_LiftText } from '../Common';
import { GlobalSettings } from '../../types/types';
import Utils from '../Utils';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { PersistedSetRow } from './PersistedSetRow';
import { PersistedSetHeader } from './PersistedSetHeader';

interface EditableLiftItemProps {
  lift: Lift;
  onChange: (lift: Lift) => void;
  onDelete?: () => void;
  mode: 'workout_edit' | 'lift_edit';
  showPlates?: boolean;
}

export default function EditableLiftItem(props: EditableLiftItemProps) {
  const { colors } = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const def = defs[props.lift.id];
  const labels = Utils.normalizeSets(props.lift.sets, def).map(
    set => set.label,
  );
  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  function onNoteChange(note: string) {
    props.onChange({ ...props.lift, note: note.length > 0 ? note : undefined });
  }

  function onToggleAlt() {
    props.onChange({
      ...props.lift,
      alternate: props.lift.alternate ? undefined : true,
    });
  }

  function getUpdatedLift() {
    return {
      ...props.lift,
      sets: [...props.lift.sets],
      goals: props.lift.goals ? [...props.lift.goals] : undefined,
    };
  }

  function addSet() {
    let set: LiftSet = { weight: 0, reps: 0 };
    if (props.lift.sets.length > 0) {
      set = { ...props.lift.sets[props.lift.sets.length - 1] };
      set.warmup = undefined; // Off by default
      set.completed = undefined;
    }

    const updatedLift = getUpdatedLift();
    updatedLift.sets = [...props.lift.sets, set];

    props.onChange(updatedLift);
  }

  function addGoal() {
    let goal: LiftSet = { weight: 0, reps: 0 };
    if (props.lift.goals && props.lift.goals?.length > 0)
      goal = { ...props.lift.goals[props.lift.goals.length - 1] };
    else if (props.lift.sets.length > 0) {
      goal = { ...props.lift.sets[props.lift.sets.length - 1] };
      // Clears all other fields
      goal = {
        weight: goal.weight,
        reps: goal.reps,
      };
    }

    const updatedLift = getUpdatedLift();
    if (props.lift.goals) updatedLift.goals = [...props.lift.goals, goal];
    else updatedLift.goals = [goal];

    props.onChange(updatedLift);
  }

  function onRemoveGoal(index: number) {
    const updatedLift = getUpdatedLift();
    updatedLift.goals!!.splice(index, 1);

    props.onChange(updatedLift);
  }

  function onRemoveSet(index: number) {
    const updatedLift = getUpdatedLift();
    updatedLift.sets.splice(index, 1);

    props.onChange(updatedLift);
  }

  function onSetChange(setIndex: number, updatedSet: LiftSet) {
    const updatedLift = getUpdatedLift();
    updatedLift.sets[setIndex] = updatedSet;
    props.onChange(updatedLift);
  }

  function onGoalChange(index: number, updated: LiftSet) {
    const updatedLift = getUpdatedLift();
    updatedLift.goals!![index] = updated;
    props.onChange(updatedLift);
  }

  const goalPercent = Utils.goalPercent(def, props.lift);

  return (
    <View style={{ margin: 4 }}>
      {props.onDelete && (
        <View
          style={{
            marginVertical: 4,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ width: '20%' }}></View>
          <Text style={[Style_LiftText, { color: colors.text, width: '60%' }]}>
            {Utils.defToString(def) + (props.lift.alternate ? ' / Alt' : '')}
          </Text>
          <View
            style={{
              width: '20%',
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Menu>
              <MenuTrigger
                customStyles={{
                  triggerWrapper: {
                    top: 0,
                  },
                }}
              >
                <Image source={require('../../icons/more.png')}></Image>
              </MenuTrigger>
              <MenuOptions
                customStyles={{ optionsContainer: {} }}
                optionsContainerStyle={{ backgroundColor: colors.border }}
              >
                <MenuOption
                  customStyles={{
                    optionText: { color: colors.notification, fontSize: 16 },
                  }}
                  onSelect={() => props.onDelete?.()}
                  text="Delete"
                />
                <MenuOption
                  customStyles={{
                    optionText: { color: colors.notification, fontSize: 16 },
                  }}
                  onSelect={onToggleAlt}
                  text="Alternate"
                />
              </MenuOptions>
            </Menu>
          </View>
        </View>
      )}

      {props.mode === 'workout_edit' && (
        <>
          <Text style={{ color: colors.text, textAlign: 'center' }}>
            {'Sets: ' +
              props.lift.sets.length +
              ' Goals: ' +
              props.lift.goals?.length}
          </Text>
          <TextInput
            placeholder={'Note'}
            onChangeText={onNoteChange}
            style={{ color: colors.text }}
          >
            {props.lift.note}
          </TextInput>
        </>
      )}
      {props.mode === 'lift_edit' && props.lift.note != undefined && (
        <Text style={{ paddingVertical: 8, color: colors.text }}>
          {props.lift.note}
        </Text>
      )}

      {props.mode === 'lift_edit' && (
        <>
          <PersistedSetHeader></PersistedSetHeader>
          {props.lift.sets.map((set, index) => (
            <PersistedSetRow
              set={set}
              label={labels[index]}
              settings={settings}
              def={def}
              key={index}
              showPlates={props.showPlates}
              showCompleteCheckbox={true}
              onDelete={() => onRemoveSet(index)}
              onChange={set => onSetChange(index, set)}
            ></PersistedSetRow>
          ))}
          <View
            style={{
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button title="Add Set" onPress={addSet}></Button>
          </View>
          {goalPercent && (
            <Text style={{ color: colors.text, textAlign: 'center' }}>
              {(goalPercent * 100).toFixed(2) + '%'}
            </Text>
          )}
          {props.lift.goals?.map((set, index) => (
            <PersistedSetRow
              set={set}
              label=""
              settings={settings}
              def={def}
              key={index}
              showPlates={props.showPlates}
              showCompleteCheckbox={false}
              onDelete={() => onRemoveGoal(index)}
              onChange={set => onGoalChange(index, set)}
            ></PersistedSetRow>
          ))}
          <View
            style={{
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button title="Add Goal" onPress={addGoal}></Button>
          </View>
        </>
      )}
    </View>
  );
}
