export default function ({ store, redirect }) {
    if(store.state.auth.loggedIn){
      if((store.state.auth.user.type === "student")){
        return redirect('/403')
      }
    }
}
