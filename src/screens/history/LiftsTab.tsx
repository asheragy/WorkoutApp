import React, { useCallback, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../../App';
import { LiftDef } from '../../core/types/types';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { useAppSelector } from '../../state/store';
import LiftHistoryRepository from '../../repository/LiftHistoryRepository';

export function LiftsTab() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const defs = useAppSelector(store => store.liftDefs);
  const [liftIds, setLiftIds] = useState<string[]>([]);

  // Reload on focus, the tab stays mounted while workouts are completed elsewhere
  useFocusEffect(
    useCallback(() => {
      LiftHistoryRepository.listKeys().then(setLiftIds);
    }, []),
  );

  const lifts = liftIds
    // History can outlive a deleted def
    .filter(id => defs[id] != undefined)
    .map(id => defs[id])
    .sort((a, b) => a.name.localeCompare(b.name));

  function onHistory(def: LiftDef) {
    navigation.navigate('LiftHistory', { liftId: def.id });
  }

  const renderItem = (item: ListRenderItemInfo<LiftDef>) => (
    <TouchableOpacity onPress={() => onHistory(item.item)}>
      <DefListItem def={item.item}></DefListItem>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={lifts}
        renderItem={renderItem}
        keyExtractor={def => def.id}
      ></FlatList>
    </View>
  );
}

interface DefItemProps {
  def: LiftDef;
}

function DefListItem(props: DefItemProps) {
  const { colors } = useTheme();

  const postfix = props.def.system ? '' : ' *';

  return (
    <View style={{ padding: 8 }}>
      <Text style={{ color: colors.text }}>
        {props.def.displayName + postfix}
      </Text>
    </View>
  );
}
