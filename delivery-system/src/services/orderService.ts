// src/services/orderService.ts
export interface Item {
  id: string;
  title: string;
  price: number;
  quantity: number;
  currency?: string;
  originCountry?: string;
  weight?: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  deliveryCountry: string;
  items: Item[];
  status: 'Створено' | 'В обробці' | 'Доставлено' | 'Скасовано';
  createdAt: string;
  updatedAt?: string;
  totalPrice?: number;
  customsDetails?: {
    customsDuty: number;
    vat: number;
    customsFee: number;
    totalDuties: number;
  };
  shippingCost?: number;
  exchangeRates?: any[];
}

export class OrderService {
  static readonly ORDERS_KEY = 'orders';

  // Отримати всі замовлення
  static getAllOrders(): Order[] {
    try {
      const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
      return orders;
    } catch {
      return [];
    }
  }

  // Отримати замовлення користувача
  static getUserOrders(userId: string): Order[] {
    const orders = this.getAllOrders();
    return orders.filter(order => order.userId === userId);
  }

  // Створити нове замовлення
  static createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const orders = this.getAllOrders();
    
    // Генеруємо ID замовлення
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      totalPrice: orderData.totalPrice || 0
    };
    
    orders.push(newOrder);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    
    return newOrder;
  }

  // Оновити статус замовлення
  static updateOrderStatus(orderId: string, newStatus: Order['status']): boolean {
    const orders = this.getAllOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return false;
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    return true;
  }

  // Видалити замовлення
  static deleteOrder(orderId: string): boolean {
    const orders = this.getAllOrders();
    const filteredOrders = orders.filter(order => order.id !== orderId);
    
    if (filteredOrders.length === orders.length) {
      return false;
    }
    
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(filteredOrders));
    return true;
  }

  // Отримати статистику
  static getOrdersStats() {
    const orders = this.getAllOrders();
    
    return {
      total: orders.length,
      created: orders.filter(o => o.status === 'Створено').length,
      processing: orders.filter(o => o.status === 'В обробці').length,
      delivered: orders.filter(o => o.status === 'Доставлено').length,
      cancelled: orders.filter(o => o.status === 'Скасовано').length
    };
  }

  // Нова функція: отримати детальну інформацію про замовлення
  static getOrderDetails(orderId: string): Order | null {
    const orders = this.getAllOrders();
    return orders.find(order => order.id === orderId) || null;
  }
}