// Improved UserManager utilities
export const UserManager = {
  getSavedUser: () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }

      const savedUser = localStorage.getItem("user");
      
      if (!savedUser) {
        return null;
      }

      const userData = JSON.parse(savedUser);
      
      if (!userData || typeof userData !== 'object') {
        console.warn('Invalid user data format in localStorage');
        localStorage.removeItem("user");
        return null;
      }

      if (!userData.id && !userData._id) {
        console.warn('User data missing required ID field');
        localStorage.removeItem("user");
        return null;
      }

      // Check if user data has required fields
      if (!userData.role) {
        console.warn('User data missing role field, user data:', userData);
        // Don't remove user data immediately, let's see what we have
        // localStorage.removeItem("user");
        // return null;
      }

      return userData;
    } catch (error) {
      console.error('Error accessing localStorage or parsing user data:', error);
      try {
        localStorage.removeItem("user");
      } catch (cleanupError) {
        console.error('Error cleaning up localStorage:', cleanupError);
      }
      return null;
    }
  },

  saveUser: (userData) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (!userData || typeof userData !== 'object') {
          console.error('Invalid user data provided to saveUser');
          return false;
        }

        localStorage.setItem("user", JSON.stringify(userData));
        console.log('User data saved successfully:', userData);
        
        // Trigger storage event for cross-component sync
        window.dispatchEvent(new CustomEvent('userDataChanged', { detail: userData }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  },

  clearUser: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem("user");
        console.log('User data cleared successfully');
        
        // Trigger storage event for cross-component sync
        window.dispatchEvent(new CustomEvent('userDataChanged', { detail: null }));
      }
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  },

  // New method to check if user is authenticated
  isAuthenticated: () => {
    return UserManager.getSavedUser() !== null;
  },

  // New method to get user role
  getUserRole: () => {
    const user = UserManager.getSavedUser();
    return user ? user.role : null;
  }
};