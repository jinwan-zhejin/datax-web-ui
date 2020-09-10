<template>
    <section class="business-glossary-section main-outer">
        <el-row class="common-condition ar mb15"></el-row>
        <el-row class="main-inner-allSize">
            <el-col class="pt10 care-technical-left">
                <div class="tree-menu">
                    <el-input
                        placeholder="请输入名称"
                        class="search-input mb10"
                        size="small"
                        v-model="treeName">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <div class="tree-c mb10">
                        <el-tooltip class="item" effect="dark" content="新建目录" placement="top">
                            <span class="tree-t-set" @click="addNewLayer(-1)"><svg-icon iconClass="文件"></svg-icon></span>
                        </el-tooltip>
                    </div>
                    <div class="tree-b">
                        <el-tree
                            :data="nodeList"
                            empty-text="节点为空"
                            default-expand-all
                            :highlight-current="true"
                            :expand-on-click-node="false"
                            :props="defaultProps"
                            :render-content="renderContent"
                            @node-click="nodeClick"
                            :filter-node-method="filterNode"
                            :indent="9"
                            ref="tree2"
                        >
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <el-col class="pt20 care-technical-right">
                <div class="box-operate pt0">
                    <el-form size="small"  label-width="100px" label-position="right">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="代码集名称：" >
                                <el-input v-model="codeSetName" style="float: left" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="编码规则：" >
                                <el-input v-model="codeSetRule" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item
                                    label="状态："
                                >
                                    <el-select
                                        v-model="status"
                                        placeholder="请选择数据状态"
                                        :disabled="!statusList.length"
                                        @change="changeDataStatus"
                                    >
                                        <el-option
                                            v-for="item in statusList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-row>
                        <el-button size="mini" @click="addNewMeta({status:-1})" :disabled="currNodeId===''" class="grey-btn">新建</el-button>
                        <el-button size="mini" class="grey-btn" @click="sendAudit" :disabled="this.deleteSelection.length<=0">送审</el-button>
                        <el-button size="mini" @click="deleteList" :disabled="this.deleteSelection.length<=0" class="red-btn">删除</el-button>
                    </el-row>
                    <el-row class="box-operate-b">
                        <el-table
                            :data="tableData"
                            stripe
                            height="100%"
                            @selection-change="changeFun"
                            style="width: 100%;"
                            >
                            <el-table-column
                                type="selection"
                                width="55"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="code"
                                label="代码"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="代码名称"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                label="状态"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <el-tag class="new-tag" v-if="scope.row.status==0">草稿</el-tag>
                                    <el-tag class="going-tag" v-if="scope.row.status==1">待审核</el-tag>
                                    <el-tag class="success-tag" v-if="scope.row.status==2">已审核</el-tag>
                                    <el-tag class="error-tag" v-if="scope.row.status==3">变更中</el-tag>
                                    <el-tag class="quit-tag" v-if="scope.row.status==4">已退回</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="220">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" v-if="scope.row.status==0 || scope.row.status==3 || scope.row.status==4" effect="dark"  content="编辑" placement="top">
                                        <i class="table-icon-menu" @click="addNewMeta(scope.row)"><svg-icon iconClass="编辑1"></svg-icon></i>
                                    </el-tooltip>
                                    <el-tooltip v-if="scope.row.status==0 || scope.row.status==3 || scope.row.status==4 " class="item" effect="dark" content="删除" placement="top">
                                        <i class="table-icon-menu" @click="deleteList(scope.row.id,0)"><svg-icon iconClass="删除"></svg-icon></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" v-if="scope.row.status==2" effect="dark" content="变更" placement="top">
                                        <i class="table-icon-menu" @click="changeStatus(scope.row.id)"><svg-icon iconClass="g-更新"></svg-icon></i>
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
                </div>
            </el-col>
        </el-row>
        <el-dialog
            width="500px"
            title="变更"
            :visible.sync="addChangeVisible"
            :before-close="closeChangeModal"
            append-to-body>
            <el-form :model="changeForm" :rules="rules" ref="addLayerForm" size="small"  label-width="80px" label-position="right">
                <el-form-item label="变更原因" prop="changeInfo">
                    <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="changeForm.changeInfo">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" size="small" @click="closeChangeModal">取 消</el-button>
                <el-button type="danger" size="small" @click="submitChange('addLayerForm')">确 定</el-button>
            </span>
        </el-dialog>
        <add-edit-code :currNodeId="currNodeId" :AddEditCodeListVisible="AddEditCodeListVisible" :isEditCodeList="isEditCodeList" @editCodeListBack="editCodeListBack"></add-edit-code>
        <add-catalog :addCatalogVisible="addCatalogVisible" :isEditCatalog="isEditCatalog" @addCatalogBack="addCatalogBack"></add-catalog>
        <add-code-set :addCodeSetVisible="addCodeSetVisible" :isEditCodeSet="isEditCodeSet" @addCodeSetBack="addCodeSetBack"></add-code-set>
    </section>
