import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {Modal, View, Text, Button, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {GlobalSettings, TrainingMax} from '../../types/types';
import Utils from '../Utils';
import {Style_LiftText} from './Common';
import {Lift, LiftSet} from '../../types/workout';
import {PersistedSetHeader, PersistedSetRow} from './EditableSetRows';

export default function LiftEditorModal(props: {
  editing: boolean;
  lift: Lift;
  tm?: TrainingMax;
  onFinish: (sets: LiftSet[]) => void;
  onViewLog: () => void;
}) {
  const [sets, setSets] = useState<LiftSet[]>(props.lift.sets);
  const {colors} = useTheme();

  const settings: GlobalSettings = useSelector((store: any) => store.settings);
  const labels = Utils.normalizeSets(sets, props.tm).map(set => set.label);

  function onSetChange(index: number, updatedSet: LiftSet) {
    var updatedSets: LiftSet[] = [...sets];
    updatedSets[index] = updatedSet;

    setSets(updatedSets);
  }

  function onSetRemove() {
    var updatedSets = [...sets];
    setSets(updatedSets.slice(0, updatedSets.length - 1));
  }

  function onSetAdd() {
    var addedSet: LiftSet =
      sets.length > 0
        ? [...sets][sets.length - 1]
        : {
            weight: 0,
            reps: 0,
          };

    setSets(sets.concat(addedSet));
  }

  async function onDone() {
    props.onFinish(sets);
  }

  return (
    <Modal visible={props.editing} transparent={true}>
      <View
        style={{
          flex: 1,
          paddingTop: 50,
          justifyContent: 'flex-start',
          height: '100%',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.95)',
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
          <PersistedSetHeader></PersistedSetHeader>
          {sets.map((set, index) => (
            <PersistedSetRow
              index={index}
              set={set}
              label={labels[index]}
              settings={settings}
              liftType={props.lift.def.type}
              key={index}
              tm={props.tm}
              onChange={onSetChange}></PersistedSetRow>
          ))}

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button
                disabled={sets.length == 0}
                title="Remove Set"
                onPress={() => onSetRemove()}></Button>
            </View>

            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button title="Add Set" onPress={() => onSetAdd()}></Button>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button
                title="Log"
                onPress={() => {
                  props.onFinish(sets); // TODO temp to workaround broken button issue after using
                  props.onViewLog();
                }}></Button>
            </View>

            <View style={{width: '50%', marginHorizontal: 10}}>
              <Button title="Done" onPress={onDone}></Button>
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
