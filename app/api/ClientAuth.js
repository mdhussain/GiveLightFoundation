class ClientAuth {

    static storeAuthState(id, isAdmin, expiresAt) {
      localStorage.setItem('id', id);
      localStorage.setItem('admin', isAdmin);
      localStorage.setItem('expires_at', expiresAt);
    }

    static isUserAuthenticated() {
      var now = new Date();
      var expiresAt = localStorage.getItem('expires_at');
      console.log(expiresAt)
      return localStorage.getItem('id') && expiresAt && now.getTime() < expiresAt;
    }

    static getLoggedInUser() {
      return localStorage.getItem('id');
    }

    static isAdminUser() {
      return localStorage.getItem('admin') && localStorage.getItem('admin') == 'true';
    }
  
  
    static clearAuthState() {
      localStorage.removeItem('id');
      localStorage.removeItem('admin');
      localStorage.removeItem('expires_at');
    }
  
    static getToken() {
      return localStorage.getItem('id');
    }

  }
  
  export default ClientAuth;