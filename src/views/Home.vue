<template>
  <el-container direction="vertical">
    <el-header>
      <Header :categorys="categorys">

      </Header>
    </el-header>
    <el-container>
      <el-aside width="280px">
          <Aside/>
      </el-aside>
      <el-main>
            <router-view name="Contents" style="font-family: Arial" :categorys="categorys"></router-view>
      </el-main>
    </el-container>
      <el-footer>
        <Footer/>
      </el-footer>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Aside from '@/components/Aside.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'home',
  components: {
    Header: Header,
    Aside: Aside,
    Footer: Footer
  },
  data() {
    return {
      categorys: []
    }
  },
  mounted() {
    this.projectList()
  },
  methods: {
    projectList(){
      this.$axios.get(this.$api.projectList, 
      {
        params: {page: 1, size: 100}
      }).then((response) => {
          this.categorys = response.data['res']
      })
    },
  }
}
</script>
