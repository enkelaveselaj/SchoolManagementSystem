import { validateEmail, validatePassword, validateUsername, getPasswordStrength } from '../validators';

describe('Validators', () => {
  test('validateEmail accepts valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  test('validateEmail rejects invalid email', () => {
    expect(validateEmail('invalid.email')).toBe(false);
  });

  test('validatePassword enforces rules', () => {
    expect(validatePassword('Password1')).toBe(true);
    expect(validatePassword('short')).toBe(false);
    expect(validatePassword('noupper1')).toBe(false);
  });

  test('validateUsername rules', () => {
    expect(validateUsername('user_name')).toBe(true);
    expect(validateUsername('ab')).toBe(false);
  });

  test('getPasswordStrength returns numeric score', () => {
    expect(typeof getPasswordStrength('Password1!')).toBe('number');
  });
});

