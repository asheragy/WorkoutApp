import {useTheme} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import LiftRepository from '../../data/LiftRepository';
import {Lift} from '../../types/types';
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

  const onSetChange = (index: number, weight: number, reps: number) => {
    // TODO temp logging
    console.log('onSetChange index=' + index);
    var updatedLift = {...lift};
    updatedLift.sets.forEach(x =>
      console.log('  ' + x.weight.value + ' x ' + x.reps.value),
    );

    var updatedSets = lift.sets.map((set, idx) => {
      if (index == idx) {
        set.reps.value = reps;
        set.weight.value = weight;
      }

      return set;
    });
    //updatedLift.sets[index].weight.value = weight;
    //updatedLift.sets[index].reps.value = reps;
    console.log('after value changes');
    updatedLift.sets.forEach(x =>
      console.log('  ' + x.weight.value + ' x ' + x.reps.value),
    );

    setLift(prevState => ({
      ...prevState,
      sets: updatedSets,
    }));

    LiftRepository.saveLift(updatedLift);
  };

  if (lift.persisted) {
    useEffect(() => {
      LiftRepository.getLift(lift.def.id).then(result => {
        if (result != null) {
          // TODO this loses the range
          lift.sets = Utils.persistedToSets(result);
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
          <SetItem number={index + 1} set={set} key={index}></SetItem>
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