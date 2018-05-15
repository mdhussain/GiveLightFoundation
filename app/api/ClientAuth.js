class ClientAuth {

    static authenticateUser(token) {
      localStorage.setItem('id', token);
    }

    static isUserAuthenticated() {
      return localStorage.getItem('id') !== null;
    }
  
    static deauthenticateUser() {
      localStorage.removeItem('id');
    }
  
    static getToken() {
      return localStorage.getItem('id');
    }

  }
  
  export default ClientAuth;