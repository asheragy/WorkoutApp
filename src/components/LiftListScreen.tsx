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
import {
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import {RootStackParamList} from '../App';
import LiftRepository from '../data/LiftRepository';
import Repository from '../data/Repository';
import {LiftDef} from '../types/types';
import {MaterialHeaderButton} from './Common';

type Props = StackScreenProps<RootStackParamList, 'ListList'>;

export function LiftListScreen({route, navigation}: Props) {
  const [lifts, setLifts] = useState<LiftDef[]>([]);
  const {colors} = useTheme();

  function loadState() {
    Repository.getWorkouts().then(result => {
      const map = new Map();
      result.forEach(workout => {
        workout.node.lifts.forEach(lift => {
          map.set(lift.def.id, lift.def);
        });
      });

      var arr: LiftDef[] = Array.from(map.values());
      arr = arr.sort((a, b) => a.name.localeCompare(b.name));

      setLifts(arr);
    });
  }

  useEffect(loadState, []);

  function onClick(def: LiftDef) {
    navigation.navigate('Lift', {
      lift: def,
    });
  }

  function onReset() {
    LiftRepository.clearAllLifts();
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <OverflowMenu
            style={{marginHorizontal: 10}}
            OverflowIcon={({color}) => (
              <Text style={{fontWeight: 'bold', fontSize: 24}}>...</Text>
            )}>
            <HiddenItem title="Reset History" onPress={() => onReset()} />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation]);

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
