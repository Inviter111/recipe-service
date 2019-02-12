<template>
  <div id="container">
    <b-container class="bv-exaple-row">
      <b-row align-h="start" style="display: block;">
        <b-card no-body>
          <b-tabs id="tabs" card>
            <b-tab title="User">
              <b-form @submit.prevent="Submit">
                <b-form-group label="Username">
                  <b-form-input v-model="user.username" required />
                </b-form-group>
                <b-form-group label="Password">
                  <b-form-input type="password" placeholder="Enter new password" v-model="user.password" />
                </b-form-group>
                <b-button type="submit" variant="primary">Save</b-button>
              </b-form>
            </b-tab>
            <b-tab title="Recipes">
              <b-table :items="recipes.data.recipes" :fields="['title', 'description', 'edit']">
                <template slot="edit" slot-scope="row" v-if="row.item.editable || user.admin">
                  <b-button size="sm" class="mr-0" :to="`/recipes/${row.item._id}/edit`">Edit</b-button>
                  <b-button size="sm" class="mr-0" variant="danger" @click.prevent="DeletePost(row.item._id)">Delete</b-button>
                </template>
              </b-table>
              <b-button id="create-btn" size="sm" variant="success" to="/create">Create</b-button>
            </b-tab>
            <b-tab title="Favorites">
              <b-table :items="favs.data" :fields="['title', 'description', 'remove']">
                <template slot="title" slot-scope="row">
                  <nuxt-link :to="`/recipes/${row.item._id}`">{{ row.item.title }}</nuxt-link>
                </template>
                <template slot="remove" slot-scope="row">
                  <b-button size="sm" class="mr-0" variant="danger" @click.prevent="DeleteFromFavs(row.item._id)">Remove</b-button>
                </template>
              </b-table>
            </b-tab>
            <b-tab v-if="user.admin" title="Users">
              <b-table :items="users.data.users" :fields="['username', 'admin', 'edit']">
                <template slot="edit" slot-scope="row">
                  <b-button size="sm" class="mr-0" :to="`/user/${row.item._id}`">Edit</b-button>
                  <b-button size="sm" class="mr-0" variant="danger" @click.prevent="DeleteUser(row.item._id)">Delete</b-button>
                </template>
              </b-table>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-row>
    </b-container>
  </div>
</template>

<style scoped>
#container {
  margin: 1rem 1rem 0 1rem;
}
#tabs {
  box-shadow: 0 4px 15px 0 rgba(0,0,0,.08);
}
#submit {
  margin-top: 0.5em;
}
#create-btn {
  margin-left: 0.5em;
}
</style>

<script>
export default {
  async asyncData({ app }) {
    const fetchedUser = await app.$axios.get('/api/auth/user')
    let recipes
    let users
    if (fetchedUser.data.user.admin) {
      recipes = await app.$axios.get('/api/recipes')
      users = await app.$axios.get('/api/auth/users')
    }
    else {
      recipes = await app.$axios.get('/api/recipes/myrecipes')
    }
    const favs = await app.$axios.get('/api/recipes/fav')
    return {
      user: {
        id: fetchedUser.data.user._id,
        username: fetchedUser.data.user.username,
        password: '',
        admin: fetchedUser.data.user.admin
      },
      recipes,
      users,
      favs
    }
  },
  middleware: 'auth',
  methods: {
    async Submit() {
      await this.$axios.put(`/api/auth/user/${this.user.id}`, this.user)
    },

    async DeletePost(id) {
      await this.$axios.delete(`/api/recipes/recipe/${id}`)
      this.recipes.data.recipes.splice(this.recipes.data.recipes.map((item) => { return item._id }).indexOf(id), 1)
    },

    async DeleteUser(id) {
      await this.$axios.delete(`/api/auth/user/${id}`)
      this.users.data.users.splice(this.users.data.users.map(item => { return item._id }).indexOf(id), 1)
    },

    async DeleteFromFavs(id) {
      await this.$axios.delete(`/api/recipes/fav/${id}`)
      this.favs.data.splice(this.favs.data.map(item => { return item._id }).indexOf(id), 1)
    }
  }
}
</script>