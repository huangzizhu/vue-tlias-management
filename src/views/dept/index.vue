<script setup>
import { ref, onMounted } from "vue";
import {
  queryAllApi,
  addApi,
  queryByIdApi,
  updateApi,
  deleteApi,
} from "@/api/dept";
import { ElMessage, ElMessageBox } from "element-plus";

//查询
const search = async () => {
  const result = await queryAllApi();
  if (result.code) {
    deptList.value = result.data;
  }
};

onMounted(() => {
  search();
});

const deptList = ref([]);

//操作部门
//删除
const del = async (id) => {
  ElMessageBox.confirm("部门删除后将无法恢复, 是否继续删除?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await deleteApi(id);
      if (result.code) {
        //成功
        ElMessage.success("操作成功");
        search();
      } else {
        //失败
        ElMessage.error(result.msg);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "操作取消",
      });
    });
};

//编辑
const edit = async (id) => {
  const result = await queryByIdApi(id);
  if (result.code) {
    dept.value = result.data;
  } else {
    ElMessage.error(result.msg);
  }
  dialogTitle.value = "编辑部门";
  dialogFormVisible.value = true;
};

// 对话框
const dialogFormVisible = ref(false);

const save = async () => {
  if (!deptFormRef.value) return;
  deptFormRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      if (dept.value.id) {
        //编辑
        result = await updateApi(dept.value);
      } else {
        //新增
        result = await addApi(dept.value);
      }
      if (result.code) {
        //成功
        ElMessage.success("操作成功");
        search();
      } else {
        //失败
        ElMessage.error(result.msg);
      }
    } else {
      //校验失败
      ElMessage.error("表单校验失败");
    }
  });
  dialogFormVisible.value = false;
};

const cancel = () => {
  resetDept();
  dialogFormVisible.value = false;
};

const dept = ref();

const resetDept = () => {
  dept.value = { name: "" };
};

const addDept = () => {
  resetDept();
  dialogTitle.value = "新增部门";
  dialogFormVisible.value = true;
  if (deptFormRef.value){
    deptFormRef.value.resetFields();
  }
};

const dialogTitle = ref("");

//表单校验
const rules = {
  name: [
    { required: true, message: "必填", trigger: "blur" },
    { min: 2, max: 10, message: "部门名称长度应当在2~10位", trigger: "blur" },
  ],
};

const deptFormRef = ref();
</script>

<template>
  <!--  表格-->
  <div>
    <div class="container">
      <h2>部门管理</h2>
    </div>
    <div class="container">
      <el-button type="primary" @click="addDept"
        ><el-icon><Plus /></el-icon>部门</el-button
      >
    </div>
    <div class="container">
      <el-table :data="deptList" stripe border :table-layout="auto">
        <el-table-column prop="id" label="ID" width="100%" align="center" />
        <el-table-column prop="name" label="部门名称" align="center" />
        <el-table-column
          prop="updateTime"
          label="最后操作时间"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" @click="edit(scope.row.id)"
              ><el-icon><EditPen /></el-icon>编辑</el-button>
            <el-button type="danger" @click="del(scope.row.id)"
              ><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!--  对话框-->
  <div class="container">
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500">
      <el-form :model="dept" :rules="rules" ref="deptFormRef">
        <el-form-item
          label="部门名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="dept.name"
            autocomplete="off"
            placeholder="请输入部门名称，长度2~10位"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  width: 98%;
  margin: 10px auto;
  align-content: center;
}
</style>
