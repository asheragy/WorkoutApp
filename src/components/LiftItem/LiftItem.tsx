import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {Lift} from '../../types/workout';
import LiftEditorModal from '../LiftEditorModal';
import Utils from '../Utils';
import {Style_LiftText} from '../Common';
import {useSelector} from 'react-redux';
import {AppState} from '../../state/store';
import {ReadOnlySetTable} from './ReadOnlySetTable';

export default function LiftItem(props: {
  lift: Lift;
  onLiftChanged: (lift: Lift) => void;
  onViewLog: (lift: Lift) => void;
}) {
  const [editing, setEditing] = useState(false);
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const def = defs[props.lift.id];

  const onFinishEdit = (lift: Lift) => {
    const updatedLift: Lift = {...props.lift};
    // TODO just do straight override?
    updatedLift.sets = lift.sets;
    updatedLift.goals = lift.goals;

    props.onLiftChanged(updatedLift);
    setEditing(false);
  };

  const onToggleHide = () => {
    let updatedLift: Lift = {...props.lift};
    updatedLift.hide = updatedLift.hide ? undefined : true;

    props.onLiftChanged(updatedLift);
    setEditing(false);
  };

  const completed =
    props.lift.hide ||
    (props.lift.sets.length > 0 && props.lift.sets.every(set => set.completed));

  const headerText: StyleProp<TextStyle> = {
    color: props.lift.hide ? colors.border : colors.text,
    textDecorationLine: completed ? 'line-through' : undefined,
    textDecorationStyle: completed ? 'solid' : undefined,
  };

  return (
    <View style={{marginVertical: 0}}>
      <View
        style={{
          marginVertical: 8,
          flexDirection: 'row',
        }}>
        <View style={{width: '20%'}}></View>
        <Text style={[Style_LiftText, headerText, {width: '60%'}]}>
          {Utils.defToString(def)}
        </Text>
        <View
          style={{
            width: '20%',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Image style={{}} source={require('../../icons/edit.png')} />
          </TouchableOpacity>
        </View>
      </View>
      {!completed && (
        <ReadOnlySetTable lift={props.lift} def={def}></ReadOnlySetTable>
      )}
      <View>
        <LiftEditorModal
          editing={editing}
          lift={props.lift}
          onViewLog={() => props.onViewLog(props.lift)}
          onToggleHide={onToggleHide}
          onFinish={onFinishEdit}></LiftEditorModal>
      </View>
    </View>
  );
}
