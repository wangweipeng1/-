<template>
  <el-card class="box">
    <cus-bread leave1="商品管理" leave2="分类参数"></cus-bread>
    <el-alert class="alert" type="warning" title="注意:只允许为第三级分类设置参数" show-icon :closable="false"></el-alert>
    <el-row>
      <el-col class="col">
        <span>请选择商品分类</span>
        <el-cascader
          clearable
          expand-trigger="hover"
          :show-all-levels="false"
          :options="options"
          :props="{ label:'cat_name', value:'cat_id'}"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-col>
      <el-col>
        <el-tabs v-model="active" @tab-click="changeTab()">
          <el-tab-pane label="动态参数" name="1">
            <el-button type="primary" size="mini" disabled>设置动态参数</el-button>
            <el-table height="250px" :data="arrDy" style="width: 100%" border stripe>
              <el-table-column type="expand" width="140">

                <template slot-scope="scope">
                  <el-tag
                    :key="i"
                    v-for="(attr, i) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope.row,attr)"
                  >{{attr}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </template>

              </el-table-column>
              <el-table-column label="#" type="index" width="120"></el-table-column>
              <el-table-column label="商品属性" prop="attr_name" width="300"></el-table-column>
              <el-table-column label="操作" width="200">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="2">
            <el-button type="primary" size="mini" disabled border>设置静态参数</el-button>
            <el-table height="250px" :data="arrStatic" style="width: 100%" stripe>
              <el-table-column label="#" type="index" width="120"></el-table-column>
              <el-table-column label="商品属性" prop="attr_name" width="300"></el-table-column>
              <el-table-column label="属性值" prop="attr_vals" width="300"></el-table-column>
              <el-table-column label="操作" width="200">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-table-column>
            </el-table>
          </el-tab-pane>
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
      active: "first",
      arrDy: [],
      arrStatic: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCategories();
  },
  methods: {
    async handleClose(item,attr) {
      item.attr_vals.splice(item.attr_vals.indexOf(attr), 1);
      const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`, {
        attr_name: item.attr_name,
        attr_sel: 'many',
        attr_vals: item.attr_vals.join(',')
      })
      console.log(res)

    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(item) {
      let inputValue = this.inputValue;
      if (inputValue) {
        item.attr_vals.push(inputValue);

        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`, {
        attr_name: item.attr_name,
        attr_sel: 'many',
        attr_vals: item.attr_vals.join(',')
      })
      console.log(res)
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    async getGoodsCategories() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res)
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    },
    handleChange() {
      this.getDyOrStatic();
    },
    async changeTab(tab, event) {
      // const res = await this.$http.get(`categories/分类id/attributes?sel='many '`)
      this.getDyOrStatic();
    },
    async getDyOrStatic() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请先选三级分类");
        if (this.active === "1") {
          this.arrDy = [];
        }
        if (this.active === "2") {
          this.arrStatic = [];
        }
        return;
      }

      if (this.active === "1") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(res)
        const {
          meta: { status, msg },
          data
        } = res.data;
        if (status === 200) {
          this.arrDy = data;
          console.log("动态数据---");

          this.arrDy.forEach(item => {
            item.attr_vals = item.attr_vals.trim().split(",");
          });
          console.log(this.arrDy, "arrDy---");
        }
      }

      if (this.active === "2") {
        // 获取静态数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log(res);
        const {
          meta: { msg, status },
          data
        } = res.data;
        if (status === 200) {
          this.arrStatic = data;
          // console.log("静态数据----");
          console.log(this.arrStatic, "arrStatic----");
        }
      }
    }
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
