<template>
    <section class="collect-list">
        <el-row class="search-condition ar mb10">
            <el-input
                placeholder="搜索..."
                style="width: 180px"
                size="small"
                @keyup.enter.native="searchList"
                v-model="dataSourceName">
                <i slot="prefix" @click="searchList" style="cursor: pointer" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button size="small" class="ml10" type="danger" @click="addCollect(-1)">新增采集</el-button>
            <!--<el-button size="small" type="info" @click="deleteCollect('s',1)" :disabled="this.deleteSelection.length<=0">删除</el-button>-->
        </el-row>
        <el-table
            :data="sourceList"
            stripe
            style="width: 100%"
        >
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="taskName"
                :show-overflow-tooltip="true"
                label="任务名称">
            </el-table-column>
            <el-table-column
                label="数据源名称">
                <template slot-scope="scope">
                    <p v-if="scope.row.deleteFlag==='2'" style="color: #e52100">{{scope.row.dataSourceName}}(已删除)</p>
                    <p v-if="scope.row.deleteFlag==='0'">{{scope.row.dataSourceName}}</p>
                </template>
            </el-table-column>
            <el-table-column
                prop="sourceType"
                label="数据库类型">
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间"
                :formatter="this.$utils.dateFormat"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                width="170">
                <template slot-scope="scope">
                    <!--<el-tooltip class="item" effect="dark" content="提交" placement="top">
                        <i class="table-icon-menu" @click="testAlert(scope.row.id)"><svg-icon iconClass="g-执行"></svg-icon></i>
                    </el-tooltip>-->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="scope.row.deleteFlag==='0'">
                        <i class="table-icon-menu" @click="addCollect(scope.row.id)"> <svg-icon iconClass="编辑1"></svg-icon></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <i class="table-icon-menu" @click="deleteCollect(scope.row.id)"><svg-icon iconClass="删除"></svg-icon></i>
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
        <add-update-collect :editCollectVisible="editCollectVisible" :isEditRelation="isEditRelation" @editCollectBack="editCollectBack"></add-update-collect>
    </section>
</template>
<script>
    import AddUpdateCollect from './AddUpdateCollect.vue'
    export default {
        name: "",
        props:['CollectListTabTime'],
        components: {AddUpdateCollect},
        data() {
            return {
                total: 0,
                currentPage: 1,
                pageLength:10,
                deleteSelection:[],
                isEdit:false,
                isEditRelation:{
                    currTime:new Date().getTime(),
                    id:'',
                },
                editCollectVisible:false,
                dataSourceName:'',
                sourceList:[],
            }
        },
        methods: {
            getList(){
                let param={
                    start:(this.currentPage-1)*10,
                    length:this.pageLength,
                    taskName:this.dataSourceName
                };
                this.$urlApi.metaData.getCollectList(param).then((res)=>{
                    this.sourceList=res.data;
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
            },
            testAlert(id){
                this.$confirm('是否提交采集任务?', '提交任务', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass:'cancelButton',
                    confirmButtonClass:'confirmButton',
                    type: 'warning',
                }).then(() => {
                    this.$urlApi.metaData.submitTask({taskId:id}).then((res)=>{
                        this.$message({
                            type: 'success',
                            message: '提交成功!'
                        });
                        this.getList()
                    })
                }).catch(() => {});
            },
            addCollect(num){   //添加
                let tempDate = new Date().getTime();
                this.editCollectVisible=true;
                this.isEditRelation.id=num;
                this.isEditRelation.currTime=tempDate;
            },
            deleteCollect(id){            //删除
               // let ids = this.deleteSelection.map(item => item.id).join();
                this.$confirm('确认要删除吗', '系统消息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'cancelButton',
                    confirmButtonClass:'confirmButton',
                }).then(() => {
                    this.$urlApi.metaData.deleteCollect({id:id}).then((res)=>{
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    });
                }).catch(() => {});
            },
            searchList(){
                this.getList();
            },
            editCollectBack(cb){
                this.editCollectVisible=false;
                this.isEditRelation.id=-1;
                if(cb===1){
                    this.getList();
                }
            },
        },
        mounted: function () {
            this.getList()
        },
        watch:{
            CollectListTabTime(val, oldVal){
                this.getList()
            }
        }
    }
</script>

<style lang="scss">

</style>
