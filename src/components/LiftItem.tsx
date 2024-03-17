import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import {Lift, LiftSet} from '../types/workout';
import LiftEditorModal from './LiftEditorModal';
import {
  GlobalSettings,
  LiftDef,
  NormalizedSet,
  PlateCount,
} from '../types/types';
import Utils from './Utils';
import {Style_LiftText} from './Common';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';

export default function LiftItem(props: {
  lift: Lift;
  onLiftChanged: (lift: Lift) => void;
  onViewLog: (lift: Lift) => void;
}) {
  //const [lift, setLift] = useState<Lift>(props.lift);
  const [editing, setEditing] = useState(false);
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const def = defs.get(props.lift.id)!;

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
            <Image style={{}} source={require('../icons/edit.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <ReadOnlySetTable lift={props.lift} def={def}></ReadOnlySetTable>
      <View>
        <LiftEditorModal
          editing={editing}
          lift={props.lift}
          onViewLog={() => props.onViewLog(props.lift)}
          onFinish={sets => {
            onSetsChanged(sets);
            setEditing(false);
          }}></LiftEditorModal>
      </View>
    </View>
  );
}

function ReadOnlySetTable(props: {lift: Lift; def: LiftDef}) {
  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  function calcPlates(weight: string): PlateCount | undefined {
    if (settings.plateCount != true) return undefined;

    // Just using string since it already accounts for percentage lifts
    var n = parseFloat(weight.replace('lb', ''));
    return Utils.calcPlates(props.def.type, n);
  }

  return (
    <View>
      <SetHeader showPlateCount={settings.plateCount == true}></SetHeader>
      <View>
        {Utils.normalizeSets(props.lift.sets, props.def).map((set, index) => (
          <SetItem
            set={set}
            key={index}
            showPlateCount={settings.plateCount == true}
            plates={calcPlates(set.weight)}></SetItem>
        ))}
      </View>
    </View>
  );
}

function SetHeader(props: {showPlateCount: boolean}) {
  const {colors} = useTheme();
  const weightWidth = props.showPlateCount ? '30%' : '60%';

  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Set
      </Text>
      <Text
        style={[styles.liftHeader, {width: weightWidth, color: colors.text}]}>
        Weight
      </Text>
      {props.showPlateCount && (
        <Text
          style={[
            styles.liftHeader,
            {width: '30%', color: colors.text},
          ]}></Text>
      )}
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Reps
      </Text>
    </View>
  );
}

function SetItem(props: {
  set: NormalizedSet;
  plates?: PlateCount;
  showPlateCount: boolean;
}) {
  const {colors} = useTheme();
  var weight = props.set.weight;
  const weightWidth = props.showPlateCount ? '30%' : '60%';

  const textStyle: StyleProp<TextStyle> = {
    color: colors.text,
    textDecorationLine: props.set.completed ? 'line-through' : undefined,
    textDecorationStyle: props.set.completed ? 'solid' : undefined,
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          width: '20%',
          textAlign: 'center',
          ...textStyle,
        }}>
        {props.set.label}
      </Text>
      <Text
        style={{
          width: weightWidth,
          textAlign: 'center',
          ...textStyle,
        }}>
        {weight}
      </Text>
      {props.showPlateCount && (
        <Text style={{width: '30%', textAlign: 'left', ...textStyle}}>
          {props.plates ? Utils.platesToString(props.plates) : ''}
        </Text>
      )}
      <Text
        style={{
          width: '20%',
          textAlign: 'center',
          ...textStyle,
        }}>
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
