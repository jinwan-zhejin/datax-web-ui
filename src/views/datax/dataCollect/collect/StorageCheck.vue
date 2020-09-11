<template>
    <section class="storage-check">
        <el-row class="search-condition ar mb10">
            <el-input
                placeholder="搜索..."
                style="width: 180px"
                size="small"
                @keyup.enter.native="searchList"
                v-model="dataSourceName">
                <i slot="prefix" @click="searchList" style="cursor: pointer" class="el-input__icon el-icon-search"></i>
            </el-input>
        </el-row>
        <ul class="storage-check-list">
            <li :key="item.id" v-for="item in sourceList">
                <p class="check-header over" :title="item.taskName">{{item.taskName}}</p>
                <div class="check-body">
                    <span>{{item.dataSourceName}}</span><br/>
                </div>
                <!--<div class="check-footer">

                </div>-->
                <div class="check-set">
                    <span @click="checkTask(item.datasourceId)"><svg-icon iconClass="审核"></svg-icon></span>
                </div>
            </li>
        </ul>
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
        <el-dialog
            title="数据源入库审核"
            :visible.sync="dialogVisible"
            width="760px"
            @close="closeOuterModal"
            :before-close="handleClose">
            <el-dialog
                width="500px"
                title="审核"
                :visible.sync="innerVisible"
                @closed="closeInnerForm"
                @open="openInner"
                append-to-body>
                <el-row style="font-size: 12px">
                    <el-col :span="12" >新增表 : {{InnerForm.newMetadataNum}}</el-col>
                    <el-col :span="12" >删除表 ：{{InnerForm.deleteMetadataNum}}</el-col>
                </el-row>
                <el-form :model="InnerForm" ref="InnerForm" size="small" :rules="rules" label-width="70px" label-position="right">
                    <el-form-item label="审核结果">
                        <el-radio-group v-model="InnerForm.status" @change="changeRadio">
                            <el-radio label="1">审核通过</el-radio>
                            <el-radio label="2">驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="描述" prop="desc">
                        <el-input :rows="3" type="textarea" v-model="InnerForm.desc" ></el-input>
                    </el-form-item>
                    <p style="font-size: 12px;padding-left: 15px;"><i class="el-icon-warning"></i> {{InnerForm.warning}}</p>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="info" size="small" @click="closeInnerForm">取 消</el-button>
                    <el-button type="danger" size="small" @click="submitMetaForm('InnerForm')" :loading="buttonLoading">确 定</el-button>
                </span>
            </el-dialog>
            <el-table
                :data="gridData"
                stripe
                v-loading="loadingTable"
                height="320"
                style="width: 100%"
            >
                <el-table-column
                    prop="startTime"
                    label="采集时间"
                    :formatter="this.$utils.dateFormat"
                >
                </el-table-column>
                <el-table-column
                    prop="spent"
                    label="执行时长(s)">
                </el-table-column>
                <el-table-column
                    width="50"
                    label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="审核" placement="top">
                            <i class="table-icon-menu" @click="checkMetaData(scope.row.id)"><svg-icon iconClass="审核"></svg-icon></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="ar mt15"
                @current-change="handleCurrentChangeInner"
                :current-page="currentPageInner"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="totalInner">
            </el-pagination>
        </el-dialog>
    </section>
</template>

