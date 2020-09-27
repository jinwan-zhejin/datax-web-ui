<template>
  <div>
    <div class="ass-item" v-for="(item, index) in AssociationArr" :key="index">
      <el-select v-model="item.tableName1" placeholder="请选择">
        <el-option
          v-for="item in $store.state.dataModel.pNodeData"
          :key="item.key"
          :label="item.tableName"
          :value="item.tableName"
        >
        </el-option>
      </el-select>
      -
      <el-select v-model="item.joinRule" placeholder="请选择join规则">
        <el-option label="left join" value="left join"></el-option>
        <el-option label="right join" value="right join"></el-option>
        <el-option label="inner join" value="inner join"></el-option>
      </el-select>
      -
      <el-select v-model="item.tableName2" placeholder="请选择">
        <el-option
          v-for="item in $store.state.dataModel.pNodeData"
          :key="item.key"
          :label="item.tableName"
          :value="item.tableName"
        >
        </el-option>
      </el-select>

      <el-select v-model="item.field1" placeholder="请选择字段">
        <el-option
          v-for="(item, index) in fieldsObj[item.tableName1]"
          :key="index"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>

      <el-select v-model="item.field2" placeholder="请选择字段">
        <el-option
          v-for="(item, index) in fieldsObj[item.tableName2]"
          :key="index"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>
      <div class="ass-input">
        <el-input
          placeholder="请输入生成内容"
          v-model="item.generate"
        ></el-input>
      </div>

      <el-button
        @click="addAssociation(item)"
        type="info"
        icon="el-icon-circle-plus-outline"
        circle
      ></el-button>
      <el-button
        v-if="index !== 0"
        @click="removeAssociation(index)"
        type="info"
        icon="el-icon-remove-outline"
        circle
      ></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Association",

  data() {
    return {
      value: "",
      joinRule: "",
      AssociationArr: [
        {
          tableName1: "",
          joinRule: "",
          tableName2: "",
          field1: "",
          field2: "",
          generate: "",
        },
      ],
    };
  },

  methods: {
    addAssociation(item) {
      if (!item.generate) {
        this.$message.error("请输入生成的表名");
        return;
      }
      this.$store.commit('ADD_ELETOPNODEDATA',{tableName:item.generate,key:item.generate});

      this.AssociationArr.push({
        tableName1: "",
        joinRule: "",
        tableName2: "",
        field1: "",
        field2: "",
        generate: "",
      });
    },

    removeAssociation(index) {
      this.AssociationArr.splice(index, 1);
    },
  },

  computed: {
    fieldsObj() {
      return this.$store.getters.allFieldsMes;
    },
  },
};
</script>

<style scoped>
.ass-item {
  margin: 5px;
  /* display: flex; */
}
.ass-item >>> .el-input__inner {
  width: 140px;
}

.ass-input {
  width: 150px;
  display: inline-block;
}
</style>