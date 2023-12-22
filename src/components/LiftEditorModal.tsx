import {useTheme} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Modal,
  View,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {GlobalSettings} from '../types/types';
import {Style_LiftText} from './Common';
import {Lift, LiftSet} from '../types/workout';
import EditableLiftItem from './EditableLiftItem';
import {MenuProvider} from 'react-native-popup-menu';
import {TextInput} from 'react-native-gesture-handler';

export default function LiftEditorModal(props: {
  editing: boolean;
  lift: Lift;
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

  var textRef = useRef<TextInput>(null);
  const [mode, setMode] = useState(0);

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
              padding: 15,
              alignItems: 'center',

              elevation: 5,
            }}>
            <EditableLiftItem
              lift={lift}
              onChange={onLiftChanged}></EditableLiftItem>

            <TouchableOpacity
              style={{backgroundColor: 'orange'}}
              onPress={() => {
                setMode(mode + 1);
              }}>
              <View>
                {mode == 1 && <Button title="-"></Button>}
                {mode < 2 && <Text>{'Mode = ' + mode}</Text>}
                {mode == 1 && <Button title="+"></Button>}
                {mode == 2 && (
                  <TextInput
                    autoFocus={true}
                    ref={textRef}
                    onEndEditing={() => {
                      setMode(0);
                    }}>
                    {'Mode = ' + mode}
                  </TextInput>
                )}
              </View>
            </TouchableOpacity>

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
      </MenuProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  liftText: Style_LiftText,
});
