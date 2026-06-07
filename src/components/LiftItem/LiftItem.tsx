import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { Lift } from '../../types/workout';
import Utils from '../Utils';
import { Style_LiftText } from '../Common';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store';
import { ReadOnlySetTable } from './ReadOnlySetTable';
import { LiftDef } from '../../types/types.ts';

export default function LiftItem(props: {
  lift: Lift;
  overrideComplete: boolean;
  onEdit: () => void;
  groupOrder?: number;
}) {
  const { colors } = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const def = defs[props.lift.id];

  const completed =
    props.lift.hide ||
    props.overrideComplete ||
    (props.lift.sets.length > 0 && props.lift.sets.every(set => set.completed));

  const headerText: StyleProp<TextStyle> = {
    color:
      props.lift.hide || props.overrideComplete ? colors.border : colors.text,
    textDecorationLine: completed ? 'line-through' : undefined,
    textDecorationStyle: completed ? 'solid' : undefined,
  };

  return (
    <View
      style={{
        marginBottom: 0,
      }}
    >
      <View
        style={{
          marginVertical: 8,
          flexDirection: 'row',
        }}
      >
        <View style={{ width: '20%' }}></View>
        <Text style={[Style_LiftText, headerText, { width: '60%' }]}>
          {getTitle(def, props.lift)}
        </Text>
        <View
          style={{
            width: '20%',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity onPress={props.onEdit}>
            <Image style={{}} source={require('../../icons/edit.png')} />
          </TouchableOpacity>
        </View>
      </View>
      {!completed && (
        <ReadOnlySetTable lift={props.lift} def={def}></ReadOnlySetTable>
      )}
    </View>
  );
}

function getTitle(def: LiftDef, lift: Lift): string {
  let t = Utils.defToString(def);
  if (lift.alternate) t += ' / Alt';

  const goalPercent = Utils.goalPercent(def, lift);
  if (goalPercent) t += ' ' + (goalPercent * 100).toFixed(2) + '%';

  return t;
}
