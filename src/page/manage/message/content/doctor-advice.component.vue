<template>
  <el-table
    :data="adviceData">
    <el-table-column
      prop="pathology_id"
      label="病理号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="specimen_type"
      label="标本类型"
      align="center" v-if="caseType==='细胞'">
    </el-table-column>
    <el-table-column
      prop="specimen_name"
      label="标本名称"
      align="center">
    </el-table-column>
    <el-table-column
      prop="paraffin_block_id"
      label="蜡块号"
      align="center" v-if="caseType!=='细胞'">
    </el-table-column>
    <el-table-column
      prop="status"
      label="当前所处状态"
      align="center" v-if="type!=='technical'">
    </el-table-column>
    <el-table-column
      prop="special_type"
      label="医嘱类型"
      align="center" v-if="type!=='technical'">
    </el-table-column>
    <el-table-column
      prop="advice"
      label="医嘱内容"
      align="center">
    </el-table-column>
    <el-table-column
      prop="excute_at"
      label="执行时间"
      align="center" v-if="type==='technical'">
    </el-table-column>
    <el-table-column
      prop="excute_status"
      label="执行状态"
      align="center" v-if="type==='technical'">
    </el-table-column>
    <el-table-column
      prop="result"
      label="结果"
      align="center" v-if="type!=='technical'"
    >
      <template slot-scope="scope">
        <el-select disabled v-model="scope.row.result" clearable size="small">
          <el-option value="+" label="+"></el-option>
          <el-option value="-" label="-"></el-option>
          <el-option value="阴性" label="阴性"></el-option>
          <el-option value="阳性" label="阳性"></el-option>
          <el-option value="不明确" label="不明确"></el-option>
        </el-select>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

  export default {
    props: {
      adviceData: Array,
      type: '',
      caseType: '',
    },
  };
</script>

<style scoped>

</style>
