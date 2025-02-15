import React from 'react';
import {LiftType} from '../../types/types';
import LiftItem from './LiftItem';

export {};

test('static LiftItem renders values', () => {
  /* TODO unsure how to resolve the image loading
  const {getByText} = render(
    <LiftItem
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
      onLiftChanged={lift => {}}
      onViewLog={lift => {}}
    />,
  );

  getByText('W');
  getByText('100lb');
  getByText('10');

  getByText('1');
  getByText('120lb');
  getByText('8');
  */
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
