<template>
  <div>
    <div v-for="(item, index) in AssociationArr" :key="index" class="ass-item">
      <el-select v-if="index === 0" v-model="item.tableName1" placeholder="请选择">
        <el-option
          v-for="item in $store.state.dataModel.pNodeData"
          :key="item.key"
          :label="item.tableName"
          :value="item.tableName"
        />
      </el-select>
      <span v-if="index === 0">-</span>
      <el-select v-model="item.joinRule" placeholder="请选择join规则">
        <el-option label="left join" value="left join" />
        <el-option label="right join" value="right join" />
        <el-option label="inner join" value="inner join" />
      </el-select>
      -
      <el-select v-model="item.tableName2" placeholder="请选择">
        <el-option
          v-for="item in $store.state.dataModel.pNodeData"
          :key="item.key"
          :label="item.tableName"
          :value="item.tableName"
        />
      </el-select>

      <el-select v-model="item.field1" placeholder="请选择字段">
        <el-option
          v-for="(ele, index) in fieldsObj[item.tableName1]"
          :key="index"
          :label="item.tableName1 + '.' +ele.name"
          :value="item.tableName1 + '.' +ele.name"
        />
      </el-select>

      <el-select v-model="item.field2" placeholder="请选择字段">
        <el-option
          v-for="(ele, index) in fieldsObj[item.tableName2]"
          :key="index"
          :label="item.tableName2 + '.' + ele.name"
          :value="item.tableName3 + '.' + ele.name"
        />
      </el-select>

      <el-button
        type="info"
        icon="el-icon-circle-plus-outline"
        circle
        @click="addAssociation(item)"
      />
      <el-button
        v-if="index !== 0"
        type="info"
        icon="el-icon-remove-outline"
        circle
        @click="removeAssociation(index)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Association',

  data() {
    return {
      value: '',
      joinRule: '',
      AssociationArr: [
        {
          tableName1: '',
          joinRule: '',
          tableName2: '',
          field1: '',
          field2: ''
        }
      ]
    };
  },

  computed: {
    fieldsObj() {
      return this.$store.getters.allFieldsMes;
    }
  },

  methods: {
    addAssociation(item) {
      // this.$store.commit('ADD_ELETOPNODEDATA',{tableName:item.generate});

      this.AssociationArr.push({
        tableName1: '',
        joinRule: '',
        tableName2: '',
        field1: '',
        field2: '',
        generate: ''
      });
    },

    removeAssociation(index) {
      this.AssociationArr.splice(index, 1);
    }
  }
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
