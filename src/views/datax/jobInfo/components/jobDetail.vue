<template>
  <div class="job_detail">
    <!-- {{jobInfo}} -->
    <div class="header">
      <div
        class="header_action"
        style="margin-left:17px;"
        @click="handlerExecute(temp)"
      >
        <i class="el-icon-video-play" />
        <span>执行一次</span>
      </div>
      <div class="header_action" @click="handlerViewLog(temp)">
        <i class="el-icon-s-order" />
        <span>查询日志</span>
      </div>
      <div class="header_action">
        <el-popover placement="bottom" width="500" @show="loadById(temp)">
          <el-table :data="registerNode">
            <el-table-column width="150" property="title" label="执行器名称" />
            <el-table-column width="150" property="appName" label="appName" />
            <el-table-column
              width="150"
              property="registryList"
              label="机器地址"
            />
          </el-table>
          <div slot="reference" style="float: left">
            <i class="el-icon-s-tools" />
            <span>注册节点</span>
          </div>
        </el-popover>
      </div>

      <div class="header_action">
        <el-popover
          placement="bottom"
          width="300"
          @show="nextTriggerTime(temp)"
        >
          <h5 v-html="triggerNextTimes" />
          <div slot="reference" style="float: left">
            <i class="el-icon-message-solid" />
            <span>下次触发时间</span>
          </div>
        </el-popover>
      </div>

      <div class="header_action" @click="handlerDelete(temp)">
        <i class="el-icon-delete-solid" />
        <span>删除</span>
      </div>
      <div class="header_switch" style="margin-right:10px;">
        <el-switch
          v-model="temp.triggerStatus"
          active-color="#00A854"
          active-text="启动"
          :active-value="1"
          inactive-color="#F04134"
          inactive-text="停止"
          :inactive-value="0"
          @change="changeSwitch(temp)"
        />
      </div>
    </div>

    <div class="content">
      <!-- {{ jobParam }} -->
      <div class="title">
        <svg-icon :icon-class="temp.jobType" />

        <span class="jobDesc">{{ temp.jobDesc }}</span>

        <div class="edit" @click="handlerUpdate(temp)">
          <i class="el-icon-edit" />
          编辑
        </div>
      </div>

      <el-row :gutter="20" class="detail">
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">执行器：</span>
          <span class="value">{{ jobGroupName }}</span>
        </el-col>
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">所属项目：</span>
          <span class="value">{{ temp.projectName }}</span>
        </el-col>
        <el-col
          v-if="
            jobType === 'NORMAL' ||
              jobType === 'IMPORT' ||
              jobType === 'EXPORT' ||
              jobType === 'SHELL' ||
              jobType === 'POWERSHELL' ||
              jobType === 'PYTHON'
          "
          class="detail_col"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="8"
          :xl="8"
        >
          <span class="key">路由策略：</span>
          <span class="value">{{ temp.executorRouteStrategy }}</span>
        </el-col>
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">子任务：</span>
          <span class="value">{{ temp.childJobId }}</span>
        </el-col>
        <el-col
          v-if="
            jobType === 'NORMAL' ||
              jobType === 'IMPORT' ||
              jobType === 'EXPORT' ||
              jobType === 'SHELL' ||
              jobType === 'POWERSHELL' ||
              jobType === 'PYTHON'
          "
          class="detail_col"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="8"
          :xl="8"
        >
          <span class="key">阻塞处理：</span>
          <span class="value">{{ temp.executorBlockStrategy }}</span>
        </el-col>
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">任务名称：</span>
          <span class="value">{{ temp.jobDesc }}</span>
        </el-col>
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">任务类型：</span>
          <span class="value">{{ temp.jobType }}</span>
        </el-col>
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">Corn：</span>
          <span class="value">{{ temp.jobCron }}</span>
        </el-col>
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">报警邮件：</span>
          <span class="value">{{ temp.alarmEmail }}</span>
        </el-col>
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">失败重试次数：</span>
          <span class="value">{{ temp.executorFailRetryCount }}</span>
        </el-col>
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">超时时间：</span>
          <span class="value">{{ temp.executorTimeout }}</span>
        </el-col>
        <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">JVM启动参数：</span>
          <span class="value">{{ temp.jvmParam }}</span>
        </el-col>
        <el-col v-if="jobType === 'SQLJOB'" class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <span class="key">schema：</span>
          <span class="value">{{ temp.schema }}</span>
        </el-col>
      </el-row>

      <!-- <div class="detail">
        <div class="detail_target">
          <span class="key">执行器：</span>
          <span class="value">{{ jobGroupName }}</span>
        </div>
        <div class="detail_target">
          <span class="key">所属项目：</span>
          <span class="value">{{ temp.projectName }}</span>
        </div>
        <div
          v-if="
            jobType === 'NORMAL' ||
              jobType === 'IMPORT' ||
              jobType === 'EXPORT' ||
              jobType === 'SHELL' ||
              jobType === 'POWERSHELL' ||
              jobType === 'PYTHON'
          "
          class="detail_target"
        >
          <span class="key">路由策略：</span>
          <span class="value">{{ temp.executorRouteStrategy }}</span>
        </div>
        <div class="detail_target">
          <span class="key">子任务：</span>
          <span class="value">{{ temp.childJobId }}</span>
        </div>
        <div
          v-if="
            jobType === 'NORMAL' ||
              jobType === 'IMPORT' ||
              jobType === 'EXPORT' ||
              jobType === 'SHELL' ||
              jobType === 'POWERSHELL' ||
              jobType === 'PYTHON'
          "
          class="detail_target"
        >
          <span class="key">阻塞处理：</span>
          <span class="value">{{ temp.executorBlockStrategy }}</span>
        </div>
        <div class="detail_target">
          <span class="key">任务名称：</span>
          <span class="value">{{ temp.jobDesc }}</span>
        </div>
        <div class="detail_target">
          <span class="key">任务类型：</span>
          <span class="value">{{ temp.jobType }}</span>
        </div>
        <div class="detail_target">
          <span class="key">Corn：</span>
          <span class="value">{{ temp.jobCron }}</span>
        </div>
        <div class="detail_target">
          <span class="key">报警邮件：</span>
          <span class="value">{{ temp.alarmEmail }}</span>
        </div>
        <div class="detail_target">
          <span class="key">失败重试次数：</span>
          <span class="value">{{ temp.executorFailRetryCount }}</span>
        </div>
        <div class="detail_target">
          <span class="key">超时时间：</span>
          <span class="value">{{ temp.executorTimeout }}</span>
        </div>
        <div class="detail_target">
          <span class="key">JVM启动参数：</span>
          <span class="value">{{ temp.jvmParam }}</span>
        </div>
        <div v-if="jobType === 'SQLJOB'" class="detail_target">
          <span class="key">schema：</span>
          <span class="value">{{ temp.schema }}</span>
        </div>
      </div> -->

      <div class="json_detail">
        <p class="json_title" @click="viewJson">查看json：</p>
      </div>
      <div v-if="jsonshow" class="json_content">
        <json-editor
          ref="jsonEditor"
          v-model="temp.jobJson"
          :cani-edit="false"
        />
      </div>
    </div>

    <div class="log_detail">
      <div class="log_title">
        <span class="log_log">运行日志</span>
        <span class="unflod" @click="showRunLogDetails">
          <i v-if="!showLog" class="el-icon-sort-up" />
          <i v-else class="el-icon-sort-down" />
        </span>
      </div>
      <transition name="fade">
        <div v-if="showLog" class="log_container">
          <pre v-text="newstlogContent" />
        </div>
      </transition>
    </div>

    <el-dialog
      :title="translaterMaster(textMap[dialogStatus] || '')"
      :visible.sync="dialogFormVisible"
      width="50%"
      :before-close="handleClose"
    >
      <h3>
        1.新建任务
        <el-button
          v-if="dialogStatus !== 'create'"
          type="text"
          icon="el-icon-edit"
          @click="editable.newTask = !editable.newTask"
        >{{ editable.newTask ? "取消" : "编辑" }}</el-button>
        <el-button
          v-if="dialogStatus !== 'create' && editable.newTask"
          type="text"
          icon="el-icon-upload"
          @click="updateData()"
        >保存更改</el-button>
      </h3>
      <div class="part-container">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="110px"
          :class="[editable.newTask ? '' : 'form-item-class']"
        >
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="执行器" prop="jobGroup">
                <el-select
                  v-if="editable.newTask"
                  v-model="temp.jobGroup"
                  placeholder="请选择执行器"
                >
                  <el-option
                    v-for="item in executorList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
                <span v-else class="info-detail">{{
                  dashOrValue(
                    finder(temp.jobGroup, executorList, "id", "title")
                  )
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="任务名称" prop="jobDesc">
                <el-input
                  v-if="editable.newTask"
                  v-model="temp.jobDesc"
                  size="medium"
                  placeholder="请输入任务描述"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(temp.jobDesc)
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="路由策略" prop="executorRouteStrategy">
                <el-select
                  v-if="editable.newTask"
                  v-model="temp.executorRouteStrategy"
                  placeholder="请选择路由策略"
                >
                  <el-option
                    v-for="item in routeStrategies"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span v-else class="info-detail">{{
                  dashOrValue(
                    finder(
                      temp.executorRouteStrategy,
                      routeStrategies,
                      "value",
                      "label"
                    )
                  )
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-dialog
                title="提示"
                :visible.sync="showCronBox"
                width="60%"
                append-to-body
              >
                <cron v-model="temp.jobCron" />
                <span slot="footer" class="dialog-footer">
                  <el-button @click="showCronBox = false">关闭</el-button>
                  <el-button
                    type="primary"
                    @click="showCronBox = false"
                  >确 定</el-button>
                </span>
              </el-dialog>
              <el-form-item label="Cron表达式" prop="jobCron">
                <el-input
                  v-if="editable.newTask"
                  v-model="temp.jobCron"
                  auto-complete="off"
                  placeholder="请输入Cron表达式"
                >
                  <el-button
                    v-if="!showCronBox"
                    slot="append"
                    icon="el-icon-turn-off"
                    title="打开图形配置"
                    @click="showCronBox = true"
                  />
                  <el-button
                    v-else
                    slot="append"
                    icon="el-icon-open"
                    title="关闭图形配置"
                    @click="showCronBox = false"
                  />
                </el-input>
                <span v-else class="info-detail">{{
                  dashOrValue(temp.jobCron)
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="阻塞处理" prop="executorBlockStrategy">
                <el-select
                  v-if="editable.newTask"
                  v-model="temp.executorBlockStrategy"
                  placeholder="请选择阻塞处理策略"
                >
                  <el-option
                    v-for="item in blockStrategies"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span v-else class="info-detail">{{
                  dashOrValue(
                    finder(
                      temp.executorBlockStrategy,
                      blockStrategies,
                      "value",
                      "label"
                    )
                  )
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="报警邮件">
                <el-input
                  v-if="editable.newTask"
                  v-model="temp.alarmEmail"
                  placeholder="请输入报警邮件，多个用逗号分隔"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(temp.alarmEmail)
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="任务类型" prop="glueType">
                <el-select
                  v-if="editable.newTask"
                  v-model="temp.glueType"
                  placeholder="任务脚本类型"
                >
                  <el-option
                    v-for="item in glueTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span v-else class="info-detail">{{
                  dashOrValue(
                    finder(temp.glueType, glueTypes, "value", "label")
                  )
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="失败重试次数">
                <el-input-number
                  v-if="editable.newTask"
                  v-model="temp.executorFailRetryCount"
                  size="small"
                  :min="0"
                  :max="20"
                />
                <span v-else class="info-detail">{{
                  temp.executorFailRetryCount
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="所属项目" prop="projectId">
                <el-select
                  v-if="editable.newTask"
                  v-model="temp.projectId"
                  placeholder="所属项目"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in jobProjectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <span v-else class="info-detail">{{
                  dashOrValue(
                    finder(temp.projectId, jobProjectList, "id", "name")
                  )
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="超时时间(分钟)">
                <el-input-number
                  v-if="editable.newTask"
                  v-model="temp.executorTimeout"
                  size="small"
                  :min="0"
                  :max="120"
                />
                <span v-else class="info-detail">{{
                  temp.executorTimeout
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="子任务">
                <el-select
                  v-if="editable.newTask"
                  v-model="temp.childJobId"
                  multiple
                  placeholder="子任务"
                  value-key="id"
                >
                  <el-option
                    v-for="item in jobIdList"
                    :key="item.id"
                    :label="item.jobDesc"
                    :value="item"
                  />
                </el-select>
                <span v-else class="info-detail">{{ reorganizeChildJob }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" />
          </el-row>
          <el-row v-if="temp.glueType === 'BEAN'" :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="辅助参数" prop="incrementType">
                <el-select
                  v-if="editable.newTask"
                  v-model="temp.incrementType"
                  placeholder="请选择参数类型"
                  value=""
                >
                  <el-option
                    v-for="item in incrementTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span v-else class="info-detail">{{
                  dashOrValue(
                    finder(temp.incrementType, incrementTypes, "value", "label")
                  )
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="temp.glueType === 'BEAN' && temp.incrementType === 1"
            :gutter="20"
          >
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="增量主键ID" prop="incStartId">
                <el-input
                  v-if="editable.newTask"
                  v-model="temp.incStartId"
                  placeholder="首次增量使用"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(temp.incStartId)
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="ID增量参数" prop="replaceParam">
                <el-input
                  v-if="editable.newTask"
                  v-model="temp.replaceParam"
                  placeholder="-DstartId='%s' -DendId='%s'"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(temp.replaceParam)
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="reader数据源" prop="datasourceId">
                <el-select
                  v-if="editable.newTask"
                  v-model="temp.datasourceId"
                  placeholder="reader数据源"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in dataSourceList"
                    :key="item.id"
                    :label="item.datasourceName"
                    :value="item.id"
                  />
                </el-select>
                <span v-else class="info-detail">{{
                  dashOrValue(
                    finder(
                      temp.datasourceId,
                      dataSourceList,
                      "id",
                      "datasourceName"
                    )
                  )
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="14" :sm="14" :md="14" :lg="7" :xl="7">
              <el-form-item label="reader表" prop="readerTable">
                <el-input
                  v-if="editable.newTask"
                  v-model="temp.readerTable"
                  placeholder="读表的表名"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(temp.readerTable)
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="10" :sm="10" :md="10" :lg="5" :xl="5">
              <el-form-item label="主键" label-width="40px" prop="primaryKey">
                <el-input
                  v-if="editable.newTask"
                  v-model="temp.primaryKey"
                  placeholder="请填写主键字段名"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(temp.primaryKey)
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="temp.glueType === 'BEAN' && temp.incrementType === 2"
            :gutter="20"
          >
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="增量开始时间" prop="incStartTime">
                <el-date-picker
                  v-if="editable.newTask"
                  v-model="temp.incStartTime"
                  type="datetime"
                  placeholder="首次增量使用"
                  format="yyyy-MM-dd HH:mm:ss"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(temp.incStartTime)
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="增量时间字段" prop="replaceParam">
                <el-input
                  v-if="editable.newTask"
                  v-model="temp.replaceParam"
                  placeholder="-DlastTime='%s' -DcurrentTime='%s'"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(temp.replaceParam)
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="增量时间格式" prop="replaceParamType">
                <el-select
                  v-if="editable.newTask"
                  v-model="temp.replaceParamType"
                  placeholder="增量时间格式"
                  @change="incStartTimeFormat"
                >
                  <el-option
                    v-for="item in replaceFormatTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span v-else class="info-detail">{{
                  dashOrValue(
                    finder(
                      temp.replaceParamType,
                      replaceFormatTypes,
                      "value",
                      "label"
                    )
                  )
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="temp.glueType === 'BEAN' && temp.incrementType === 3"
            :gutter="20"
          >
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="分区字段" prop="partitionField">
                <el-input
                  v-if="editable.newTask"
                  v-model="partitionField"
                  placeholder="请输入分区字段"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(partitionField)
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="14" :sm="14" :md="14" :lg="7" :xl="7">
              <el-form-item label="分区时间">
                <el-select
                  v-if="editable.newTask"
                  v-model="timeFormatType"
                  placeholder="分区时间格式"
                >
                  <el-option
                    v-for="item in timeFormatTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span v-else class="info-detail">{{
                  dashOrValue(
                    finder(timeFormatType, timeFormatTypes, "value", "label")
                  )
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="10" :sm="10" :md="10" :lg="5" :xl="5">
              <el-input-number
                v-if="editable.newTask"
                v-model="timeOffset"
                size="small"
                :min="-20"
                :max="0"
                style="width: 65%"
              />
              <span v-else class="info-detail">{{
                dashOrValue(timeOffset)
              }}</span>
            </el-col>
          </el-row>
          <el-row v-if="temp.glueType === 'BEAN'" :gutter="20">
            <el-col :span="24">
              <el-form-item label="JVM启动参数">
                <el-input
                  v-if="editable.newTask"
                  v-model="temp.jvmParam"
                  placeholder="-Xms1024m -Xmx1024m -XX:+HeapDumpOnOutOfMemoryError"
                />
                <span v-else class="info-detail">{{
                  dashOrValue(temp.jvmParam)
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <h3>
        2.构建reader
        <el-button
          v-if="dialogStatus !== 'create'"
          type="text"
          icon="el-icon-edit"
          @click="editReader"
        >{{ editable.reader ? "取消" : "编辑" }}</el-button>
        <el-button
          v-if="dialogStatus !== 'create' && editable.reader"
          type="text"
          icon="el-icon-upload"
          @click="updateData()"
        >保存更改</el-button>
      </h3>
      <div class="part-container">
        <!-- {{ this.$store.state.taskAdmin.tabType }}
        <br>
        {{ this.$store.state.taskAdmin.dataSourceList }} -->
        <quality-reader v-if="$store.state.taskAdmin.jobInfoType === 'DQCJOB'" ref="qualityReader" />
        <reader v-else ref="reader" />
      </div>

      <h3>
        3.构建writer
        <el-button
          v-if="dialogStatus !== 'create'"
          type="text"
          icon="el-icon-edit"
          @click="editable.writer = !editable.writer"
        >{{ editable.writer ? "取消" : "编辑" }}</el-button>
        <el-button
          v-if="dialogStatus !== 'create' && editable.writer"
          type="text"
          icon="el-icon-upload"
          @click="updateData()"
        >保存更改</el-button>
      </h3>
      <div class="part-container">
        <!-- {{ jobInfo.jobParam }} -->
        <el-form
          :model="writerFormQuality"
          label-position="right"
          label-width="150px"
          :rules="rules"
          :class="[editable.writer ? '' : 'form-item-class']"
        >
          <el-form-item label="数据库源：">
            <el-select
              v-if="editable.writer"
              v-model="writerFormQuality.writerDatasourceId"
              filterable
              @change="wDsChange"
            >
              <el-option
                v-for="(item, index) in $store.state.taskAdmin.dataSourceList"
                :key="index"
                :label="item.datasourceName"
                :value="item.id"
              />
            </el-select>
            <span v-else class="info-detail">{{
              dashOrValue(
                finder(
                  writerFormQuality.writerDatasourceId,
                  $store.state.taskAdmin.dataSourceList,
                  "id",
                  "datasourceName"
                )
              )
            }}</span>
          </el-form-item>
          <el-form-item
            v-if="
              $store.state.taskAdmin.jobInfoType === 'DQCJOB' &&
                (dataSource === 'postgresql' ||
                dataSource === 'greenplum' ||
                dataSource === 'oracle' ||
                dataSource === 'sqlserver')"
            label="Schema："
          >
            <el-select
              v-if="editable.writer"
              v-model="writerFormQuality.writerSchema"
              allow-create
              default-first-option
              filterable
              @change="schemaChange"
            >
              <el-option
                v-for="(item, index) in schemaList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
            <span v-else class="info-detail">
              {{ dashOrValue(writerFormQuality.writerSchema) }}
            </span>
          </el-form-item>
          <el-form-item label="数据库表名：" prop="tableName">
            <el-select
              v-if="editable.writer"
              v-model="writerFormQuality.writerTables[0]"
              @change="wTbChange"
            >
              <el-option
                v-for="(item, index) in wTbList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
            <span v-else class="info-detail">{{
              dashOrValue(writerFormQuality.writerTables ? writerFormQuality.writerTables[0] : '')
            }}</span>
          </el-form-item>
          <el-form-item v-if="dataSource === 'hive'" label="path：" prop="path">
            <el-input
              v-if="editable.writer"
              v-model="writerFormQuality.hiveWriter.writerPath"
              :autosize="{ minRows: 2, maxRows: 20 }"
              type="textarea"
              placeholder="为与hive表关联，请填写hive表在hdfs上的存储路径"
            />
            <span v-else>{{ writerFormQuality.hiveWriter.writerPath }}</span>
          </el-form-item>
          <el-form-item v-if="dataSource === 'hive'" label="defaultFS：" prop="defaultFS">
            <el-input
              v-if="editable.writer"
              v-model="writerFormQuality.hiveWriter.writerDefaultFS"
              placeholder="Hadoop hdfs文件系统namenode节点地址"
            />
            <span v-else>{{ writerFormQuality.hiveWriter.writerDefaultFS }}</span>
          </el-form-item>
          <el-form-item v-if="dataSource === 'hive'" label="fileName：" prop="fileName">
            <el-input
              v-if="editable.writer"
              v-model="writerFormQuality.hiveWriter.writerFileName"
              placeholder="HdfsWriter写入时的文件名"
            />
            <span v-else>{{ writerFormQuality.hiveWriter.writerFileName }}</span>
          </el-form-item>
          <el-form-item v-if="dataSource === 'hive'" label="fileType：" prop="fileType">
            <el-select
              v-if="editable.writer"
              v-model="writerFormQuality.hiveWriter.writerFileType"
              placeholder="文件的类型"
            >
              <el-option
                v-for="(item, index) in fileTypes"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ dashOrValue(finder(writerFormQuality.hiveWriter.writerFileType, fileTypes, 'value', 'label')) }}</span>
          </el-form-item>
          <el-form-item v-if="dataSource === 'hive'" label="writeMode：" prop="writeMode">
            <el-select
              v-if="editable.writer"
              v-model="writerFormQuality.hiveWriter.writeMode"
              placeholder="文件的类型"
            >
              <el-option
                v-for="(item, index) in writeModes"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ dashOrValue(finder(writerFormQuality.hiveWriter.writeMode, writeModes, 'value', 'label')) }}</span>
          </el-form-item>
          <el-form-item v-if="dataSource === 'hive'" label="fieldDelimiter：" prop="fieldDelimiter">
            <el-input
              v-if="editable.writer"
              v-model="writerFormQuality.hiveWriter.writeFieldDelimiter"
              placeholder="与创建表的分隔符一致"
            />
            <span v-else>{{ dashOrValue(writerFormQuality.hiveWriter.writeFieldDelimiter) }}</span>
          </el-form-item>
          <el-form-item label="字段：">
            <el-checkbox
              v-model="writerForm.checkAll"
              :disabled="!editable.writer"
              :indeterminate="writerForm.isIndeterminate"
              @change="wHandleCheckAllChange"
            >全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group
              v-model="writerFormQuality.writerColumns"
              :disabled="!editable.writer"
              @change="wHandleCheckedChange"
            >
              <el-checkbox
                v-for="(item, index) in fromColumnList"
                :key="index"
                :label="item"
              >{{ item }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="dataSource !== 'hive'" label="前置sql语句：">
            <el-input
              v-if="editable.writer"
              v-model="writerFormQuality.rdbmsWriter.preSql"
              placeholder="前置sql在insert之前执行"
              type="textarea"
              :rows="3"
            />
            <span v-else class="info-detail">{{
              dashOrValue(hasVal(writerFormQuality.rdbmsWriter, 'preSql'))
            }}</span>
          </el-form-item>
          <el-form-item v-if="dataSource !== 'hive'" label="后置Sql语句：">
            <el-input
              v-if="editable.writer"
              v-model="writerFormQuality.rdbmsWriter.postSql"
              placeholder="多个用;分隔"
              type="textarea"
              :rows="3"
            />
            <span v-else class="info-detail">{{
              dashOrValue(hasVal(writerFormQuality.rdbmsWriter, 'postSql'))
            }}</span>
          </el-form-item>
        </el-form>
        <!-- 非质量任务 writer
        <el-form
          v-else
          label-position="right"
          label-width="150px"
          :model="writerFormQuality"
          :rules="rules"
          :class="[editable.writer ? '' : 'form-item-class']"
        >
          <el-form-item label="数据库源：" prop="datasourceId">
            <el-select
              v-if="editable.writer"
              v-model="writerFormQuality.writerDataSourceID"
              filterable
              @change="wDsChange"
            >
              <el-option
                v-for="item in $store.state.taskAdmin.dataSourceList"
                :key="item.id"
                :label="item.datasourceName"
                :value="item.id"
              />
            </el-select>
            <span v-else class="info-detail">{{
              dashOrValue(
                finder(
                  $store.state.taskAdmin.writerDataSourceID,
                  $store.state.taskAdmin.dataSourceList,
                  "id",
                  "datasourceName"
                )
              )
            }}</span>
          </el-form-item>
          <el-form-item label="数据库表名：" prop="tableName">
            <el-select
              v-if="editable.writer"
              allow-create
              default-first-option
              filterable
              :value="$store.state.taskAdmin.writerTableName"
              @change="wTbChange"
            >
              <el-option
                v-for="item in wTbList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <span v-else class="info-detail">{{
              dashOrValue($store.state.taskAdmin.writerTableName)
            }}</span>
          </el-form-item>
          <div style="margin: 5px 0;" />
          <el-form-item label="字段：">
            <el-checkbox
              v-model="writerForm.checkAll"
              :disabled="!editable.writer"
              :indeterminate="writerForm.isIndeterminate"
              @change="wHandleCheckAllChange"
            >全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group
              v-model="$store.state.taskAdmin.selectWriterColumn"
              :disabled="!editable.writer"
              @change="wHandleCheckedChange"
            >
              <el-checkbox v-for="c in fromColumnList" :key="c" :label="c">{{
                c
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="前置sql语句：">
            <el-input
              v-if="editable.writer"
              v-model="writerForm.preSql"
              placeholder="前置sql在insert之前执行"
              type="textarea"
              :rows="3"
            />
            <span v-else class="info-detail">{{
              dashOrValue(writerForm.preSql)
            }}</span>
          </el-form-item>
          <el-form-item label="后置Sql语句：">
            <el-input
              v-if="editable.writer"
              v-model="writerForm.postSql"
              placeholder="多个用;分隔"
              type="textarea"
              :rows="3"
            />
            <span v-else class="info-detail">{{
              dashOrValue(writerForm.postSql)
            }}</span>
          </el-form-item>
        </el-form> -->
      </div>

      <h3>
        4.字段映射
        <el-button
          v-if="dialogStatus !== 'create'"
          type="text"
          icon="el-icon-edit"
          @click="editable.mapping = !editable.mapping"
        >{{ editable.mapping ? "取消" : "编辑" }}</el-button>
        <el-button
          v-if="dialogStatus !== 'create' && editable.mapping"
          type="text"
          icon="el-icon-upload"
          @click="updateData()"
        >保存更改</el-button>
      </h3>
      <!-- {{ $store.state.taskAdmin.readerColumns }}
      <br>
      {{ $store.state.taskAdmin.selectReaderColumn }} -->
      <div style="margin: 0 24px">
        <el-table
          :data="tableData"
          :header-cell-style="{
            background: '#f8f8fa',
            color: '#666666',
            'font-family': 'PingFangHK-Medium, PingFangHK'
          }"
          style="width: 100%"
        >
          <el-table-column label="数据源库(Reader)">
            <template slot-scope="scope">
              <el-select
                v-model="readerForm.lcolumns[scope.row.index]"
                :disabled="!editable.mapping"
                placeholder="请选择"
                filterable
                value-key="index"
                @change="lHandleSelect(scope.row.index, $event)"
              >
                <el-option
                  v-for="(tmp, index) in fromColumnsList"
                  :key="index"
                  :label="tmp"
                  :value="tmp"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="目标字段(Writer)">
            <template slot-scope="scope">
              <el-select
                v-model="readerForm.rcolumns[scope.row.index]"
                :disabled="!editable.mapping"
                placeholder="请选择"
                filterable
                value-key="index"
                @change="rHandleSelect(scope.row.index, $event)"
              >
                <el-option
                  v-for="(tmp, index) in toColumnsList"
                  :key="index"
                  :label="tmp"
                  :value="tmp"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                plain
                size="small"
                value-key="index"
                :disabled="!editable.mapping"
                @click="bHandleClick(scope.row.index, $event)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          v-if="isEditable"
          size="small"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="75%"
      class="log_detail_window"
      title="日志信息"
      :visible.sync="logview"
    >
      <jobLog :id="jobId" ref="jobLog" />
    </el-dialog>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/metadata-query';
import * as executor from '@/api/datax-executor';
import * as job from '@/api/datax-job-info';
import * as log from '@/api/datax-job-log';
import waves from '@/directive/waves'; // waves directive
import Cron from '@/components/Cron';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import JsonEditor from '@/components/JsonEditor';
import ShellEditor from '@/components/ShellEditor';
import PythonEditor from '@/components/PythonEditor';
import PowershellEditor from '@/components/PowershellEditor';
import * as datasourceApi from '@/api/datax-jdbcDatasource';
import * as jobProjectApi from '@/api/datax-job-project';
import reader from '@/views/datax/json-build/reader';
import writer from '@/views/datax/json-build/writer';
import qualityReader from '../../jsonQuality/reader';
import qualityWriter from '../../jsonQuality/writer';
import mapper from '@/views/datax/json-build/mapper';
import { isJSON } from '@/utils/validate';
import jobLog from './jobLog';
import { getTableSchema } from '@/api/metadata-query';

import {
  handlerExecute,
  handlerViewLog,
  handlerDelete,
  handlerStart,
  handlerStop,
  loadById,
  nextTriggerTime,
  handlerUpdate
} from '../method';
import { translaterMaster } from '@/utils/dictionary';

export default {
  name: 'SimpleJob',
  components: {
    Pagination,
    JsonEditor,
    ShellEditor,
    PythonEditor,
    PowershellEditor,
    Cron,
    jobLog,
    reader,
    writer,
    qualityReader,
    qualityWriter,
    mapper
  },
  directives: {
    waves
  },
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
  props: {
    jobInfo: { type: Object, default: () => ({}) }
  },
  data() {
    const validateIncParam = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Increment parameters is required'));
      }
      callback();
    };
    const validatePartitionParam = (rule, value, callback) => {
      if (!this.partitionField) {
        callback(new Error('Partition parameters is required'));
      }
      callback();
    };
    return {
      tableData: [],
      mapperJson: {},
      fromColumnsList: [],
      fromColumnsListChecked: [],
      toColumnsList: [],
      toColumnsListChecked: [],
      ruleSettings: [],
      readerForm: {
        lcolumns: [],
        rcolumns: [],
        rules: [],
        lcheckAll: false,
        rcheckAll: false,
        isIndeterminate: true
      },
      /** 数据库-表-列 */
      fromColumnList: [],
      wTbList: [],
      writerForm: {
        checkAll: false,
        isIndeterminate: true,
        ifCreateTable: false
      },
      /** 质量任务表单 */
      writerFormQuality: {},
      rColumnList: [],
      rTbList: [],
      jsonshow: false,
      newstlogContent: '',
      jobId: '',
      logview: false,
      logData: [],
      editFrom: true,
      switchVal: 1,
      showLog: false,
      projectIds: '',
      list: null,
      listLoading: true,
      total: 0,
      schemaList: [],
      // jobTypeLabel: '',
      listQuery: {
        current: 1,
        size: 10000,
        jobGroup: 0,
        projectIds: '',
        triggerStatus: -1,
        jobDesc: '',
        glueType: ''
      },
      showCronBox: false,
      dialogPluginVisible: false,
      pluginData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        jobGroup: [
          {
            required: true,
            message: 'jobGroup is required',
            trigger: 'change'
          }
        ],
        executorRouteStrategy: [
          {
            required: true,
            message: 'executorRouteStrategy is required',
            trigger: 'change'
          }
        ],
        executorBlockStrategy: [
          {
            required: true,
            message: 'executorBlockStrategy is required',
            trigger: 'change'
          }
        ],
        glueType: [
          {
            required: true,
            message: 'jobType is required',
            trigger: 'change'
          }
        ],
        projectId: [
          {
            required: true,
            message: 'projectId is required',
            trigger: 'change'
          }
        ],
        jobDesc: [
          {
            required: true,
            message: 'jobDesc is required',
            trigger: 'blur'
          }
        ],
        jobProject: [
          {
            required: true,
            message: 'jobProject is required',
            trigger: 'blur'
          }
        ],
        jobCron: [
          {
            required: true,
            message: 'jobCron is required',
            trigger: 'blur'
          }
        ],
        incStartId: [
          {
            trigger: 'blur',
            validator: validateIncParam
          }
        ],
        replaceParam: [
          {
            trigger: 'blur',
            validator: validateIncParam
          }
        ],
        primaryKey: [
          {
            trigger: 'blur',
            validator: validateIncParam
          }
        ],
        incStartTime: [
          {
            trigger: 'change',
            validator: validateIncParam
          }
        ],
        replaceParamType: [
          {
            trigger: 'change',
            validator: validateIncParam
          }
        ],
        partitionField: [
          {
            trigger: 'blur',
            validator: validatePartitionParam
          }
        ],
        datasourceId: [
          {
            trigger: 'change',
            validator: validateIncParam
          }
        ],
        readerTable: [
          {
            trigger: 'blur',
            validator: validateIncParam
          }
        ]
      },
      temp: {
        id: undefined,
        jobGroup: '',
        jobCron: '',
        jobDesc: '',
        executorRouteStrategy: '',
        executorBlockStrategy: '',
        childJobId: '',
        childJobIdArr: '',
        executorFailRetryCount: '',
        alarmEmail: '',
        executorTimeout: '',
        userId: 0,
        jobConfigId: '',
        executorHandler: '',
        glueType: '',
        glueSource: '',
        jobJson: '',
        executorParam: '',
        replaceParam: '',
        replaceParamType: 'Timestamp',
        jvmParam: '',
        incStartTime: '',
        partitionInfo: '',
        incrementType: 0,
        incStartId: '',
        primaryKey: '',
        projectId: '',
        datasourceId: '',
        readerTable: '',
        jobType: ''
      },
      resetTemp() {
        this.temp = this.$options.data().temp;
        this.jobJson = '';
        this.glueSource = '';
        this.timeOffset = 0;
        this.timeFormatType = 'yyyy-MM-dd';
        this.partitionField = '';
      },
      executorList: [],
      jobIdList: '',
      jobProjectList: '',
      dataSourceList: '',
      blockStrategies: [
        {
          value: 'SERIAL_EXECUTION',
          label: '单机串行'
        },
        {
          value: 'DISCARD_LATER',
          label: '丢弃后续调度'
        },
        {
          value: 'COVER_EARLY',
          label: '覆盖之前调度'
        }
      ],
      routeStrategies: [
        {
          value: 'FIRST',
          label: '第一个'
        },
        {
          value: 'LAST',
          label: '最后一个'
        },
        {
          value: 'ROUND',
          label: '轮询'
        },
        {
          value: 'RANDOM',
          label: '随机'
        },
        {
          value: 'CONSISTENT_HASH',
          label: '一致性HASH'
        },
        {
          value: 'LEAST_FREQUENTLY_USED',
          label: '最不经常使用'
        },
        {
          value: 'LEAST_RECENTLY_USED',
          label: '最近最久未使用'
        },
        {
          value: 'FAILOVER',
          label: '故障转移'
        },
        {
          value: 'BUSYOVER',
          label: '忙碌转移'
        }
        // { value: 'SHARDING_BROADCAST', label: '分片广播' }
      ],
      glueTypes: [
        {
          value: 'BEAN',
          label: 'DataX任务'
        },
        {
          value: 'GLUE_SHELL',
          label: 'Shell任务'
        },
        {
          value: 'GLUE_PYTHON',
          label: 'Python任务'
        },
        {
          value: 'GLUE_POWERSHELL',
          label: 'PowerShell任务'
        }
      ],
      incrementTypes: [
        {
          value: 0,
          label: '无'
        },
        {
          value: 1,
          label: '主键自增'
        },
        {
          value: 2,
          label: '时间自增'
        },
        {
          value: 3,
          label: 'HIVE分区'
        }
      ],
      triggerNextTimes: '',
      registerNode: [],
      jobJson: '',
      glueSource: '',
      timeOffset: 0,
      timeFormatType: 'yyyy-MM-dd',
      partitionField: '',
      timeFormatTypes: [
        {
          value: 'yyyy-MM-dd',
          label: 'yyyy-MM-dd'
        },
        {
          value: 'yyyyMMdd',
          label: 'yyyyMMdd'
        },
        {
          value: 'yyyy/MM/dd',
          label: 'yyyy/MM/dd'
        }
      ],
      replaceFormatTypes: [
        {
          value: 'yyyy/MM/dd',
          label: 'yyyy/MM/dd'
        },
        {
          value: 'yyyy-MM-dd',
          label: 'yyyy-MM-dd'
        },
        {
          value: 'HH:mm:ss',
          label: 'HH:mm:ss'
        },
        {
          value: 'yyyy/MM/dd HH:mm:ss',
          label: 'yyyy/MM/dd HH:mm:ss'
        },
        {
          value: 'yyyy-MM-dd HH:mm:ss',
          label: 'yyyy-MM-dd HH:mm:ss'
        },
        {
          value: 'Timestamp',
          label: '时间戳'
        }
      ],
      statusList: [
        {
          value: 500,
          label: '失败'
        },
        {
          value: 502,
          label: '失败(超时)'
        },
        {
          value: 200,
          label: '成功'
        },
        {
          value: 0,
          label: '无'
        }
      ],
      /** 可编辑 */
      editable: {
        /** 新建任务 */
        newTask: false,
        /** 构建reader */
        reader: false,
        /** 构建writer */
        writer: false,
        /** 字段映射 */
        mapping: false
      },
      dataSource: '',
      fileTypes: [
        { value: 'text', label: 'text' },
        { value: 'orc', label: 'orc' }
      ],
      writeModes: [
        { value: 'append', label: 'append 写入前不做任何处理' },
        {
          value: 'nonConflict',
          label: 'nonConflict 目录下有fileName前缀的文件，直接报错'
        }
      ]
    };
  },

  computed: {
    jobType() {
      return this.jobInfo.jobType;
    },

    jobGroupName() {
      return this.executorList.find(
        element => element.id === this.temp.jobGroup
      )?.title;
    },

    jobParam() {
      return JSON.parse(this.jobInfo.jobParam);
    },

    ruleArr() {
      return this.readerForm.rules;
    },

    readerColumns() {
      return this.$store.state.taskAdmin.selectReaderColumn;
    },

    writerColumns() {
      return this.$store.state.taskAdmin.writerColumns;
    },

    /**
     * @description: 查找sets中某一项的attr属性与item相同，若有则返回sets中某一项的distAttr属性值
     * @param {String} item
     * @param {array} sets
     * @param {String} attr
     * @param {String} distAttr
     * @returns {String}
     */
    finder() {
      return (item, sets, attr, distAttr) => {
        var temp = '';
        if (sets) {
          temp = sets.find(ele => ele[attr] === item);
        }
        if (!temp) {
          return '';
        }
        return temp[distAttr];
      };
    },
    /** 提取子任务下拉列表数组jobDesc属性 */
    reorganizeChildJob() {
      var tmp = '-';
      if (this.temp.childJobId) {
        this.temp.childJobId.forEach(ele => {
          if (tmp === '-') {
            tmp = ele.jobDesc;
          } else {
            tmp += ', '.concat(ele.jobDesc);
          }
        });
      }
      return tmp;
    },
    /** 没有值显示短横线，有值显示值 */
    dashOrValue() {
      return val => {
        if (val) {
          return val;
        } else {
          return '-';
        }
      };
    },
    isEditable() {
      var temp = null;
      for (var i in this.editable) {
        if (temp === null) {
          temp = this.editable[i];
        } else {
          temp = temp || this.editable[i];
        }
      }
      return temp;
    },

    hasVal() {
      return (res, item) => {
        if (res) {
          if (res.hasOwnProperty(item)) {
            return res[item]
          } else {
            return ''
          }
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    'writerFormQuality.writerDatasourceId': function(oldVal, newVal) {
      this.$store.state.taskAdmin.dataSourceList.find((item) => {
        if (item.id === this.writerFormQuality.writerDatasourceId) {
          this.dataSource = item.datasource;
        }
      })
      if (
        this.dataSource === 'postgresql' ||
        this.dataSource === 'greenplum' ||
        this.dataSource === 'oracle' ||
        this.dataSource === 'sqlserver'
      ) {
        this.getSchemaList()
      }
      this.getTables('rdbmsWriter');
    },

    fromColumnsListChecked(newval) {
      const arr = [];
      newval.forEach((element, index) => {
        const obj = {
          sourceField: this.readerForm.lcolumns[index],
          clearRule: this.readerForm.rules[index],
          targetField: this.readerForm.rcolumns[index],
          index: index
        };
        arr.push(obj);
      });
      this.$store.commit('SET_TABLEDATA', arr);
    },

    readerColumns(val) {
      console.log('val', val);
      this.readerForm.lcolumns = JSON.parse(JSON.stringify(val));
      this.fromColumnsList = val;
      this.tableData = [];
      val.forEach((row, index) => {
        const obj = {
          column: row,
          index
        };
        this.tableData.push(obj);
      });
    },

    writerColumns(val) {
      this.readerForm.rcolumns = JSON.parse(JSON.stringify(val));
      this.toColumnsList = val;
    },

    dialogFormVisible(val) {
      this.$store.commit('SET_READER_EDITABLE', !val);
      if (!val) {
        for (var i in this.editable) {
          this.editable[i] = false;
        }
      } else {
        this.$store.state.taskAdmin.dataSourceList.find((item) => {
          if (item.id === this.$store.state.taskAdmin.writerDataSourceID) {
            this.dataSource = item.datasource;
          }
        })
        this.writerFormQuality = JSON.parse(JSON.stringify(this.jobParam))
        this.getColumns()
      }
    },

    'writerFormQuality.writerSchema'(val) {
      this.getTables('rdbmsWriter')
    },

    'editable.writer'(val) {
      if (!val) {
        this.writerFormQuality = JSON.parse(JSON.stringify(this.jobParam))
        this.getColumns()
      }
    }
  },
  created() {
    this.fetchData();
    this.getExecutor();
    this.getJobIdList();
    this.getJobProject();
    this.getDataSourceList();
    this.getSchemaList();
    this.temp = this.jobInfo;
    this.writerFormQuality = JSON.parse(JSON.stringify(this.jobParam))
  },

  methods: {
    /**
     * @description: 质量任务编辑 - 数据源切换
     */
    wDsChange(e) {
      this.$store.commit('SET_WRITER_DATASOURCE_ID', e);
      this.$store.state.taskAdmin.dataSourceList.find((item) => {
        if (item.id === e) {
          this.dataSource = item.datasource;
        }
      });
    },

    getReaderData() {
      return this.$refs.reader.getData();
    },
    /**
     * @description: writer表项全选
     */
    wHandleCheckAllChange(val) {
      this.writerFormQuality.writerColumns = val ? this.fromColumnList : [];
      this.writerForm.isIndeterminate = false;
      this.$store.commit('SET_SELECT_WRITERCOLUMN', this.writerFormQuality.writerColumns);
    },
    wHandleCheckedChange(value) {
      console.log(value);
      const checkedCount = value.length;
      this.writerForm.checkAll = checkedCount === this.fromColumnList.length;
      this.writerForm.isIndeterminate =
        checkedCount > 0 && checkedCount < this.fromColumnList.length;
      this.$store.commit('SET_SELECT_WRITERCOLUMN', value);
    },
    wTbChange(t) {
      this.getColumns('writer');
      this.$store.commit('SET_WRITER_TABLENAME', t);
    },

    // 执行一次
    handlerExecute(temp) {
      handlerExecute.call(this, temp).then(() => {
        this.newstlogContent = '';
        this.logList();
        this.showLog = true;
        this.jsonshow = false;
      });
    },

    // 查看日志
    handlerViewLog(temp) {
      // handlerViewLog.call(this, temp);
      this.$store.commit('SET_LOGVIEW_TYPE', 0);
      this.logview = true;
      this.jobId = temp.id;
      this.$refs.jobLog?.fetchData();
    },

    // 删除
    handlerDelete(temp) {
      handlerDelete
        .call(this, temp)
        .then(() => {
          this.$emit('deleteDetailTab', temp.id);
          this.$emit('deleteJob', true);
        })
        .then(() => {});
    },

    // 开关
    changeSwitch(temp) {
      temp.triggerStatus === 1
        ? handlerStart.call(this, temp)
        : handlerStop.call(this, temp);
    },

    // 注册节点
    loadById(row) {
      loadById.call(this, row);
    },

    // 下次触发时间
    nextTriggerTime(row) {
      nextTriggerTime.call(this, row);
    },

    // 编辑
    handlerUpdate(row) {
      this.$store.commit(
        'SET_JOBINFO_TYPE',
        this.jobInfo.jobType
      )
      this.$store.commit('SET_READER_ISEDIT', true)

      row.childJobId = row.childJobId?.join?.(',');
      handlerUpdate.call(this, row);

      const jobParam = JSON.parse(row.jobParam);
      console.log('jobParam', jobParam);
      this.$store.commit(
        'SET_READER_DATASOURCE_ID',
        jobParam.readerDatasourceId
      );

      if (this.$store.state.taskAdmin.jobInfoType === 'DQCJOB') {
        const jobParamRule = jobParam.rule
        jobParamRule.forEach(ele => {
          const codeArr = []
          ele.ruleId.forEach(code => {
            codeArr.push(code.code)
          })
          ele.ruleId = codeArr
        })
        this.$store.commit('SET_JOBRULE', jobParamRule)
      }

      this.$store.commit('SET_READER_TABLENAME', jobParam.readerTables[0]);

      this.$store.commit('SET_READER_SCHEMA', jobParam.readerSchema)

      this.$store.commit('SET_WRITER_SCHEMA', jobParam.writerSchema)

      this.$store.commit('SET_SELECT_READERCOLUMN', jobParam.readerColumns);

      this.$store.commit(
        'SET_WRITER_DATASOURCE_ID',
        jobParam.writerDatasourceId
      );

      this.$store.commit('SET_WRITER_TABLENAME', jobParam.writerTables[0]);

      this.$store.commit('SET_SELECT_WRITERCOLUMN', jobParam.writerColumns);

      this.getColumns();

      this.getTables('rdbmsWriter');
    },

    // 实时更新日志
    logList() {
      const param = Object.assign(
        {},
        {
          current: 1,
          size: 10,
          jobGroup: 0,
          jobId: this.temp.id,
          logStatus: -1,
          filterTime: ''
        }
      );
      let status = 0;

      log.getList(param).then(response => {
        const { content } = response;

        const newestLog = content.data[0] || {};
        if (!newestLog?.executorAddress) {
          this.logList();
          return;
        }
        status = newestLog.handleCode;
        const triggerTime = Date.parse(newestLog?.triggerTime);
        log
          .viewJobLog(newestLog?.executorAddress, triggerTime, newestLog?.id, 1)
          .then(response => {
            this.newstlogContent = response.content.logContent;
          })
          .then(() => {
            if (status === 0) {
              setTimeout(this.logList(), 1000);
            }
          });
      });
    },

    // schema列表
    async getSchemaList() {
      const schemaList = await getTableSchema({
        datasourceId: this.writerFormQuality.writerDatasourceId
      });
      this.schemaList = schemaList;
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getExecutor() {
      job.getExecutorList().then(response => {
        const { content } = response;
        this.executorList = content;
        console.log('this.executorList', content);
      });
    },
    getJobIdList() {
      job.getJobIdList().then(response => {
        const { content } = response;
        this.jobIdList = content;
      });
    },
    getJobProject() {
      jobProjectApi.getJobProjectList().then(response => {
        this.jobProjectList = response;
      });
    },
    getDataSourceList() {
      datasourceApi.getDataSourceList().then(response => {
        this.dataSourceList = response;
        console.log('this.dataSourceList', this.dataSourceList);
      });
    },
    fetchData() {
      this.listLoading = true;
      this.listQuery.projectIds = this.$store.state.taskAdmin.projectId;
      job.getList(this.listQuery).then(response => {
        const { content } = response;
        this.total = content.recordsTotal;
        this.list = content.data;
        this.listLoading = false;
        this.$store.commit('SET_TASKLIST', this.list);
        // console.log(this.list);
        const t = this.list.filter(item => item.id === this.$store.state.taskAdmin.jobInfo.id)
        this.$store.commit('SET_JOB_INFO', t[0])
      });
    },
    incStartTimeFormat(vData) {},
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },

    updateData() {
      this.$store.commit('SET_SELECT_WRITERCOLUMN', this.readerForm.rcolumns);
      this.$store.commit('SET_SELECT_READERCOLUMN', this.readerForm.lcolumns);
      const jobParam = {
        readerDatasourceId: this.$store.state.taskAdmin.readerDataSourceID,
        writerDatasourceId: this.writerFormQuality.writerDatasourceId,
        readerTables: [this.$store.state.taskAdmin.readerTableName], // reader表名[Array]
        writerTables: this.writerFormQuality.writerTables, // writer表名[Array]
        readerColumns: this.$store.state.taskAdmin.selectReaderColumn, // 已选择的表项
        writerColumns: this.writerFormQuality.writerColumns,
        readerSchema: this.$store.state.taskAdmin.readerSchema,
        writerSchema: (this.dataSource === 'postgresql' || this.dataSource === 'greenplum' || this.dataSource === 'oracle' || this.dataSource === 'sqlserver') ? this.writerFormQuality.writerSchema : '',
        transformer: this.writerFormQuality.transformer,
        hiveReader: this.writerFormQuality.hiveReader,
        hiveWriter: this.dataSource === 'hive' ? this.writerFormQuality.hiveWriter : {},
        rdbmsReader: this.writerFormQuality.rdbmsReader,
        rdbmsWriter: this.dataSource !== 'hive' ? this.writerFormQuality.rdbmsWriter : { preSql: '', postSql: '' },
        hbaseReader: this.writerFormQuality.hbaseReader,
        hbaseWriter: this.writerFormQuality.hbaseWriter,
        mongoDBReader: this.writerFormQuality.mongoDBReader,
        mongoDBWriter: this.writerFormQuality.mongoDBWriter
      };

      if (this.temp.glueType === 'BEAN' && !isJSON(this.temp.jobJson)) {
        this.$notify({
          title: 'Fail',
          message: 'json格式错误',
          type: 'error',
          duration: 2000
        });
        return;
      }
      this.$refs['dataForm'].validate(valid => {
        // const tabName = this.temp.id;
        if (valid) {
          if (this.temp.childJobId) {
            const auth = [];
            for (const i in this.temp.childJobId) {
              auth.push(this.temp.childJobId[i].id);
            }
            this.temp.childJobIdArr = auth
            this.temp.childJobId = auth.toString();
          }
          // this.temp.executorHandler =
          //   this.temp.glueType === "BEAN" ? "executorJobHandler" : "";
          this.temp.glueSource = this.glueSource;
          if (this.partitionField) {
            this.temp.partitionInfo =
              this.partitionField +
              ',' +
              this.timeOffset +
              ',' +
              this.timeFormatType;
          }
          if (this.temp.jobType === 'DQCJOB') {
            const tempjobRule = JSON.parse(JSON.stringify(this.$store.state.taskAdmin.jobRule))
            tempjobRule.forEach(ele => {
              const codeArr = []
              ele.ruleId.forEach(code => {
                codeArr.push({ code })
              })
              ele.ruleId = codeArr;
            });
            jobParam.rule = tempjobRule
          }
          this.temp.jobParam = JSON.stringify(jobParam);
          job.updateJob(this.temp).then(() => {
            this.fetchData();
            this.dialogFormVisible = false;
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            });
            // this.$emit("deleteDetailTab", tabName);
            // this.$emit("deleteJob");
          });
        }
      });
    },

    viewJson() {
      this.jsonshow = !this.jsonshow;
      if (this.showLog) {
        this.showLog = false;
      }
    },

    showRunLogDetails() {
      this.showLog = !this.showLog;
      if (this.jsonshow) {
        this.jsonshow = false;
      }
    },

    // 获取表名
    getTables(type) {
      if (type === 'rdbmsWriter') {
        let obj = {};
        if (
          this.dataSource === 'postgresql' ||
          this.dataSource === 'greenplum' ||
          this.dataSource === 'oracle' ||
          this.dataSource === 'sqlserver'
        ) {
          obj = {
            datasourceId: this.writerFormQuality.writerDatasourceId,
            tableSchema: this.writerFormQuality.writerSchema
          };
        } else {
          obj = {
            datasourceId: this.writerFormQuality.writerDatasourceId
          };
        }
        // 组装
        dsQueryApi.getTables(obj).then(response => {
          this.wTbList = response
          this.$store.commit('SET_WRITER_TABLENAME', this.wTbList[0])
        }).catch(error => {
          console.log(error)
          this.wTbList = []
          this.$store.commit('SET_WRITER_TABLENAME', '')
        })
      }
    },
    // 获取表字段
    getColumns() {
      const obj = {
        datasourceId: this.writerFormQuality.writerDatasourceId,
        tableName: this.writerFormQuality.writerTables[0]
      };
      dsQueryApi.getColumns(obj).then(response => {
        this.fromColumnList = response;

        if (this.writerFormQuality.writerDatasourceId === this.jobParam.writerDatasourceId && this.writerFormQuality.writerTables[0] === this.jobParam.writerTables[0]) {
          this.writerFormQuality.writerColumns = this.jobParam.writerColumns
        } else {
          this.writerFormQuality.writerColumns = this.fromColumnList
        }

        // this.writerForm.checkAll = true;
        // this.writerForm.isIndeterminate = false;
        this.writerForm.checkAll = this.writerFormQuality.writerColumns.length === this.fromColumnList.length;
        this.writerForm.isIndeterminate =
          this.writerFormQuality.writerColumns.length > 0 && this.writerFormQuality.writerColumns.length < this.fromColumnList.length

        this.$store.commit('SET_WRITER_COLUMNS', response);

        this.readerForm.rcolumns = response;
        this.toColumnsList = response;
      });
    },

    lHandleSelect(index, v) {},
    cHandleSelect(index, v) {},
    rHandleSelect(index, v) {
      console.log(index, v);
    },

    bHandleClick(index, v) {
      this.fromColumnsListChecked.splice(index, 1);
      this.toColumnsListChecked.splice(index, 1);

      this.readerForm.lcolumns.splice(index, 1);
      this.readerForm.rcolumns.splice(index, 1);
      this.tableData.splice(index, 1);
    },

    getLColumns() {
      return this.readerForm.lcolumns;
    },
    getRColumns() {
      return this.readerForm.rcolumns;
    },
    getRules() {
      return this.readerForm.rules;
    },
    editReader() {
      this.editable.reader = !this.editable.reader;
      this.$store.commit('SET_READER_ISEDIT', true)
      this.$store.commit('SET_READER_EDITABLE', this.editable.reader);
    },
    exStatus(param) {
      param = !param;
    },
    translaterMaster,
    /**
     * @description: 点击Schema触发表改变
     */
    schemaChange() {
      this.getTables('rdbmsWriter')
    }
  }
};
</script>

<style scoped>
.header {
  overflow: hidden;
  padding: 8px 0;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
}

.header_action {
  font-size: 14px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  line-height: 20px;
  float: left;
  cursor: pointer;
}

.header_action:not(:first-child) {
  margin-left: 32px;
}

.header_action span {
  margin-left: 4px;
}

.header_switch {
  float: right;
}

.content {
  padding: 0 16px 16px;
}

.title {
  margin-top: 31px;
}

.task_img {
  width: 21px;
}

.jobDesc {
  font-size: 24px;
  font-family: PingFangHK-Medium, PingFangHK;
  font-weight: 500;
  color: #333333;
  line-height: 33px;
  margin-left: 10px;
}

.edit {
  float: right;
  font-size: 14px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  color: #3d5fff;
  height: 33px;
  line-height: 33px;
  cursor: pointer;
}

.detail {
  margin-top: 20px;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
}

.detail .key {
  font-size: 14px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}

.detail .value {
  font-size: 14px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  line-height: 20px;
}

.detail_target {
  width: 50%;
  padding: 8px;
  /* background: red; */
}
.detail_col {
  padding: 8px;
}

.json_title {
  font-size: 14px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  color: #3d5fff;
  line-height: 20px;
  padding: 8px;
  cursor: pointer;
}

.json_content >>> .CodeMirror {
  background: white;
  color: #333333;
}

.json_content >>> .CodeMirror-gutters {
  background: #f8f8fa;
  border: none;
}

.json_content >>> .CodeMirror-lint-markers {
  width: 0;
}

.json_content >>> .CodeMirror-linenumber {
  color: rgba(102, 102, 102, 1);
  left: 0 !important;
  /* width: 44px !important; */
}

.job_detail {
  position: relative;
}

.log_detail {
  width: 100%;
  background: #f8f8fa;
  border: 2px solid #f8f8fa;
  border-left: none;
  position: absolute;
  bottom: 0;
}

.log_title {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  font-family: PingFangHK-Medium, PingFangHK;
  font-weight: 500;
  color: #333333;
  /* background: white; */
}

.log_log {
  background: white;
  display: inline-block;
  padding: 0 24px;
}

.log_container {
  padding-left: 24px;
  height: 240px;
  overflow: scroll;
  background: white;
  font-size: 13px;
}

.unflod {
  color: black;
  float: right;
  cursor: pointer;
  margin-right: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: height 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
 {
  height: 0;
}

.log_detail_window >>> .el-dialog {
  border-radius: 8px;
}

.log_detail_window >>> .el-dialog__body {
  padding: 20px 40px;
}
</style>
<style lang="scss" scoped>
.el-dialog {
  h3 {
    font-size: 20px;
    font-family: PingFangHK-Medium, PingFangHK;
    margin: 22px 0;
    color: #333333;
    .el-button {
      position: relative;
      float: right;
      padding: 0;
      font-size: 16px;
      margin: 0 10px;
    }
  }
  .el-form {
    .info-detail {
      color: #333333;
      font-family: PingFangHK-Regular, PingFangHK;
    }
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .part-container {
    padding: 24px;
    background: #f8f8fa;
    margin: 0 24px;
  }
  .el-table {
    border: 1px solid #f3f3f3;
    >>> td {
      border-bottom: 1px solid #f3f3f3;
    }
    >>> th {
      border-bottom: 1px solid #f3f3f3;
    }
  }
}
>>> .el-dialog {
  margin-bottom: 15vh;
  .el-dialog__body {
    padding-top: 0;
  }
}
.form-item-class {
  >>> .el-form-item__label {
    font-weight: 500;
    color: #999999;
    font-family: PingFangHK-Regular, PingFangHK;
  }
}
</style>
