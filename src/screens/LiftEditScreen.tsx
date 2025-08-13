import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Button, ScrollView, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {GlobalSettings} from '../types/types';
import {Lift} from '../types/workout';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App.tsx';
import EditableLiftItem from '../components/EditableLiftItem/EditableLiftItem.tsx';
import {
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import {MaterialHeaderButton} from '../components/Common.tsx';
import {AppState} from '../state/store.ts';
import Utils from '../components/Utils.ts';

type Props = StackScreenProps<RootStackParamList, 'LiftEdit'>;

export default function LiftEditScreen({route, navigation}: Props) {
  const [lift, setLift] = useState<Lift>(route.params.lift);
  const {colors} = useTheme();
  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  const defs = useSelector((store: AppState) => store.liftDefs);
  const def = defs[lift.id];

  function onLiftChanged(lift: Lift) {
    setLift(lift);
  }

  useEffect(() => {
    navigation.setOptions({title: Utils.defToString(def)});
  }, [def, navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <OverflowMenu
            style={{marginHorizontal: 10}}
            OverflowIcon={({color}) => (
              <Text
                style={{fontWeight: 'bold', fontSize: 24, color: colors.text}}>
                ...
              </Text>
            )}>
            <HiddenItem
              title="History"
              onPress={() =>
                navigation.navigate('LiftHistory', {liftId: lift.id})
              }
            />
            <HiddenItem
              title={lift.hide ? 'Unhide' : 'Skip'}
              onPress={() => onToggleHide()}
            />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  function onToggleHide() {
    let updatedLift: Lift = {...lift};
    updatedLift.hide = updatedLift.hide ? undefined : true;

    route.params.onFinish(updatedLift);
    navigation.pop();
  }

  async function onDone() {
    route.params.onFinish(lift);
    navigation.pop();
  }

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          marginVertical: 8,
        }}>
        <EditableLiftItem
          lift={lift}
          onChange={onLiftChanged}></EditableLiftItem>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
          }}>
          <View style={{width: '100%', marginHorizontal: 10}}>
            <Button title="Done" onPress={onDone}></Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
