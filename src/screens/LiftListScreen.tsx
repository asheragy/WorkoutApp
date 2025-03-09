import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../App';
import {LiftDef} from '../types/types';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';
import LiftHistoryRepository from '../repository/LiftHistoryRepository';

type Props = StackScreenProps<RootStackParamList, 'LiftList'>;

// TODO Better name for this, its the list of lifts with active history
export function LiftListScreen({route, navigation}: Props) {
  const [lifts, setLifts] = useState<LiftDef[]>([]);
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);

  function loadState() {
    // TODO can this just be from defs?
    LiftHistoryRepository.listKeys().then(result => {
      const arr = result
        .map(key => defs[key])
        .sort((a, b) => a.name.localeCompare(b.name));

      setLifts(arr);
    });
  }

  useEffect(loadState, []);

  function onClick(def: LiftDef) {
    navigation.navigate('LiftHistory', {
      liftId: def.id,
    });
  }

  const renderItem = (item: ListRenderItemInfo<LiftDef>) => (
    <TouchableOpacity onPress={() => onClick(item.item)}>
      <View key={item.index} style={{padding: 10}}>
        <Text style={{color: colors.text}}>{item.item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        style={{backgroundColor: colors.background}}
        data={lifts}
        renderItem={renderItem}
        keyExtractor={(_, index) => 'test' + index}></FlatList>
    </View>
  );
}
