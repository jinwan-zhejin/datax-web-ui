<!--
 * @Date: ,: 2020-11-03 14:51:16
 * @Author: ,: Anybody
 * @LastEditors: ,: Anybody
 * @LastEditTime: ,: 2020-11-03 18:54:55
 * @FilePath: ,: \datax-web-ui\src\views\cloudbeaveratlas\components\metaCompareDetails.vue
 * @Description: ,: 元数据比对 详情子组件
-->
<template>
  <div class="details-container">
    <el-row class="top">
      <el-col class="title">
        <label>元数据比对详情</label>
        <el-tooltip content="关闭所有" placement="top">
          <el-button
            style="position: relative; float: right; padding: 0; font-size: 18px;"
            type="text"
            icon="el-icon-error"
            @click="handleCloseAll"
          />
        </el-tooltip>
      </el-col>
      <el-col class="item">
        <i class="el-icon-document" />
        <span>{{ detailsInfo.id }}&nbsp;&nbsp;{{ detailsInfo.name + ' (' + detailsInfo.typeName + ')' }}</span>
      </el-col>
    </el-row>
    <el-row class="infos">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <span class="infos-key">请求ID：</span>
        <span class="infos-value">{{ detailsInfo.id }}</span>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <span class="infos-key">请求GUID：</span>
        <span class="infos-value">{{ detailsInfo.guid }}</span>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <span class="infos-key">基线元数据时间：</span>
        <span class="infos-value">{{ dateFormat('YYYY-mm-dd HH:MM:SS', detailsInfo.timestamp1) }}</span>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <span class="infos-key">待比较元数据时间：</span>
        <span class="infos-value">{{ dateFormat('YYYY-mm-dd HH:MM:SS', detailsInfo.timestamp2) }}</span>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <span class="infos-key">请求提交时间：</span>
        <span class="infos-value">{{ dateFormat('YYYY-mm-dd HH:MM:SS', detailsInfo.createTime) }}</span>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <span class="infos-key">实体名：</span>
        <span class="infos-value">{{ detailsInfo.typeName }}</span>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <span class="infos-key">实例名：</span>
        <span class="infos-value">{{ detailsInfo.name }}</span>
      </el-col>
    </el-row>
    【对象相交】{{ intersectObjects(compare.params1, compare.params2) }}
    <br><br>
    【对象合并】{{ mergeObjects(compare.params1, compare.params2) }}
    <br><br>
    【1】 {{ compare.params1 }}
    <br><br>
    【2】 {{ compare.params2 }}
    <el-row class="compare">
      <el-col class="compare-title">基于时间比对详情： {{ compare.difference === '' ? '版本一致' : (compare.difference.indexOf('.') > -1 ? '参数不一致' : compare.difference) }}</el-col>
      <el-col v-if="compare.difference.indexOf('.') > -1" class="compare-title">具体参数： {{ compare.difference }}</el-col>
      <el-col v-if="objectHasVal !== 0" class="details-table">
        <el-col class="table-column" :span="12">基线时间版本详情</el-col>
        <el-col class="table-column" :span="12">待比较时间版本详情</el-col>
        <!-- 对象一致 -->
        <el-col v-if="compare.difference === ''">
          <el-col v-for="(item, index) in intersectObjects(compare.params1, compare.params2)" :key="index" class="table-items">
            <el-col class="table-items-key" :span="4">{{ translaterMaster(item) }}</el-col>
            <el-col class="table-items-value" :span="8">{{ compare.params1[item] }}</el-col>
            <el-col class="table-items-key" :span="4">{{ translaterMaster(item) }}</el-col>
            <el-col class="table-items-value" :span="8">{{ compare.params2[item] }}</el-col>
          </el-col>
        </el-col>
        <!-- 对象添加/删除 -->
        <el-col v-else-if="objectHasVal === 1 || objectHasVal === 2">
          <el-col v-for="(value, key, index) in compare['params' + objectHasVal]" :key="index" class="table-items">
            <el-col class="table-items-key" :span="4">{{ translaterMaster(key) }}</el-col>
            <el-col class="table-items-value" :span="8">{{ objectHasVal === 1 ? value : '-' }}</el-col>
            <el-col class="table-items-key" :span="4">{{ translaterMaster(key) }}</el-col>
            <el-col class="table-items-value" :span="8">{{ objectHasVal === 2 ? value : '-' }}</el-col>
          </el-col>
        </el-col>
        <!-- 对象修改 -->
        <el-col v-else-if="compare.difference.indexOf('.') > -1">
          <el-col v-for="(item, index) in intersectObjects(compare.params1, compare.params2)" :key="index" class="table-items">
            <el-col class="table-items-key" :span="4">{{ translaterMaster(item) }}</el-col>
            <el-col class="table-items-value" :span="8">{{ compare.params1[item] }}</el-col>
            <el-col class="table-items-key" :span="4">{{ translaterMaster(item) }}</el-col>
            <el-col class="table-items-value" :span="8">{{ compare.params2[item] }}</el-col>
          </el-col>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as apiatlas from '@/api/datax-metadata-atlas'
