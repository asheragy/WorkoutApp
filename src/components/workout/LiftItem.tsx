import {useTheme} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import LiftRepository from '../../data/LiftRepository';
import {Lift, LiftSet} from '../../types/types';
import Utils from '../Utils';
import {Style_LiftText} from './Common';
import LiftEditorModal from './LiftEditorModal';
import {SetHeader, SetItem} from './SetRows';

export default function LiftItem(props: {
  lift: Lift;
  onViewLog: (lift: Lift) => void;
}) {
  const showHeader = props.lift.sets.length > 0;
  const [lift, setLift] = useState<Lift>(props.lift);
  const [editing, setEditing] = useState(false);
  const {colors} = useTheme();

  const onSetChange = (index: number, updatedSet: LiftSet) => {
    console.log('onSetChange index=' + index);
    var updatedLift = {...lift};

    console.log('before update');

    updatedLift.sets.forEach(x =>
      console.log('  ' + x.weight + ' x ' + x.reps + ' ' + x.warmup),
    );

    updatedLift.sets[index] = updatedSet;
    console.log('after update');
    updatedLift.sets.forEach(x =>
      console.log('  ' + x.weight + ' x ' + x.reps + ' ' + x.warmup),
    );

    setLift(prevState => ({
      ...prevState,
      sets: updatedLift.sets,
    }));

    LiftRepository.saveLift(updatedLift);
  };

  if (lift.persisted) {
    useEffect(() => {
      LiftRepository.getLift(lift.def.id).then(result => {
        if (result != null) {
          lift.sets = Utils.persistedToSets(result, lift.sets);
          setLift(lift);
        }
      });
    }, []);
  }

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
          {lift.persisted && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Image style={{}} source={require('../../icons/edit.png')} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showHeader && <SetHeader></SetHeader>}
      <View>
        {Utils.normalizeSets(lift.sets).map((set, index) => (
          <SetItem set={set} key={index}></SetItem>
        ))}
      </View>
      {lift.persisted && (
        <View>
          <LiftEditorModal
            editing={editing}
            lift={lift}
            onSetChange={onSetChange}
            onViewLog={() => props.onViewLog(lift)}
            onFinish={() => setEditing(false)}></LiftEditorModal>
        </View>
      )}
    </View>
  );
}
