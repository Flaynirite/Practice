// src/utils/validators.ts
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\+?[\d\s\-\(\)]{10,}$/;
  return re.test(phone);
};

export const formatValidationError = (field: string, value: string): string => {
  switch (field) {
    case 'email':
      return !validateEmail(value) ? 'Невірний формат email' : '';
    case 'password':
      return !validatePassword(value) ? 'Пароль має містити мінімум 6 символів' : '';
    case 'name':
      return !validateName(value) ? "Ім'я має містити мінімум 2 символи" : '';
    case 'phone':
      return !validatePhone(value) ? 'Невірний формат телефону' : '';
    default:
      return '';
  }
};