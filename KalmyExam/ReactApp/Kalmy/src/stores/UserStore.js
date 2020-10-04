import {extendObservable} from 'mobx';
class UserStore{
    constructor(){
      extendObservable(this,{
          loading:true,
          isLoggedIn:false,
          username:'',
          Register:false,
          Token:'',
      })  
    }
}
export default new UserStore();