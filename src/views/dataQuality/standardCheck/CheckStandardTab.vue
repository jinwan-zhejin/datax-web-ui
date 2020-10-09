<template>
    <section class="check-standard-tab-section">
        <div class="search_list">
            <el-row >
                <el-col :span="24">
                    <span class="search_title">分类:</span>
                    <el-radio-group v-model="searchType" size="small" @change="changeStatus">
                        <el-radio-button label="">全部</el-radio-button>
                        <el-radio-button label="0">数据元</el-radio-button>
                        <el-radio-button label="1">数据集</el-radio-button>
                        <el-radio-button label="2">代码</el-radio-button>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-button size="mini" class="grey-btn" @click="sendAudit" :disabled="this.deleteSelection.length<=0">审核</el-button>
                    <div style="float: right">
                        <el-input v-model="searchName"  placeholder="请输入任务名称进行查询" style="width: 330px" size="mini">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <el-button type="danger" size="mini" @click="changeStatus">查询</el-button>
                    </div>

                </el-col>
            </el-row>
        </div>
        <el-row class="mt20">
            <el-table
                :data="tableData"
                stripe
                style="width: 100%;"
                @selection-change="changeFun"
            >
                <el-table-column
                    type="selection"
                    width="55"
                >
                </el-table-column>
                <el-table-column
                    prop="taskName"
                    label="任务名称"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <el-button type="text" @click="showDataSource(scope.row)">{{scope.row.taskName}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="所属类型"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==0">数据元</span>
                        <span v-if="scope.row.type==1">数据集</span>
                        <span v-if="scope.row.type==2">代码</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="submitter"
                    label="送审人"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="submitTime"
                    label="送审时间"
                    :formatter="this.$utils.dateFormat"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    label="状态"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <el-tag class="new-tag" v-if="scope.row.status==0">待审核</el-tag>
                        <el-tag class="success-tag" v-if="scope.row.status==1">通过</el-tag>
                        <el-tag class="error-tag" v-if="scope.row.status==2">退回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="审核" placement="top">
                            <i class="table-icon-menu" @click="updataAudit(scope.row)"><svg-icon iconClass="审核"></svg-icon></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="ar mt15"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20,30]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-row>
        <el-dialog
            width="500px"
            title="审核"
            :visible.sync="checkAuditVisible"
            :before-close="closeDialog"
            append-to-body>
            <el-form :model="checkAuditForm" :rules="rules" ref="checkAuditForm" size="small"  label-width="80px" label-position="right">
                <el-form-item label="审核结论" prop="status">
                    <el-radio-group v-model="checkAuditForm.status" @change="changeRadio">
                        <el-radio label="1">通过</el-radio>
                        <el-radio label="2">退回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述" prop="comment">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="checkAuditForm.comment">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" size="small" @click="closeDialog">取 消</el-button>
                <el-button type="danger" size="small" @click="submitAudit('checkAuditForm')">确 定</el-button>
            </span>
        </el-dialog>
        <add-update-meta :AddUpdateVisible="AddUpdateVisible" :isEditMeta="isEditMeta" @AddUpdateVisibleBack="AddUpdateVisibleBack"></add-update-meta>
        <add-or-update-data-set-dialog :isEditMeta="isEditSet" :addOrUpdateDataSetDialogVisible="addOrUpdateDataSetDialogVisible" @addOrUpdateDataSetDialogVisibleEvent="updateDialogStatus"></add-or-update-data-set-dialog>
        <add-edit-code :currNodeId="currNodeId" :AddEditCodeListVisible="AddEditCodeListVisible" :isEditCodeList="isEditCodeList" @editCodeListBack="editCodeListBack"></add-edit-code>
    </section>
</template>

