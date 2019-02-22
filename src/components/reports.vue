<template>
  <el-card class="box">
    <cus-bread leave1="商品管理" leave2="分类参数"></cus-bread>
    <div class="pic" id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  mounted() {
    this.addEcharts();
  },
  methods: {
    async addEcharts() {
      const myChart = echarts.init(document.getElementById("main"));
      const option1 = {
        title: {
          text: "图示"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };

     
      const res = await this.$http.get(`reports/type/1`);
      console.log(res);
      const {data} = res.data;
        const option2 = data;

      const option = { ...option1, ...option2 };
      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.box {
  height: 100%;
}
.pic {
    margin-top: 20px
}
</style>
