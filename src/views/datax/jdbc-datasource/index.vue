<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">普通数据源</div>
          <div class="right">
            <el-input
              v-model="listQuery.datasourceName"
              clearable
              placeholder="数据源名称"
              style="width: 268px"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            >
              <el-button slot="append" v-waves size="small" style="margin: 0px;padding: 8.5px 0px;" class="filter-item" type="goon" @click="fetchData">搜索</el-button>
            </el-input>
            <el-button class="filter-item" style="margin-left: 10px;" type="goon" size="small" icon="el-icon-plus" @click="showAdd">
              添加
            </el-button>
            <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
              reviewer
            </el-checkbox> -->
          </div>
        </div>
      </el-card>
    </div>
    <div class="main">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        :header-cell-style="{ background: '#FAFAFC' }"
        fit
        highlight-current-row
      >
        <!-- <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">{{ scope.$index }}</template>
        </el-table-column> -->
        <el-table-column label="数据源" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.datasource }}</template>
        </el-table-column>
        <el-table-column label="数据源名称" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.datasourceName }}</template>
        </el-table-column>
        <el-table-column label="数据源分组" width="140" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.datasourceGroup }}
          </template>
        </el-table-column>
        <el-table-column
          label="jdbc连接串"
          width="200"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{
            scope.row.jdbcUrl ? scope.row.jdbcUrl : "-"
          }}</template>
        </el-table-column>
        <el-table-column
          label="ZK地址"
          width="190"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{
            scope.row.zkAdress ? scope.row.zkAdress : "-"
          }}</template>
        </el-table-column>
        <el-table-column
          label="数据库名"
          width="120"
          align="center"
          :show-overflow-tooltip="true"
        >-->
          <template slot-scope="scope">{{
            scope.row.database ? scope.row.database : "-"
          }}</template>-->
        </el-table-column>
        <el-table-column label="备注" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.comments }}</template>
        </el-table-column>
        <el-table-column
          min-width="200"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <a
              style="color: #3d5fff; margin: 0px 6px"
              @click="handleUpdate(row)"
            >编辑</a>
            <span
              style="
                width: 1px;
                height: 12px;
                background: #e6e6e8;
                display: inline-block;
              "
            />
            <a
              style="color: #fe4646; margin: 0px 6px"
              @click="handleDelete(row)"
            >删除</a>
            <span
              style="
                width: 1px;
                height: 12px;
                background: #e6e6e8;
                display: inline-block;
              "
            />
            <a
              style="color: #3d5fff; margin: 0px 6px"
              :disabled="gathering"
              @click="gatherMetadata(row)"
            >元数据采集</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        style="float: right"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        layout="total, prev, pager, next, sizes"
        @pagination="fetchData"
      />
    </div>
    <!-- 原添加编辑对话框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="800px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="数据源" prop="datasource">
          <el-select
            v-model="temp.datasource"
            placeholder="数据源"
            style="width: 200px"
            @change="selectDataSource(temp.datasource)"
          >
            <el-option
              v-for="item in dataSources"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据源名称" prop="datasourceName">
          <el-input
            v-model="temp.datasourceName"
            placeholder="数据源名称"
            style="width: 40%"
          />
        </el-form-item>
        <el-form-item label="数据源分组" prop="datasourceGroup">
          <el-input
            v-model="temp.datasourceGroup"
            placeholder="数据源分组"
            style="width: 40%"
          />
        </el-form-item>
        <el-form-item v-if="jdbc" label="用户名">
          <el-input
            v-model="temp.userName"
            placeholder="用户名"
            style="width: 40%"
          />
        </el-form-item>
        <el-form-item v-if="visible" v-show="jdbc" label="密码">
          <el-input
            v-model="temp.password"
            type="password"
            placeholder="密码"
            style="width: 40%"
          >
            <i
              slot="suffix"
              title="显示密码"
              style="cursor: pointer"
              class="el-icon-view"
              @click="changePass('show')"
            />
          </el-input>
        </el-form-item>
        <el-form-item v-show="jdbc" v-else label="密码">
          <el-input
            v-model="temp.password"
            type="text"
            placeholder="密码"
            style="width: 40%"
          >
            <i
              slot="suffix"
              title="隐藏密码"
              style="cursor: pointer"
              class="el-icon-check"
              @click="changePass('hide')"
            />
          </el-input>
        </el-form-item>
        <el-form-item v-if="jdbc" label="jdbc url" prop="jdbcUrl">
          <el-input
            v-model="temp.jdbcUrl"
            :autosize="{ minRows: 3, maxRows: 6 }"
            type="textarea"
            placeholder="jdbc url"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item v-if="mongodb" label="地址" prop="jdbcUrl">
          <el-input
            v-model="temp.jdbcUrl"
            :autosize="{ minRows: 3, maxRows: 6 }"
            type="textarea"
            placeholder="127.0.0.1:27017"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item v-if="jdbc" label="jdbc驱动类" prop="jdbcDriverClass">
          <el-input
            v-model="temp.jdbcDriverClass"
            placeholder="jdbc驱动类"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item v-if="hbase" label="ZK地址" prop="zkAdress">
          <el-input
            v-model="temp.zkAdress"
            placeholder="127.0.0.1:2181"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item v-if="mongodb" label="数据库名称" prop="database">
          <el-input
            v-model="temp.database"
            placeholder="数据库名称"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item label="注释">
          <el-input
            v-model="temp.comments"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
            style="width: 60%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="goon"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
        <el-button type="goon" @click="testDataSource()"> 测试连接 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPluginVisible" title="Reading statistics">
      <el-table
        :data="pluginData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="goon"
          @click="dialogPvVisible = false"
        >Confirm</el-button>
      </span>
    </el-dialog>
    <!-- UI添加对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="70%" top="51px">
      <div slot="title" class="add_dialog_title">
        <span v-show="currentStep === 2">{{ sqlName }}连接设置</span>
        <span v-show="currentStep === 1">选择新连接类型</span>
      </div>
      <!-- 第一步选择连接类型 -->
      <div v-show="currentStep === 1" class="topSelect">
        <!-- <span>选择数据源:</span><el-input v-model="sqlName" style="width: 80%;float: right;" disabled /> -->
        <el-input v-model="input3" placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" style="backgroundColor: #3D5FFF;border-radius: 0px 4px 4px 0px;color: #FFFFFF;" size="small" @click="searchSQL">搜索</el-button>
        </el-input>
      </div>
      <el-tabs
        v-show="currentStep === 1"
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="所有类型" name="first">
          <ul>
            <li v-for="item in iconTXT" v-show="isShowSQL" :id="item.name" :key="item.name" @click="getInfo" @dbclick="dbClickNext">
              <a>
                <img :src="item.url" :alt="item.name">
                <p>{{ item.name }}</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="常用类型" name="second">
          <ul>
            <li @click="getInfo">
              <a>
                <img src="@/assets/dataSourceIcon/mysql_icon_big@2x.png" alt="">
                <p>MYSQL</p>
              </a>
            </li>
            <li @click="getInfo">
              <a>
                <img src="@/assets/dataSourceIcon/postgresql_icon_big@2x.png" alt="">
                <p>postgresql</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="SQL" name="third">
          <ul>
            <li @click="getInfo">
              <a>
                <img src="@/assets/dataSourceIcon/mysql_icon_big@2x.png" alt="">
                <p>MYSQL</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="分析型" name="fourth">
          <ul>
            <li @click="getInfo">
              <a>
                <img src="@/assets/dataSourceIcon/hive_icon_big@2x.png" alt="">
                <p>hive</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <!-- 第二步表单 -->
      <!-- SQL Server连接设置表单 -->
      <el-form
        v-show="sqlserver"
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="主机" prop="master">
          <el-input
            v-model="ruleForm.master"
            placeholder="PS:目前由于接口参数不同，未曾改动，暂时将此属性当作数据源名称使用"
          />
        </el-form-item>
        <el-form-item label="数据库架构">
          <el-input
            v-model="ruleForm.sql"
            placeholder="当前属性同上原因,暂时不起任何作用"
          />
        </el-form-item>
        <el-form-item label="认证" prop="authentication">
          <el-select v-model="ruleForm.authentication" placeholder="请选择">
            <el-option label="master" value="master" />
            <el-option label="master1" value="master1" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
      </el-form>
      <!-- MariaDB MYSQL连接设置表单 -->
      <div v-show="mm" class="set">
        <p>服务器</p>
        <el-form :model="ServerForm" class="bgcForm">
          <div class="from_item_input float_input">
            <span class="input_label">服务器地址:</span>
            <div class="input_content">
              <el-input v-model="ServerForm.serverUrl" size="small" />
            </div>
          </div>

          <div class="from_item_input float_input">
            <span class="input_label">端口:</span>
            <div class="input_content">
              <el-input v-model="ServerForm.serverPort" size="small" />
            </div>
          </div>

          <div class="from_item_input float_input last_input">
            <span class="input_label">数据库:</span>
            <div class="input_content">
              <el-input v-model="ServerForm.database" size="small" />
            </div>
          </div>
        </el-form>
        <p>认证</p>
        <el-form :model="userForm" class="bgcForm">
          <div class="from_item_input">
            <span class="input_label">用户名:</span>
            <div class="input_content">
              <el-input v-model="userForm.username" size="small" />
            </div>
          </div>

          <div class="from_item_input">
            <span class="input_label">密码:</span>
            <div class="input_content">
              <el-input
                v-model="userForm.password"
                size="small"
                type="password"
              />
              <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
            </div>
          </div>
        </el-form>
        <p>高级</p>
        <el-form :model="AdvancedForm" class="bgcForm">

          <div class="from_item_input last_input">
            <span class="input_label">服务器时区:</span>
            <div class="input_content">
              <!-- <el-input v-model="AdvancedForm.serverTime" size="small" /> -->
              <el-select v-model="AdvancedForm.serverTime" style="height: 32px;" placeholder="请选择服务器时区">
                <el-option label="Asia/Shanghai" value="shanghai" />
              </el-select>
            </div>
          </div>
        </el-form>
      </div>
      <!-- Greenplum PostqreSQL连接设置表单 -->
      <div v-show="gp" class="set">
        <p>服务器</p>
        <el-form :model="ServerForm" label-width="100px" class="bgcForm">
          <el-form-item label="主机:">
            <el-input v-model="ServerForm.master" />
          </el-form-item>
          <el-form-item label="端口:">
            <el-input v-model="ServerForm.serverPort" />
          </el-form-item>
          <el-form-item label="数据库:">
            <el-input v-model="ServerForm.database" />
          </el-form-item>
        </el-form>
        <p>认证</p>
        <el-form :model="userForm" label-width="100px" class="bgcForm">
          <el-form-item label="用户名:">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="密码:">
            <el-input v-model="userForm.password" />
            <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
          </el-form-item>
        </el-form>
        <p>高级</p>
        <el-form :model="AdvancedForm" label-width="100px" class="bgcForm">
          <el-form-item label="用户角色:" style="width: 50%; float: left">
            <el-input v-model="AdvancedForm.userRole" />
          </el-form-item>
          <el-form-item label="本地客户端:" style="width: 50%; float: right">
            <el-input v-model="AdvancedForm.client" />
          </el-form-item>
        </el-form>
      </div>
      <!-- Apache Hive,Apache Spark,Cloudera Impala连接设置表单 -->
      <div v-show="threeSQL" class="set">
        <p>一般</p>
        <el-form :model="ServerForm" label-width="100px" class="bgcForm">
          <el-form-item label="JDBC URL:" style="width: 50%">
            <el-input v-model="ServerForm.jdbcUrl" />
          </el-form-item>
          <el-form-item label="主机:" style="width: 50%; float: left">
            <el-input v-model="ServerForm.master" />
          </el-form-item>
          <el-form-item label="端口:" style="width: 50%; float: right">
            <el-input v-model="ServerForm.serverPort" />
          </el-form-item>
          <el-form-item label="数据库/模式:" style="width: 50%">
            <el-input v-model="ServerForm.database" />
          </el-form-item>
        </el-form>
        <p>认证</p>
        <el-form :model="userForm" label-width="100px" class="bgcForm">
          <el-form-item label="用户名:" style="width: 50%">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="密码:" style="width: 50%">
            <el-input v-model="userForm.password" />
            <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <!-- oracle连接设置表单 -->
      <div v-show="oracle" class="set">
        <p>连接类型</p>
        <el-form :model="ServerForm" label-width="100px" class="bgcForm">
          <el-form-item label="主机:" style="width: 50%; float: left">
            <el-input v-model="ServerForm.master" />
          </el-form-item>
          <el-form-item label="端口:" style="width: 50%; float: right">
            <el-input v-model="ServerForm.serverPort" />
          </el-form-item>
          <el-form-item label="Database:">
            <el-select
              v-model="ServerForm.database"
              placeholder="ORCL"
              style="width: 55%; float: left"
            >
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="ServerForm.role"
              placeholder="ORCL"
              style="width: 40%; float: right"
            >
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <p>认证</p>
        <el-form :model="userForm" label-width="100px" class="bgcForm">
          <el-form-item label="认证:" style="width: 50%">
            <el-select v-model="userForm.advanced" placeholder="请选择认证">
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用户名:" style="width: 50%; float: left">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="角色:" style="width: 50%; float: right">
            <el-select v-model="userForm.role" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="密码:" style="width: 50%">
            <el-input v-model="userForm.password" />
            <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <!-- DB2 LUW 连接设置表单 -->
      <div v-show="DB2" class="set">
        <p>数据库</p>
        <el-form :model="ServerForm" label-width="100px" class="bgcForm">
          <el-form-item label="主机:" style="width: 50%; float: left">
            <el-input v-model="ServerForm.master" />
          </el-form-item>
          <el-form-item label="端口:" style="width: 50%; float: right">
            <el-input v-model="ServerForm.port" />
          </el-form-item>
          <el-form-item label="数据库:" prop="username">
            <el-input v-model="ServerForm.sql" />
          </el-form-item>
        </el-form>
        <p>认证</p>
        <el-form :model="userForm" label-width="100px" class="bgcForm">
          <el-form-item label="用户名:" style="width: 50%">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="密码:" style="width: 50%">
            <el-input v-model="userForm.password" />
            <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <!-- ClickHouse HBase 连接设置表单 -->
      <div v-show="ch" class="set">
        <p>一般</p>
        <el-form :model="ServerForm" label-width="100px" class="bgcForm">
          <el-form-item label="JDBC URL:" style="width: 50%">
            <el-input v-model="ServerForm.jdbcUrl" />
          </el-form-item>
          <el-form-item label="端口:" style="width: 50%; float: right">
            <el-input v-model="ServerForm.serverPort" />
          </el-form-item>
          <el-form-item label="主机:" style="width: 50%">
            <el-input v-model="ServerForm.master" />
          </el-form-item>
        </el-form>
        <p>认证</p>
        <el-form :model="userForm" label-width="100px" class="bgcForm">
          <el-form-item label="用户名:" style="width: 50%">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="密码:" style="width: 50%">
            <el-input v-model="userForm.password" />
            <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="currentStep === 2" size="small" style="float: left;">测试连接...</el-button>
        <el-button v-show="currentStep !== 1" size="small" @click="lastStep">上一步</el-button>
        <el-button size="small" type="goon" @click="nextStep">下一步</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" :disabled="currentStep === 1" @clsick="addData">完 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as datasourceApi from '@/api/datax-jdbcDatasource';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination';
