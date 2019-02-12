<template>
  <div>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <b-container class="bv-example-row" style="margin-bottom: 8px;">
      <b-row align-h="start">
        <b-col>
          <b-form inline @submit.prevent="Search('byTitle')">
            <b-form-input placeholder="Название" v-model="searchOptions.byTitle.params.title" required style="width: 70%"></b-form-input>
            <b-btn class="submit-btn" type="submit" variant="primary">Поиск</b-btn>
          </b-form>
        </b-col>
        <b-col>
          <b-form inline @submit.prevent="Search('byType')">
            <b-form-select :options="recipeTypes" v-model="searchOptions.byType.params.recipeType" required/>
            <b-btn class="submit-btn" type="submit" variant="primary">Поиск</b-btn>
          </b-form>
        </b-col>
        <b-col>
          <b-form inline @submit.prevent="Search('byHashtags')">
            <b-form-input placeholder="Хэштег" v-model="searchOptions.byHashtags.params.hashtags" required></b-form-input>
            <b-btn class="submit-btn" type="submit" variant="primary">Поиск</b-btn>
          </b-form>
        </b-col>
        <b-col col  lg="2">
          <b-form inline @submit.prevent="Search('byTop')">
            <b-form-input placeholder="Топ" v-model="searchOptions.byTop.params.total" style="width: 40%;" required></b-form-input>
            <b-btn class="submit-btn" type="submit" variant="primary">Поиск</b-btn>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="bv-example-row">
      <b-row align-h="start">
        <b-col v-for="recipe of recipes" :key="recipe._id" cols="4" style="padding-bottom: 8px;">
          <div>
            <b-card no-body>
              <b-card-body>
                <b-link :to="`/recipes/${recipe._id}`" style="color: #04b;">
                  <h4 class="card-title" style="margin-bottom: 0;">{{ recipe.title }}</h4>
                </b-link>
              </b-card-body>
              <b-card-img :src="`data:${recipe.completePhoto.contentType};base64,${(recipe.completePhoto.data).toString('base64')}`" alt="Image" style="max-height: 190px;"/>
              <b-card-footer>
                <i v-if="favRecipes.includes(recipe._id)" @click.prevent="RemoveFavorite(recipe._id)" class="fas fa-star"></i>
                <i v-else @click.prevent="Favorite(recipe._id)" class="far fa-star"></i>
                <b-button v-if="isAuthenticated && $store.state.user.admin" size="sm" class="float-right" :to="`/recipes/${recipe._id}/edit`">Edit</b-button>
              </b-card-footer>
            </b-card>
          </div>
        </b-col>
      </b-row>
    <b-pagination v-model="currPage" :per-page="6" :total-rows="totalRecipes" @change="Paginate" align="center" />
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  async asyncData({ app }) {
    const fetchedRecipes = await app.$axios.get('/api/recipes/', { params : {
      p: '1',
      lim: '6'
    }})
    const fetchedUser = await app.$axios.get('/api/auth/user')
    const favRecipes = fetchedUser.data.user.favs
    const recipes = fetchedRecipes.data.recipes
    recipes.forEach(recipe => {
      recipe.completePhoto.data = Buffer.from(recipe.completePhoto.data.data).toString('base64')
    });
    const totalRecipes = fetchedRecipes.data.totalRecipes
    return { recipes, totalRecipes, favRecipes }
  },
  data() {
    return {
      currPage: 1,
      searchType: 'default',
      recipeTypes: [
        { text: 'Выберите одно', value: null },
        'Салат', 'Первое', 'Второе', 'Суп', 'Десерт', 'Напиток'
      ],
      searchOptions: {
        default: {
          url: '/api/recipes/',
          params: {
            p: '1',
            lim: '6'
          }
        },
        byTitle: {
          url: '/api/recipes/title',
          params: {
            p: '1',
            lim: '6',
            title: ''
          }
        },
        byType: {
          url: '/api/recipes/recipeType',
          params: {
            p: '1',
            lim: '6',
            recipeType: null
          }
        },
        byHashtags: {
          url: '/api/recipes/hashtags',
          params: {
            p: '1',
            lim: '6',
            hashtags: null
          }
        },
        byTop: {
          url: '/api/recipes/top',
          params: {
            p: '1',
            lim: '6',
            total: null
          }
        }
      }
    }
  },
  middleware: 'auth',
  methods: {
    async Paginate(currPage) {
      this.searchOptions[this.searchType].params.p = currPage
      const fetchedRecipes = await this.$axios.get(this.searchOptions[this.searchType].url, {
        params: this.searchOptions[this.searchType].params 
      })
      fetchedRecipes.data.recipes.forEach(recipe => {
        recipe.completePhoto.data = Buffer.from(recipe.completePhoto.data.data).toString('base64')
      })
      this.recipes = fetchedRecipes.data.recipes
    },

    async Search(searchType) {
      this.searchType = searchType
      this.currPage = 1
      this.searchOptions[this.searchType].params.p = '1'
      if (this.searchType == 'byHashtags') {
        this.searchOptions.byHashtags.params.hashtags = this.searchOptions.byHashtags.params.hashtags.split(' ')
      }
      const fetchedRecipes = await this.$axios.get(this.searchOptions[this.searchType].url, {
        params: this.searchOptions[this.searchType].params
      })
      fetchedRecipes.data.recipes.forEach(recipe => {
        recipe.completePhoto.data = Buffer.from(recipe.completePhoto.data.data).toString('base64')
      })
      this.recipes = fetchedRecipes.data.recipes
      this.totalRecipes = +fetchedRecipes.data.totalRecipes
    },
    
    async Favorite(id) {
      await this.$axios.put(`/api/recipes/fav/${id}`)
      this.favRecipes.push(id)
    },

    async RemoveFavorite(id) {
      await this.$axios.delete(`/api/recipes/fav/${id}`)
      this.favRecipes.splice(this.favRecipes.indexOf(id), 1)
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
}
</script>

<style scoped>
.submit-btn {
  margin-left: 4px;
}
</style>
