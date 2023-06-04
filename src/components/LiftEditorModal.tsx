import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {Modal, View, Button, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {GlobalSettings, TrainingMax} from '../types/types';
import {Style_LiftText} from './Common';
import {Lift, LiftSet} from '../types/workout';
import EditableLiftItem from './EditableLiftItem';

export default function LiftEditorModal(props: {
  editing: boolean;
  lift: Lift;
  tm?: TrainingMax;
  onFinish: (sets: LiftSet[]) => void;
  onViewLog: () => void;
}) {
  const [lift, setLift] = useState(props.lift);
  const {colors} = useTheme();

  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  function onLiftChanged(lift: Lift) {
    setLift(lift);
  }

  async function onDone() {
    props.onFinish(lift.sets);
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
          <EditableLiftItem
            lift={lift}
            tm={props.tm}
            onChange={onLiftChanged}></EditableLiftItem>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <View style={{width: '45%', marginHorizontal: 10}}>
              <Button
                title="Log"
                onPress={() => {
                  props.onFinish(lift.sets); // TODO temp to workaround broken button issue after using
                  props.onViewLog();
                }}></Button>
            </View>

            <View style={{width: '45%', marginHorizontal: 10}}>
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
