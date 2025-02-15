import React from 'react';
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
import {LiftDef} from '../types/types';
import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';
import Utils from '../components/Utils';

type Props = StackScreenProps<RootStackParamList, 'LiftDefList'>;

export function LiftDefListScreen({route, navigation}: Props) {
  const isSelection = route.params.onSelect != undefined;
  const defs = useSelector((store: AppState) => store.liftDefs);

  const lifts = Array.from(defs.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  function onEdit(def: LiftDef) {
    if (isSelection) {
      route.params.onSelect(def.id);
      navigation.pop();
    } else {
      navigation.navigate('LiftDefEdit', {def: def});
    }
  }

  function onAdd() {
    navigation.navigate('LiftDefEdit', {});
  }

  const renderItem = (item: ListRenderItemInfo<LiftDef>) => (
    <TouchableOpacity onPress={() => onEdit(item.item)}>
      <DefListItem def={item.item}></DefListItem>
    </TouchableOpacity>
  );

  // TODO make add a menu
  return (
    <View
      style={{
        flex: 1,
        flexGrow: 1,
      }}>
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

  const postfix = props.def.system ? '' : ' *';

  return (
    <View style={{padding: 8}}>
      <Text>{Utils.defToString(props.def) + postfix}</Text>
    </View>
  );
}