<script>
    import SvgIcon from "../../../../components/SvgIcon.vue";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        name: "",
        components: {
            ElCol,
            ElRow,
            SvgIcon},
        data() {
            return {
                currentPageInner:1,
                totalInner: 0,
                pageLengthInner:10,

                innerVisible:false,
                dialogVisible:false,
                dataSourceName:'',
                total: 0,
                currentPage: 1,
                pageLength:10,
                sourceList:[],
                InnerForm:{
                    sourceId:'',
                    collectHisId:'',
                    deleteMetadataNum:'',
                    newMetadataNum:'',
                    desc:'已通过',
                    status:'1',
                    warning:'审核通过后，系统以本次采集结果更新元数据库，历史采集未入库记录将失效。'
                },
                currId:'',
                loadingTable:false,
                gridData:[

                ],
                buttonLoading:false,
                rules: {
                    desc: [
                        { required: true, message: '请填写描述信息', trigger: 'change' },
                        { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        props:['StorageCheckTabTime'],
        methods: {
            changeRadio(cb){
                if(cb==1){
                    this.InnerForm.desc="已通过";
                    this.InnerForm.warning="审核通过后，系统以本次采集结果更新元数据库，历史采集未入库记录将失效。"
                }else{
                    this.InnerForm.desc="已驳回";
                    this.InnerForm.warning="驳回后，系统将放弃更新本次元数据变更信息。"
                }
            },
            openInner(){
                let param={
                    sourceId:this.InnerForm.sourceId,
                    collectHisId:this.InnerForm.collectHisId,
                };
                this.InnerForm.desc='已通过';
                this.InnerForm.status='1';
                this.$urlApi.metaData.compareData(param).then((res)=>{
                    this.InnerForm.newMetadataNum=res.data.newMetadataNum;
                    this.InnerForm.deleteMetadataNum=res.data.deleteMetadataNum;
                })
            },
            getCheckList(){
                let param={
                    start:(this.currentPage-1)*10,
                    length:this.pageLength,
                    taskName:this.dataSourceName
                };
                this.$urlApi.metaData.getcheckList(param).then((res)=>{
                    this.sourceList=res.data;
                    this.total=res.recordsFiltered
                })
            },
            handleSizeChange(cb){
                this.pageLength=cb;
                this.getCheckList()
            },
            handleCurrentChange(cb){
                this.currentPage = cb;
                this.getCheckList()
            },
            searchList(){
                this.getCheckList()
            },
            checkTask(id){
                this.dialogVisible=true;
                this.currId=id;
                this.InnerForm.sourceId=id;
                let params={
                    sourceId:this.currId,
                    start:(this.currentPageInner-1)*10,
                    length:this.pageLengthInner,
                };
                this.loadingTable=true;
                this.$urlApi.metaData.unreleaseCollecthis(params).then((res)=>{
                    this.loadingTable=false;
                    this.gridData=res.data;
                    this.totalInner=res.recordsFiltered;
                })
            },
            handleCurrentChangeInner(cb){
                this.currentPageInner = cb;
                this.loadingTable=true;
                let params={
                    sourceId:this.currId,
                    start:(this.currentPageInner-1)*10,
                    length:this.pageLengthInner,
                };
                this.$urlApi.metaData.unreleaseCollecthis(params).then((res)=>{
                    this.loadingTable=false;
                    this.gridData=res.data;
                    this.totalInner=res.recordsFiltered
                })
            },
            handleClose(){
                this.dialogVisible=false;
                this.innerVisible=false;
                this.gridData=[];
            },
            closeOuterModal(){
                this.getCheckList()
            },
            checkMetaData(collectHisId){
                this.innerVisible=true;
                this.InnerForm.collectHisId=collectHisId;
            },
            submitMetaForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.buttonLoading=true;
                        this.$urlApi.metaData.submitCompareCheck(this.InnerForm).then((res)=>{
                            this.buttonLoading=false;
                            this.$message({
                                message:'提交审核成功',
                                type:'success'
                            });
                            this.$refs['InnerForm'].resetFields();
                            this.InnerForm.newMetadataNum='';
                            this.InnerForm.deleteMetadataNum='';
                            this.innerVisible=false;
                        }).then((res)=>{
                            let params={
                                sourceId:this.currId,
                                start:(this.currentPageInner-1)*10,
                                length:this.pageLengthInner,
                            };
                            this.$urlApi.metaData.unreleaseCollecthis(params).then((res)=>{
                                this.gridData=res.data;
                                this.totalInner=res.recordsFiltered
                            })
                        });
                    } else {
                        return false;
                    }
                });
            },
            closeInnerForm(){
                this.$refs['InnerForm'].resetFields();
                this.InnerForm.newMetadataNum='';
                this.InnerForm.deleteMetadataNum='';
                this.innerVisible=false;
            }
        },
        mounted: function () {
            this.getCheckList();
        },
        watch:{
            StorageCheckTabTime(val, oldVal){
                this.getCheckList()
            }
        }
    }
</script>

<style lang="scss">
.storage-check{
    .el-dialog__body{padding-left: 20px;padding-right: 20px;padding-bottom: 40px}
    .storage-check-list{
        display: flex;
        justify-content: flex-start;
        flex-wrap:wrap;
        li{
            margin-right: 60px;
            overflow: hidden;
            margin-bottom: 30px;
            border: 1px solid #E1E5EC;
            text-align: center;
            width: 187px;
            box-shadow:0px 1px 4px 0px rgba(215,215,215,0.5);
            border-radius: 2px;
            position: relative;
            transition:linear 2s;; /* Safari and Chrome */
            .check-header{
                line-height: 32px;
                background: #ACB5C3;
                color: #ffffff;
                margin: 0;
            }
            .check-body{
                background: rgba(249,249,250,1);padding-top: 19px;box-sizing: border-box;padding-bottom: 16px;
                span{line-height: 28px;font-size: 16px;font-weight:bold;}
            }
            .check-set{
                position: absolute;
                width: 100%;
                height: 32px;
                background:rgba(51,55,67,.7);
                bottom: -32px;
                left: 0;
                cursor: pointer;
                box-sizing: border-box;
                transition: .5s;
                display: flex;
                justify-content: center;
                span{
                    width: 45px;
                    display: inline-block;
                    height: 100%;
                    font-size: 16px;
                    line-height: 32px;
                    text-align: center;
                    color: #ffffff;
                    &:hover{
                        background: rgba(255,255,255,.27);
                    }
                }
            }
            &:hover{
                .check-set{
                    bottom:0
                }
            }
        }

    }
}
.el-radio__label{font-size: 12px!important;}

</style>
