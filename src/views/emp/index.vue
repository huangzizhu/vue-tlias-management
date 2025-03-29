<template>
  <div>
    <div class="container">
      <h2>员工管理</h2>
      <!--  查询表单-->
      <div class="query-form">
        <el-form :inline="true" :model="queryForm" class="query-form">
          <el-form-item label="姓名">
            <el-input v-model="queryForm.name" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="queryForm.gender" placeholder="请选择" clearable>
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="入职日期">
            <div class="demo-date-picker">
              <div class="block">
                <el-date-picker v-model="queryForm.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="danger" @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--      按钮-->
      <div class="container" >
        <el-button type="primary" @click="addEmp"><el-icon><Plus /></el-icon>新增员工</el-button>
        <el-button type="danger" @click="delBatch"><el-icon><Delete /></el-icon>批量删除</el-button>
      </div>
      <!--  员工表格-->
      <div class="container">
        <el-table :data="empList" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55px" />
          <el-table-column prop="id" width="100px" label="ID" align="center" />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="image" label="头像" width="200px" align="center">
            <template #default="scope">
              <img :src="scope.row.image" width="50px" />
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="100px" align="center">
            <template #default="scope">
              <span v-if="scope.row.gender == 1">男</span>
              <span v-else-if="scope.row.gender == 2">女</span>
            </template>
          </el-table-column>
          <el-table-column prop="job" label="职位" align="center">
            <template #default="scope">
              <span v-if="scope.row.job == 1">班主任</span>
              <span v-else-if="scope.row.job == 2">讲师</span>
              <span v-else-if="scope.row.job == 3">学工主管</span>
              <span v-else-if="scope.row.job == 4">教研主管</span>
              <span v-else-if="scope.row.job == 5">咨询师</span>
              <span v-else>其他</span>
            </template>
          </el-table-column>
          <el-table-column prop="entryDate" label="入职日期" align="center" />
          <el-table-column prop="updateTime" label="更新时间" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" @click="edit(scope.row.id)"
              ><el-icon><EditPen /></el-icon>编辑</el-button>
              <el-button type="danger" @click="delById(scope.row.id)"
              ><el-icon><Delete /></el-icon>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条-->
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5,10,20,30,50,75,100]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 新增/修改员工的对话框 -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle" style="width: 800px">
        {{employee}}
        <el-form :model="employee" label-width="80px" :rules="rules" ref="employeeFormRef">
          <!-- 基本信息 -->
          <!-- 第一行 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第二行 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%;">
                  <el-option v-for="g in genders" :label="g.name" :value="g.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第三行 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="职位" >
                <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%;">
                  <el-option v-for="dept in jobs" :label="dept.name" :value="dept.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="薪资" >
                <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第四行 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属部门">
                <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%;">
                  <el-option v-for="dept in depts" :label="dept.name" :value="dept.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入职日期">
                <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第五行 -->
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="头像">
                <el-upload
                  class="avatar-uploader"
                  action="/api/upload"
                  :headers="{'token':token}"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="employee.image" :src="employee.image" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 工作经历 -->
          <!-- 第六行 -->
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="工作经历">
                <el-button type="success" size="small" @click="addExprs"><el-icon><Plus /></el-icon>添加工作经历</el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第七行 ...  工作经历 -->
          <el-row :gutter="3" v-for="(expr, index) in employee.exprList" :key="index">
            <el-col :span="10">
              <el-form-item size="small" label="时间" label-width="80px">
                <el-date-picker v-model="expr.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item size="small" label="公司" label-width="60px">
                <el-input v-model="expr.company" placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item size="small" label="职位" label-width="60px">
                <el-input v-model="expr.job" placeholder="请输入职位"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item size="small" label-width="0px">
                <el-button @click="deleteExpr(index)" type="danger" ><el-icon><Delete /></el-icon>删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 底部按钮 -->
        <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
        </template>
      </el-dialog>


    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { queryAllApi,addApi,updateApi,queryByIdApi,deleteApi } from "@/api/emp";
import { queryAllApi as queryAllDepts } from "@/api/dept";
import { ElMessage, ElMessageBox } from "element-plus";
//分页

const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

const handleSizeChange = () => {
  search();
}
const handleCurrentChange = () => {
  search();
}

