import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  Alert,
  Button,
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../App';
import {LiftDef} from '../types/types';
import {TextInput} from 'react-native-gesture-handler';
import {Lift, Workout} from '../types/workout';
import Utils from '../components/Utils';
import WorkoutRepository from '../repository/WorkoutRepository';
import EditableLiftItem from '../components/EditableLiftItem';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {MaterialHeaderButton} from '../components/Common';
import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';

type Props = StackScreenProps<RootStackParamList, 'WorkoutEdit'>;

export function WorkoutEditScreen({route, navigation}: Props) {
  const existing = route.params.workout;
  const [title, setTitle] = useState(
    existing ? existing.name : 'Workout Title',
  );
  const [lifts, setLifts] = useState<Lift[]>(existing ? existing.lifts : []);
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);

  // Menu
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item title="+Exercise" onPress={onSelectExercise} />
          <Item title="save" onPress={onSave} />
        </HeaderButtons>
      ),
    });
  }, [navigation, lifts]);

  async function onSave() {
    const workout: Workout = {
      id: existing ? existing.id : undefined,
      name: title,
      lifts: lifts,
    };

    await WorkoutRepository.upsert(workout);
    route.params.onChanged();
    navigation.pop();
  }

  function onSelectExercise() {
    navigation.navigate('LiftDefList', {onSelect: onExerciseAdded});
  }

  function onExerciseAdded(def: LiftDef) {
    const lift: Lift = {
      id: def.id,
      sets: [],
    };
    setLifts(prevState => [...prevState, lift]);
  }

  function onExerciseDelete(index: number) {
    var updatedLifts = [...lifts];
    updatedLifts.splice(index, 1);
    setLifts(updatedLifts);
  }

  function onLiftChanged(index: number, lift: Lift) {
    console.log(lifts.length);
    var updatedLifts = [...lifts];
    updatedLifts[index] = lift;

    setLifts(updatedLifts);
  }

  async function onDeleteWorkout() {
    await WorkoutRepository.delete(route.params.workout!);
    route.params.onChanged();
    navigation.pop();
  }

  function confirmLiftDelete(index: number) {
    Alert.alert(
      `Delete ${defs.get(lifts[index].id)?.name}?`,
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
      {cancelable: false},
    );
  }

  const renderItem = (item: ListRenderItemInfo<Lift>) => (
    <View style={{margin: 4, backgroundColor: colors.card}}>
      <TouchableOpacity onLongPress={() => confirmLiftDelete(item.index)}>
        <EditableLiftItem
          lift={item.item}
          onChange={lift => onLiftChanged(item.index, lift)}></EditableLiftItem>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <Text>{existing?.id}</Text>
      <TextInput onChangeText={setTitle}>{title}</TextInput>
      {existing != undefined && (
        <Text>
          {'Last Completed: ' + Utils.lastCompleted(existing.lastCompleted)}
        </Text>
      )}

      <View
        style={{
          flex: 1,
          flexGrow: 1,
        }}>
        <FlatList
          data={lifts}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}></FlatList>
        {route.params.workout && (
          <Button title="Delete" onPress={onDeleteWorkout}></Button>
        )}
      </View>
    </View>
  );
}
