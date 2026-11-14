import { LiftSet } from '../../core/types/workout';
import { GlobalSettings, LiftDef } from '../../core/types/types';
import { useTheme } from '@react-navigation/native';
import React, { useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Alert, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Widths } from './Widths';
import { NumberControl } from '../NumberControl';
import SetUtils from '../../core/utils/SetUtils';
import RNCheckBox from '@react-native-community/checkbox';

// The package's typings extend `NativeMethods`, which react-native's types no
// longer export as of 0.88, so its class type is unusable as a JSX element.
const CheckBox = RNCheckBox as unknown as React.ComponentType<{
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}>;

// Swipeable keeps its action panel visible behind the row at all times (as of
// gesture-handler 3.5), so hide the red background until a swipe starts.
function DeleteBackground(props: { progress: SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: props.progress.value === 0 ? 0 : 1,
  }));

  return (
    <Animated.View
      style={[
        { flexDirection: 'row', flex: 1, backgroundColor: 'red' },
        animatedStyle,
      ]}
    />
  );
}

export function PersistedSetRow(props: {
  set: LiftSet;
  settings: GlobalSettings;
  label: string;
  def: LiftDef;
  showCompleteCheckbox: boolean;
  showPlates?: boolean;
  onChange: (updatedSet: LiftSet) => void;
  onDelete: () => void;
  top1RM?: number;
}) {
  const { colors } = useTheme();

  const update = (weight: number, reps: number) => {
    const updatedSet = { ...props.set };
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

  const onToggleComplete = () => {
    const updatedSet: LiftSet = {
      ...props.set,
      completed: !props.set.completed,
    };

    props.onChange(updatedSet);
  };

  const swipeableRef: React.MutableRefObject<SwipeableMethods | null> =
    useRef(null);

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
      { cancelable: false },
    );
  }

  const renderRightActions = (progress: SharedValue<number>) => {
    return <DeleteBackground progress={progress} />;
  };

  const set1RM = SetUtils.calculate1RM(props.settings, props.def, props.set);

  return (
    <GestureHandlerRootView style={{ padding: 2 }}>
      <Swipeable
        renderRightActions={renderRightActions}
        ref={swipeableRef}
        onSwipeableWillOpen={confirmDelete}
      >
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 4,
          }}
        >
          <Menu
            style={{
              width: Widths[0],
              alignSelf: 'center',
            }}
          >
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
                optionsContainer: { backgroundColor: colors.background },
              }}
            >
              <MenuOption
                customStyles={{
                  optionText: { fontSize: 16, color: colors.text },
                }}
                onSelect={onToggleWarmup}
                text={props.set.warmup ? 'Work Set' : 'Warmup'}
              ></MenuOption>
            </MenuOptions>
          </Menu>

          <View
            style={{
              width: Widths[1],
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <View>
              <NumberControl
                disabled={props.set.completed}
                value={props.set.weight}
                onChange={newWeightValue =>
                  update(newWeightValue, props.set.reps)
                }
                decrementBy={() =>
                  props.set.weight -
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
                  ) - props.set.weight
                }
              ></NumberControl>
              {props.showPlates && (
                <Text style={{ color: colors.text, textAlign: 'center' }}>
                  {SetUtils.calcPlatesStr(props.def, props.set.weight)}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{
              width: Widths[2],
              flexDirection: 'row',
              backgroundColor: 'orange',
              justifyContent: 'center',
            }}
          ></View>

          <View
            style={{
              width: Widths[3],
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <View>
              <NumberControl
                disabled={props.set.completed}
                precision={0}
                value={props.set.reps}
                onChange={newRepsValue =>
                  update(props.set.weight, newRepsValue)
                }
                decrementBy={() => 1}
                incrementBy={() => 1}
              ></NumberControl>
            </View>
          </View>
          <View
            style={{
              width: Widths[4],
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                color: colors.text,
              }}
            >
              {props.set.warmup
                ? props.top1RM
                  ? Math.round((100 * set1RM) / props.top1RM) + '%'
                  : ''
                : Math.round(set1RM * 10) / 10}
            </Text>
          </View>
          <View
            style={{
              width: Widths[5],
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {props.showCompleteCheckbox && (
              <CheckBox
                value={props.set.completed}
                onValueChange={() => onToggleComplete()}
              ></CheckBox>
            )}
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