//查询表单
const queryForm = ref({
  name: "",
  gender: "",
  begin: "",
  end: "",
  date: ""
});
// 监听 date 的变化
watch(
  () => queryForm.value.date,
  (newValue) => {
    if (newValue.length == 2) {
      queryForm.value.begin = newValue[1];
      queryForm.value.end = newValue[0];
    }
    else {
      queryForm.value.begin = "";
      queryForm.value.end = "";
    }
  }
);
//查询
const search = async () => {
  const result = await queryAllApi(queryForm.value.name,queryForm.value.gender, queryForm.value.end, queryForm.value.begin, currentPage.value, pageSize.value);
  if (result.code){
    empList.value = result.data.list;
    total.value = result.data.total;
  }
};
const clear = () => {
  queryForm.value = { name: "", gender: "", begin: "", end: "", date: "" };
  search();
};
onMounted(() => {
  search();
  getToken();
});

const token = ref();
const getToken = () => {
  const loginUser = JSON.parse(localStorage.getItem("loginUser"));
  if (loginUser && loginUser.token) {
    token.value = loginUser.token;
  }
};

//查询员工列表
const empList = ref([]);

//表单校验规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 2, max: 20, message: '用户名长度应在2到20个字符之间', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'change' },
    { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'change' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'change' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'change' }
  ]
});
const employeeFormRef = ref();
//职位列表数据
const jobs = ref([{ name: '班主任', value: 1 },{ name: '讲师', value: 2 },{ name: '学工主管', value: 3 },{ name: '教研主管', value: 4 },{ name: '咨询师', value: 5 },{ name: '其他', value: 6 }])
//性别列表数据
const genders = ref([{ name: '男', value: 1 }, { name: '女', value: 2 }])
//部门列表数据
const depts = ref([])

const queryDepts = async () => {
  const result = await queryAllDepts();
  if (result.code) {
    depts.value = result.data;
  }
}
//新增/修改表单
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
})

//新增员工
const addEmp = () => {
  if (employeeFormRef.value){
    employeeFormRef.value.resetFields();
  }
  employee.value = { username: '', name: '', gender: '', phone: '', job: '',
    salary: '', deptId: '', entryDate: '', image: '', exprList: [] };
  queryDepts();
  dialogTitle.value = '新增员工';
  dialogVisible.value = true;
}
//新增/编辑员工
const save = async () => {
  if (!employeeFormRef.value) return;
  employeeFormRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      if (employee.value.id) {
        //编辑
        result = await updateApi(employee.value);
      } else {
        //新增
        result = await addApi(employee.value);
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
  dialogVisible.value = false;
}
//添加经历
const addExprs = () => {
  employee.value.exprList.push({
    company: '',
    job: '',
    date:''
  })
}
//监听经历
watch(() => employee.value.exprList, () => {
  if(employee.value.exprList && employee.value.exprList.length > 0) {
      employee.value.exprList.forEach((item) => {
        if (item.date && item.date.length == 2) {
          item.begin = item.date[0];
          item.end = item.date[1];
        }
    })
  }
},{deep: true})
//删除经历
const deleteExpr = (index) => {
  employee.value.exprList.splice(index, 1);
}
// 编辑员工
const edit = async (id) => {
  if (employeeFormRef.value) {
    employeeFormRef.value.resetFields();
  }
  queryDepts();
  dialogTitle.value = '编辑员工';
  dialogVisible.value = true;
  //回显
  const result = await queryByIdApi(id);
  if (result.code) {
    employee.value = result.data;
    if (employee.value.exprList && employee.value.exprList.length > 0) {
      employee.value.exprList.forEach((item) => {
        if(item.begin && item.end) {
          item.date = [item.begin, item.end];
        }
      })
    }
    else {
      employee.value.exprList = [];
    }
  } else {
    ElMessage.error(result.msg);
  }
}
// 删除员工
const delById = (id) => {
  ElMessageBox.confirm("删除后将无法恢复, 是否继续删除?", "Warning", {
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
}

const delIds = ref([]);

// 批量删除
const delBatch = () => {
  if (delIds.value && delIds.value.length > 0) {
    delById(delIds.value);
  }
}

const handleSelectionChange = (val) => {
  delIds.value = [];
  val.forEach((item) => {
    delIds.value.push(item.id);
  })
}
// 控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')
//文件上传
// 图片上传成功后触发
const handleAvatarSuccess = (response) => {
  if(response.code){
    employee.value.image = response.data;
  }
  else {
    ElMessage.error(response.msg)
  }
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}
</script>

<style>
.container {
  width: 98%;
  margin: 15px auto;
  align-content: center;
}
.query-form {
  width: 98%;
  margin: 0 auto;
  align-content: center;
}
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
.avatar {
  height: 40px;
}
.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border-radius: 10px;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>
