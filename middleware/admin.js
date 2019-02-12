export default function({ store, redirect }) {
  if (!store.state.user.admin) {
    return redirect('/')
  }
}
