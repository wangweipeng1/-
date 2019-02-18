<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="图片加载失败">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a @click.prevent="handleloginout" href="#" class="loginout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <el-menu default-active="1" :unique-opened='true' :router='true'>
          <!-- 用户管理 -->
          <el-submenu :index="item1.order+''" v-for="(item1, i) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2, i) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              {{ item2.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main class="main">
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  beforeMount () {
    // if (!localStorage.getItem('token')) {
    //   this.$router.push({
    //     name: 'login'
    //   })
    // }
  },
  created () {
    this.getMenus()
  },
  methods: {
    async getMenus () {
      const res = await this.$http.get(`menus`)
      const {meta: {status, msg}, data} = res.data
      if (status === 200) {
        this.menus = data
      }
    },
    handleloginout () {
      localStorage.clear()
      this.$router.push({
        name: 'login'
      })
      this.$message.success('退出成功')
    }
  }
}
</script>

<style>
.container {
  background-color: #b3c0d1;
  height: 100%;
}
.header {
  padding: 0;
}
.middle {
  text-align: center;
  color: #fff;
  line-height: 60px;
}
.loginout {
  color: blue;
  text-decoration: none;
  text-align: center;
  line-height: 60px;
}

.aside {
  background-color: #fff;
}
.main {
  background-color: #e9eef3;
}
</style>
