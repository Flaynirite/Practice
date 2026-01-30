// src/services/adminService.ts (додаємо нові функції)
export class AdminService {
  static readonly ADMINS_CONFIG_KEY = 'deliveryco_admins_config';

  // Отримати список адмінів з конфігурації
  static getAdminsList(): string[] {
    try {
      const config = localStorage.getItem(this.ADMINS_CONFIG_KEY);
      if (config) {
        return JSON.parse(config);
      }
    } catch (error) {
      console.error('Error reading admin config:', error);
    }
    
    // Повертаємо дефолтний список
    return [
      'admin@deliveryco.com',
      'maksymkucheruk2@gmail.com',
      'superadmin@deliveryco.com'
    ];
  }

  // Зберегти список адмінів
  static saveAdminsList(emails: string[]): void {
    localStorage.setItem(this.ADMINS_CONFIG_KEY, JSON.stringify(emails));
  }

  // Додати нового адміна
  static addAdmin(email: string): boolean {
    const admins = this.getAdminsList();
    const emailLower = email.toLowerCase().trim();
    
    if (admins.includes(emailLower)) {
      return false; // Вже є в списку
    }
    
    admins.push(emailLower);
    this.saveAdminsList(admins);
    
    // Оновлюємо права користувача в базі
    this.updateUserAdminStatusByEmail(emailLower, true);
    
    return true;
  }

  // Видалити адміна (не можна видалити останнього)
  static removeAdmin(email: string): boolean {
    const admins = this.getAdminsList();
    const emailLower = email.toLowerCase().trim();
    
    if (admins.length <= 1) {
      return false; // Не можна видалити останнього адміна
    }
    
    const index = admins.indexOf(emailLower);
    if (index === -1) {
      return false; // Не знайдено
    }
    
    admins.splice(index, 1);
    this.saveAdminsList(admins);
    
    // Оновлюємо права користувача в базі
    this.updateUserAdminStatusByEmail(emailLower, false);
    
    return true;
  }

  // Перевірити, чи email є в списку адмінів
  static isAdminEmail(email: string): boolean {
    const admins = this.getAdminsList();
    return admins.includes(email.toLowerCase().trim());
  }

  // Синхронізувати права адмінів з користувачами
  static syncAdminPermissions(): void {
    const admins = this.getAdminsList();
    const users = JSON.parse(localStorage.getItem('deliveryco_users') || '[]');
    
    let changed = false;
    
    users.forEach((user: any) => {
      const shouldBeAdmin = admins.includes(user.email.toLowerCase());
      if (user.isAdmin !== shouldBeAdmin) {
        user.isAdmin = shouldBeAdmin;
        changed = true;
      }
    });
    
    if (changed) {
      localStorage.setItem('deliveryco_users', JSON.stringify(users));
      
      // Оновити поточну сесію, якщо потрібно
      const currentSession = JSON.parse(localStorage.getItem('deliveryco_session') || 'null');
      if (currentSession) {
        const currentUser = users.find((u: any) => u.id === currentSession.id);
        if (currentUser) {
          currentSession.isAdmin = currentUser.isAdmin;
          localStorage.setItem('deliveryco_session', JSON.stringify(currentSession));
        }
      }
    }
  }

  // Нова функція: оновити статус адміна за email
  private static updateUserAdminStatusByEmail(email: string, isAdmin: boolean): void {
    const users = JSON.parse(localStorage.getItem('deliveryco_users') || '[]');
    const emailLower = email.toLowerCase().trim();
    
    const userIndex = users.findIndex((u: any) => 
      u.email.toLowerCase() === emailLower
    );
    
    if (userIndex !== -1) {
      users[userIndex].isAdmin = isAdmin;
      localStorage.setItem('deliveryco_users', JSON.stringify(users));
      
      // Оновити поточну сесію, якщо це поточний користувач
      const currentSession = JSON.parse(localStorage.getItem('deliveryco_session') || 'null');
      if (currentSession && currentSession.email.toLowerCase() === emailLower) {
        currentSession.isAdmin = isAdmin;
        localStorage.setItem('deliveryco_session', JSON.stringify(currentSession));
      }
    }
  }

  // Нова функція: отримати всіх адмінів з повною інформацією
  static getAllAdminsWithInfo(): any[] {
    const admins = this.getAdminsList();
    const users = JSON.parse(localStorage.getItem('deliveryco_users') || '[]');
    
    return admins.map(email => {
      const user = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      return {
        email,
        name: user?.name || 'Невідомий користувач',
        id: user?.id || null,
        isActive: !!user
      };
    });
  }
}