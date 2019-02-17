<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread leave1='权限管理' leave2='权限列表'></cus-bread>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" height="450px" class="table" stripe>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column label="层级" width="140">
        <template slot-scope='scope'>
            <span v-if='scope.row.level === "0"'>一级</span>
            <span v-if='scope.row.level === "1"'>二级</span>
            <span v-if='scope.row.level === "2"'>三级</span>
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
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const res = await this.$http.get(`rights/list`);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.list = data;
        console.log(msg)
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.table {
  margin-top: 20px;
}
</style>
