import React from 'react';
import renderer, { act } from 'react-test-renderer';

// Mock useAuth hook to isolate the component from store/network
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isLoading: false,
    user: null,
  }),
}));

import LoginScreen from '../auth/LoginScreen';

it('renders LoginScreen without crashing', () => {
  let tree;
  act(() => {
    tree = renderer.create(<LoginScreen navigation={{ navigate: () => {} }} />);
  });
  expect(tree.toJSON()).toBeTruthy();
});

