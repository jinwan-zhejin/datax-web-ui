<template>
    <el-dialog
        :title="isEditRelation.id===-1? '新增':'编辑'"
        :visible.sync="editCollectVisible"
        :before-close="closeDialog"
        @close="clearData"
        width="760px">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" size="small"  label-width="100px" label-position="right">
            <el-form-item label="采集任务名称" prop="taskName">
                <el-input v-model="ruleForm.taskName"  maxlength="20" placeholder="最大长度为20个字符"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="数据源名称"  prop="datasourceId">
                        <el-select v-if="isEditRelation.id===-1" v-model="ruleForm.datasourceId"  placeholder="请选择数据源名称">
                            <el-option :value="item.id" :label="item.datasourceName" :key="item.id" v-for="item in dataOption"></el-option>
                        </el-select>
                        <span v-else>{{dataSourceName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="挂载目录" prop="reMetadataMenuId">
                        <el-cascader
                            change-on-select
                            :options="layerOptions"
                            :props="layerOptionsProps"
                            v-model="ruleForm.reMetadataMenuId"
                        >
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="调度方式"  prop="cycleType">
                        <el-select v-model="ruleForm.cycleType" placeholder="请选择调度方式">
                            <el-option value="0" label="采集一次"></el-option>
                            <el-option value="1" label="多次采集"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="采集频率" v-if="ruleForm.cycleType==='0'" prop="triggerTime">
                <el-date-picker
                    v-model="ruleForm.triggerTime"
                    size="small"
                    type="datetime"
                    value-format="timestamp"
                    placeholder="选择执行时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="采集频率" v-if="ruleForm.cycleType==='1'" prop="jobCron">
                <el-col :span="6">
                    <el-select v-model="ruleForm.jobCron" placeholder="请设置执行周期" @change="setCycle">
                        <el-option v-show="false" label="请选择频率" value="4"></el-option>
                        <el-option label="按月执行" value="0"></el-option>
                        <el-option label="按周执行" value="1"></el-option>
                        <el-option label="按天执行" value="2"></el-option>
                        <el-option label="按小时执行" value="3"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="17" class="year ml5" v-if="CycleSelected==='0'">
                    <el-col :span="8" class="mr5">
                        <el-input-number v-model="ruleForm.exeDate1.value1" @change="handleChange" :min="1" :max="31" label="设置执行日"></el-input-number>
                    </el-col>
                    <el-col :span="13">
                        <el-time-picker
                            v-model="ruleForm.exeDate1.value2"
                            placeholder="任意时间点"
                            value-format="HH:mm:ss"
                        >
                        </el-time-picker>
                    </el-col>
                </el-col>
                <el-col :span="16" class="year ml5" v-if="CycleSelected==='1'">
                    <el-col :span="8">
                        <el-select v-model="ruleForm.exeDate2.value1" placeholder="请设置执行周期">
                            <el-option label="周日" value="SUN"></el-option>
                            <el-option label="周一" value="MON"></el-option>
                            <el-option label="周二" value="TUE"></el-option>
                            <el-option label="周三" value="WED"></el-option>
                            <el-option label="周四" value="THU"></el-option>
                            <el-option label="周五" value="FRI"></el-option>
                            <el-option label="周六" value="SAT"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" class="ml5">
                        <el-time-picker
                            v-model="ruleForm.exeDate2.value2"
                            placeholder="任意时间点"
                            value-format="HH:mm:ss"
                        >
                        </el-time-picker>
                    </el-col>
                </el-col>
                <el-col :span="16" class="year ml5" v-if="CycleSelected==='2'">
                    <el-col :span="6">
                        <el-time-picker
                            v-model="ruleForm.exeDate3.value1"
                            placeholder="任意时间点"
                            value-format="HH:mm:ss"
                        >
                        </el-time-picker>
                    </el-col>
                </el-col>
                <el-col :span="16" class="year ml5" v-if="CycleSelected==='3'">
                    <el-select  size="small" v-model="ruleForm.exeDate4.value1" multiple placeholder="请选择时间（可多选）">
                        <el-option
                            v-for="item in timeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog"  type="info" size="small">取 消</el-button>
                <el-button type="danger" size="small" @click="submitForm('ruleForm')" >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "",
        components: {},
        props:['editCollectVisible','isEditRelation'],
        data() {
            const getTimeList = _ =>{
                let Arr=[];
                for(let i=0;i<=59;i++){
                    Arr.push({
                        value:i,
                        label:i,
                    })
                }
                return Arr;
            };
            return {
                dataOption:[],
                dataSourceName:'',
                timeOptions:getTimeList(),
                ruleForm:{
                    id:0,
                    taskName:'',
                    datasourceId:'',
                    metadataMenuId:'',
                    reMetadataMenuId:[],
                    triggerTime:'',
                    cycleType:'0',
                    jobCron:"",
                    exeDate1:{
                        value1:"",
                        value2: "",
                    },
                    exeDate2:{
                        value1:"",
                        value2: "",
                    },
                    exeDate3:{
                        value1:"",
                    },
                    exeDate4:{
                        value1:"",
                    },
                   // dataSourceName:''
                },
                layerOptionsProps:{
                    value:'id',
                    label:'name'
                },
                layerOptions:[],
                rules: {
                        taskName: [
                            { required: true, message: '请填写任务名称', trigger: 'blur' },
                        ],
                    datasourceId:[
                        { required: true, message: '请选择数据源', trigger: 'change' }
                    ],
                    reMetadataMenuId: [
                        { required: true, message: '请选择挂载目录', trigger: 'change' },
                    ],
                    cycleType:[
                        { required: true, message: '请选择调度方式', trigger: 'change' },
                    ],
                    jobCron:[
                        { required: true, message: '请设置执行频率', trigger: 'change' },
                    ],
                    triggerTime:[
                        { required: true, message: '请选择采集频率', trigger: 'change' },
                    ],
                },
                sourceList:[],
                CycleSelected:"",
                currId:null,
            }
        },
        methods: {
            setCycle(cb){
                this.CycleSelected=cb
            },
            handleChange(val){
                this.ruleForm.exeDate1.value1=val
            },
            getMetaDirs(){
                this.$urlApi.metaData.getMetaDataDirs({metadataType:1}).then((res)=>{
                    this.layerOptions=res.data
                }).then((res)=>{
                    this.getDataSource()
                })
            },
            getDataSource(){
                this.$urlApi.metaData.getDataCollectDs().then((res)=>{
                    this.dataOption=res.data;
                })
            },
            getDataById(){
                this.$urlApi.metaData.getCollectDataById({id:this.isEditRelation.id}).then((res)=>{
                    let row=res.data;
                    this.ruleForm.cycleType=row.cycleType;
                    this.CycleSelected=row.jobCron
                    this.ruleForm.reMetadataMenuId=row.backMetadataMenuId.split(',').map(Number);
                   // console.log(row)
                    this.ruleForm.datasourceId=row.datasourceId;
                    this.ruleForm.taskName=row.taskName;
                    this.dataSourceName=row.dataSourceName;

                    this.ruleForm.jobCron=row.jobCron;
                    if(this.ruleForm.cycleType == '1'){
                        switch(row.jobCron){
                            case '0':this.ruleForm.exeDate1.value1=row.triggerTime.substring(0, row.triggerTime.indexOf(':'));this.ruleForm.exeDate1.value2=row.triggerTime.substring(row.triggerTime.indexOf(':')+1,row.triggerTime.length); break;
                            case '1':this.ruleForm.exeDate2.value1=row.triggerTime.substring(0, row.triggerTime.indexOf(':'));this.ruleForm.exeDate2.value2=row.triggerTime.substring(row.triggerTime.indexOf(':')+1,row.triggerTime.length); break;
                            case '2':this.ruleForm.exeDate3.value1=row.triggerTime;break;
                            case '3':this.ruleForm.exeDate4.value1=row.triggerTime.split(",");break;
                        }
                    }else{
                        this.ruleForm.triggerTime=row.triggerTime
                    }
                });
            },
            clearData(){
                this.ruleForm.id=0;
                this.ruleForm.triggerTime='';
                this.ruleForm.reMetadataMenuId=[];
                this.ruleForm.exeDate1={
                    value1:"",
                    value2: "",
                };
                this.ruleForm.exeDate2={
                    value1:"",
                    value2: "",
                };
                this.ruleForm.exeDate3={
                    value1:"",
                };
                this.ruleForm.exeDate4={
                    value1:"",
                };
                this.$refs['ruleForm'].resetFields();

            },
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let param={};
                        if(this.ruleForm.cycleType==='0'){
                            param.jobCron=4;
                            param.triggerTime=this.ruleForm.triggerTime;
                        }else{
                            switch(this.ruleForm.jobCron){
                                case '0':param.triggerTime = this.ruleForm.exeDate1.value1+":"+this.ruleForm.exeDate1.value2; break;
                                case '1':param.triggerTime = this.ruleForm.exeDate2.value1+":"+this.ruleForm.exeDate2.value2;break;
                                case '2':param.triggerTime = this.ruleForm.exeDate3.value1;break;
                                case '3':param.triggerTime = this.ruleForm.exeDate4.value1.join(",");break;
                            }
                            param.jobCron=this.ruleForm.jobCron;
                        }
                        param.taskName=this.ruleForm.taskName;
                        param.datasourceId=this.ruleForm.datasourceId;
                        param.metadataMenuId=this.ruleForm.reMetadataMenuId[this.ruleForm.reMetadataMenuId.length-1];
                        param.backMetadataMenuId=this.ruleForm.reMetadataMenuId.join(',');
                        param.cycleType=this.ruleForm.cycleType;
                        param.id=this.ruleForm.id;

                        this.$urlApi.metaData.AddCollectTask(param).then((res)=>{
                            this.$message({
                                message:'操作成功',
                                type:'success'
                            });
                            this.$refs['ruleForm'].resetFields();
                            this.$emit("editCollectBack",1);
                        })
                    } else {
                        return false;
                    }
                });
            },
            closeDialog(){
                this.$emit("editCollectBack",0);
                this.$refs['ruleForm'].resetFields();
            }
        },
        mounted: function () {

        },
        watch:{
            isEditRelation:{//深度监听，可监听到对象、数组的变化
                handler(val, oldVal){
                    this.getMetaDirs()
                    if(val.id != -1){
                        this.ruleForm.id=val.id;
                        this.getDataById();
                    }
                },
                deep:true
            }
        }
    }
</script>

<style lang="scss">

</style>
