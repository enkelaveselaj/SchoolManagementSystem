export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  // At least 6 characters, 1 uppercase, 1 number
  const re = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  return re.test(password);
}

export function validateUsername(username) {
  // At least 3 characters, alphanumeric and underscore only
  return /^[a-z0-9_]{3,}$/i.test(username);
}

export function getPasswordStrength(password) {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  return strength;
}

export function getPasswordStrengthLabel(strength) {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return labels[strength] || 'Very Weak';
}

