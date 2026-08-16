export type FieldError = string | null;

export interface LoginValues {
  username: string;
  password: string;
}

export interface LoginErrors {
  username: FieldError;
  password: FieldError;
}

/**
 * Validate login form fields. Only checks that fields are non-empty
 * (no format rules). Returns an errors object; null values mean valid.
 */
export function validateLogin(
  values: LoginValues,
  messages: {
    usernameRequired: string;
    passwordRequired: string;
  }
): LoginErrors {
  const errors: LoginErrors = { username: null, password: null };

  if (!values.username.trim()) {
    errors.username = messages.usernameRequired;
  }

  if (!values.password) {
    errors.password = messages.passwordRequired;
  }

  return errors;
}
