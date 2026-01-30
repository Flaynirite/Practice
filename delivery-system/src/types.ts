// src/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  isAdmin?: boolean;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  avatar?: string;
}

export interface Item {
  id?: string;
  title: string;
  price: number;
  quantity: number;
  link?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string; // Додаємо ім'я користувача для адмін панелі
  deliveryCountry: string;
  items: Item[];
  status: 'Створено' | 'В обробці' | 'Доставлено' | 'Скасовано';
  createdAt: string;
  updatedAt?: string;
  totalPrice?: number;
  shippingPrice?: number;
  deliveryTime?: string;
  estimatedDelivery?: string;
}