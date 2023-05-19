import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Lift, LiftSet} from '../../types/workout';
import Utils from '../Utils';
import {Style_LiftText} from './Common';
import LiftEditorModal from './LiftEditorModal';
import {SetHeader, SetItem} from './SetRows';
import {TrainingMax} from '../../types/types';

export default function LiftItem(props: {
  lift: Lift;
  tm?: TrainingMax;
  onLiftChanged: (lift: Lift) => void;
  onViewLog: (lift: Lift) => void;
}) {
  const showHeader = props.lift.sets.length > 0;
  //const [lift, setLift] = useState<Lift>(props.lift);
  const [editing, setEditing] = useState(false);
  const {colors} = useTheme();

  const onSetsChanged = (updatedSets: LiftSet[]) => {
    var updatedLift: Lift = {...props.lift};
    updatedLift.sets = updatedSets;

    props.onLiftChanged(updatedLift);
  };

  return (
    <View style={{marginVertical: 0}}>
      <View
        style={{
          marginVertical: 8,
          flexDirection: 'row',
        }}>
        <Text style={{width: '20%'}}></Text>
        <Text style={[Style_LiftText, {color: colors.text, width: '60%'}]}>
          {props.lift.def.name}
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
      {showHeader && <SetHeader></SetHeader>}
      <View>
        {Utils.normalizeSets(props.lift.sets, props.tm).map((set, index) => (
          <SetItem set={set} key={index}></SetItem>
        ))}
      </View>
      <View>
        <LiftEditorModal
          editing={editing}
          lift={props.lift}
          tm={props.tm}
          onViewLog={() => props.onViewLog(props.lift)}
          onFinish={sets => {
            onSetsChanged(sets);
            setEditing(false);
          }}></LiftEditorModal>
      </View>
    </View>
  );
}
