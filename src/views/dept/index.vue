<script setup>
import {ref,onMounted} from "vue";
import axios from "axios";

const search = async () => {
  const result = await axios.get("http://127.0.0.1:8080/depts");
  if (result.data.code){
    deptList.value = result.data.data;
  }
}
onMounted(()=>{
  search();
})


const deptList = ref([])
</script>

<template>
  <div class="empt">
    <div class="container">
      <p>部门管理</p>
    </div>
    <div class="container">
      <el-button type="primary">Primary</el-button>
    </div>
    <div class="container" >
      <el-table :data="deptList" stripe border :table-layout="auto">
        <el-table-column prop="id" label="ID" width="100%" align="center" />
        <el-table-column prop="name" label="部门名称" align="center"/>
        <el-table-column prop="updateTime" label="最后操作时间" align="center" />
        <el-table-column  label="操作" align="center">
          <template #default="">
            <el-button type="primary"><el-icon><EditPen /></el-icon>编辑</el-button>
            <el-button type="danger"><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>




</template>

<style scoped>
.container{
  margin: 10px 0;
}
.empt {
  width: 98%;
  margin: 0 auto;
  align-content: center;
}

</style>
