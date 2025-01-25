import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {Modal, View, Button, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {GlobalSettings} from '../types/types';
import {Style_LiftText} from './Common';
import {Lift, LiftSet} from '../types/workout';
import EditableLiftItem from './EditableLiftItem';
import {MenuProvider} from 'react-native-popup-menu';

export default function LiftEditorModal(props: {
  editing: boolean;
  lift: Lift;
  onFinish: (lift: Lift) => void;
  onToggleHide: () => void;
  onViewLog: () => void;
}) {
  const [lift, setLift] = useState(props.lift);
  // Override local state if props change
  React.useEffect(() => setLift(props.lift), [props.lift]);

  const {colors} = useTheme();
  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  function onLiftChanged(lift: Lift) {
    setLift(lift);
  }

  function onToggleHide() {
    props.onToggleHide();
  }

  async function onDone() {
    props.onFinish(lift);
  }

  return (
    <Modal visible={props.editing} transparent={true}>
      <MenuProvider skipInstanceCheck={true}>
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
              paddingVertical: 15,
              paddingHorizontal: 0,
              alignItems: 'center',

              elevation: 5,
            }}>
            <EditableLiftItem
              lift={lift}
              onChange={onLiftChanged}></EditableLiftItem>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
              }}>
              <View style={{width: '30%', marginHorizontal: 10}}>
                <Button
                  title="Log"
                  onPress={() => {
                    props.onFinish(lift.sets); // TODO temp to workaround broken button issue after using
                    props.onViewLog();
                  }}></Button>
              </View>

              <View style={{width: '30%', marginHorizontal: 10}}>
                <Button
                  title={lift.hide ? 'Unhide' : 'Skip'}
                  disabled={lift.sets.find(x => x.completed) != undefined}
                  onPress={onToggleHide}></Button>
              </View>
              <View style={{width: '40%', marginHorizontal: 10}}>
                <Button title="Done" onPress={onDone}></Button>
              </View>
            </View>
          </View>
        </View>
      </MenuProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  liftText: Style_LiftText,
});
