export default function ({ store, redirect }) {
    if(store.state.auth.user.ngx_permissions !== undefined){
      if(store.state.auth.user.ngx_permissions.indexOf('booking.super_admin') === -1){
        return redirect('/403')
      }
    }
}