<template>
    <section class="document-manage-section main-outer">
        <el-row class="common-condition ar mb15"></el-row>
        <el-row class="main-inner-allSize">
            <el-col class="pt10 care-technical-left">
                <div class="tree-menu">
                    <el-input
                        placeholder="请输入目录名称"
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
                            ref="tree2"
                        >
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <el-col class="pt20 care-technical-right">
                <div class="box-operate pt0">
                    <el-row>
                        <el-button size="mini" @click="upLoad({id:currNodeId})" :disabled="currNodeId===''" class="grey-btn">新增</el-button>
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
                                prop="name"
                                label="文件名称"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                prop="type"
                                label="文件类型"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                prop="filePath"
                                label="文件路径"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="220">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" effect="dark"  content="下载" placement="top">
                                        <a :href="downLoadFile+'?id='+scope.row.id" class="table-icon-menu"><svg-icon iconClass="下载"></svg-icon></a>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="更新" placement="top">
                                        <i class="table-icon-menu" @click="upDateFile(scope.row.id)"><svg-icon iconClass="g-更新"></svg-icon></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                        <i class="table-icon-menu" @click="deleteList(scope.row.id)"><svg-icon iconClass="删除"></svg-icon></i>
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
            title="上传文件"
            :visible.sync="upLoaddialogVisible"
            width="50%"
            @close="closeModal"
            :before-close="handleClose"
            >
            <el-upload
                class="upload-demo"
                ref="upload"
                :action="upLoadUrl"
                :data="{delimiter:delimiter,id:currId}"
                :before-upload="beforeUpload"
                :on-success="successUpLoad"
                multiple
                accept="doc,docx,pdf"
                :limit="3"
                :auto-upload="false"
                :on-exceed="overLimit"
                :file-list="fileList"
                :on-change="handleChange"
            >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <!--<el-input style="width: 50px" size="small" v-model="delimiter" class="fr"></el-input>-->

                <div slot="tip" class="el-upload__tip">只能上传doc,docx,pdf文件</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="upLoaddialogVisible = false"  type="info" size="small">关 闭</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="更新文件"
            :visible.sync="upDatedialogVisible"
            width="50%"
            @close="closeModalUpdate"
            :before-close="handleCloseUpdate">
            <el-upload
                class="upload-demo0"
                ref="upload0"
                :action="updateUrl"
                :data="{id:currListId}"
                :before-upload="beforeUpDateFile"
                :on-success="successUpLoadUpDateFile"
                multiple
                accept="doc,docx,pdf"
                :limit="1"
                :auto-upload="false"
                :on-exceed="overLimitUpDateFile"
                :file-list="fileListUpdate"
            >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpdate">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传doc,docx,pdf文件</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="upDatedialogVisible = false"  type="info" size="small">关 闭</el-button>
            </span>
        </el-dialog>
        <add-edit-code :currNodeId="currNodeId" :AddEditCodeListVisible="AddEditCodeListVisible" :isEditCodeList="isEditCodeList" @editCodeListBack="editCodeListBack"></add-edit-code>
        <add-catalog :addCatalogVisible="addCatalogVisible" :isEditCatalog="isEditCatalog" @addCatalogBack="addCatalogBack"></add-catalog>
    </section>
</template>

