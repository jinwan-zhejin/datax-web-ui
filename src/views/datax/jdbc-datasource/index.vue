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
            <el-button class="filter-item" style="margin-left: 30px;" type="goon" size="small" icon="el-icon-plus" @click="showAdd">
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
            <li v-for="item in iconTXT" v-show="isShowSQL" :id="item.type + item.name" :key="item.name" @click="getInfo" @dblclick="dbClickNext">
              <a>
                <img :src="item.url" :alt="item.name">
                <p>{{ item.name }}</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="常用类型" name="second">
          <ul>
            <li v-for="item in CommonType" v-show="isShowSQL" :id="item.type + item.name" :key="item.name" @click="getInfo" @dblclick="dbClickNext">
              <a>
                <img :src="item.url" :alt="item.name">
                <p>{{ item.name }}</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="SQL" name="third">
          <ul>
            <li v-for="item in SQLType" v-show="isShowSQL" :id="item.type + item.name" :key="item.name" @click="getInfo" @dblclick="dbClickNext">
              <a>
                <img :src="item.url" :alt="item.name">
                <p>{{ item.name }}</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="分析型" name="fourth">
          <ul>
            <li v-for="item in AssType" v-show="isShowSQL" :id="item.type + item.name" :key="item.name" @click="getInfo" @dblclick="dbClickNext">
              <a>
                <img :src="item.url" :alt="item.name">
                <p>{{ item.name }}</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <!-- 第二步表单 -->
      <!-- SQL Server连接设置表单 -->
      <div class="sqlserForm">
        <el-form
          v-show="sqlserver"
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="数据源名称:">
            <el-input
              v-model="ruleForm.datasourceName"
              placeholder="请输入数据源名称"
            />
          </el-form-item>
          <el-form-item label="备注:">
            <el-input
              v-model="ruleForm.comments"
              placeholder="请输入备注"
            />
          </el-form-item>
          <el-form-item label="数据源分组:">
            <el-input
              v-model="ruleForm.datasourceGroup"
            />
          </el-form-item>
          <el-form-item label="主机:">
            <el-input
              v-model="ruleForm.master"
            />
          </el-form-item>
          <el-form-item label="端口:">
            <el-input
              v-model="ruleForm.serverPort"
            />
          </el-form-item>
          <el-form-item label="数据库/架构:">
            <el-input
              v-model="ruleForm.database"
            />
          </el-form-item>
          <el-form-item label="认证:">
            <el-select v-model="ruleForm.authentication" style="width: 100%;" placeholder="请选择">
              <el-option label="master" value="master" />
              <el-option label="master1" value="master1" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户名:">
            <el-input v-model="ruleForm.username" />
          </el-form-item>
          <el-form-item label="密码:">
            <el-input v-model="ruleForm.password" type="password" />
          </el-form-item>
        </el-form>
      </div>
      <!-- MongoDB 连接设置表单 -->
      <div v-show="Mdb" class="sqlserForm">
        <el-form
          :model="MdbForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="数据源名称:">
            <el-input
              v-model="MdbForm.datasourceName"
              placeholder="请输入数据源名称"
            />
          </el-form-item>
          <el-form-item label="备注:">
            <el-input
              v-model="MdbForm.comments"
              placeholder="请输入备注"
            />
          </el-form-item>
          <el-form-item label="数据源分组:">
            <el-input
              v-model="MdbForm.datasourceGroup"
            />
          </el-form-item>
          <el-form-item label="地址:">
            <el-input
              v-model="MdbForm.serverUrl"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="mongodb://[username:password@]host1[:port1][,...hostN[:portN]]][/[database][?options]]"
            />
          </el-form-item>
          <el-form-item label="数据库:">
            <el-input v-model="MdbForm.database" />
          </el-form-item>
        </el-form>
      </div>
      <!-- MariaDB MYSQL连接设置表单 -->
      <div v-show="mm" class="set">
        <p>基本信息</p>
        <div class="bgcForm">
          <el-form :model="MySQLForm" label-width="100px">
            <el-form-item label="数据源名称:">
              <el-input v-model="MySQLForm.datasourceName" />
            </el-form-item>
            <el-form-item label="数据源分组:">
              <el-input v-model="MySQLForm.datasourceGroup" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="MySQLForm.comments" />
            </el-form-item>
          </el-form>
        </div>
        <p>服务器</p>
        <div class="bgcForm">
          <el-form :model="MySQLForm" label-width="100px">
            <el-form-item label="服务器地址:">
              <el-input v-model="MySQLForm.serverUrl" />
            </el-form-item>
            <el-form-item label="端口:">
              <el-input v-model="MySQLForm.serverPort" />
            </el-form-item>
            <el-form-item label="数据库:">
              <el-input v-model="MySQLForm.database" />
            </el-form-item>
          </el-form>
        </div>
        <p>认证</p>
        <div class="bgcForm">
          <el-form :model="MySQLForm" label-width="100px">
            <el-form-item label="用户名:">
              <el-input v-model="MySQLForm.username" />
            </el-form-item>
            <el-form-item label="密码:">
              <el-input v-model="MySQLForm.password" type="password" />
              <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <p>高级</p>
        <div class="bgcForm">
          <el-form :model="MySQLForm" label-width="100px">
            <el-form-item label="服务器时区:">
              <el-select v-model="MySQLForm.serverTime" style="height: 32px;width: 100%;" placeholder="请选择服务器时区">
                <el-option label="Asia/Shanghai" value="shanghai" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- Greenplum PostqreSQL连接设置表单 -->
      <div v-show="gp" class="set">
        <p>基本信息</p>
        <div class="bgcForm">
          <el-form :model="GPForm" label-width="100px" class="bgcForm">
            <el-form-item label="数据源名称:">
              <el-input v-model="GPForm.datasourceName" />
            </el-form-item>
            <el-form-item label="数据源分组:">
              <el-input v-model="GPForm.datasourceGroup" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="GPForm.comments" />
            </el-form-item>
          </el-form>
        </div>
        <p>服务器</p>
        <div class="bgcForm">
          <el-form :model="GPForm" label-width="100px" class="bgcForm">
            <el-form-item label="主机:">
              <el-input v-model="GPForm.master" />
            </el-form-item>
            <el-form-item label="端口:">
              <el-input v-model="GPForm.serverPort" />
            </el-form-item>
            <el-form-item label="数据库:">
              <el-input v-model="GPForm.database" />
            </el-form-item>
          </el-form>
        </div>
        <p>认证</p>
        <div class="bgcForm">
          <el-form :model="GPForm" label-width="100px" class="bgcForm">
            <el-form-item label="用户名:">
              <el-input v-model="GPForm.username" />
            </el-form-item>
            <el-form-item label="密码:">
              <el-input v-model="GPForm.password" type="password" />
              <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <p>高级</p>
        <div class="bgcForm">
          <el-form :model="GPForm" label-width="100px" class="bgcForm">
            <el-form-item label="用户角色:">
              <el-input v-model="GPForm.userRole" />
            </el-form-item>
            <el-form-item label="本地客户端:">
              <el-input v-model="GPForm.client" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- Apache Hive,Apache Spark,Cloudera Impala连接设置表单 -->
      <div v-show="threeSQL" class="set">
        <p>基本信息</p>
        <div class="bgcForm">
          <el-form :model="HiveForm" label-width="100px">
            <el-form-item label="数据源名称:">
              <el-input v-model="HiveForm.datasourceName" />
            </el-form-item>
            <el-form-item label="数据源分组:">
              <el-input v-model="HiveForm.datasourceGroup" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="HiveForm.comments" />
            </el-form-item>
          </el-form>
        </div>
        <p>一般</p>
        <div class="bgcForm">
          <el-form :model="HiveForm" label-width="100px">
            <el-form-item label="JDBC URL:">
              <el-input v-model="HiveForm.jdbcUrl" disabled />
            </el-form-item>
            <el-form-item label="主机:">
              <el-input v-model="HiveForm.master" />
            </el-form-item>
            <el-form-item label="端口:">
              <el-input v-model="HiveForm.serverPort" />
            </el-form-item>
            <el-form-item label="数据库:">
              <el-input v-model="HiveForm.database" />
            </el-form-item>
          </el-form>
        </div>
        <p>认证</p>
        <div class="bgcForm">
          <el-form :model="HiveForm" label-width="100px">
            <el-form-item label="用户名:">
              <el-input v-model="HiveForm.username" />
            </el-form-item>
            <el-form-item label="密码:">
              <el-input v-model="HiveForm.password" type="password" />
              <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- oracle连接设置表单 -->
      <div v-show="oracle" class="set">
        <p>基本信息</p>
        <div class="bgcForm">
          <el-form :model="OracleForm" label-width="100px">
            <el-form-item label="数据源名称:">
              <el-input v-model="OracleForm.datasourceName" />
            </el-form-item>
            <el-form-item label="数据源分组:">
              <el-input v-model="OracleForm.datasourceGroup" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="OracleForm.comments" />
            </el-form-item>
          </el-form>
        </div>
        <p>连接类型</p>
        <div class="bgcForm">
          <el-form :model="OracleForm" label-width="100px">
            <el-form-item label="主机:">
              <el-input v-model="OracleForm.master" />
            </el-form-item>
            <el-form-item label="端口:">
              <el-input v-model="OracleForm.serverPort" />
            </el-form-item>
            <el-form-item label="Database:">
              <el-select
                v-model="OracleForm.database"
                style="width: 100%"
                placeholder="ORCL"
              >
                <el-option
                  v-for="item in roclData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="OracleForm.role"
                style="width: 100%"
                placeholder="ORCL"
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
        </div>
        <p>认证</p>
        <div class="bgcForm">
          <el-form :model="OracleForm" label-width="100px">
            <el-form-item label="认证:">
              <el-select v-model="OracleForm.advanced" style="width: 100%" placeholder="请选择认证">
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户名:">
              <el-input v-model="OracleForm.username" />
            </el-form-item>
            <el-form-item label="角色:">
              <el-select v-model="OracleForm.role" style="width: 100%" placeholder="请选择角色">
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="密码:">
              <el-input v-model="OracleForm.password" type="password" />
              <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- DB2 LUW 连接设置表单 -->
      <div v-show="DB2" class="set">
        <p>基本信息</p>
        <div class="bgcForm">
          <el-form :model="DB2Form" label-width="100px">
            <el-form-item label="数据源名称:">
              <el-input v-model="DB2Form.datasourceName" />
            </el-form-item>
            <el-form-item label="数据源分组:">
              <el-input v-model="DB2Form.datasourceGroup" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="DB2Form.comments" />
            </el-form-item>
          </el-form>
        </div>
        <p>数据库</p>
        <div class="bgcForm">
          <el-form :model="DB2Form" label-width="100px">
            <el-form-item label="主机:">
              <el-input v-model="DB2Form.master" />
            </el-form-item>
            <el-form-item label="端口:">
              <el-input v-model="DB2Form.serverPort" />
            </el-form-item>
            <el-form-item label="数据库:" prop="username">
              <el-input v-model="DB2Form.database" />
            </el-form-item>
          </el-form>
        </div>
        <p>认证</p>
        <div class="bgcForm">
          <el-form :model="DB2Form" label-width="100px">
            <el-form-item label="用户名:">
              <el-input v-model="DB2Form.username" />
            </el-form-item>
            <el-form-item label="密码:">
              <el-input v-model="DB2Form.password" type="password" />
              <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- ClickHouse HBase 连接设置表单 -->
      <div v-show="ch" class="set">
        <p>基本信息</p>
        <div class="bgcForm">
          <el-form :model="CHForm" label-width="100px">
            <el-form-item label="数据源名称:">
              <el-input v-model="CHForm.datasourceName" />
            </el-form-item>
            <el-form-item label="数据源分组:">
              <el-input v-model="CHForm.datasourceGroup" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="CHForm.comments" />
            </el-form-item>
          </el-form>
        </div>
        <p>一般</p>
        <div class="bgcForm">
          <el-form :model="CHForm" label-width="100px">
            <el-form-item label="JDBC URL:">
              <el-input v-model="CHForm.jdbcUrl" disabled />
            </el-form-item>
            <el-form-item label="主机:">
              <el-input v-model="CHForm.master" />
            </el-form-item>
            <el-form-item label="端口:">
              <el-input v-model="CHForm.serverPort" />
            </el-form-item>
            <el-form-item label="数据库:">
              <el-input v-model="CHForm.database" />
            </el-form-item>
          </el-form>
        </div>
        <p>认证</p>
        <div class="bgcForm">
          <el-form :model="CHForm" label-width="100px">
            <el-form-item label="用户名:">
              <el-input v-model="CHForm.username" />
            </el-form-item>
            <el-form-item label="密码:">
              <el-input v-model="CHForm.password" type="password" />
              <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="currentStep === 2" size="small" style="float: left;" @click="testLink">测试连接...</el-button>
        <el-button v-show="currentStep !== 1" size="small" @click="lastStep">上一步</el-button>
        <el-button v-show="currentStep === 1" size="small" type="goon" @click="nextStep">下一步</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" :disabled="isBanAdd" @click="addData">完 成</el-button>
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
      isBanAdd: true,
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
          selected: 0,
          type: 'all'
        },
        {
          name: 'MongoDB',
          url: require('@/assets/dataSourceIcon/MongoDB.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Greenplum',
          url: require('@/assets/dataSourceIcon/GREEN.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Sql Server',
          url: require('@/assets/dataSourceIcon/mssql_icon_big@2x.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'PostgreSQL',
          url: require('@/assets/dataSourceIcon/postgresql_icon_big@2x.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Oracle',
          url: require('@/assets/dataSourceIcon/oracle.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'ClickHouse',
          url: require('@/assets/dataSourceIcon/clickhouse.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'DB2',
          url: require('@/assets/dataSourceIcon/db2_i_icon_big@2x.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'HBase',
          url: require('@/assets/dataSourceIcon/hbase.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Hive',
          url: require('@/assets/dataSourceIcon/hive_icon_big@2x.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Spark',
          url: require('@/assets/dataSourceIcon/spark.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Impala',
          url: require('@/assets/dataSourceIcon/Impala.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Flink',
          url: require('@/assets/dataSourceIcon/Flink.png'),
          selected: 0,
          type: 'all'
        }
      ],
      CommonType: [
        {
          name: 'MySQL',
          url: require('@/assets/dataSourceIcon/mysql_icon_big@2x.png'),
          selected: 0,
          type: 'Common'
        },
        {
          name: 'MongoDB',
          url: require('@/assets/dataSourceIcon/MongoDB.png'),
          selected: 0,
          type: 'Common'
        },
        {
          name: 'Oracle',
          url: require('@/assets/dataSourceIcon/oracle.png'),
          selected: 0,
          type: 'Common'
        }
      ],
      SQLType: [
        {
          name: 'MySQL',
          url: require('@/assets/dataSourceIcon/mysql_icon_big@2x.png'),
          selected: 0,
          type: 'SQL'
        },
        {
          name: 'Greenplum',
          url: require('@/assets/dataSourceIcon/GREEN.png'),
          selected: 0,
          type: 'SQL'
        },
        {
          name: 'Sql Server',
          url: require('@/assets/dataSourceIcon/mssql_icon_big@2x.png'),
          selected: 0,
          type: 'SQL'
        },
        {
          name: 'PostgreSQL',
          url: require('@/assets/dataSourceIcon/postgresql_icon_big@2x.png'),
          selected: 0,
          type: 'SQL'
        },
        {
          name: 'Oracle',
          url: require('@/assets/dataSourceIcon/oracle.png'),
          selected: 0,
          type: 'SQL'
        },
        {
          name: 'DB2',
          url: require('@/assets/dataSourceIcon/db2_i_icon_big@2x.png'),
          selected: 0,
          type: 'SQL'
        }
      ],
      AssType: [
        {
          name: 'Greenplum',
          url: require('@/assets/dataSourceIcon/GREEN.png'),
          selected: 0,
          type: 'ass'
        },
        {
          name: 'ClickHouse',
          url: require('@/assets/dataSourceIcon/clickhouse.png'),
          selected: 0,
          type: 'ass'
        }
      ],
      roclData: [
        {
          name: 'orcl',
          value: 'orcl'
        },
        {
          name: 'helowin',
          value: 'helowin'
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
      MySQLForm: {},
      GPForm: {}, // greenplum, postgresql
      HiveForm: {}, // Apache Hive,Apache Spark,Cloudera Impala
      OracleForm: {}, // oracle
      DB2Form: {}, // OracleForm
      CHForm: {}, // ClickHouse HBase
      MdbForm: {
        serverUrl: ''
      }, // MongoDB
      userForm: {},
      sqlName: '',
      params: {
        comments: '',
        datasource: '',
        datasourceGroup: '',
        datasourceName: '',
        jdbcDriverClass: '',
        jdbcUrl: '',
        jdbcPassword: '',
        jdbcUsername: ''
      },
      lastSelect: '',
      currentSelect: '',
      tabType: 'all',
      typeArr: []
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
          this.sqlName === 'Spark' ||
          this.sqlName === 'Impala' || this.sqlName === 'Flink') &&
        this.currentStep === 2
      );
    },
    // sqlserver
    sqlserver() {
      return (
        (this.sqlName === 'Sql Server') &&
        this.currentStep === 2
      );
    },
    // MongoDB
    Mdb() {
      return (
        (this.sqlName === 'MongoDB') &&
        this.currentStep === 2
      );
    }
  },
  watch: {
    sqlName: function(val) {
      console.log(val.replace(/\s*/g, ''));
      console.log(this.params, '----------');
      if (val === 'MYSQL') {
        this.params.jdbcUrl = 'jdbc:mysql://{host}:{port}/{database}';
        console.log(this.params.jdbcUrl);
      } else if (val.toLowerCase() === 'oracle') {
        this.params.jdbcUrl = 'jdbc:oracle:thin:@//{host}:{port}/{database}';
      } else if (val.toLowerCase() === 'postgresql') {
        this.params.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}';
        this.ruleForm.driver = 'org.postgresql.Driver';
      } else if (val.toLowerCase() === 'greenplum') {
        this.params.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}';
        this.ruleForm.driver = 'org.postgresql.Driver';
      } else if (val.replace(/\s*/g, '').toLowerCase() === 'sqlserver') {
        this.params.jdbcUrl = 'jdbc:sqlserver://{host}:{port};DatabaseName={database}';
      } else if (val.toLowerCase() === 'clickhouse') {
        this.params.jdbcUrl = 'jdbc:clickhouse://{host}:{port}/{database}';
      } else if (val === 'hive') {
        this.params.jdbcUrl = 'jdbc:hive2://{host}:{port}/{database}';
      } else if (val.toLowerCase() === 'mongodb') {
        this.MdbForm.serverUrl = 'mongodb://[username:password@]host1[:port1][,...hostN[:portN]]][/[database][?options]]'
      } else {
        this.isBanAdd = false
      }
    },
    'CHForm.master': {
      handler(val) {
        if (val) {
          this.CHForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + val
        } else {
          this.CHForm.jdbcUrl = ''
        }
      },
      deep: true
    },
    'CHForm.serverPort': {
      handler(val) {
        if (val && this.CHForm.master) {
          if (this.CHForm.jdbcUrl.split('//')[1].split(':')[1]) {
            this.CHForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.CHForm.jdbcUrl.split('//')[1].split(':')[0] + ':' + val
          } else {
            this.CHForm.jdbcUrl = this.CHForm.jdbcUrl + ':' + val
          }
        } else if (!val && this.CHForm.master) {
          this.CHForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.CHForm.jdbcUrl.split('//')[1].split(':')[0]
        }
      },
      deep: true
    },
    'CHForm.database': {
      handler(val) {
        if (val && this.CHForm.master && this.CHForm.serverPort) {
          if (this.CHForm.jdbcUrl.split('//')[1].split(':')[1].split('/')) {
            this.CHForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.CHForm.jdbcUrl.split('//')[1].split(':')[0] + ':' + this.CHForm.serverPort + '/' + val
          } else {
            this.CHForm.jdbcUrl = this.CHForm.jdbcUrl + ':' + val
          }
        } else if (!val && this.CHForm.master && this.CHForm.serverPort) {
          this.CHForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.CHForm.master + ':' + this.CHForm.serverPort
        }
      },
      deep: true
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
            this.$router.push('/cloudbeaveratlas/management')
            console.log('跳转成功')
          });
          this.gathering = true;
          this.$message({
            type: 'info',
            message: '采集任务开始!'
          });
          this.$router.push('/cloudbeaveratlas/management')
          console.log('跳转失败')
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消元数据采集'
          });
        });
    },
    // 搜索数据源类型
    searchSQL() {
      for (let i = 0; i < this.typeArr.length; i++) {
        console.log(this.typeArr[i].name.indexOf(this.input3))
        if (this.typeArr[i].name.toLowerCase().indexOf(this.input3.toLowerCase()) === 0) {
          document.getElementById(this.typeArr[i].type + this.typeArr[i].name).style.display = 'block'
        } else {
          document.getElementById(this.typeArr[i].type + this.typeArr[i].name).style.display = 'none'
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
        this.temp.jdbcUrl = 'jdbc:sqlserver://{host}:{port};DatabaseName={database}';
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
      this.currentStep = 1
      this.dialogVisible = true;
      this.MySQLForm.serverTime = 'Asia/Shanghai'
    },
    // 获取点击当前数据源名称方法
    getInfo(e) {
      // window.clearTimeout(time) // 首先清除计时器
      // time = setTimeout(() => {
      this.sqlName = e.path[1].textContent.trim()
      if (this.sqlName !== this.lastSelect) {
        this.currentSelect = this.sqlName
        if (this.lastSelect !== '') {
          document.getElementById(this.tabType + this.lastSelect).style.backgroundColor = '#fff'
          console.log(document.getElementById(this.tabType + this.lastSelect), '-------------')
        }
        document.getElementById(this.tabType + this.currentSelect).style.backgroundColor = '#C4CFFF'
        this.lastSelect = this.sqlName
      }
      console.log(this.sqlName)
      // }, 1000); // 大概时间300ms
    },
    // tabs标签页方法
    handleClick(tab, event) {
      console.log(tab.label);
      console.log(tab.index);
      if (tab.index === '3') {
        this.lastSelect = ''
        this.currentSelect = ''
        this.sqlName = ''
        this.tabType = 'ass'
        for (let i = 0; i < this.SQLType.length; i++) {
          document.getElementById(this.SQLType[i].type + this.SQLType[i].name).style.backgroundColor = '#fff'
        }
        for (let i = 0; i < this.iconTXT.length; i++) {
          document.getElementById(this.iconTXT[i].type + this.iconTXT[i].name).style.backgroundColor = '#fff'
        }
        for (let i = 0; i < this.CommonType.length; i++) {
          document.getElementById(this.CommonType[i].type + this.CommonType[i].name).style.backgroundColor = '#fff'
        }
        this.typeArr = this.AssType
      } else if (tab.index === '2') {
        this.lastSelect = ''
        this.currentSelect = ''
        this.sqlName = ''
        for (let i = 0; i < this.AssType.length; i++) {
          document.getElementById(this.AssType[i].type + this.AssType[i].name).style.backgroundColor = '#fff'
        }
        for (let i = 0; i < this.iconTXT.length; i++) {
          document.getElementById(this.iconTXT[i].type + this.iconTXT[i].name).style.backgroundColor = '#fff'
        }
        for (let i = 0; i < this.CommonType.length; i++) {
          document.getElementById(this.CommonType[i].type + this.CommonType[i].name).style.backgroundColor = '#fff'
        }
        this.tabType = 'SQL'
        this.typeArr = this.SQLType
      } else if (tab.index === '1') {
        this.lastSelect = ''
        this.currentSelect = ''
        this.sqlName = ''
        for (let i = 0; i < this.AssType.length; i++) {
          document.getElementById(this.AssType[i].type + this.AssType[i].name).style.backgroundColor = '#fff'
        }
        for (let i = 0; i < this.iconTXT.length; i++) {
          document.getElementById(this.iconTXT[i].type + this.iconTXT[i].name).style.backgroundColor = '#fff'
        }
        for (let i = 0; i < this.SQLType.length; i++) {
          document.getElementById(this.SQLType[i].type + this.SQLType[i].name).style.backgroundColor = '#fff'
        }
        this.tabType = 'Common'
        this.typeArr = this.CommonType
      } else if (tab.index === '0') {
        this.lastSelect = ''
        this.currentSelect = ''
        this.sqlName = ''
        for (let i = 0; i < this.AssType.length; i++) {
          document.getElementById(this.AssType[i].type + this.AssType[i].name).style.backgroundColor = '#fff'
        }
        for (let i = 0; i < this.CommonType.length; i++) {
          document.getElementById(this.CommonType[i].type + this.CommonType[i].name).style.backgroundColor = '#fff'
        }
        for (let i = 0; i < this.SQLType.length; i++) {
          document.getElementById(this.SQLType[i].type + this.SQLType[i].name).style.backgroundColor = '#fff'
        }
        this.tabType = 'all'
        this.typeArr = this.iconTXT
      }
    },
    // 取消
    cancel() {
      this.dialogVisible = false;
      this.currentStep = 1;
      console.log(this.currentStep, '1111111111111111111111');
      this.MySQLForm = {}
      this.OracleForm = {}
      this.MdbForm = {}
      this.sqlName = ''
      for (let i = 0; i < this.SQLType.length; i++) {
        document.getElementById(this.SQLType[i].type + this.SQLType[i].name).style.backgroundColor = '#fff'
      }
      for (let i = 0; i < this.iconTXT.length; i++) {
        document.getElementById(this.iconTXT[i].type + this.iconTXT[i].name).style.backgroundColor = '#fff'
      }
      for (let i = 0; i < this.CommonType.length; i++) {
        document.getElementById(this.CommonType[i].type + this.CommonType[i].name).style.backgroundColor = '#fff'
      }
      for (let i = 0; i < this.AssType.length; i++) {
        document.getElementById(this.AssType[i].type + this.AssType[i].name).style.backgroundColor = '#fff'
      }
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
      // window.clearTimeout(time) // 首先清除计时器
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
      const obj = {}
      if (this.sqlName === 'MySQL') {
        obj.datasourceName = this.MySQLForm.datasourceName;
        obj.datasource = this.sqlName.toLowerCase();
        obj.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.MySQLForm.serverUrl + ':' + this.MySQLForm.serverPort + '/' + this.MySQLForm.database;
        obj.userName = this.MySQLForm.username;
        obj.password = this.MySQLForm.password;
        obj.datasourceGroup = this.MySQLForm.datasourceGroup;
        obj.comments = this.MySQLForm.comments;
        obj.jdbcDriverClass = 'com.mysql.jdbc.Driver';
      } else if (this.sqlName === 'Oracle') {
        obj.datasourceName = this.OracleForm.datasourceName;
        obj.datasource = this.sqlName.toLowerCase();
        obj.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + ':thin:@//' + this.OracleForm.master + ':' + this.OracleForm.serverPort + '/' + this.OracleForm.database;
        obj.userName = this.OracleForm.username;
        obj.password = this.OracleForm.password;
        obj.datasourceGroup = this.OracleForm.datasourceGroup;
        obj.comments = this.OracleForm.comments;
        obj.jdbcDriverClass = '';
      } else if (this.sqlName === 'MongoDB') {
        obj.datasourceName = this.MdbForm.datasourceName;
        obj.datasource = this.sqlName.toLowerCase();
        obj.jdbcUrl = this.MdbForm.serverUrl;
        obj.datasourceGroup = this.MdbForm.datasourceGroup;
        obj.comments = this.MdbForm.comments;
        obj.databaseName = this.MdbForm.database;
        obj.jdbcDriverClass = '';
      } else if (this.sqlName === 'Greenplum' || this.sqlName === 'PostgreSQL') {
        console.log(this.GPForm)
        obj.datasourceName = this.GPForm.datasourceName;
        obj.datasource = this.sqlName.toLowerCase();
        obj.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + ':thin:@//' + this.GPForm.master + ':' + this.GPForm.serverPort + '/' + this.GPForm.database;
        obj.userName = this.GPForm.username;
        obj.password = this.GPForm.password;
        obj.datasourceGroup = this.GPForm.datasourceGroup;
        obj.comments = this.GPForm.comments;
        obj.jdbcDriverClass = 'org.postgresql.Driver';
      } else if (this.sqlName === 'Sql Server') {
        obj.datasourceName = this.ruleForm.datasourceName;
        obj.datasourceGroup = this.ruleForm.datasourceGroup;
        obj.datasource = this.sqlName.toLowerCase();
        obj.jdbcUrl = 'jdbc:' + this.sqlName.replace(/\s*/g, '').toLowerCase() + '://' + this.ruleForm.master + ':' + this.ruleForm.serverPort + ';DatabaseName=' + this.ruleForm.database;
        obj.userName = this.ruleForm.username;
        obj.password = this.ruleForm.password;
        obj.comments = this.ruleForm.comments;
        obj.jdbcDriverClass = '';
      } else if (this.sqlName === 'ClickHouse' || this.sqlName === 'HBase') {
        obj.datasourceName = this.CHForm.datasourceName;
        obj.datasourceGroup = this.CHForm.datasourceGroup;
        obj.datasource = this.sqlName.toLowerCase();
        this.sqlName === 'ClickHouse' ? obj.jdbcUrl = 'jdbc:clickhouse://' + this.CHForm.master + ':' + this.CHForm.serverPort : obj.zkAdress = this.CHForm.master + ':' + this.CHForm.serverPort
        obj.userName = this.CHForm.username;
        obj.password = this.CHForm.password;
        obj.comments = this.CHForm.comments;
        this.sqlName === 'ClickHouse' ? obj.jdbcDriverClass = 'ru.yandex.clickhouse.ClickHouseDriver' : obj.jdbcDriverClass = ''
      } else if (this.sqlName === 'DB2') {
        obj.datasourceName = this.DB2Form.datasourceName;
        obj.datasource = this.sqlName.toLowerCase();
        obj.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.DB2Form.master + ':' + this.DB2Form.serverPort + '/' + this.DB2Form.database;
        obj.userName = this.DB2Form.username;
        obj.password = this.DB2Form.password;
        obj.datasourceGroup = this.DB2Form.datasourceGroup;
        obj.comments = this.DB2Form.comments;
        obj.jdbcDriverClass = '';
      }
      datasourceApi.created(obj).then(() => {
        this.fetchData();
        this.dialogVisible = false;
        this.$notify({
          title: '提示',
          message: '数据源添加成功',
          type: 'success',
          duration: 2000
        })
        this.MySQLForm = {}
        this.OracleForm = {}
        this.MdbForm = {}
        this.ruleForm = {}
        this.CHForm = {}
        this.GPForm = {}
        this.DB2Form = {}
        this.currentStep = 1
        this.isBanAdd = true
      }).catch(err => {
        if (err) {
          this.$notify({
            title: '提示',
            message: '数据源添加失败',
            type: 'fail',
            duration: 2000
          })
        }
      })
    },
    // 测试连接
    testLink() {
      const obj1 = {}
      if (this.sqlName === 'MySQL') {
        obj1.datasourceName = this.MySQLForm.datasourceName;
        obj1.datasource = this.sqlName.toLowerCase();
        obj1.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.MySQLForm.serverUrl + ':' + this.MySQLForm.serverPort + '/' + this.MySQLForm.database;
        obj1.jdbcUsername = this.MySQLForm.username;
        obj1.jdbcPassword = this.MySQLForm.password;
        obj1.datasourceGroup = this.MySQLForm.datasourceGroup;
        obj1.comments = this.MySQLForm.comments;
        obj1.jdbcDriverClass = 'com.mysql.jdbc.Driver';
      } else if (this.sqlName === 'Oracle') {
        obj1.datasourceName = this.OracleForm.datasourceName;
        obj1.datasource = this.sqlName.toLowerCase();
        obj1.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + ':thin:@//' + this.OracleForm.master + ':' + this.OracleForm.serverPort + '/' + this.OracleForm.database;
        obj1.jdbcUsername = this.OracleForm.username;
        obj1.jdbcPassword = this.OracleForm.password;
        obj1.datasourceGroup = this.OracleForm.datasourceGroup;
        obj1.comments = this.OracleForm.comments;
        obj1.jdbcDriverClass = 'oracle.jdbc.OracleDriver';
      } else if (this.sqlName === 'MongoDB') {
        obj1.datasourceName = this.MdbForm.datasourceName;
        obj1.datasource = this.sqlName.toLowerCase();
        obj1.jdbcUrl = this.MdbForm.serverUrl;
        obj1.datasourceGroup = this.MdbForm.datasourceGroup;
        obj1.comments = this.MdbForm.comments;
        obj1.databaseName = this.MdbForm.database;
        obj1.jdbcDriverClass = '';
      } else if (this.sqlName === 'Greenplum' || this.sqlName === 'PostgreSQL') {
        console.log(this.GPForm)
        obj1.datasourceName = this.GPForm.datasourceName;
        obj1.datasource = this.sqlName.toLowerCase();
        obj1.jdbcUrl = 'jdbc:postgresql' + '://' + this.GPForm.master + ':' + this.GPForm.serverPort + '/' + this.GPForm.database;
        obj1.jdbcUsername = this.GPForm.username;
        obj1.jdbcPassword = this.GPForm.password;
        obj1.datasourceGroup = this.GPForm.datasourceGroup;
        obj1.comments = this.GPForm.comments;
        obj1.jdbcDriverClass = 'org.postgresql.Driver'
      } else if (this.sqlName === 'Sql Server') {
        obj1.datasourceName = this.ruleForm.datasourceName;
        obj1.datasourceGroup = this.ruleForm.datasourceGroup;
        obj1.datasource = this.sqlName.replace(/\s*/g, '').toLowerCase();
        obj1.jdbcUrl = 'jdbc:' + this.sqlName.replace(/\s*/g, '').toLowerCase() + '://' + this.ruleForm.master + ':' + this.ruleForm.serverPort + ';DatabaseName=' + this.ruleForm.database;
        obj1.jdbcUsername = this.ruleForm.username;
        obj1.jdbcPassword = this.ruleForm.password;
        obj1.comments = this.ruleForm.comments;
        obj1.jdbcDriverClass = 'com.microsoft.sqlserver.jdbc.SQLServerDriver';
      } else if (this.sqlName === 'ClickHouse' || this.sqlName === 'HBase') {
        obj1.datasourceName = this.CHForm.datasourceName;
        obj1.datasourceGroup = this.CHForm.datasourceGroup;
        obj1.datasource = this.sqlName.toLowerCase();
        this.sqlName === 'ClickHouse' ? obj1.jdbcUrl = this.CHForm.jdbcUrl + '/' + this.CHForm.database : obj1.zkAdress = this.CHForm.jdbcUrl
        obj1.jdbcUsername = this.CHForm.username;
        obj1.jdbcPassword = this.CHForm.password;
        obj1.comments = this.CHForm.comments;
        this.sqlName === 'ClickHouse' ? obj1.jdbcDriverClass = 'ru.yandex.clickhouse.ClickHouseDriver' : obj1.jdbcDriverClass = ''
      }
      datasourceApi.test(obj1).then((response) => {
        if (response.data === false) {
          this.$notify({
            title: '提示',
            message: response.data.msg,
            type: 'fail',
            duration: 2000
          });
        } else {
          this.$notify({
            title: '提示',
            message: '数据库测试连接成功',
            type: 'success',
            duration: 2000
          });
          this.isBanAdd = false
        }
      })
    },
    // 编辑测试连接
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
                title: '成功',
                message: '测试连接成功',
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
              title: '成功',
              message: '编辑数据成功',
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
            title: '提示',
            message: '删除成功',
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
      .bgcForm {
        .el-form {
          overflow: hidden;
          border-radius: 6px;
          width: 60%;
          margin: 0px auto;
        }
      }
      .sqlserForm {
        .el-form {
          overflow: hidden;
          border-radius: 6px;
          width: 60%;
          margin: 0px auto;
        }
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

.el-form-item {
  margin-bottom: 16px;
  .el-form-item__label {
    padding: 0 16px 0 0;
  }
}

</style>
