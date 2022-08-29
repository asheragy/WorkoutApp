import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Modal, View, Text, Button, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {lifts} from '../../data/LiftDatabase';
import {Lift, GlobalSettings, LiftSet} from '../../types/types';
import {Style_LiftText} from './Common';
import {SetHeader, PersistedSetRow} from './SetRows';

export default function LiftEditorModal(props: {
  editing: boolean;
  lift: Lift;
  onFinish: () => void;
  onViewLog: () => void;
  onSetChange: (index: number, updatedSet: LiftSet) => void;
}) {
  const {colors} = useTheme();
  const goal = props.lift.goal != undefined;
  console.log(props.lift);
  const settings: GlobalSettings = useSelector((store: any) => store.settings);
  const warmups = props.lift.sets.filter(x => x.warmup == true).length;

  return (
    <Modal visible={props.editing} transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.75)',
        }}>
        <View
          style={{
            margin: 10,
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 15,
            alignItems: 'center',

            elevation: 5,
          }}>
          <Text
            style={[styles.liftText, {color: colors.text, marginBottom: 8}]}>
            {props.lift.def.name}
          </Text>
          <SetHeader></SetHeader>
          {props.lift.sets.map((set, index) => (
            <PersistedSetRow
              index={index}
              set={set}
              warmupOffset={warmups}
              settings={settings}
              liftType={props.lift.def.type}
              key={index}
              onChange={props.onSetChange}></PersistedSetRow>
          ))}

          {goal && (
            // TODO unsure if this should go here or the main workout screen
            <View style={{flexDirection: 'row', marginVertical: 8}}>
              <Text
                style={{width: '20%', color: colors.text, textAlign: 'center'}}>
                Goal
              </Text>
              <Text
                style={{width: '60%', color: colors.text, textAlign: 'center'}}>
                {props.lift.goal}
              </Text>
              <Text style={{width: '20%'}}></Text>
            </View>
          )}

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button
                title="Log"
                onPress={() => {
                  props.onFinish(); // TODO temp to workaround broken button issue after using
                  props.onViewLog();
                }}></Button>
            </View>

            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button title="Done" onPress={() => props.onFinish()}></Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  liftText: Style_LiftText,
});
