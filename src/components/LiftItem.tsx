import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Lift, LiftSet} from '../types/workout';
import LiftEditorModal from './LiftEditorModal';
import {LiftDef, NormalizedSet, PlateCount, TrainingMax} from '../types/types';
import Utils from './Utils';
import {Style_LiftText} from './Common';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';

export default function LiftItem(props: {
  lift: Lift;
  tm?: TrainingMax;
  onLiftChanged: (lift: Lift) => void;
  onViewLog: (lift: Lift) => void;
}) {
  //const [lift, setLift] = useState<Lift>(props.lift);
  const [editing, setEditing] = useState(false);
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);

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
          {defs.get(props.lift.id)!.name}
        </Text>
        <View
          style={{
            width: '20%',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Image style={{}} source={require('../icons/edit.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <ReadOnlySetTable
        lift={props.lift}
        tm={props.tm}
        def={defs.get(props.lift.id)!}></ReadOnlySetTable>
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

function ReadOnlySetTable(props: {lift: Lift; tm?: TrainingMax; def: LiftDef}) {
  function calcPlates(weight: string): PlateCount | undefined {
    // Just using string since it already accounts for percentage lifts
    var n = parseInt(weight.replace('lb', ''));
    return Utils.calcPlates(props.def.type, n);
  }

  return (
    <View>
      <SetHeader></SetHeader>
      <View>
        {Utils.normalizeSets(props.lift.sets, props.tm).map((set, index) => (
          <SetItem
            set={set}
            key={index}
            plates={calcPlates(set.weight)}></SetItem>
        ))}
      </View>
    </View>
  );
}

function SetHeader() {
  const {colors} = useTheme();
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Set
      </Text>
      <Text style={[styles.liftHeader, {width: '60%', color: colors.text}]}>
        Weight
      </Text>
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Reps
      </Text>
    </View>
  );
}

function SetItem(props: {set: NormalizedSet; plates?: PlateCount}) {
  const {colors} = useTheme();
  var weight = props.set.weight;

  /*
  TODO disabling for now but need setting
  if (props.plates !== undefined) {
    console.log(props.plates);
    if (props.plates.p45) weight += ' 45(' + props.plates.p45 + ')';
    if (props.plates.p25) weight += ' 25(' + props.plates.p25 + ')';
    if (props.plates.p10) weight += ' 10(' + props.plates.p10 + ')';
    if (props.plates.p5) weight += ' 5(' + props.plates.p5 + ')';
    if (props.plates.p2point5) weight += ' 2.5(' + props.plates.p2point5 + ')';
  }
  */

  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{width: '20%', textAlign: 'center', color: colors.text}}>
        {props.set.label}
      </Text>
      <Text style={{width: '60%', textAlign: 'center', color: colors.text}}>
        {weight}
      </Text>
      <Text style={{width: '20%', textAlign: 'center', color: colors.text}}>
        {props.set.reps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  liftHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
