import React from 'react';
import renderer from 'react-test-renderer';
import LoginScreen from '../auth/LoginScreen';

it('renders LoginScreen without crashing', () => {
  const tree = renderer.create(<LoginScreen navigation={{ navigate: () => {} }} />).toJSON();
  expect(tree).toBeTruthy();
});

