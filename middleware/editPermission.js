import axios from 'axios'

export default function({ store, redirect, params }) {
  return axios.get(`/api/recipes/recipe/${params.id}`, {
    headers: {
      Authorization: `Bearer ${document.cookie.split(';')[2].split('%20')[1]}`
    }
  })
    .then(res => {
      if (res.data.author !== res.data.username && !res.data.admin) {
        return redirect('/')
      } else if (!res.data.recipe.editable && !res.data.admin) {
        return redirect('/')
      }
    })
    .catch(err => {
      return redirect('/')
    })
}