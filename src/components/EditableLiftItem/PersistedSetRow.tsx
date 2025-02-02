import {LiftSet} from '../../types/workout';
import {GlobalSettings, LiftDef} from '../../types/types';
import {useTheme} from '@react-navigation/native';
import Utils from '../Utils';
import React, {useRef} from 'react';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {Alert, Animated, Text, View} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {Widths} from './Widths';
import {NumberControl} from '../NumberControl';
import SetUtils from '../../utils/SetUtils';
import CheckBox from '@react-native-community/checkbox';

export function PersistedSetRow(props: {
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
    <GestureHandlerRootView style={{padding: 2}}>
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
            {props.hideCompleted != true && (
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
