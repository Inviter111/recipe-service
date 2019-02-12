export default function({ store, redirect }) {
    if (!store.$auth.$state.user.user.active) {
        return redirect('/')
    }
}