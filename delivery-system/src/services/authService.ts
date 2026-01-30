// src/services/authService.ts - ПОВНІСТЮ ВИДАЛЕНІ ВСІ ПЕРЕВІРКИ
export class AuthService {
  private static readonly USERS_KEY = 'deliveryco_users';
  private static readonly SESSION_KEY = 'deliveryco_session';
  
  // ДОДАЙ СВІЙ EMAIL СЮДИ
  private static readonly ADMIN_EMAILS = [
    'admin@deliveryco.com',
    'maksymkucheruk2@gmail.com',
    'superadmin@deliveryco.com',
    'твій_емейл@gmail.com' // ← ЗАМІНИ ЦЕ НА СВІЙ EMAIL
  ];

  static getCurrentSession() {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setCurrentSession(session: any) {
    if (session) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  static getAllUsers() {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveUsers(users: any[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static async register(userData: { name: string; email: string; password: string }) {
    const users = this.getAllUsers();
    
    const existingUser = users.find((u: any) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('Користувач з таким email вже існує');
    }

    const passwordHash = btoa(userData.password);

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
      // АДМІН ПО EMAIL - БЕЗ ПИТАНЬ!
      isAdmin: this.ADMIN_EMAILS.includes(userData.email.toLowerCase()),
      phone: '',
      address: '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=4f46e5&color=fff`
    };

    users.push(newUser);
    this.saveUsers(users);

    const session = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin, // БЕЗ ПЕРЕВІРОК!
      avatar: newUser.avatar
    };

    this.setCurrentSession(session);
    return session;
  }

  static login(email: string, password: string) {
    const users = this.getAllUsers();
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Користувача не знайдено');
    }

    const passwordHash = btoa(password);
    if (user.passwordHash !== passwordHash) {
      throw new Error('Невірний пароль');
    }

    // КРИТИЧНО ВАЖЛИВО: ВСІ ВИБРАНІ EMAIL АДМІНИ
    const isAdmin = this.ADMIN_EMAILS.includes(email.toLowerCase());

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: isAdmin, // БЕЗ user.isAdmin, ЛИШЕ ПО СПИСКУ!
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff`
    };

    this.setCurrentSession(session);
    return session;
  }

  static logout() {
    this.setCurrentSession(null);
  }

  static updateUserProfile(userId: string, updates: any) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Користувача не знайдено');
    }

    const user = users[userIndex];

    if (updates.name) user.name = updates.name.trim();
    if (updates.email) {
      const emailLower = updates.email.trim().toLowerCase();
      const emailExists = users.some((u: any, index: number) => 
        index !== userIndex && u.email.toLowerCase() === emailLower
      );
      if (emailExists) {
        throw new Error('Цей email вже використовується');
      }
      user.email = emailLower;
      // АВТОМАТИЧНО АДМІН, ЯКЩО EMAIL У СПИСКУ
      if (this.ADMIN_EMAILS.includes(emailLower)) {
        user.isAdmin = true;
      }
    }
    if (updates.password) {
      if (updates.password.length < 6) {
        throw new Error('Пароль має містити мінімум 6 символів');
      }
      user.passwordHash = btoa(updates.password);
    }
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.address !== undefined) user.address = updates.address;
    if (updates.avatar !== undefined) user.avatar = updates.avatar;
    // ВИДАЛИВ ПЕРЕВІРКУ НА updates.isAdmin - ВИРІШУЄМО ЛИШЕ ПО EMAIL

    this.saveUsers(users);

    const updatedSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: this.ADMIN_EMAILS.includes(user.email.toLowerCase()), // ВСЕГДА ПЕРЕВІРЯЄМО!
      avatar: user.avatar
    };

    this.setCurrentSession(updatedSession);
    return updatedSession;
  }

  // ВИДАЛИВ ВСІ ПЕРЕВІРКИ НА АДМІНА - ДОСТУП У ВСІХ!
  static getAllUsersForAdmin() {
    const users = this.getAllUsers();
    return users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: this.ADMIN_EMAILS.includes(user.email.toLowerCase()), // ПЕРЕВІРКА ТІЛЬКИ ПО EMAIL
      createdAt: user.createdAt,
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar,
      ordersCount: this.getUserOrdersCount(user.id)
    }));
  }

  static getUserOrdersCount(userId: string) {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      return orders.filter((order: any) => order.userId === userId).length;
    } catch {
      return 0;
    }
  }

  static updateUserAdminStatus(userId: string, isAdmin: boolean) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Користувача не знайдено');
    }

    // МОЖНА ЗМІНИТИ, АЛЕ ПРИ НАСТУПНОМУ LOGIN ВСЕ ОНОВИТЬСЯ ПО EMAIL
    users[userIndex].isAdmin = isAdmin;
    this.saveUsers(users);

    const currentSession = this.getCurrentSession();
    if (currentSession && currentSession.id === userId) {
      currentSession.isAdmin = isAdmin;
      this.setCurrentSession(currentSession);
    }

    return true;
  }

  static deleteUser(userId: string) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Користувача не знайдено');
    }

    users.splice(userIndex, 1);
    this.saveUsers(users);
    return true;
  }

  static getStatistics() {
    const users = this.getAllUsers();
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    return {
      totalUsers: users.length,
      totalAdmins: users.filter((u: any) => 
        this.ADMIN_EMAILS.includes(u.email.toLowerCase())
      ).length,
      totalOrders: orders.length,
      activeOrders: orders.filter((o: any) => 
        o.status !== 'Доставлено' && o.status !== 'Скасовано'
      ).length,
      deliveredOrders: orders.filter((o: any) => o.status === 'Доставлено').length,
      cancelledOrders: orders.filter((o: any) => o.status === 'Скасовано').length,
      totalRevenue: orders.reduce((sum: number, order: any) => {
        const orderTotal = order.items.reduce((itemSum: number, item: any) => 
          itemSum + (item.price * item.quantity), 0
        );
        return sum + orderTotal;
      }, 0)
    };
  }
}