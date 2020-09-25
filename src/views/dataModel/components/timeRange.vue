<template>
  <el-popover placement="right" width="500" trigger="click">
    <el-tabs type="border-card">
      <el-tab-pane label="默认">
        <ul>
          <li class="radio">
            <el-radio v-model="radio" label="Last day">Last day</el-radio>
          </li>
          <li class="radio">
            <el-radio v-model="radio" label="Last week">Last week</el-radio>
          </li>
          <li class="radio">
            <el-radio v-model="radio" label="Last month">Last month</el-radio>
          </li>
          <li class="radio">
            <el-radio v-model="radio" label="Last quarter"
              >Last quarter</el-radio
            >
          </li>
          <li class="radio">
            <el-radio v-model="radio" label="Last year">Last year</el-radio>
          </li>
          <li class="radio">
            <el-radio v-model="radio" label="No filter">No filter</el-radio>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="自定义">
        <h4>相对于今天<i class="el-icon-check"></i></h4>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="" class="customize">
            <el-select v-model="formInline.type" placeholder="">
              <el-option label="Next" value="Next"></el-option>
              <el-option label="Last" value="Last"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="customize">
            <el-input v-model="formInline.num" placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="" class="customize">
            <el-select v-model="formInline.timeUnit" placeholder="">
              <el-option label="seconds" value="seconds"></el-option>
              <el-option label="minutes" value="minutes"></el-option>
              <el-option label="hours" value="hours"></el-option>
              <el-option label="days" value="days"></el-option>
              <el-option label="weeks" value="weeks"></el-option>
              <el-option label="months" value="months"></el-option>
              <el-option label="years" value="years"></el-option>
            </el-select>
          </el-form-item>
          <h4>开始/结束<i class="el-icon-check"></i></h4>
          <el-date-picker
            v-model="timeStr"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-button slot="reference">{{ timeRange }}</el-button>
  </el-popover>
</template>

<script>
export default {
  name: "TimeRange",
  data() {
    return {
      timeRange: "No filter",
      radio: "No filter",
      formInline: {
        type: "Next",
        num: 7,
        timeUnit: "seconds",
      },
      timeStr: "",
    };
  },
};
</script>

<style scoped>
.radio {
  list-style: none;
  padding: 10px 0;
}
.customize >>> .el-input__inner {
  width: 100px;
}
</style>