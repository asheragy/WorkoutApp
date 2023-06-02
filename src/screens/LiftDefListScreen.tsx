import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../App';
import {LiftDef, LiftType} from '../types/types';
import LiftDefRepository from '../repository/LiftDefRepository';
import {useTheme} from '@react-navigation/native';
import {SystemLifts} from '../repository/LiftDatabase';

type Props = StackScreenProps<RootStackParamList, 'LiftDefList'>;

export function LiftDefListScreen({route, navigation}: Props) {
  const isSelection = route.params.onSelect != undefined;
  const [lifts, setLifts] = useState<LiftDef[]>([]);

  function onRefresh() {
    LiftDefRepository.getAll().then(lifts => {
      var result = lifts.concat(SystemLifts);

      result = result.sort((a, b) => a.name.localeCompare(b.name));
      setLifts(result);
    });
  }

  function onAdd() {
    navigation.navigate('LiftDefEdit', {onChanged: onRefresh});
  }

  function onEdit(def: LiftDef) {
    if (isSelection) {
      route.params.onSelect(def);
      navigation.pop();
    } else {
      navigation.navigate('LiftDefEdit', {onChanged: onRefresh, def: def});
    }
  }

  useEffect(onRefresh, []);

  const renderItem = (item: ListRenderItemInfo<LiftDef>) => (
    <TouchableOpacity onPress={() => onEdit(item.item)}>
      <DefListItem def={item.item}></DefListItem>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={lifts}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}></FlatList>

      <Button title="Add" onPress={() => onAdd()}></Button>
    </View>
  );
}

interface DefItemProps {
  def: LiftDef;
}

function DefListItem(props: DefItemProps) {
  const {colors} = useTheme();

  return (
    <View style={{padding: 8}}>
      <Text>{props.def.name + ' (' + LiftType[props.def.type] + ')'}</Text>
    </View>
  );
}
