<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <cus-bread leave1="商品管理" leave2="商品列表"></cus-bread>
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
        <el-button @click="$router.push({name:'goodsadd'})" type="success" plain>添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" height="400px">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格（元）" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column label="创建日期" width="150">
        <template slot-scope="scope">{{ scope.row.add_time | fmtdate }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 10,
      total: -1,
      list: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    //   获取商品列表
    async getTableData() {
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.goods;
      }
    },
    //   获取所有商品
    async getAllUsers() {},
    //   搜索商品
    async searchUser() {},
  }
};
</script>

<style scoped>
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