<script>
    // import AddUpdateMeta from './dataMeta/AddUpdateMeta.vue'
    // import AddOrUpdateDataSetDialog from "./dataCollect/AddOrUpdateDataSetDialog"
    // import AddEditCode from './business/AddEditCode.vue'
	export default {
		name: "check-standard-tab",
        props:['checkStandardVisible'],
		components: {
            AddUpdateMeta,
            AddOrUpdateDataSetDialog,
            AddEditCode
        },
		data() {
            return {
                total: 0,
                currentPage: 1,
                pageLength:10,
                deleteSelection:[],
                currId:'',

                searchType: '',
                searchName:'',
                tableData: [],

                AddUpdateVisible:false,
                addOrUpdateDataSetDialogVisible:false,
                AddEditCodeListVisible:false,
                checkAuditVisible:false,
                checkAuditForm:{
                    ids:'',
                    status:'',
                    comment:''
                },
                rules: {
                    status: [
                        { required: true, message: '请填写审核结论', trigger: 'blur' },
                    ],
                    comment:[
                        { required: true, message: '请填写描述', trigger: 'change1' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                },
                isEditSet:{
                    id:'',
                    currTime:new Date().getTime(),
                    isHistory:false,
                },
                isEditMeta:{
                    id:'',
                    currTime:new Date().getTime(),
                    isHistory:false,
                },
                isEditCodeList:{
                    currTime:new Date().getTime(),
                    id:'',
                    isHistory:false,
                },
                currNodeId:'',
            }
		},
		methods: {
            getList(){
                let param={
                    start:(this.currentPage-1)*10,
                    length:this.pageLength,
                    type:this.searchType,
                    taskName:this.searchName,
                    status:'0'
                };
                this.$urlApi.dataStandard.standardAuditList(param).then((res)=>{
                    this.tableData=res.data;
                    this.total=res.recordsFiltered
                })
            },
            handleSizeChange(cb){
                this.pageLength=cb;
                this.getList()
            },
            handleCurrentChange(cb){
                this.currentPage = cb;
                this.getList()
            },
            changeFun(val){                                         //选择复选框
                this.deleteSelection=val;
                console.log(this.deleteSelection)
            },
            changeStatus(val){
                this.getList()
            },
            sendAudit(){
                this.checkAuditVisible=true;
            },
            updataAudit(row){
                this.currId=row.id;
                this.deleteSelection=[];
                this.deleteSelection.push({id:this.currId})
                this.checkAuditVisible=true;
            },
            changeRadio(val){
                if(val==1){
                    this.checkAuditForm.comment='通过'
                }else{
                    this.checkAuditForm.comment=''
                }
            },
            submitAudit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // this.checkAuditForm.ids=this.currId;
                        this.checkAuditForm.ids = this.deleteSelection.map(item => item.id).join();
                        this.$urlApi.dataStandard.updataAuditStatus(this.checkAuditForm).then((res)=>{
                            this.$message({
                                message:'操作成功',
                                type:'success'
                            });
                            this.$refs['checkAuditForm'].resetFields()
                            this.checkAuditVisible=false;
                            this.getList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            closeDialog(){
                this.$refs['checkAuditForm'].resetFields();
                this.checkAuditVisible=false;
            },
            AddUpdateVisibleBack(cb){
                this.AddUpdateVisible=false;
                this.isEditMeta.id="";
                this.isEditMeta.isHistory=false;
                this.getList();
            },
            updateDialogStatus(){
                this.addOrUpdateDataSetDialogVisible=false;
                this.isEditMeta.id="";
                this.isEditMeta.isHistory=false;
                this.getList();
            },
            editCodeListBack(){
                this.AddEditCodeListVisible=false;
                this.isEditCodeList.id="";
                this.isEditCodeList.isHistory=false;
                this.getList();
            },
            showDataSource(item){               //查看任务详情
                let tempDate = new Date().getTime();
                console.log(item.type)
                if(item.type == 0){
                    this.AddUpdateVisible=true;
                    this.isEditMeta.currTime=tempDate;
                    this.isEditMeta.isHistory=true;
                    this.isEditMeta.id=item.flowId;
                }else if(item.type == 1){
                    this.addOrUpdateDataSetDialogVisible=true;
                    this.isEditSet.currTime=tempDate;
                    this.isEditSet.isHistory=true;
                    this.isEditSet.id=item.flowId;
                }else if(item.type == 2){
                    this.AddEditCodeListVisible=true;
                    this.isEditCodeList.id=item.flowId;
                    this.isEditCodeList.isHistory=true;
                    this.isEditCodeList.currTime=tempDate;
                }


            }
        },
        mounted:function () {
            this.getList()
        },
        watch:{
            checkStandardVisible:function (val) {
                this.getList()
            }
        }
	}
</script>

<style lang="scss">
    .check-standard-tab-section {
        .search_list {
            margin-top: 10px;
            .search_title {
                display: inline-block;
                width: 60px;
                text-align: right;
                margin-right: 10px;
            }
            .el-radio-button__inner {
                border: 0;
            }
            .el-radio-button__orig-radio:checked + .el-radio-button__inner {
                color: #F67F89;
                border: 0;
                background: transparent;
                -webkit-box-shadow: none;
                -moz-box-shadow: none;
                -o-box-shadow: none;
                box-shadow: none;
            }
        }
    }
</style>
