<!--
 * @Date: 2020-10-22 10:21:05
 * @Author: Anybody
 * @LastEditors: ,: Anybody
 * @LastEditTime: ,: 2020-11-02 14:56:54
 * @FilePath: ,: \datax-web-ui\src\views\cloudbeaveratlas\components\statistics.vue
 * @Description: 统计
-->

<template>
  <div>
    <el-dialog :visible="statisticsShow" title="统计数据" width="60%" top="7.5vh" custom-class="dialog-border-radius" @close="closeStatistics">
      <el-button style="position: absolute;right: 55px;top: 15px;" size="mini" plain type="primary" icon="el-icon-refresh-left" @click="getStatistics" />
      <el-scrollbar>
        <el-collapse v-model="statistics.activeCollapse">
          <el-collapse-item name="entity">
            <div slot="title">
              实体 ({{ statistics.entity.count }})
            </div>
            <el-table :data="statistics.entity.table" :default-sort="{prop: 'key'}" :header-cell-style="headerCellStyle">
              <el-table-column label="实体类型" prop="key" />
              <el-table-column :label="'有效 (' + statistics.entity.active + ')'">
                <template v-slot:default="{row}">
                  <a :class="{'alink-blue':row.active>0}">{{ row.active }}</a>
                </template>
              </el-table-column>
              <el-table-column :label="'已删除 (' + statistics.entity.deleted + ')'">
                <template v-slot:default="{row}">
                  <a :class="{'alink-red':row.deleted>0}">{{ row.deleted }}</a>
                </template>
              </el-table-column>
              <el-table-column :label="'Shell (' + statistics.entity.shell + ')'">
                <template v-slot:default="{row}">
                  <a :class="{'alink-red':row.shell>0}">{{ row.shell }}</a>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="classification">
            <div slot="title">
              分类 ({{ statistics.classification.count }})
            </div>
            <el-table :data="statistics.classification.table" :default-sort="{prop: 'key'}" :header-cell-style="headerCellStyle">
              <el-table-column label="名称" prop="key" />
              <el-table-column :label="'数量 (' + statistics.classification.count + ')'">
                <template v-slot:default="{row}">
                  <a :class="{'alink-blue':row.count>0}">{{ row.count }}</a>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="server">
            <div slot="title">
              服务器统计
            </div>
            <el-col>
              <el-table :data="statistics.server.server" :default-sort="{prop: 'key'}" :header-cell-style="headerCellStyle">
                <el-table-column label="服务器详细信息" prop="key">
                  <template v-slot:default="{row}">
                    {{ translater(row.key) }}
                  </template>
                </el-table-column>
                <el-table-column label="" prop="value" />
              </el-table>
            </el-col>
            <el-col>
              <br>
              <span style="font-size: 16px;font-weight: bold;">通知详情</span>
              <el-table :header-cell-style="headerCellStyle">
                <el-table-column label="Kafka主题分区" />
                <el-table-column label="开始偏移" />
                <el-table-column label="当前偏移" />
                <el-table-column label="处理" />
                <el-table-column label="失败" />
                <el-table-column label="最后消息处理时间" />
              </el-table>
            </el-col>
            <el-col>
              <el-table :data="statistics.server.notification.table2" :default-sort="{prop: 'key'}" :header-cell-style="headerCellStyle">
                <el-table-column label="期" prop="key" />
                <el-table-column label="计数" prop="count" />
                <el-table-column label="平均时间（毫秒）" prop="avg" />
                <el-table-column label="创建" prop="creates" />
                <el-table-column label="更新" prop="updates" />
                <el-table-column label="删除" prop="deletes" />
                <el-table-column label="失败" prop="failed" />
              </el-table>
            </el-col>
          </el-collapse-item>
          <el-collapse-item name="system">
            <div slot="title">
              系统详情
            </div>
            <el-table :data="statistics.system.os" :default-sort="{prop: 'key'}" :header-cell-style="headerCellStyle">
              <el-table-column label="OS" prop="key">
                <template v-slot:default="{row}">
                  {{ translater(row.key) }}
                </template>
              </el-table-column>
              <el-table-column label="" prop="value" />
            </el-table>
            <el-table :data="statistics.system.runtime" :default-sort="{prop: 'key'}" :header-cell-style="headerCellStyle">
              <el-table-column label="运行环境" prop="key">
                <template v-slot:default="{row}">
                  {{ translater(row.key) }}
                </template>
              </el-table-column>
              <el-table-column label="" prop="value" />
            </el-table>
            <el-table :data="statistics.system.memory" :default-sort="{prop: 'key'}" :header-cell-style="headerCellStyle">
              <el-table-column label="内存" prop="key">
                <template v-slot:default="{row}">
                  {{ row.key.indexOf('_')>-1 ? translaterMaster(row.key):translater(row.key) }}
                </template>
              </el-table-column>
              <el-table-column label="">
                <template v-slot:default="{row}">
                  <!-- {{ (row.key==='memory_pool_usages'||row.key==='nonHeapMax') ? row.value : computeSize(row.value).concat(' MB') }} -->
                  <span v-if="row.key==='nonHeapMax'">{{ row.value }}</span>
                  <span v-else-if="row.key==='memory_pool_usages'">
                    <json-viewer :value="row.value" :expand-depth="2" expanded :copyable="false" boxed sort />
                  </span>
                  <span v-else>{{ computeSize(row.value).concat(' MB') }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="closeStatistics">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getItemsNotEmpty } from '@/api/datax-metadata-atlas'