import * as meta from '@/api/metadata-query';

let time = null

export default {
  name: 'JdbcDatasource',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      gathering: false,
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 10
      },
      isShowSQL: true, // SQL的显示
      checked: false, // 是否保存本地密码
      iconTXT: [
        {
          name: 'MySQL',
          url: require('@/assets/dataSourceIcon/mysql_icon_big@2x.png'),
          selected: 0
        },
        {
          name: 'MongoDB',
          url: require('@/assets/dataSourceIcon/MongoDB.png'),
          selected: 0
        },
        {
          name: 'Greenplum',
          url: require('@/assets/dataSourceIcon/GREEN.png'),
          selected: 0
        },
        {
          name: 'Hive',
          url: require('@/assets/dataSourceIcon/hive_icon_big@2x.png'),
          selected: 0
        },
        {
          name: 'Sql Server',
          url: require('@/assets/dataSourceIcon/mssql_icon_big@2x.png'),
          selected: 0
        },
        {
          name: 'PostgreSQL',
          url: require('@/assets/dataSourceIcon/postgresql_icon_big@2x.png'),
          selected: 0
        },
        {
          name: 'Oracle',
          url: require('@/assets/dataSourceIcon/oracle.png'),
          selected: 0
        },
        {
          name: 'ClickHouse',
          url: require('@/assets/dataSourceIcon/clickhouse.png'),
          selected: 0
        },
        {
          name: 'HBase',
          url: require('@/assets/dataSourceIcon/hbase.png'),
          selected: 0
        },
        {
          name: 'DB2',
          url: require('@/assets/dataSourceIcon/db2_i_icon_big@2x.png'),
          selected: 0
        }
      ],
      roleList: [
        {
          value: '123',
          label: '管理员'
        }
      ],
      input3: '',
      pluginTypeOptions: ['reader', 'writer'],
      dialogPluginVisible: false,
      pluginData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        datasourceName: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        jdbcUrl: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        datasource: [
          { required: true, message: 'this is required', trigger: 'change' }
        ],
        zkAdress: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        database: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ]
      },
      temp: {
        id: undefined,
        datasourceName: '',
        datasourceGroup: 'Default',
        userName: '',
        password: '',
        jdbcUrl: '',
        comments: '',
        datasource: '',
        zkAdress: '',
        database: ''
      },
      visible: true,
      dataSources: [
        { value: 'MYSQL', label: 'MYSQL' },
        { value: 'oracle', label: 'oracle' },
        { value: 'postgresql', label: 'postgresql' },
        { value: 'greenplum', label: 'greenplum' },
        { value: 'sqlserver', label: 'sqlserver' },
        { value: 'hive', label: 'hive' },
        { value: 'hbase', label: 'hbase' },
        { value: 'mongodb', label: 'mongodb' },
        { value: 'clickhouse', label: 'clickhouse' }
      ],
      jdbc: true,
      hbase: false,
      mongodb: false,
      dialogVisible: false,
      diaTit: '选中新连接类型',
      currentStep: 1,
      activeName: 'first',
      ruleForm: {
        datasourceName: '',
        userName: '',
        password: '',
        jdbcUrl: '',
        comments: '',
        datasource: '',
        zkAdress: '',
        database: ''
      },
      AdvancedForm: {},
      ServerForm: {},
      userForm: {},
      // rules: {
      //   master: [
      //     { required: true, message: '请输入主机名称', trigger: 'blur' }
      //   ],
      //   sql: [
      //     { required: true, message: '请输入数据库/架构名称', trigger: 'blur' }
      //   ],
      //   username: [
      //     { required: true, message: '请输入用户名', trigger: 'blur' }
      //   ],
      //   password: [
      //     { required: true, message: '请输入密码', trigger: 'blur' }
      //   ],
      //   driver: [
      //     { required: true, message: '请输入驱动名称', trigger: 'blur' }
      //   ]
      // },
      sqlName: '',
      params: {
        comments: '',
        datasource: '',
        datasourceGroup: '',
        datasourceName: '',
        jdbcDriverClass: '',
        jdbcUrl: '',
        password: '',
        userName: ''
      },
      lastSelect: '',
      currentSelect: ''
    }
  },
  // 计算属性
  computed: {
    // ClickHouse HBase
    ch() {
      return (
        this.currentStep === 2 &&
        (this.sqlName === 'ClickHouse' || this.sqlName === 'HBase')
      );
    },
    // Greenplum PostqreSQL
    gp() {
      return (
        (this.sqlName === 'Greenplum' || this.sqlName === 'PostgreSQL') &&
        this.currentStep === 2
      );
    },
    // oracle
    oracle() {
      return this.sqlName === 'Oracle' && this.currentStep === 2;
    },
    // MariaDB MYSQL
    mm() {
      return (
        (this.sqlName === 'MariaDB' || this.sqlName === 'MySQL') &&
        this.currentStep === 2
      );
    },
    // DB2
    DB2() {
      return this.sqlName === 'DB2' && this.currentStep === 2;
    },
    // Apache Hive,Apache Spark,Cloudera Impala
    threeSQL() {
      return (
        (this.sqlName === 'Hive' ||
          this.sqlName === 'ApacheSpark' ||
          this.sqlName === 'ClouderaImpala') &&
        this.currentStep === 2
      );
    },
    // sqlserver
    sqlserver() {
      return (
        (this.sqlName === 'Sql Server' || this.sqlName === 'MongoDB') &&
        this.currentStep === 2
      );
    }
  },
  watch: {
    sqlName: function(val) {
      console.log(val);
      console.log(this.params, '----------');
      if (val === 'MYSQL') {
        this.params.jdbcUrl = 'jdbc:mysql://{host}:{port}/{database}';
        console.log(this.params.jdbcUrl);
      } else if (val === 'oracle') {
        this.params.jdbcUrl = 'jdbc:oracle:thin:@//{host}:{port}/{database}';
      } else if (val === 'postgresql') {
        this.params.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}';
        this.ruleForm.driver = 'org.postgresql.Driver';
      } else if (val === 'greenplum') {
        this.params.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}';
        this.ruleForm.driver = 'org.postgresql.Driver';
      } else if (val === 'sqlserver') {
        this.params.jdbcUrl =
          'jdbc:sqlserver://{host}:{port};DatabaseName={database}';
      } else if (val === 'clickhouse') {
        this.params.jdbcUrl = 'jdbc:clickhouse://{host}:{port}/{database}';
      } else if (val === 'hive') {
        this.params.jdbcUrl = 'jdbc:hive2://{host}:{port}/{database}';
      }
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    gatherMetadata(row) {
      this.$confirm('即将开始元数据采集, 是否继续?', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(row);
          const param = {};
          param.id = row.id;
          console.log(param);
          meta.getDbMetadata(param).then((res) => {
            console.log(res);
            this.gathering = false;
            this.$message({
              type: 'success',
              message: '元数据采集成功'
            });
          });
          this.gathering = true;
          this.$message({
            type: 'info',
            message: '采集任务开始!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消元数据采集'
          });
        });
    },
    searchSQL() {
      for (let i = 0; i < this.iconTXT.length; i++) {
        console.log(this.iconTXT[i].name.indexOf(this.input3))
        if (this.iconTXT[i].name.toLowerCase().indexOf(this.input3.toLowerCase()) === 0) {
          document.getElementById(this.iconTXT[i].name).style.display = 'block'
        } else {
          document.getElementById(this.iconTXT[i].name).style.display = 'none'
        }
      }
    },
    selectDataSource(datasource) {
      if (datasource === 'MYSQL') {
        this.temp.jdbcUrl = 'jdbc:mysql://{host}:{port}/{database}';
      } else if (datasource === 'oracle') {
        this.temp.jdbcUrl = 'jdbc:oracle:thin:@//{host}:{port}/{database}';
      } else if (datasource === 'postgresql') {
        this.temp.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}';
        this.temp.jdbcDriverClass = 'org.postgresql.Driver';
      } else if (datasource === 'greenplum') {
        this.temp.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}';
        this.temp.jdbcDriverClass = 'org.postgresql.Driver';
      } else if (datasource === 'sqlserver') {
        this.temp.jdbcUrl =
          'jdbc:sqlserver://{host}:{port};DatabaseName={database}';
      } else if (datasource === 'clickhouse') {
        this.temp.jdbcUrl = 'jdbc:clickhouse://{host}:{port}/{database}';
      } else if (datasource === 'hive') {
        this.temp.jdbcUrl = 'jdbc:hive2://{host}:{port}/{database}';
      }
      this.getShowStrategy(datasource);
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        datasourceName: '',
        datasourceGroup: 'Default',
        userName: '',
        password: '',
        jdbcUrl: '',
        jdbcDriverClass: '',
        comments: ''
      };
    },
    // 显示添加对话框
    showAdd() {
      this.dialogVisible = true;
    },
    // 获取点击当前数据源名称方法
    getInfo(e) {
      window.clearTimeout(time) // 首先清除计时器
      time = setTimeout(() => {
        this.sqlName = e.path[1].textContent.trim()
        if (this.sqlName !== this.lastSelect) {
          this.currentSelect = this.sqlName
          if (this.lastSelect !== '') {
            document.getElementById(this.lastSelect).style.backgroundColor = '#fff'
          }
          document.getElementById(this.currentSelect).style.backgroundColor = '#C4CFFF'
          this.lastSelect = this.sqlName
        }
        console.log(this.sqlName)
      }, 1000); // 大概时间300ms
    },
    // tabs标签页方法
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 取消
    cancel() {
      this.dialogVisible = false;
      this.$refs[this.ruleForm].resetFields();
      this.currentStep = 1;
      console.log(this.currentStep, '1111111111111111111111');
      this.ruleForm = {};
    },
    // 下一步
    nextStep() {
      if (this.currentStep < 2) {
        if (this.sqlName !== '') {
          this.currentStep++;
        } else {
          this.$message.warning('请选择数据源类型');
        }
      }
      console.log(this.currentStep);
    },
    // 双击下一步
    dbClickNext() {
      window.clearTimeout(time) // 首先清除计时器
      if (this.currentStep < 2) {
        if (this.sqlName !== '') {
          this.currentStep++
        } else {
          this.$message.warning('请选择数据源类型')
        }
      }
      console.log(this.currentStep)
      console.log('双击下一步')
    },
    lastStep() {
      console.log(this.currentStep);
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    // 添加数据源（原方法）
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          datasourceApi.created(this.temp).then(() => {
            this.fetchData();
            this.dialogFormVisible = false;
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    // 添加数据源
    addData() {
      this.params.datasourceName = this.ruleForm.master;
      this.params.datasource = this.sqlName;
      this.params.jdbcDriverClass = this.ruleForm.driver;
      this.params.username = this.ruleForm.username;
      this.params.password = this.ruleForm.password;
      this.params.datasourceGroup = 'Default';
      this.params.comments = '';
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          datasourceApi.created(this.params).then(() => {
            this.fetchData();
            this.dialogVisible = false;
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    testDataSource() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          datasourceApi.test(this.temp).then((response) => {
            if (response.data === false) {
              this.$notify({
                title: 'Fail',
                message: response.data.msg,
                type: 'fail',
                duration: 2000
              });
            } else {
              this.$notify({
                title: 'Success',
                message: 'Tested Successfully',
                type: 'success',
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.getShowStrategy(row.datasource);
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          datasourceApi.updated(tempData).then(() => {
            this.fetchData();
            this.dialogFormVisible = false;
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    fetchData() {
      this.listLoading = true;
      datasourceApi.list(this.listQuery).then((response) => {
        const { records } = response;
        const { total } = response;
        this.total = total;
        const bdsource = ['hive', 'impala', 'spark', 'flink'];
        this.list = records.filter(function(e) {
          if (!bdsource.includes(e.datasource)) {
            return true;
          }
        });
        this.listLoading = false;
      });
    },
    getShowStrategy(datasource) {
      if (datasource === 'hbase') {
        this.jdbc = this.mongodb = false;
        this.hbase = true;
      } else if (datasource === 'mongodb') {
        this.jdbc = this.hbase = false;
        this.mongodb = true;
        this.temp.jdbcUrl =
          'mongodb://[username:password@]host1[:port1][,...hostN[:portN]]][/[database][?options]]';
      } else {
        this.hbase = this.mongodb = false;
        this.jdbc = true;
      }
    },
    handleDelete(row) {
      console.log('删除');
      const idList = [];
      idList.push(row.id);
      // 拼成 idList=xx
      // 多个比较麻烦，这里不处理
      datasourceApi
        .deleted({
          idList: row.id
        })
        .then((response) => {
          this.fetchData();
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          });
        });
      // const index = this.list.indexOf(row)
    },
    handleFetchPv(id) {
      datasourceApi.fetched(id).then((response) => {
        this.pluginData = response;
        this.dialogPvVisible = true;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    changePass(value) {
      this.visible = !(value === 'show');
    }
  }
};
</script>

<style lang="scss">
.add_dialog_title {
  font-size: 24px !important;
  font-family: PingFangHK-Medium, PingFangHK !important;
}
.app-container {
  .filter-container {
    overflow: hidden;
    // line-height: 56px;
    background-color: #ffffff;
    padding: 0px;
    // border-radius: 5px 5px 0px 0px;
    // box-shadow:0 2px 12px 0 rgba(0,0,0,.3);
    .el-card {
      .left {
        float: left;
        width: 120px;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }
      .right {
        float: right;
        margin-right: 20px;
        .el-input {
          overflow: hidden;
          .el-input__inner {
            float: left;
            width: 200px;
            height: 32px;
            line-height: 32px;
            padding-right: 15px;
          }
          .el-input-group__append {
            float: left;
            width: 60px;
            padding: 0px 15px;
            text-align: center;
            color: #fff;
            background-color: #3d5fff;
          }
        }
      }
    }
  }
  .main {
    background-color: #fff;
    overflow: hidden;
    margin-top: 10px;
  }
  .topSelect {
    overflow: hidden;
    height: 40px;
    line-height: 40px;
    .el-input {
      .el-input__inner {
        height: 32px;
      }
      .el-button {
        .el-button--default {
          color: #ffffff;
        }
      }
    }
  }
  .el-tabs {
    margin-top: 20px;
    .el-tab-pane {
      ul {
        overflow: hidden;
        li {
          list-style: none;
          float: left;
          width: 12.5%;
          a {
            text-align: center;
            img {
              display: block;
              margin: 0 auto;
              margin-top: 10px;
              width: 64px;
            }
            p {
              height: 40px;
              font-size: 14px;
              font-family: PingFangHK-Regular, PingFangHK;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              margin-top: 10px;
            }
          }
          p {
            font-size: 16px;
            margin-top: 20px;
          }
        }
        li:hover {
          background-color: #e9e9f5 !important;
        }
        li:active {
          background-color: #C4CFFF;
        }
        li:visited {
          background-color: #C4CFFF;
        }
      }
    }
  }
  .set {
    p {
      font-size: 18px;
      margin: 20px 0px 16px 0;
      font-family: PingFangHK-Medium, PingFangHK;
    }
    .bgcForm {
      background-color: #f5f6fa;
      padding: 24px 16px;
      overflow: hidden;
    }
  }
  .el-dialog {
    border-radius: 8px;
    .el-dialog__header {
      font-size: 24px;
      .p_tit {
        font-size: 16px;
        color: #cccccc;
        margin-top: 20px;
      }
    }
    .el-dialog__body {
      padding: 10px 20px;
      .el-form {
        overflow: hidden;
        border-radius: 6px;
      }
    }
    .el-dialog__footer {
      border-top: 1px solid #F3F3F3;
      padding: 20px;
    }
  }
}
.from_item_input {
  width: 39.6%;
  display: flex;
  justify-content: space-between;
  height: 32px;
  line-height: 32px;
  margin-bottom: 16px;
  .input_label {
    display: inline-block;
    width: 33.3%;
    text-align: right;
    white-space:nowrap;
  }
  .input_content {
    width: 62.5%;
  }
}

.float_input {
  float: left;
  margin-left: 24px;
}

.last_input {
  margin-bottom: 0;
}
</style>
