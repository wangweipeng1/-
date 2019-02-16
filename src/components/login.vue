<template>
    <div class="login-wrap">
        <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
            <h2>用户登录</h2>
            <el-form-item label="用户名">
                <el-input v-model="formData.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="formData.password"></el-input>
            </el-form-item>
            <el-button @click.prevent='handleLogin' class="login-btn" type="primary" round>登录</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const res = await this.$http.post(`login`, this.formData)
      const {data: {data, meta: {status, msg}}} = res
      if (status === 200) {
        localStorage.setItem('token', data.token)
        this.$router.push({
          name: 'home'
        })
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.login-wrap {
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-form {
    background-color: #fff;
    width: 400px;
    border-radius: 5px;
    padding: 30px;
}
.login-btn {
    width: 100%;
}
</style>
