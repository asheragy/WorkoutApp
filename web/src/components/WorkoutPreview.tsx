import { Fragment } from 'react';
import { Lift, isLiftGroup, Workout } from '@shared/types/workout.ts';
import { SystemLiftDefs as liftDefs } from '@shared/LiftDatabase.ts';

type Props = {
  workout: Workout;
};

const nameStyle = { textAlign: 'left' as const, padding: '2px 8px 2px 0' };
const countStyle = { textAlign: 'right' as const, padding: '2px 0' };
const INDENT = '  '; // two non-breaking spaces so the indent survives HTML whitespace collapsing

function LiftRow({ lift, indent }: { lift: Lift; indent?: boolean }) {
  return (
    <tr>
      <td style={nameStyle}>
        {indent && INDENT}
        {liftDefs[lift.id].displayName}
      </td>
      <td style={countStyle}>{lift.sets.length}</td>
    </tr>
  );
}

// Read-only text summary of a workout: lift name on the left, set count on the right.
export default function WorkoutPreview({ workout }: Props) {
  return (
    <table style={{ borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
      <tbody>
        {workout.items.map(item =>
          isLiftGroup(item) ? (
            <Fragment key={item.instanceId}>
              <tr>
                <td style={{ ...nameStyle, fontStyle: 'italic' }}>One of</td>
                <td />
              </tr>
              {item.lifts.map(lift => (
                <LiftRow key={lift.instanceId} lift={lift} indent />
              ))}
            </Fragment>
          ) : (
            <LiftRow key={item.instanceId} lift={item} />
          ),
        )}
      </tbody>
    </table>
  );
}