<script type="text/jsx">
    import AddCatalog from './document/AddCatalog.vue'
    import AddEditCode from './document/AddEditCode.vue'
    // import ElRow from "element-ui/packages/row/src/row";
    export default {
        name: "business-glossary",
        components: {
            ElRow,
            AddCatalog,AddEditCode
        },
        data() {
            return {
                upLoaddialogVisible:false,
                upDatedialogVisible:false,
                downLoadFile:'',
                upLoadUrl:'',
                fileList:[],
                upNum:0,

                updateUrl:'',
                fileListUpdate:[],
                currListId:'',

                treeName:'',
                currNodeId:'',
                addCatalogVisible:false,
                AddEditCodeListVisible:false,
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
                    code:''
                },
                total: 0,
                currentPage: 1,
                pageLength:10,

                currId:'',
                deleteSelection:[],
                tableData: [],
                nodeList: [],
                delimiter:',',
                delimiterUpdate:',',
                defaultProps: {
                    id: 'id',
                    label: 'name',
                    children: 'children',
                    parent: 'parentId'
                },
            }
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            getLayerMenu(){
                // this.$urlApi.dataStandard.getMenuDocumentContent().then((res)=>{
                //     this.nodeList=res.data
                // })
            },
            getData(){
                let param={
                    id:this.currNodeId,
                    start:(this.currentPage-1)*10,
                    length:this.pageLength,
                };
                // this.$urlApi.dataStandard.getDocumentFile(param).then((res)=>{
                //     this.tableData=res.data;
                //     this.total=res.recordsFiltered
                // })
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
            deleteList(id){
                this.$confirm('确认要删除吗', '系统消息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'cancelButton',
                    confirmButtonClass:'confirmButton',
                }).then(() => {
                    // this.$urlApi.dataStandard.deleteDocumentFile({id:id}).then((res)=>{
                    //     this.getData()
                    //     this.$message({
                    //         type: 'success',
                    //         message: '删除成功'
                    //     });
                    // });
                }).catch(() => {});
            },
            renderContent(h, {node, data, store}) {
                let nodeItemContent=        //第二级
                    <span class="nodeItem" title={ node.label}>
                    <span>
                        <span class="node-label"><span class="node-icon"><svg-icon iconClass="文件夹"></svg-icon></span>{ node.label }</span>
                        <span class="nodeOptDetail">
                            <el-tooltip class="item" effect="dark" content="新增下级目录" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.addNewLayer(data, node, h) }><svg-icon iconClass="g-添加"></svg-icon></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="上传" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.upLoad(data, node, h) }><svg-icon iconClass="上传"></svg-icon></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.deleteLayer(data, node, h) }><svg-icon iconClass="删除"></svg-icon></el-button>
                            </el-tooltip>
                        </span>
                    </span>
                </span>;
                let nodeFieldItem =              //第一级
                    <span class="nodeItem" title={ node.label}>
                    <span>
                        <span class="node-label"><span class="node-icon"><svg-icon iconClass="文件夹"></svg-icon></span>{ node.label }</span>
                        <span class="nodeOptDetail">
                            <el-tooltip class="item" effect="dark" content="上传" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.upLoad(data, node, h) }><svg-icon iconClass="上传"></svg-icon></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button type="text" size="mini" on-click={ () => this.deleteLayer(data, node, h) }><svg-icon iconClass="删除"></svg-icon></el-button>
                            </el-tooltip>
                        </span>
                    </span>
                </span>;
                if(node.level>3){
                    return nodeFieldItem;
                }else{
                    return nodeItemContent;
                }
            },
            nodeClick: function (nodeObj, node, obj) {
                this.currNodeId=nodeObj.id;
                this.getData()
            },
            addNewLayer(data, node, h){
                this.addCatalogVisible=true;
                this.isEditCatalog.id=data.id;
                this.isEditCatalog.currTime=new Date().getTime();
                this.isEditCatalog.pid=data.parentId;
                this.isEditCatalog.isCodeset=data.isCodeset;
                this.isEditCatalog.isEdit=false
            },
            deleteLayer(data, node, h){
                this.$confirm('确认要删除吗', '系统消息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'cancelButton',
                    confirmButtonClass:'confirmButton',
                }).then(() => {
                    // this.$urlApi.dataStandard.deleteDocumentFolder({id:data.id}).then((res)=>{
                    //     this.$message({
                    //         type: 'success',
                    //         message: '删除成功'
                    //     });
                    //     this.getLayerMenu()
                    // });

                }).catch(() => {});
            },
            addCatalogBack(){
                this.addCatalogVisible=false;
                this.getLayerMenu()
            },
            editCodeListBack(){
                this.AddEditCodeListVisible=false;
                this.getData();
            },
            upLoad(data){
                this.currId=data.id;
                this.currNodeId=data.id;
                this.upLoaddialogVisible=true
            },
            beforeUpload(file){
                let testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
                const extension = testmsg === 'docx';
                const extension1 = testmsg === 'doc';
                const extension2 = testmsg === 'pdf';
                if(!extension && !extension1 && !extension2) {
                    this.$message({
                        message: '上传文件只能是doc,docx,pdf格式!',
                        type: 'warning'
                    });
                    return false
                }else{
                    return true
                }
            },
            handleChange(file, fileList){
                this.fileList=fileList
            },
            overLimit(files, fileList){
                this.$message({
                    "message":'最多上传3个文件',
                    'type':'warning'
                })
            },
            successUpLoad(response, file, fileList){
                //this.fileList=fileList;
                this.upNum++;
                if(response.code==='506'){
                    this.$message({
                        message:response.message,
                        type:'error'
                    });
                    this.fileList=[];
                }else{
                    if(this.upNum === this.fileList.length){
                        this.$message({
                            message:'上传成功',
                            type:'success'
                        });
                        this.upLoaddialogVisible=false;
                    }
                }
                //this.$refs.upload.clearFiles()
            },
            submitUpload() {     //导入sql
                this.$refs.upload.submit();
            },
            handleClose(){
                this.upLoaddialogVisible=false;
                this.fileList=[];
            },
            closeModal(){
                this.fileList=[];
                this.upNum = 0;
                this.getData()
            },
            upDateFile(id){
                this.upDatedialogVisible=true;
                this.currListId=id;
            },
            beforeUpDateFile(file){
                let testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
                const extension = testmsg === 'docx';
                const extension1 = testmsg === 'doc';
                const extension2 = testmsg === 'pdf';
                if(!extension && !extension1 && !extension2) {
                    this.$message({
                        message: '上传文件只能是doc,docx,pdf格式!',
                        type: 'warning'
                    });
                    return false
                }else{
                    return true
                }
            },
            overLimitUpDateFile(files, fileList){
                this.$message({
                    "message":'更新时，只能上传与文档名称相同的文档',
                    'type':'warning'
                })
            },
            successUpLoadUpDateFile(response, file, fileList){
                if(response.code==="200"){
                    this.fileListUpdate=fileList;
                    this.$message({
                        message:'上传成功',
                        type:'success'
                    });
                    this.upDatedialogVisible=false;
                }else{
                    this.$message({
                        message:response.message,
                        type:'error'
                    });
                }
            },
            submitUpdate() {     //导入sql
                //this.$refs.upload0.submit();
                this.$refs['upload0'].submit();
            },
            closeModalUpdate(){
                this.fileListUpdate=[];
                this.getData();
            },
            handleCloseUpdate(){
                this.upDatedialogVisible=false;
                this.fileListUpdate=[];
                this.getData()
            },
        },
        mounted:function () {
            // this.upLoadUrl=this.$urlApi.dataStandard.uploadFile();
            // this.updateUrl=this.$urlApi.dataStandard.updateFile();
            // this.downLoadFile=this.$urlApi.dataStandard.downLoadFile()
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
    .document-manage-section {
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
                        height:-moz-calc(100% - 70px);
                        height:-webkit-calc(100% - 70px);
                        height: calc(100% - 70px);
                    }
                }
            }
        }
    }

</style>
