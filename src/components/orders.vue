<template>
  <el-card class="box">
    <cus-bread leave1="订单管理" leave2="订单列表"></cus-bread>
    <el-table :data="list" height="450">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="120"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="120"></el-table-column>
      <el-table-column label="是否付款" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_send === '是'" type="danger">已付款</el-tag>
          <el-tag v-else-if="scope.row.is_send === '否'" type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'" type="danger">已发货</el-tag>
          <el-tag v-else-if="scope.row.order_pay === '1'" type="danger">未发货</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="120">
        <template slot-scope="scope">{{ scope.row.create_time | fmtdate }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <el-button @click="showEditDate()" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="省市区/县" label-width="80px">
          <el-cascader
            expand-trigger="hover"
            clearable
            :options="catlist"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="80px">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleEdit = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Catlist from "@/assets/city_data2017_element.js";

export default {
  data() {
    return {
      list: [],
      pagesize: 10,
      pagenum: 1,
      total: -1,

      form: {},
      dialogFormVisibleEdit: false,

      //   级联
      selectedOptions: [],
      catlist: [],
    };
  },
  created() {
    this.getOrdersData();
  },
  methods: {
    showEditDate() {
        this.catlist = Catlist
      this.dialogFormVisibleEdit = true;
    },

    //   分页
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getOrdersData();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getOrdersData();
    },

    // 获取订单数据
    async getOrdersData() {
      const res = await this.$http.get(
        `orders?query=1&&pagenum=${this.pagenum}&&pagesize=${this.pagesize}`
      );
      //   console.log(res)
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.list = data.goods;
        console.log(this.list, "this.list----");
        this.total = data.total;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>