</template>

<script type="text/jsx">
    import AddCatalog from './business/AddCatalog.vue'
    import AddCodeSet from './business/AddCodeSet.vue'
    import AddEditCode from './business/AddEditCode.vue'
	export default {
		name: "business-glossary",
		components: {
            AddCatalog,AddCodeSet,AddEditCode
        },
		data() {
			return {
                rules: {
                    changeInfo:[
                        { required: true, message: '请填写变更原因', trigger: 'blur' },
                        { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
                    ],
                },
                changeForm:{
                    id:'',
                    changeInfo:''
                },
                status:'',
                treeName:'',
                currNodeId:'',
                codeSetName:'',
                codeSetRule:'',
                addCatalogVisible:false,
                addCodeSetVisible:false,
                AddEditCodeListVisible:false,
                addChangeVisible:false,   //变更
                isEditCodeList:{
                    currTime:new Date().getTime(),
                    id:'',
                    codesetId:'',
                },
                isEditCatalog:{
                    currTime:new Date().getTime(),
                    id:'',
                    pid:'',
                    isCodeset:'1',
                    isEdit:false,
                    name:'',
                    code:'',
                    explanation:''
                },
                isEditCodeSet:{
                    currTime:new Date().getTime(),
                    id:'',
                    pid:'',
                    isCodeset:'0',
                    isEdit:false,
                    name:'',
                    code:''
                },
                total: 0,
                currentPage: 1,
                pageLength:10,

                deleteSelection:[],
                tableData: [],
                nodeList: [],
                defaultProps: {
                    id: 'id',
                    label: 'name',
                    children: 'children',
                    parent: 'parentId'
                },
                statusList: [
                    {
                        value: '',
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '草稿'
                    },
                    {
                        value: 1,
                        label: '待审核'
                    },
                    {
                        value: 2,
                        label: '已审核'
                    },
                    {
                        value: 3,
                        label: '变更中'
                    },
                    {
                        value:4,
                        label:'已退回'
                    }
                ],
            }
		},
		methods: {
            closeChangeModal(){
                this.changeForm.changeInfo='';
                this.addChangeVisible=false
            },
            changeStatus(id){             //设置变更
                this.addChangeVisible=true;
                this.changeForm.id=id;
            },
            submitChange(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$urlApi.dataStandard.changeCode(this.changeForm).then((res)=>{
                            this.addChangeVisible=false;
                            this.closeChangeModal();
                            this.$message({
                                message:'操作成功',
                                type:'success'
                            });
                            this.getData();
                        })
                    } else {
                        return false;
                    }
                });

            },
            changeDataStatus(val){
                this.getData()
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            getLayerMenu(){
                this.$urlApi.dataStandard.getCodeSet().then((res)=>{
                    this.nodeList=res.data
                })
            },
            getData(){
                let param={
                    id:this.currNodeId,
                    status:this.status,
                    start:(this.currentPage-1)*10,
                    length:this.pageLength,
                };
                this.$urlApi.dataStandard.getCodesFromSet(param).then((res)=>{
                    this.tableData=res.data;
                    this.total=res.recordsFiltered;
                })
            },
            getCodeSetData(){
                this.$urlApi.dataStandard.getCodeSetById({'id':this.currNodeId}).then((res)=>{
                    this.codeSetName=res.data.name;
                    this.codeSetRule=res.data.codeRule;
                })
            },
            changeFun(val){
                this.deleteSelection=val
            },
            handleSizeChange(cb){
                this.pageLength=cb;
                this.getData()
            },
            handleCurrentChange(cb){
                this.currentPage = cb;
                this.getData()
            },
            addNewMeta(row){
                if(row.status=='0' || row.status=='3' || row.status=='4'){
                    this.isEditCodeList.id=row.id;
                    this.isEditCodeList.name=row.name;
                    this.isEditCodeList.code=row.code;
                    this.isEditCodeList.currTime=new Date().getTime();
                    this.AddEditCodeListVisible=true;
                }else if(row.status==-1){
                    this.AddEditCodeListVisible=true;
                    this.isEditCodeList.id=null;
                }else{
                    this.$message({
                        message:'只有草稿、变更中、已退回状态才能修改',
                        type:'warning',
                        duration:'1500',
                    })
                }
            },
            sendAudit(){
                let statusArr = this.deleteSelection.map(item => item.status).join();
                if(statusArr.indexOf('1')!==-1 || statusArr.indexOf('2')!==-1 || statusArr.indexOf('4')!==-1){
                    this.$message({
                        type: 'warning',
                        message: '只有草稿和变更中状态下的代码可以送审'
                    });
                    return
                }
                let ids = this.deleteSelection.map(item => item.id).join();
                this.$confirm('确认要送审吗', '系统消息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'cancelButton',
                    confirmButtonClass:'confirmButton',
                }).then(() => {
                    this.$urlApi.dataStandard.codeSetsendAudit({ids:ids}).then((res)=>{
                        this.getData()
                        this.$message({
                            type: 'success',
                            message: '送审成功'
                        });
                    });
                }).catch(() => {});
            },
            deleteList(id,num){
                let statusArr = this.deleteSelection.map(item => item.status).join();
                if(statusArr.indexOf('1')!==-1 || statusArr.indexOf('2')!==-1){
                    this.$message({
                        type: 'warning',
                        message: '只有草稿、变更中及已退回的代码可以删除！'
                    });
                    return
                }
                let ids;
                if(num===0){
                    ids=id
                }else{
                    ids = this.deleteSelection.map(item => item.id).join();
                }
                this.$confirm('确认要删除吗', '系统消息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'cancelButton',
                    confirmButtonClass:'confirmButton',
                }).then(() => {
                    this.$urlApi.dataStandard.deleteCodes({ids:ids}).then((res)=>{
                        this.getData()
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    });
                }).catch(() => {});
            },
            renderContent(h, {node, data, store}) {
                let nodeItemContent=        //第二级
                    <span class="nodeItem" title={node.label}>
                    <span>
                        <span class="node-label"><span class="node-icon"><svg-icon iconClass="文件夹"></svg-icon></span>{ node.label }</span>
                        <span class="nodeOptDetail">
                            <el-tooltip class="item" effect="dark" content="新增下级目录" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.addNewLayer(data, node, h) }><svg-icon iconClass="g-添加"></svg-icon></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="新增代码集" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.addNewCodeSet(data, node, h) }><svg-icon iconClass="g-新建"></svg-icon></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.editLayer(data, node, h) }><svg-icon iconClass="编辑1"></svg-icon></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.deleteLayer(data, node, h) }><svg-icon iconClass="删除"></svg-icon></el-button>
                            </el-tooltip>
                        </span>
                    </span>
                </span>;
                let nodeFieldItem =              //第一级
                    <span class="nodeItem" title={node.label}>
                    <span>
                        <span class="node-label">{node.label}</span>
                         <span class="nodeOptDetail">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                              <el-button type="text" size="mini" on-click={ () => this.deleteLayer(data, node, h) }><svg-icon iconClass="删除"></svg-icon></el-button>
                            </el-tooltip>
                        </span>
                    </span>
                </span>;
                let nodeItem=        //第4级
                    <span class="nodeItem" title={node.label}>
                    <span>
                        <span class="node-label"><span class="node-icon"><svg-icon iconClass="文件夹"></svg-icon></span>{ node.label }</span>
                        <span class="nodeOptDetail">
                            <el-tooltip class="item" effect="dark" content="新增代码集" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.addNewCodeSet(data, node, h) }><svg-icon iconClass="g-新建"></svg-icon></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.editLayer(data, node, h) }><svg-icon iconClass="编辑1"></svg-icon></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.deleteLayer(data, node, h) }><svg-icon iconClass="删除"></svg-icon></el-button>
                            </el-tooltip>
                        </span>
                    </span>
                </span>;
                if(data.isCodeset==='0'){
                    return nodeFieldItem;
                }else if(node.level===4){
                    return nodeItem;
                }else{
                    return nodeItemContent;
                }
            },
            nodeClick: function (nodeObj, node, obj) {
                if(nodeObj.isCodeset==='0'){
                    this.currNodeId=nodeObj.id;
                    this.getCodeSetData();
                    this.getData();
                }else{
                    this.currNodeId='';
                }
            },
            addNewCodeSet(data, node, h){
                this.addCodeSetVisible=true;
                this.isEditCodeSet.id=data.id;
                this.isEditCodeSet.currTime=new Date().getTime();
                this.isEditCodeSet.pid=data.parentId;
                this.isEditCodeSet.isCodeset=data.isCodeset;
                this.isEditCodeSet.isEdit=false
            },
            addNewLayer(data, node, h){
                this.addCatalogVisible=true;
                this.isEditCatalog.id=data.id;
                this.isEditCatalog.currTime=new Date().getTime();
                this.isEditCatalog.pid=data.parentId;
                this.isEditCatalog.isCodeset=data.isCodeset;
                this.isEditCatalog.isEdit=false
            },
            editLayer(data, node, h){
                this.addCatalogVisible=true;
                this.isEditCatalog.id=data.id;
                this.isEditCatalog.name=data.name;
                this.isEditCatalog.code=data.code;
                this.isEditCatalog.currTime=new Date().getTime();
                this.isEditCatalog.pid=data.parentId;
                this.isEditCatalog.isCodeset=data.isCodeset;
                this.isEditCatalog.isEdit=true
                this.isEditCatalog.explanation=data.explanation;
            },
            deleteLayer(data, node, h){
                this.$confirm('确认要删除吗', '系统消息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'cancelButton',
                    confirmButtonClass:'confirmButton',
                }).then(() => {
                    this.$urlApi.dataStandard.deleteCodeSets({id:data.id}).then((res)=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.getLayerMenu()
                    });

                }).catch(() => {});
            },
            addCatalogBack(){
                this.addCatalogVisible=false;
                this.getLayerMenu()
            },
            addCodeSetBack(){
                this.addCodeSetVisible=false
                this.getLayerMenu()
            },
            editCodeListBack(){
                this.AddEditCodeListVisible=false;
                this.getData();
            }
        },
        mounted:function () {
            this.getLayerMenu()
        },
        watch: {
            treeName(val) {
                this.$refs.tree2.filter(val);
            }
        },
	}
