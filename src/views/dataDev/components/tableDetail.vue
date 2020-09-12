<template>
  <el-tabs type="border-card">
    <el-tab-pane label="结果">
      <el-table :data="tableData" style="width: 100%" max-height="350">
        <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="province" label="省份" width="120"></el-table-column>
        <el-table-column prop="city" label="市区" width="120"></el-table-column>
        <el-table-column prop="address" label="地址" width="300"></el-table-column>
        <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="历史查询">历史查询</el-tab-pane>
  </el-tabs>
</template>

<script>
import { createConnection } from '@/graghQL/demo';
export default {
  name: "TableDetail",
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    initData() {
      let params = {
        config: {
          name: "demo01@47.103.79.104",
          driverId: "mysql:mysql8",
          host: "47.103.79.104",
          port: "3307",
          databaseName: "demo01",
          authModelId: "native",
          credentials: {
            userName: "root",
            userPassword: "1QAZ@wsx",
          },
        },
      };
      createConnection(params)
        .then((res) => {
          console.log("request success");
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
      ],
    };
  },
  mounted(){
      this.initData()
  }
};
</script>