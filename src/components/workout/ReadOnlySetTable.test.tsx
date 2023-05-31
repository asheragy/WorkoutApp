import React from 'react';
import {ReadOnlySetTable} from './ReadOnlySetTable';
import {render} from '@testing-library/react-native';
import {LiftType} from '../../types/types';

export {};

test('static ReadOnlySetTable renders values', () => {
  const {getByText} = render(
    <ReadOnlySetTable
      lift={{
        def: {
          id: '',
          name: '',
          type: LiftType.Barbell,
        },
        sets: [
          {
            weight: 100,
            reps: 10,
            warmup: true,
          },
          {
            weight: 120,
            reps: 8,
          },
        ],
      }}
    />,
  );

  getByText('W');
  getByText('100lb');
  getByText('10');

  getByText('1');
  getByText('120lb');
  getByText('8');

  /* Alternate way
  var setItem = renderer.create(
    <SetItem
      set={{
        weight: '100lb',
        reps: '10',
        label: '2',
      }}
    />,
  );

  var textFields = setItem.root.findAllByType(Text);

  expect(textFields[0].props.children).toBe('2');
  expect(textFields[1].props.children).toBe('100lb');
  expect(textFields[2].props.children).toBe('10');
  */
});
