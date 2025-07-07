// utils/UserManager.js

export const UserManager = {
  getSavedUser: () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }

      const savedUser = localStorage.getItem("user");
      if (!savedUser) return null;

      const userData = JSON.parse(savedUser);

      if (!userData || typeof userData !== 'object') {
        console.warn('Invalid user data in localStorage');
        localStorage.removeItem("user");
        return null;
      }

      // Minimal validation
      if (!userData._id && !userData.id) {
        console.warn('User data missing ID field');
        localStorage.removeItem("user");
        return null;
      }

      return userData;
    } catch (err) {
      console.error('Error parsing user data from localStorage:', err);
      localStorage.removeItem("user");
      return null;
    }
  },

  saveUser: (userData) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (!userData || typeof userData !== 'object') {
          console.error('Invalid user data for saveUser');
          return false;
        }

        localStorage.setItem("user", JSON.stringify(userData));
        console.log('✅ User data saved:', userData);

        window.dispatchEvent(new CustomEvent('userDataChanged', { detail: userData }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error saving user to localStorage:', err);
      return false;
    }
  },

  clearUser: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem("user");
        console.log('🧹 User data cleared');

        window.dispatchEvent(new CustomEvent('userDataChanged', { detail: null }));
      }
    } catch (err) {
      console.error('Error clearing localStorage user:', err);
    }
  },

  isAuthenticated: () => {
    return UserManager.getSavedUser() !== null;
  },

  getUserRole: () => {
    const user = UserManager.getSavedUser();
    return user?.role || null;
  }
};
