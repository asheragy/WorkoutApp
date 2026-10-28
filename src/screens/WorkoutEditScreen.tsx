import React, { useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import {
  Alert,
  Button,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../App';
import { GlobalSettings } from '../core/types/types';
import { TextInput } from 'react-native-gesture-handler';
import {
  isLiftGroup,
  Lift,
  LiftGroup,
  Workout,
  WorkoutItem,
} from '../core/types/workout';
import LiftUtils from '../core/utils/LiftUtils';
import Utils from '../components/Utils';
import WorkoutRepository from '../repository/WorkoutRepository';
import EditableLiftItem from '../components/EditableLiftItem/EditableLiftItem';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialHeaderButton } from '../components/Common';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AppState } from '../state/store';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

type Props = StackScreenProps<RootStackParamList, 'WorkoutEdit'>;

export function WorkoutEditScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const settings: GlobalSettings = useSelector(
    (store: AppState) => store.settings,
  );

  const [workout, setWorkout] = useState<Workout>({
    name: 'Workout Title',
    items: [],
    routineId: settings.routine,
  });

  function loadState() {
    if (route.params.workoutId) {
      WorkoutRepository.get(route.params.workoutId).then(result => {
        if (result !== undefined) {
          setWorkout(result);
        }
      });
    }
  }

  useEffect(loadState, []);

  // Menu
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
            <Item
              title="+Exercise"
              iconName="plus"
              onPress={onSelectExercise}
            />
            <Item title="save" iconName="content-save" onPress={onSave} />
          </HeaderButtons>
        </View>
      ),
    });
  }, [navigation, workout]);

  async function onSave() {
    const workoutToSave: Workout = { ...workout };

    try {
      await WorkoutRepository.upsert(workoutToSave);
    } catch (error) {
      console.error('Failed to save workout:', error);
    }

    navigation.goBack();
  }

  // TODO copy from context menu in prior screen instead of here?
  async function onCopy() {
    const workoutCopy: Workout = {
      ...workout,
      name: workout.name + ' (Copy)',
    };

    delete workoutCopy.id;
    await WorkoutRepository.upsert(workoutCopy);
    navigation.goBack();
  }

  function onSelectExercise() {
    navigation.navigate('LiftDefList', { onSelect: onExerciseAdded });
  }

  function onExerciseAdded(defId: string) {
    const lift: Lift = {
      id: defId,
      instanceId: Utils.generate_uuidv4(),
      sets: [],
      goals: [],
    };
    setWorkout(prev => ({
      ...prev,
      items: [...prev.items, lift],
    }));
  }

  function onExerciseDelete(index: number) {
    setWorkout(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function onLiftChanged(lift: Lift) {
    setWorkout(prev => ({
      ...prev,
      items: LiftUtils.replaceLift(prev.items, lift) ?? prev.items,
    }));
  }

  function onAddToGroup(instanceId: string) {
    setWorkout(prev => {
      const items = prev.items;
      const index = items.findIndex(x => x.instanceId == instanceId);
      const lift = items[index];
      if (index < 0 || isLiftGroup(lift) || items.length < 2) return prev;

      // First item joins the one after it, everything else joins the one before
      const neighborIndex = index == 0 ? 1 : index - 1;
      const neighbor = items[neighborIndex];

      // This lift goes first when merging forward, last when merging backward
      const lifts = isLiftGroup(neighbor) ? neighbor.lifts : [neighbor];
      const merged: LiftGroup = {
        kind: 'oneOf',
        instanceId: isLiftGroup(neighbor)
          ? neighbor.instanceId
          : Utils.generate_uuidv4(),
        lifts: index == 0 ? [lift, ...lifts] : [...lifts, lift],
      };

      const first = Math.min(index, neighborIndex);
      return {
        ...prev,
        items: [...items.slice(0, first), merged, ...items.slice(first + 2)],
      };
    });
  }

  function onRemoveFromGroup(groupId: string, liftId: string) {
    setWorkout(prev => {
      const items = prev.items;
      const index = items.findIndex(x => x.instanceId == groupId);
      const group = items[index];
      if (index < 0 || !isLiftGroup(group)) {
        console.log('Error: group not found ' + groupId);
        return prev;
      }

      const lift = group.lifts.find(x => x.instanceId == liftId);
      if (!lift) {
        console.log('Error: lift not found in group ' + liftId);
        return prev;
      }

      // Split into: remaining group, then the removed lift directly after it.
      // A group of one is just a lift, so collapse it.
      const remaining = group.lifts.filter(x => x.instanceId != liftId);
      const rest: WorkoutItem =
        remaining.length == 1 ? remaining[0] : { ...group, lifts: remaining };

      return {
        ...prev,
        items: [
          ...items.slice(0, index),
          rest,
          lift,
          ...items.slice(index + 1),
        ],
      };
    });
  }

  function setLifts(items: WorkoutItem[]) {
    setWorkout(prev => ({
      ...prev,
      items: items,
    }));
  }

  function setTitle(title: string) {
    setWorkout(prev => ({
      ...prev,
      name: title,
    }));
  }

  async function onDeleteWorkout() {
    await WorkoutRepository.deleteById(route.params.workoutId!);
    navigation.goBack();
  }

  function confirmLiftDelete(index: number) {
    const item = workout.items[index];
    if (isLiftGroup(item)) {
      ToastAndroid.show(
        'Error: should not be able to delete group',
        ToastAndroid.LONG,
      );
      return;
    } else {
      const liftId = item.id;
      Alert.alert(
        `Delete ${defs[liftId].name}?`,
        undefined,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => onExerciseDelete(index),
          },
        ],
        { cancelable: false },
      );
    }
  }

  const renderItem = (params: RenderItemParams<WorkoutItem>) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={params.drag}
        style={{ margin: 4, backgroundColor: colors.card }}
      >
        {!isLiftGroup(params.item) && (
          <EditableLiftItem
            lift={params.item}
            mode={'workout_edit'}
            onChange={onLiftChanged}
            onDelete={() => confirmLiftDelete(params.getIndex()!)}
            onGroup={() => onAddToGroup(params.item.instanceId)}
            inGroup={false}
          ></EditableLiftItem>
        )}
        {isLiftGroup(params.item) && (
          <View
            style={{
              borderLeftWidth: 3,
              borderLeftColor: colors.primary,
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 12,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                paddingHorizontal: 8,
                paddingTop: 4,
              }}
            >
              One of
            </Text>
            {params.item.lifts.map((lift, idx) => {
              return (
                <View
                  key={lift.instanceId}
                  style={
                    idx > 0
                      ? { borderTopWidth: 1, borderTopColor: colors.border }
                      : undefined
                  }
                >
                  <EditableLiftItem
                    lift={lift}
                    mode={'workout_edit'}
                    onChange={onLiftChanged}
                    onDelete={() => console.log('Not allowed for groups')}
                    onGroup={() =>
                      onRemoveFromGroup(params.item.instanceId, lift.instanceId)
                    }
                    inGroup={true}
                  ></EditableLiftItem>
                </View>
              );
            })}
          </View>
        )}
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput onChangeText={setTitle} style={{ color: colors.text }}>
        {workout.name}
      </TextInput>
      {workout.id != undefined && (
        <Text style={{ color: colors.text }}>
          {'Last Completed: ' + Utils.lastCompleted(workout.lastCompleted)}
        </Text>
      )}

      <View
        style={{
          flex: 1,
          flexGrow: 1,
        }}
      >
        <DraggableFlatList
          data={workout.items}
          renderItem={renderItem}
          onDragEnd={({ data }) => setLifts(data)}
          keyExtractor={lift => lift.instanceId}
        ></DraggableFlatList>
        {route.params.workoutId && (
          <Button title="Delete" onPress={onDeleteWorkout}></Button>
        )}
        {route.params.workoutId && (
          <Button title="Create Copy" onPress={onCopy}></Button>
        )}
      </View>
    </View>
  );
}