import { translater, translaterMaster } from '../utils/dictionary'
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)

export default {
  name: 'Statistics',
  props: {
    statisticsShow: Boolean
  },
  data() {
    return {
      statistics: {
        data: {}, // 统计数据
        activeCollapse: ['classification', 'server'],
        entity: {
          count: 0, // 总数
          active: 0, // 有效
          deleted: 0, // 已删除
          shell: 0,
          table: []
        },
        classification: {
          count: 0, // 总数
          table: []
        },
        server: {
          server: [],
          notification: {
            table1: [],
            table2: []
          }
        },
        system: {
          os: [],
          runtime: [],
          memory: []
        }
      },
      headerCellStyle: { background: '#F8F8FA', color: '#333333', fontWeight: 'bold' }
    }
  },
  computed: {
    computeSize() {
      return rowdata => {
        return (parseInt(rowdata) / 1048576).toFixed(2)
      }
    }
  },
  watch: {
    statisticsShow: {
      handler(val) {
        if (val) {
          this.getStatistics()
        }
      }
    }
  },
  created() {
    this.getStatistics()
  },
  methods: {
    /**
     * @description: 获取统计数据
     */
    async getStatistics() {
      const res = await getItemsNotEmpty()
      if (res.status === 200 && res.statusText === 'OK') {
        this.initStatistics()
        this.statistics.data = res.data.data
        this.statistics.entity.count = this.statistics.data.general.entityCount
        // 处理entity表格
        for (var i in this.statistics.data.entity.entityActive) {
          this.statistics.entity.active += this.statistics.data.entity.entityActive[i]
          this.statistics.entity.table.push({
            key: i,
            active: this.statistics.data.entity.entityActive[i],
            deleted: this.statistics.data.entity.entityDeleted.hasOwnProperty(i) ? this.statistics.data.entity.entityDeleted[i] : 0,
            shell: this.statistics.data.entity.entityShell.hasOwnProperty(i) ? this.statistics.data.entity.entityShell[i] : 0
          })
        }
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.entity.entityDeleted) {
          this.statistics.entity.deleted += this.statistics.data.entity.entityDeleted[i]
          if (!this.statistics.data.entity.entityActive.hasOwnProperty(i)) {
            this.statistics.entity.table.push({
              key: i,
              active: 0,
              deleted: this.statistics.data.entity.entityDeleted[i],
              shell: this.statistics.data.entity.entityShell.hasOwnProperty(i) ? this.statistics.data.entity.entityShell[i] : 0
            })
          }
        }
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.entity.entityShell) {
          this.statistics.entity.shell += this.statistics.data.entity.entityShell[i]
          if (!this.statistics.data.entity.entityActive.hasOwnProperty(i) && !this.statistics.data.entity.entityDeleted.hasOwnProperty(i)) {
            this.statistics.entity.table.push({
              key: i,
              active: 0,
              deleted: 0,
              shell: this.statistics.data.entity.entityShell[i]
            })
          }
        }
        // 处理classification表格
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.tag.tagEntities) {
          this.statistics.classification.count += this.statistics.data.tag.tagEntities[i]
          this.statistics.classification.table.push({
            key: i,
            count: this.statistics.data.tag.tagEntities[i]
          })
        }
        // 处理server表格
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.general.stats) {
          if (i.indexOf('Server:') > -1) {
            // Server Details
            this.statistics.server.server.push({
              key: i.replace('Server:', ''),
              value: (i.replace('Server:', '') === 'activeTimeStamp' || i.replace('Server:', '') === 'startTimeStamp') ? this.formatDate(this.statistics.data.general.stats[i]) : this.statistics.data.general.stats[i]
            })
          } else if (i.indexOf('Notification:') > -1) {
            // Notification Details
            if (i.replace('Notification:', '') === 'total') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')).concat(' (开始于').concat(this.formatDate(this.statistics.data.general.stats['Server:startTimeStamp']).concat(')')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('Creates')],
                updates: this.statistics.data.general.stats[i.concat('Updates')],
                deletes: this.statistics.data.general.stats[i.concat('Deletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            } else if (i.replace('Notification:', '') === 'currentHour') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')).concat(' (开始于').concat(this.formatDate(this.statistics.data.general.stats[i.concat('StartTime')]).concat(')')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('EntityCreates')],
                updates: this.statistics.data.general.stats[i.concat('EntityUpdates')],
                deletes: this.statistics.data.general.stats[i.concat('EntityDeletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            } else if (i.replace('Notification:', '') === 'currentDay') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')).concat(' (开始于').concat(this.formatDate(this.statistics.data.general.stats[i.concat('StartTime')]).concat(')')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('EntityCreates')],
                updates: this.statistics.data.general.stats[i.concat('EntityUpdates')],
                deletes: this.statistics.data.general.stats[i.concat('EntityDeletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            } else if (i.replace('Notification:', '') === 'previousHour') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('EntityCreates')],
                updates: this.statistics.data.general.stats[i.concat('EntityUpdates')],
                deletes: this.statistics.data.general.stats[i.concat('EntityDeletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            } else if (i.replace('Notification:', '') === 'previousDay') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('EntityCreates')],
                updates: this.statistics.data.general.stats[i.concat('EntityUpdates')],
                deletes: this.statistics.data.general.stats[i.concat('EntityDeletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            }
          }
        }
        this.statistics.server.server.push({
          key: 'collectionTime',
          value: this.formatDate(this.statistics.data.general.collectionTime)
        })
        // 处理system表格
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.system.os) {
          this.statistics.system.os.push({
            key: i,
            value: this.statistics.data.system.os[i]
          })
        }
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.system.runtime) {
          this.statistics.system.runtime.push({
            key: i,
            value: this.statistics.data.system.runtime[i]
          })
        }
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.system.memory) {
          // 大小单位转换
          if (i === 'memory_pool_usages') {
            for (var k in this.statistics.data.system.memory[i]) {
              for (var j in this.statistics.data.system.memory[i][k]) {
                this.statistics.data.system.memory[i][k][j] = (this.statistics.data.system.memory[i][k][j] / 1024 / 1024).toFixed(2).concat(' MB')
              }
            }
          }
          this.statistics.system.memory.push({
            key: i,
            value: this.statistics.data.system.memory[i]
          })
        }
      }
    },
    /**
     * @description: 初始化统计数据
     */
    initStatistics() {
      this.statistics.entity = {
        count: 0, // 总数
        active: 0, // 有效
        deleted: 0, // 已删除
        shell: 0,
        table: []
      }
      this.statistics.classification = {
        count: 0, // 总数
        table: []
      }
      this.statistics.server = {
        server: [],
        notification: {
          table1: [],
          table2: []
        }
      }
      this.statistics.system = {
        os: [],
        runtime: [],
        memory: []
      }
    },
    /**
     * @description: 格式化时间
     */
    formatDate(val) {
      const date = new Date(val);
      const y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      // h = h < 10 ? ('0' + h) : h;
      const ampm = h > 12 ? 'PM' : 'AM'
      h = h > 12 ? (h - 12) : h
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      // let s = date.getSeconds();
      // s = s < 10 ? ('0' + s) : s;
      return y + '/' + MM + '/' + d + ' ' + h + ':' + m + ' ' + ampm + ' (CST)';
    },
    translater(str) {
      return translater(str)
    },
    translaterMaster(str) {
      return translaterMaster(str)
    },
    /**
     * @description: 关闭dialog
     */
    closeStatistics() {
      this.$emit('closestatistics')
    }
  }
}
</script>

<style lang="scss" scoped>
.alink-blue {
  color: #3D5FFF;
}
.alink-red {
  color: #b43d1f;
}
.alink:hover,.alink-red:hover {
  text-decoration:underline
}
.el-scrollbar {
  height: calc(63vh);
  .el-collapse {
    background: white;
    ::v-deep .el-collapse-item__header {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
.el-table {
  border: 2px solid #f8f8fa;
}
// .dialog-border-radius {
//   border-radius: 8px;
// }

</style>
