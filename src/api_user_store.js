var api_user = {};

class ApiUser {
   constructor(props) {
      if (props) { 
         api_user = props;
      }
    }
    get() {
        return api_user;
    }
}
export default ApiUser;