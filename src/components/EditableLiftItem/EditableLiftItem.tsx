import React from 'react';
import { Button, Image, Text, TextInput, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Lift, LiftSet } from '../../core/types/workout';
import { Style_LiftText } from '../Common';
import { GlobalSettings } from '../../core/types/types';
import { displayName } from '../../core/LiftDatabase.ts';
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
import SetUtils from '../../core/utils/SetUtils.ts';
import LiftUtils from '../../core/utils/LiftUtils.ts';

interface EditableLiftItemProps {
  lift: Lift;
  onChange: (lift: Lift) => void;
  onDelete?: () => void;
  onGroup?: () => void;
  mode: 'workout_edit' | 'lift_edit';
  showPlates?: boolean;
  inGroup?: boolean;
}

export default function EditableLiftItem(props: EditableLiftItemProps) {
  const { colors } = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const def = defs[props.lift.id];
  const labels = SetUtils.normalizeSets(props.lift.sets, def).map(
    set => set.label,
  );
  const settings: GlobalSettings = useSelector(
    (store: AppState) => store.settings,
  );

  function onNoteChange(note: string) {
    props.onChange({ ...props.lift, note: note.length > 0 ? note : undefined });
  }

  function getUpdatedLift() {
    return {
      ...props.lift,
      sets: [...props.lift.sets],
      goals: props.lift.goals ? [...props.lift.goals] : undefined,
      goals2: props.lift.goals2 ? [...props.lift.goals2] : undefined,
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

  function addGoal(primary: boolean) {
    let goal: LiftSet = { weight: 0, reps: 0 };
    if (primary && props.lift.goals && props.lift.goals?.length > 0)
      goal = { ...props.lift.goals[props.lift.goals.length - 1] };
    else if (!primary && props.lift.goals2 && props.lift.goals2?.length > 0)
      goal = { ...props.lift.goals2[props.lift.goals2.length - 1] };
    else if (props.lift.sets.length > 0) {
      goal = { ...props.lift.sets[props.lift.sets.length - 1] };
      // Clears all other fields
      goal = {
        weight: goal.weight,
        reps: goal.reps,
      };
    }

    const updatedLift = getUpdatedLift();
    if (primary) {
      if (props.lift.goals) updatedLift.goals = [...props.lift.goals, goal];
      else updatedLift.goals = [goal];
    } else {
      if (props.lift.goals2) updatedLift.goals2 = [...props.lift.goals2, goal];
      else updatedLift.goals2 = [goal];
    }

    props.onChange(updatedLift);
  }

  function onRemoveGoal(primary: boolean, index: number) {
    const updatedLift = getUpdatedLift();

    if (primary) updatedLift.goals!.splice(index, 1);
    else updatedLift.goals2!.splice(index, 1);

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

  function onGoalChange(primary: boolean, index: number, updated: LiftSet) {
    const updatedLift = getUpdatedLift();

    if (primary) updatedLift.goals![index] = updated;
    else updatedLift.goals2![index] = updated;
    props.onChange(updatedLift);
  }

  const goalPercent = LiftUtils.goalPercent(settings, def, props.lift);
  const goal2Percent = LiftUtils.goal2Percent(settings, def, props.lift);

  const setMaxes = props.lift.sets
    .filter(x => !x.warmup)
    .map(x => SetUtils.calculate1RM(settings, def, x));
  const top1RM = setMaxes.length > 0 ? Math.max(...setMaxes) : undefined;

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
            {displayName(defs, props.lift.id)}
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
                {props.inGroup && (
                  <MenuOption
                    customStyles={{
                      optionText: { color: colors.notification, fontSize: 16 },
                    }}
                    onSelect={() => props.onGroup?.()}
                    text="Remove"
                  />
                )}
                {!props.inGroup && (
                  <MenuOption
                    customStyles={{
                      optionText: { color: colors.notification, fontSize: 16 },
                    }}
                    onSelect={() => props.onDelete?.()}
                    text="Delete"
                  />
                )}
                {!props.inGroup && (
                  <MenuOption
                    customStyles={{
                      optionText: { color: colors.notification, fontSize: 16 },
                    }}
                    onSelect={() => props.onGroup?.()}
                    text="Group"
                  />
                )}
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
              ((props.lift.goals?.length ?? 0) +
                (props.lift.goals2?.length ?? 0))}
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
              top1RM={top1RM}
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
              onDelete={() => onRemoveGoal(true, index)}
              onChange={set => onGoalChange(true, index, set)}
            ></PersistedSetRow>
          ))}
          <View
            style={{
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button title="Add Goal" onPress={() => addGoal(true)}></Button>
          </View>

          {goal2Percent && (
            <Text style={{ color: colors.text, textAlign: 'center' }}>
              {(goal2Percent * 100).toFixed(2) + '%'}
            </Text>
          )}
          {props.lift.goals2?.map((set, index) => (
            <PersistedSetRow
              set={set}
              label=""
              settings={settings}
              def={def}
              key={index}
              showPlates={props.showPlates}
              showCompleteCheckbox={false}
              onDelete={() => onRemoveGoal(false, index)}
              onChange={set => onGoalChange(false, index, set)}
            ></PersistedSetRow>
          ))}
          <View
            style={{
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button title="Add Goal2" onPress={() => addGoal(false)}></Button>
          </View>
        </>
      )}
    </View>
  );
}
