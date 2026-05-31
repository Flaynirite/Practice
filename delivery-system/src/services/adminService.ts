
export class AdminService {
  static readonly ADMINS_CONFIG_KEY = 'deliveryco_admins_config';


  static getAdminsList(): string[] {
    try {
      const config = localStorage.getItem(this.ADMINS_CONFIG_KEY);
      if (config) {
        return JSON.parse(config);
      }
    } catch (error) {
      console.error('Error reading admin config:', error);
    }
    

    return [
      'admin@deliveryco.com',
      'maksymkucheruk2@gmail.com',
      'superadmin@deliveryco.com'
    ];
  }


  static saveAdminsList(emails: string[]): void {
    localStorage.setItem(this.ADMINS_CONFIG_KEY, JSON.stringify(emails));
  }


  static addAdmin(email: string): boolean {
    const admins = this.getAdminsList();
    const emailLower = email.toLowerCase().trim();
    
    if (admins.includes(emailLower)) {
      return false; 
    }
    
    admins.push(emailLower);
    this.saveAdminsList(admins);
    

    this.updateUserAdminStatusByEmail(emailLower, true);
    
    return true;
  }


  static removeAdmin(email: string): boolean {
    const admins = this.getAdminsList();
    const emailLower = email.toLowerCase().trim();
    
    if (admins.length <= 1) {
      return false; 
    }
    
    const index = admins.indexOf(emailLower);
    if (index === -1) {
      return false; 
    }
    
    admins.splice(index, 1);
    this.saveAdminsList(admins);
    
    
    this.updateUserAdminStatusByEmail(emailLower, false);
    
    return true;
  }

  
  static isAdminEmail(email: string): boolean {
    const admins = this.getAdminsList();
    return admins.includes(email.toLowerCase().trim());
  }

  
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

  
  private static updateUserAdminStatusByEmail(email: string, isAdmin: boolean): void {
    const users = JSON.parse(localStorage.getItem('deliveryco_users') || '[]');
    const emailLower = email.toLowerCase().trim();
    
    const userIndex = users.findIndex((u: any) => 
      u.email.toLowerCase() === emailLower
    );
    
    if (userIndex !== -1) {
      users[userIndex].isAdmin = isAdmin;
      localStorage.setItem('deliveryco_users', JSON.stringify(users));
      
      
      const currentSession = JSON.parse(localStorage.getItem('deliveryco_session') || 'null');
      if (currentSession && currentSession.email.toLowerCase() === emailLower) {
        currentSession.isAdmin = isAdmin;
        localStorage.setItem('deliveryco_session', JSON.stringify(currentSession));
      }
    }
  }

  
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