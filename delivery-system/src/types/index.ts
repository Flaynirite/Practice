// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Item {
  id?: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  deliveryCountry: string;
  items: Item[];
  status: 'Створено' | 'В обробці' | 'Доставлено' | 'Скасовано';
  createdAt: string;
  updatedAt?: string;
}