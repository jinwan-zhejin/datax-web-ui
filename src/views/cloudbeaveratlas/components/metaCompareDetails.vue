<!--
 * @Date: ,: 2020-11-03 14:51:16
 * @Author: ,: Anybody
 * @LastEditors: ,: Anybody
 * @LastEditTime: ,: 2020-11-05 11:16:50
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
    <!-- 【对象相交】{{ intersectObjects(compare.params1, compare.params2) }}
    <br><br>
    【对象合并】{{ mergeObjects(compare.params1, compare.params2) }}
    <br><br> -->
    <!-- 【1】 {{ compare.params1 }}
    <br><br>
    【2】 {{ compare.params2 }} -->
    <!-- <el-button @click="test">test</el-button> -->
    <el-row class="compare">
      <el-col class="compare-title">
        <el-col><label>基于时间比对详情</label></el-col>
        <el-col class="compare-infos">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="infos-key">状态：</span>
            <span class="infos-value">{{ compare.difference === '' ? '版本一致' : (compare.difference.indexOf('.') > -1 ? '参数不一致' : compare.difference) }}</span>
          </el-col>
          <el-col v-if="compare.difference.indexOf('.') > -1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="infos-key">具体参数：</span>
            <span class="infos-value">{{ translaterArray(compare.difference) }}</span>
          </el-col>
        </el-col>
      </el-col>
      <el-col v-if="objectHasVal !== 0" class="details-table">
        <el-col :span="12" style="border-right: 1px solid #e9e9e9dd;">
          <el-col class="table-column">基线时间版本详情</el-col>
        </el-col>
        <el-col :span="12" style="border-left: 1px solid #e9e9e9dd;">
          <el-col class="table-column">待比较时间版本详情</el-col>
        </el-col>
        <!-- 对象一致\对象修改 -->
        <el-col v-if="compare.difference === '' || compare.difference.indexOf('.') > -1">
          <el-col v-for="(item, index) in mergeObjects(compare.params1, compare.params2)" :key="index" class="table-items">
            <el-col :span="12" style="border-right: 1px solid #e9e9e9dd; padding: 7px;" :style="{background: differenceArray.indexOf(item)>-1?'rgb(255, 244, 182)':'transparent'}">
              <el-col class="table-items-key" :span="5">{{ compare.params1.hasOwnProperty(item) ? translaterMaster(item) : '' }}</el-col>
              <el-col class="table-items-value" :span="19" v-html="compare.params1.hasOwnProperty(item) ? object2Table(item, compare.params1[item]) :''" />
            </el-col>
            <el-col :span="12" style="border-right: 1px solid #e9e9e9dd; padding: 7px;" :style="{background: differenceArray.indexOf(item)>-1?'rgb(255, 244, 182)':'transparent'}">
              <el-col class="table-items-key" :span="5">{{ compare.params2.hasOwnProperty(item) ? translaterMaster(item) : '' }}</el-col>
              <el-col class="table-items-value" :span="19" v-html="compare.params2.hasOwnProperty(item) ? object2Table(item, compare.params2[item]) : ''" />
            </el-col>
          </el-col>
        </el-col>
        <!-- 对象添加/删除 -->
        <el-col v-else-if="objectHasVal === 1 || objectHasVal === 2">
          <el-col v-for="(value, key, index) in compare['params' + objectHasVal]" :key="index" class="table-items">
            <el-col :span="12" style="border-right: 1px solid #e9e9e9dd; padding: 7px">
              <el-col class="table-items-key" :span="5">{{ objectHasVal===1 ? translaterMaster(key) : '' }}</el-col>
              <el-col class="table-items-value" :span="19" v-html="objectHasVal===1 ? object2Table(key, value) : ''" />
            </el-col>
            <el-col :span="12" style="border-right: 1px solid #e9e9e9dd; padding: 7px">
              <el-col class="table-items-key" :span="5">{{ objectHasVal===2 ? translaterMaster(key) : '' }}</el-col>
              <el-col class="table-items-value" :span="19" v-html="objectHasVal===2 ? object2Table(key, value) : ''" />
            </el-col>
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
    /**
     * @description: 获取有值的比对项
     */
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
    },
    /**
     * @description: comapre.difference数组
     */
    differenceArray() {
      var temp = this.compare.difference.split(', ')
      return temp
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
    test() {
      console.log(this.compare.params1['classifications']);
    },
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
     * @description: 翻译difference
     */
    translaterArray(str) {
      const array = str.split(', ')
      let temp = ''
      for (var i = 0; i < array.length; i++) {
        temp += translaterMaster(array[i].split('.')[0]).concat('-').concat(translaterMaster(array[i].split('.')[1]))
        if (i < array.length - 1) {
          temp += ',  '
        }
      }
      return temp
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
     * @description: 格式化value，日期格式化为date，对象格式化为表格
     * @param {string} key 键
     * @param {string} value 值
     */
    formatValue(key, value) {
      if (typeof value === 'number' && key.toLowerCase().indexOf('time') > -1) {
        return this.dateFormat('YYYY-mm-dd HH:MM:SS', value)
      } else if (typeof value === 'string' && value.indexOf('-') <= -1 && value.indexOf('/') <= -1 && value.indexOf(' ') <= -1 && key.toLowerCase().indexOf('time') > -1) {
        return this.dateFormat('YYYY-mm-dd HH:MM:SS', parseInt(value))
      } else {
        if (value.length === 0 || value === '') {
          return '-'
        }
        if (typeof value === 'object' && value.length === undefined) {
          return this.object2Table(key, value)
        }
        return value
      }
    },
    /**
     * @description: 对象转成表格展示
     * @param {string} key 键
     * @param {string} value 值
     */
    object2Table(key, value) {
      if (typeof value !== 'object') { // 非数组、对象
        if (typeof value === 'number' && key.toLowerCase().indexOf('time') > -1) {
          return this.dateFormat('YYYY-mm-dd HH:MM:SS', value)
        } else if (typeof value === 'string' && value.indexOf('-') <= -1 && value.indexOf('/') <= -1 && value.indexOf(' ') <= -1 && key.toLowerCase().indexOf('time') > -1) {
          return this.dateFormat('YYYY-mm-dd HH:MM:SS', parseInt(value))
        }
        return value
      } else {
        if (value.length === 0 || value === '') { // 空数组、空值
          return '-'
        }
        // 有值数组、对象
        // const mergeSub = this.mergeObjects(this.compare.params1[key], this.compare.params2[key]));
        var temp = ``
        var color = ''
        for (var i in value) {
          if (this.differenceArray.indexOf(key.concat('.').concat(i)) > -1) {
            color = 'rgb(255, 244, 182)'
          } else {
            color = 'transparent'
          }
          temp += `
          <div style="width: 100%; -webkit-line-clamp: 1;overflow: hidden;display: -webkit-box;white-space: normal; padding: 5px 0; background: ${color}; border-bottom: 1px solid #e9e9e9dd; border-left: 1px solid #e9e9e9dd; font-size: 14px">
            <div style="width: 30%; white-space: normal; word-break: break-all; padding-right: 10px; color: #666666; font-weight: 500; text-align: right;">${translaterMaster(i)}</div>
            <div style="width: 70%; white-space: normal; word-break: break-all;">${this.formatValue(key.concat('.').concat(i), value[i])}</div>
          </div>
          `
        }
        return temp
      }
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
    margin: 16px 0;
    .title {
      label {
        font-size: 24px;
        font-weight: bold;
      }
    }
    .item {
      margin-top: 15px;
      font-size: 24px;
      i {
        color: #3d5eff;
      }
    }
  }
  .infos {
    padding: 10px 0;
    font-size: 15px;
    line-height: 20px;
    .el-col {
      padding: 5px 0;
    }
  }
  .infos-key {
    color: #999999;
  }
  .infos-value {
    color: #333333;
  }
  .compare {
    .compare-title {
      label {
        font-size: 18px;
        font-weight: bold;
      }
      .compare-infos {
        font-size: 15px;
        margin: 16px 0;
      }
      margin: 10px 0;
    }
    .details-table {
      border: 1px solid #e9e9e9dd;
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
        border-bottom: 1px solid #e9e9e9dd;
        text-align: left;
        // padding: 7px;
        font-size: 14px;
        .table-items-key {
          color: #666666;
          font-weight: 550;
          text-align: right;
          padding-right: 15px;
        }
        .table-items-value {
          color: #333333;
        }
      }
    }
  }
}

</style>
