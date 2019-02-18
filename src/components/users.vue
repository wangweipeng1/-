<template>
  <!-- el-card小容器 可以理解为是div -->
  <el-card class="box-card">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchBox">
      <el-col>
        <el-input
          @clear="getAllUsers()"
          placeholder="请输入内容"
          v-model="query"
          class="searchInput"
          clearable
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="showDiaAddUser()" type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" height="400px">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="200">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="120">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button
            @click="showDiaEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            @click="showMsgBox(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-button
            @click="showDiaSetRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加按钮 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑按钮对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formdata" label-width="80px">
        <el-form-item label="用户名" >
          {{currUsername}}
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectVal" placeholder="请选择角色名称">
            <el-option label="请选择" :value="-1" disabled></el-option>
            <el-option :label="item.roleName" :value="item.id" v-for='(item, i) in roles' :key='item.id'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: -1,
      selectVal: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      list: [],
      currUsername: '',
      currUserId: '',
      roles: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async setRole () {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {rid: this.selectVal})
      const {meta: {status, msg}} = res.data
      if (status === 200) {
        this.dialogFormVisibleRole = false
        this.$message.success(msg)
      }
    },
    async showDiaSetRole (user) {
      this.currUserId = user.id
      this.currUsername = user.username
      this.formdata = user
      this.dialogFormVisibleRole = true
      const res = await this.$http.get(`roles`)
      console.log(res)
      const {meta: {status, msg}, data} = res.data
      if (status === 200) {
        this.roles = data
      }
      // 获取当前用户的角色ID
      const res2 = await this.$http.get(`users/${user.id}`)
      // console.log(res2)
      this.selectVal = res2.data.data.rid
    },
    async changeState (user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      )
      const {
        meta: { status, msg }
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
      }
    },
    async editUser () {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      )
      const {
        meta: { status, msg }
      } = res.data
      if (status === 200) {
        this.dialogFormVisibleEdit = false
        this.$message.success(msg)
        this.getTableData()
      }
    },
    async showDiaEditUser (user) {
      this.dialogFormVisibleEdit = true
      // this.formdata = user
      const res = await this.$http.get(`users/${user.id}`)
      console.log(res)
      this.formdata = res.data.data
    },
    showMsgBox (user) {
      this.$confirm('是否把我删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`)
          const {
            meta: { status, msg }
          } = res.data
          if (status === 200) {
            this.$message.success(msg)
            this.pagenum = 1
            this.getTableData()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    async addUser () {
      const res = await this.$http.post(`users`, this.formdata)
      this.dialogFormVisibleAdd = false
      this.getTableData()
    },
    showDiaAddUser () {
      this.formdata = {}
      this.dialogFormVisibleAdd = true
    },
    getAllUsers () {
      this.pagenum = 1
      this.getTableData()
    },
    searchUser () {
      this.getTableData()
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = 1
      this.pagesize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getTableData()
    },
    async getTableData () {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      // 可注释
      // console.log(res)

      const {
        data,
        meta: { status, msg }
      } = res.data
      if (status === 200) {
        this.total = data.total
        this.list = data.users
        // 可注释
        console.log(msg)
      }
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>
