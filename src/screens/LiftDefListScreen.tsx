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
import {useAppSelector} from '../state/store';
import Utils from '../components/Utils';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {MaterialHeaderButton} from '../components/Common.tsx';

type Props = StackScreenProps<RootStackParamList, 'LiftDefList'>;

// TODO better name for this, its a subset of
export function LiftDefListScreen({route, navigation}: Props) {
  const isSelection = route.params.onSelect != undefined;
  const defs = useAppSelector(store => store.liftDefs);
  const lifts = Array.from(Object.values(defs)).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  // Menu
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 10}}>
          <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
            <Item title="add" iconName="plus" onPress={onAdd} />
          </HeaderButtons>
        </View>
      ),
    });
  }, [navigation]);

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
      <Text style={{color: colors.text}}>
        {Utils.defToString(props.def) + postfix}
      </Text>
    </View>
  );
}
