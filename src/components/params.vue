<template>
  <el-card class="box">
    <cus-bread leave1="商品管理" leave2="分类参数"></cus-bread>
    <el-alert class="alert" type="warning" title="注意:只允许为第三级分类设置参数" show-icon :closable="false"></el-alert>
    <el-row>
      <el-col class="col">
        <span>请选择商品分类</span>
        <el-cascader
          expand-trigger="hover"
          :show-all-levels="false"
          :options="options"
          :props="{ label:'cat_name', value:'cat_id'}"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-col>
      <el-col>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="first">
            <el-button type="primary" size="mini" disabled border>设置动态参数</el-button>
            <el-table :data="tableData5" style="width: 100%">
              <el-table-column type="expand"></el-table-column>
              <el-table-column label="#" prop="id"></el-table-column>
              <el-table-column label="商品属性" prop="name"></el-table-column>
              <el-table-column label="操作"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="second"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      activeName: "first",
      tableData5: []
    };
  },
  methods: {
    handleChange() {},
    handleClick(tab, event) {}
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 16px;
}
.col {
  margin-top: 16px;
  margin-bottom: 20px;
  font-size: 14px;
}
</style>
