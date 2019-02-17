<template>
  <el-card>
    <!-- 面包屑 -->
    <cus-bread leave1="权限管理" leave2="角色列表"></cus-bread>
    <el-button type="primary" plain class="btn">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" height="400px">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
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
  </el-card>
</template>
    
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created () {
      this.getTableData()
  },
  methods: {
    //   删除按钮-显示删除提示框
      showMsgBox (user) {
          this.$confirm('确认要删除该用户角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            // console.log(user)
            const res = await this.$http.delete(`roles/${user.id}`)
            const {meta: {status, msg}} = res.data
            if (status === 200) {
                this.getTableData()
                this.$message.success(msg)
            }
        }).catch(() => {
            this.$message.info('已取消删除')  
      })},
    //   获取角色列表
    async getTableData () {
          const res = await this.$http.get(`roles`)
        //   console.log(res)
          const {data, meta: {status, msg}} = res.data
          if (status === 200) {
              this.list = data
          }
      }
  }
};
</script>

<style>
.btn {
  margin-top: 20px;
}
</style>