</script>

<style lang="scss">
    .business-glossary-section {
        .main-inner-allSize{
            display: flex;
            min-width: 0;
            .care-technical-left{
                width: 215px;
                padding-right: 15px;
                height: 100%;
                .tree-menu{
                    height: 100%;
                    background: rgba(245,247,250,1);
                    padding: 15px 17px;
                    box-sizing: border-box;
                    .tree-c{
                        display: flex;
                        justify-content: flex-start;
                        .tree-t-set{
                            width: 28px;
                            height: 26px;
                            display: block;
                            border-radius:2px;
                            border:1px solid #E1E5EC;
                            margin-right: 7px;
                            cursor: pointer;
                            background:rgba(240,241,244,1);
                            font-size: 14px;
                            line-height: 26px;
                            text-align: center;
                        }
                    }
                    .tree-b{
                        height:-moz-calc(100% - 72px);
                        height:-webkit-calc(100% - 72px);
                        height: calc(100% - 72px);
                        overflow: auto;
                        .el-tree{
                            .el-tree-node__content{
                                position: relative;
                                .nodeItem {
                                    width: 80%;
                               /*     position: relative;*/
                                    .node-label {
                                        display: inline-block;
                                        width: 100%;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        .node-icon{
                                            margin-right: 5px;
                                            font-size: 14px;
                                        }
                                    }
                                    .node-label:hover {
                                        display: inline-block;
                                    }
                                    .nodeOpt {
                                        display: none!important;
                                        float: right;
                                        position: relative;
                                        top: -2px;
                                        font-size: 14px;
                                        font-weight: bold;
                                    }
                                    .nodeOptDetail {
                                        display: none;
                                        position: absolute;
                                        right: 0;
                                        top: 0px;
                                        height: 26px;
                                        line-height: 26px;
                                        font-size: 14px;
                                        background:rgba(51,55,67,.7);
                                        border-radius: 2px;
                                        cursor: default;
                                        padding: 0 8px;
                                        .el-button{
                                            color: #ffffff;
                                        }
                                    }
                                }
                                .nodeItem:hover .nodeOptDetail {
                                    display: inline-block!important;
                                    text-align: right;
                                }
                            }

                        }

                    }
                }
            }
            .care-technical-right{
                flex: 1;
                min-width: 0;
                .box-operate{
                    height: 100%;
                    .box-operate-b{
                        height:-moz-calc(100% - 180px);
                        height:-webkit-calc(100% - 180px);
                        height: calc(100% - 180px);
                    }
                }
            }
        }
    }
</style>
