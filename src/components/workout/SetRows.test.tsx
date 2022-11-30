import React from 'react';
import {SetItem} from './SetRows';
import {render} from '@testing-library/react-native';

export {};

test('static set row renders values', () => {
  const {getByText} = render(
    <SetItem
      set={{
        weight: '100lb',
        reps: '10',
        label: '2',
      }}
    />,
  );

  getByText('2');
  getByText('100lb');
  getByText('10');

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
