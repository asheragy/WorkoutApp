import React, {useRef} from 'react';
import {
  Alert,
  Animated,
  Button,
  DimensionValue,
  StyleSheet,
  Text,
  TouchableOpacity,
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

interface EditableLiftItemProps {
  lift: Lift;
  onChange: (lift: Lift) => void;
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
    var set: LiftSet = {weight: 0, reps: 0};
    var updatedLift = {...props.lift};
    updatedLift.sets = [...props.lift.sets, set];

    props.onChange(updatedLift);
  }

  function onRemoveSet(index: number) {
    var updatedLift = {...props.lift};
    updatedLift.sets.splice(index, 1);

    props.onChange(updatedLift);
  }

  function onSetChange(setIndex: number, updatedSet: LiftSet) {
    var updatedLift = {...props.lift};
    updatedLift.sets[setIndex] = updatedSet;

    props.onChange(updatedLift);
  }

  return (
    <View style={{margin: 8}}>
      <Text style={[styles.liftText, {color: colors.text, marginBottom: 8}]}>
        {def.name}
      </Text>

      <View>
        <PersistedSetHeader></PersistedSetHeader>
        {props.lift.sets.map((set, index) => (
          <PersistedSetRow
            set={set}
            label={labels[index]}
            settings={settings}
            def={def}
            key={index}
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

const Widths: DimensionValue[] = ['10%', '35%', '10%', '35%', '10%'];

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
  onChange: (updatedSet: LiftSet) => void;
  onDelete: () => void;
}) {
  const {colors} = useTheme();

  const update = (weight?: number, reps?: number) => {
    var updatedSet = {...props.set};
    updatedSet.weight = weight;
    updatedSet.reps = reps;

    props.onChange(updatedSet);
  };

  const onToggleWarmup = () => {
    var updatedSet: LiftSet = {
      ...props.set,
      warmup: !props.set.warmup,
    };

    props.onChange(updatedSet);
  };

  const onTogglePercent = () => {
    var updatedSet: LiftSet = {
      ...props.set,
      percentage: !props.set.percentage,
    };

    props.onChange(updatedSet);
  };

  var percentageWeight = '';
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
    progress: Animated.AnimatedInterpolation<number>,
    dragAnimatedValue: Animated.AnimatedInterpolation<number>,
  ) => {
    const opacity = dragAnimatedValue.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          flex: 1,
          backgroundColor: 'red',
          opacity: opacity,
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
        <View style={{flexDirection: 'row', marginVertical: 4}}>
          <Menu
            style={{
              width: Widths[0],
              alignSelf: 'center',
            }}>
            <MenuTrigger
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
                : Math.round(Utils.calculate1RM(props.def, props.set))}
            </Text>
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
});