import { translaterMaster } from '../utils/dictionary'

export default {
  name: 'MetaCompareDetails',
  props: {
    detailsInfo: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      // 比对数据解析
      compare: {
        params1: '', // json1
        params2: '', // json2
        difference: '' // 不同 content
      }
    }
  },
  computed: {
    objectHasVal() {
      if (this.compare.params1 === null && this.compare.params2 !== null) {
        return 2
      } else if (this.compare.params1 !== null && this.compare.params2 === null) {
        return 1
      } else if (this.compare.params1 === null && this.compare.params2 === null) {
        return 0
      } else {
        return 3
      }
    }
  },
  watch: {
    detailsInfo: {
      handler(val, oldVal) {
        console.log(val)
        this.getDetails(val.id)
      },
      deep: true
    }
  },
  created() {
    if (this.detailsInfo !== {}) {
      this.getDetails(this.detailsInfo.id)
    }
  },
  methods: {
    /**
     * @description: 格式化时间
     */
    dateFormat(fmt, date) {
      let ret = '';
      date = new Date(date);
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          )
        }
      }
      return fmt
    },
    /**
     * @description: 获取某id记录比对具体信息
     */
    async getDetails(id) {
      const res = await apiatlas.getOneCompareRecord(id);
      if (res.code === 200) {
        this.compare.params2 = res.content.substring(
          res.content.indexOf('{json2=') + '{json2='.length,
          res.content.indexOf(', json1=')
        );
        this.compare.params1 = res.content.substring(
          res.content.indexOf(', json1=') + ', json1='.length,
          res.content.indexOf(', contrast')
        );
        this.compare.difference = res.content
          .substring(
            res.content.indexOf(', contrast=') + ', contrast='.length,
            res.content.length - 1
          )
          .replace('null', '');
        this.compare.params2 = JSON.parse(this.compare.params2);
        this.compare.params1 = JSON.parse(this.compare.params1);
        this.compare.difference = this.compare.difference.substring(
          1,
          this.compare.difference.length - 1
        );
        if (this.compare.difference.indexOf(':') > -1) {
          this.compare.difference = translaterMaster(
            this.compare.difference.split(':')[0]
          )
          // console.log(this.compare.difference);
        }
        // this.compare.difference = '[' + this.compare.difference + ']'
      } else {
        this.$message({
          message: '获取该比对记录失败',
          showClose: true,
          type: 'error',
          duration: 4000
        });
      }
    },
    /**
     * @description: 引用翻译
     */
    translaterMaster(str) {
      return translaterMaster(str)
    },
    /**
     * @description: 处理成可比较数据（取交集）
     * @param {object} obj1 对象参数1
     * @param {object} obj2 对象参数2
     */
    intersectObjects(obj1, obj2) {
      var mergeArray = []
      for (var i in obj1) {
        if (obj2.hasOwnProperty(i)) {
          mergeArray.push(i)
        }
      }
      // console.log(mergeArray);
      return mergeArray
    },
    /**
     * @description: 处理成可比较数据（取并集）
     * @param {object} obj1 对象参数1
     * @param {object} obj2 对象参数2
     */
    mergeObjects(obj1, obj2) {
      var mergeArray = []
      for (var i in obj1) {
        mergeArray.push(i)
      }
      for (i in obj2) {
        if (mergeArray.indexOf(i) > -1) {
          continue
        } else {
          mergeArray.push(i)
        }
      }
      return mergeArray
    },
    /**
     * @description: 关闭所有tab
     */
    handleCloseAll() {
      this.$emit('closeall')
    }
  }
}
</script>

<style lang="scss" scoped>
.details-container {
  font-family: PingFangHK-Medium, PingFangHK;
  .top {
    font-size: 16px;
    color: #333333;
    margin: 20px 0;
    .title {
      label {
        font-size: 18px;
        font-weight: bold;
      }
    }
    .item {
      margin-top: 15px;
      i {
        color: #3d5eff;
      }
    }
  }
  .infos {
    padding: 10px;
    font-size: 15px;
    line-height: 20px;
    .el-col {
      padding: 5px;
    }
    .infos-key {
      color: #999999;
    }
    .infos-value {
      color: #333333;
    }
  }
  .compare {
    .compare-title {
      font-size: 16px;
      font-weight: bold;
      margin: 10px 5px;
    }
    .details-table {
      border: 1px solid #efeff7;
      background: #f8f8fa;
      color: #333333;
      .table-column {
        padding: 10px;
        font-size: 15px;
        font-weight: 550;
        text-align: center;
      }
      .table-items {
        background: white;
        border-bottom: 1px solid #efeff7;
        text-align: left;
        padding: 7px;
        font-size: 15px;
        .table-items-key {
          color: #666666;
          font-weight: 550;
        }
        .table-items-value {

        }
      }
    }
  }
}

</style>
