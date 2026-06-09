import authService from '../authService';
import api from '../api';

jest.mock('../api');
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('login success stores token and returns user', async () => {
    const fakeResponse = { data: { token: 'abc123', user: { id: 1, firstName: 'Test' } } };
    api.post.mockResolvedValueOnce(fakeResponse);

    const result = await authService.login('test@example.com', 'Password1');

    expect(result.success).toBe(true);
    expect(result.token).toBe('abc123');
    expect(result.user).toEqual({ id: 1, firstName: 'Test' });
  });

  test('login failure returns error', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });

    const result = await authService.login('test@example.com', 'wrong');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });
});

