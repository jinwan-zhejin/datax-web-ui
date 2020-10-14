import * as job from "@/api/datax-job-info";
import * as executor from "@/api/datax-executor";

//执行一次
export function handlerExecute(row) {
  this.$confirm("确定执行吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    const param = {};
    param.jobId = row.id;
    param.executorParam = row.executorParam;
    job.triggerJob(param).then(response => {
      this.$notify({
        title: "Success",
        message: "Execute Successfully",
        type: "success",
        duration: 2000
      });
    });
  });
}

//查看日志
export function handlerViewLog(row) {
  this.$router.push({ path: "/datax/log/jobLog", query: { jobId: row.id } });
}

//删除
export function handlerDelete(row) {
  return this.$confirm("确定删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    job.removeJob(row.id).then(response => {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000
      });
    });
  });
}

//启动
export function handlerStart(row) {
  job.startJob(row.id).then(response => {
    this.$notify({
      title: "成功",
      message: "启动成功",
      type: "success",
      duration: 2000
    });
  });
}

//暂停
export function handlerStop(row) {
  job.stopJob(row.id).then(response => {
    this.$notify({
      title: "成功",
      message: "停止成功",
      type: "success",
      duration: 2000
    });
  });
}

//注册节点
export function loadById(row) {
  executor.loadById(row.jobGroup).then(response => {
    this.registerNode = [];
    const { content } = response;
    this.registerNode.push(content);
  });
}

//下次注册时间
export function nextTriggerTime(row) {
  job.nextTriggerTime(row.jobCron).then(response => {
    const { content } = response;
    this.triggerNextTimes = content.join("<br>");
  });
}

//编辑
export function handlerUpdate(row) {
    this.resetTemp()
    this.temp = Object.assign({}, row) // copy obj
    if (this.temp.jobJson) this.jobJson = JSON.parse(this.temp.jobJson)
    this.glueSource = this.temp.glueSource
    const arrchildSet = []
    const arrJobIdList = []
    if (this.jobIdList) {
      for (const n in this.jobIdList) {
        if (this.jobIdList[n].id !== this.temp.id) {
          arrJobIdList.push(this.jobIdList[n])
        }
      }
      this.JobIdList = arrJobIdList
    }

    if (this.temp.childJobId) {
      const arrString = this.temp.childJobId.split(',')
      for (const i in arrString) {
        for (const n in this.jobIdList) {
          if (this.jobIdList[n].id === parseInt(arrString[i])) {
            arrchildSet.push(this.jobIdList[n])
          }
        }
      }
      this.temp.childJobId = arrchildSet
    }

    if (this.temp.partitionInfo) {
      const partition = this.temp.partitionInfo.split(',')
      this.partitionField = partition[0]
      this.timeOffset = partition[1]
      this.timeFormatType = partition[2]
    }
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      this.$refs['dataForm'].clearValidate()
    })
  }
