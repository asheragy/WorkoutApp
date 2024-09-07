import React, {useRef} from 'react';
import {
  Alert,
  Animated,
  Button,
  DimensionValue,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Lift, LiftSet} from '../types/workout';
import {Style_LiftText} from './Common';
import {GlobalSettings, LiftDef} from '../types/types';
import {NumberControl} from './NumberControl';
import Utils from './Utils';
import {useSelector} from 'react-redux';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {AppState} from '../state/store';
import SetUtils from '../utils/SetUtils';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import CheckBox from '@react-native-community/checkbox';

interface EditableLiftItemProps {
  lift: Lift;
  onChange: (lift: Lift) => void;
  onDelete?: () => void;
  hideCompleted?: boolean;
}

export default function EditableLiftItem(props: EditableLiftItemProps) {
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const def = defs.get(props.lift.id)!;
  const labels = Utils.normalizeSets(props.lift.sets, def).map(
    set => set.label,
  );
  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  function addSet() {
    let set: LiftSet = {weight: 0, reps: 0};
    if (props.lift.sets.length > 0) {
      set = {...props.lift.sets[props.lift.sets.length - 1]};
      set.warmup = undefined; // Off by default
      set.completed = undefined;
    }

    const updatedLift = {...props.lift};
    updatedLift.sets = [...props.lift.sets, set];

    props.onChange(updatedLift);
  }

  function onRemoveSet(index: number) {
    const updatedLift = {...props.lift};
    updatedLift.sets.splice(index, 1);

    props.onChange(updatedLift);
  }

  function onSetChange(setIndex: number, updatedSet: LiftSet) {
    const updatedLift = {...props.lift};
    updatedLift.sets[setIndex] = updatedSet;

    props.onChange(updatedLift);
  }

  return (
    <View style={{margin: 4}}>
      <View
        style={{
          marginVertical: 4,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{width: '20%'}}></Text>
        <Text style={[Style_LiftText, {color: colors.text, width: '60%'}]}>
          {Utils.defToString(def)}
        </Text>
        {props.onDelete && (
          <View
            style={{
              width: '20%',
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-end',
            }}>
            <Menu>
              <MenuTrigger
                customStyles={{
                  triggerWrapper: {
                    top: 0,
                  },
                }}>
                <Image source={require('../icons/more.png')}></Image>
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{backgroundColor: colors.border}}>
                <MenuOption onSelect={() => props.onDelete?.()} text="Delete" />
              </MenuOptions>
            </Menu>
          </View>
        )}
      </View>

      <View>
        <PersistedSetHeader></PersistedSetHeader>
        {props.lift.sets.map((set, index) => (
          <PersistedSetRow
            set={set}
            label={labels[index]}
            settings={settings}
            def={def}
            key={index}
            hideCompleted={props.hideCompleted}
            onDelete={() => onRemoveSet(index)}
            onChange={set => onSetChange(index, set)}></PersistedSetRow>
        ))}
      </View>

      <View
        style={{
          margin: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button title="Add Set" onPress={addSet}></Button>
      </View>
    </View>
  );
}

const Widths: DimensionValue[] = ['10%', '35%', '0%', '32%', '10%', '13%'];

function PersistedSetHeader() {
  const {colors} = useTheme();
  const labels = ['Set', 'Weight', '', 'Reps', '1RM'];

  return (
    <View style={{flexDirection: 'row'}}>
      {labels.map((label, index) => (
        <Text
          key={index}
          style={[
            styles.liftHeader,
            {width: Widths[index], color: colors.text},
          ]}>
          {label}
        </Text>
      ))}
    </View>
  );
}

function PersistedSetRow(props: {
  set: LiftSet;
  settings: GlobalSettings;
  label: string;
  def: LiftDef;
  hideCompleted?: boolean;
  onChange: (updatedSet: LiftSet) => void;
  onDelete: () => void;
}) {
  const {colors} = useTheme();

  const update = (weight?: number, reps?: number) => {
    const updatedSet = {...props.set};
    updatedSet.weight = weight;
    updatedSet.reps = reps;

    props.onChange(updatedSet);
  };

  const onToggleWarmup = () => {
    const updatedSet: LiftSet = {
      ...props.set,
      warmup: !props.set.warmup,
      goal: undefined,
    };

    props.onChange(updatedSet);
  };

  const onToggleGoal = () => {
    const updatedSet: LiftSet = {
      ...props.set,
      goal: !props.set.goal,
      warmup: undefined,
    };

    props.onChange(updatedSet);
  };

  const onTogglePercent = () => {
    const updatedSet: LiftSet = {
      ...props.set,
      percentage: !props.set.percentage,
    };

    props.onChange(updatedSet);
  };

  const onToggleComplete = () => {
    const updatedSet: LiftSet = {
      ...props.set,
      completed: !props.set.completed,
    };

    props.onChange(updatedSet);
  };

  let percentageWeight = '';
  if (props.set.percentage && props.set.weight && props.def.trainingMax) {
    percentageWeight =
      Utils.calcPercentage(props.set.weight, props.def.trainingMax) + '';
  }

  const swipeableRef: React.MutableRefObject<Swipeable | null> = useRef(null);

  function confirmDelete() {
    Alert.alert(
      'Delete set?',
      undefined,
      [
        {
          text: 'Cancel',
          onPress: () => swipeableRef.current?.close(),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            swipeableRef.current?.close();
            props.onDelete();
          },
        },
      ],
      {cancelable: false},
    );
  }

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragAnimatedValue: Animated.AnimatedInterpolation<number>,
  ) => {
    const opacity = dragAnimatedValue.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          flex: 1,
          backgroundColor: 'red',
          transform: [{translateX: opacity}],
        }}></Animated.View>
    );
  };

  const disablePercentage =
    !props.set.percentage && props.def.trainingMax == undefined;

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        ref={swipeableRef}
        onSwipeableWillOpen={confirmDelete}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 4,
          }}>
          <Menu
            style={{
              width: Widths[0],
              alignSelf: 'center',
            }}>
            <MenuTrigger
              disabled={props.set.completed}
              text={props.label}
              customStyles={{
                triggerText: {
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: colors.text,
                },
              }}
            />
            <MenuOptions
              customStyles={{
                optionsContainer: {backgroundColor: colors.background},
              }}>
              <MenuOption
                customStyles={{
                  optionText: {fontSize: 16, color: colors.text},
                }}
                onSelect={onToggleWarmup}
                text={props.set.warmup ? 'Work Set' : 'Warmup'}></MenuOption>
              <MenuOption
                customStyles={{
                  optionText: {fontSize: 16, color: colors.text},
                }}
                onSelect={onToggleGoal}
                text={props.set.goal ? 'Remove Goal' : 'Goal'}></MenuOption>

              <MenuOption
                customStyles={{
                  optionText: {
                    fontSize: 16,
                    color: colors.text,
                    opacity: disablePercentage ? 0.5 : 1,
                  },
                }}
                onSelect={onTogglePercent}
                disabled={disablePercentage}
                text={
                  props.set.percentage ? 'Disable Percentage' : 'Percentage'
                }></MenuOption>
            </MenuOptions>
          </Menu>

          <View
            style={{
              width: Widths[1],
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <NumberControl
              disabled={props.set.completed}
              value={props.set.weight}
              onChange={newWeightValue =>
                update(newWeightValue, props.set.reps)
              }
              decrementBy={() =>
                (props.set.weight || 0) -
                SetUtils.decrementWeight(
                  props.set,
                  props.def.type,
                  props.settings,
                )
              }
              incrementBy={() =>
                SetUtils.incrementWeight(
                  props.set,
                  props.def.type,
                  props.settings,
                ) - (props.set.weight || 0)
              }></NumberControl>
          </View>
          <View
            style={{
              width: Widths[2],
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                color: colors.text,
              }}>
              {percentageWeight}
            </Text>
          </View>

          <View
            style={{
              width: Widths[3],
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <NumberControl
              disabled={props.set.completed}
              precision={0}
              value={props.set.reps}
              onChange={newRepsValue => update(props.set.weight, newRepsValue)}
              decrementBy={() => 1}
              incrementBy={() => 1}></NumberControl>
          </View>
          <View
            style={{
              width: Widths[4],
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                color: colors.text,
              }}>
              {props.set.warmup
                ? ''
                : Math.round(Utils.calculate1RM(props.def, props.set) * 10) /
                  10}
            </Text>
          </View>
          <View
            style={{
              width: Widths[5],
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            {!props.set.goal && props.hideCompleted != true && (
              <CheckBox
                value={props.set.completed}
                onValueChange={() => onToggleComplete()}></CheckBox>
            )}
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  liftText: Style_LiftText,
  liftHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    flexDirection: 'column',
  },
});
