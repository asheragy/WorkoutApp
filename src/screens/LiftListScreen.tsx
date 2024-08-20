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
import {LiftDef} from '../types/types';
import {MaterialHeaderButton} from '../components/Common';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';
import LiftHistoryRepository from '../repository/LiftHistoryRepository';

type Props = StackScreenProps<RootStackParamList, 'LiftList'>;

export function LiftListScreen({route, navigation}: Props) {
  const [lifts, setLifts] = useState<LiftDef[]>([]);
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);

  function loadState() {
    LiftHistoryRepository.listKeys().then(result => {
      const arr = result
        .map(key => defs.get(key)!)
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

  function onReset() {
    // TODO probably don't want to keep this
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
