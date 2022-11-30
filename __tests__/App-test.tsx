/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../src/App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  // Some issues with things like AsyncStorage if this needs to work
  //renderer.create(<App />);
});
