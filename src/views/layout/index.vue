<script lang="ts" setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const value = ref(true)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Tlias智能学习辅助系统</span>
        <span class="right_tool">
          <a href="">
            <el-icon><EditPen /></el-icon> 修改密码 &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;
          </a>
          <a href="">
            <el-icon><SwitchButton /></el-icon> 退出登录
          </a>
        </span>
      </el-header>
      
      <el-container class="left-content">
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <el-switch
            v-model="value"
            size="large"
            active-text="展开"
            inactive-text="折叠"
          />
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            :collapse="!value"
          >
<!--            首页-->
            <router-link to="/index">
              <el-menu-item index="1">
                <el-icon><Position /></el-icon>
                <span>首页</span>
              </el-menu-item>
            </router-link>


            <el-sub-menu index="2">
              <template #title>
                <el-icon><User /></el-icon>
                <span>班级学员管理</span>
              </template>
              <router-link to="/clazz">
                <el-menu-item index="2-1"><el-icon><HomeFilled /></el-icon>班级管理</el-menu-item>
              </router-link>
              <router-link to="stu">
                <el-menu-item index="2-2"><el-icon><UserFilled /></el-icon>学员管理</el-menu-item>
              </router-link>


            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>系统信息管理</span>
              </template>
              <router-link to="/dept">
                <el-menu-item index="3-1"><el-icon><Menu /></el-icon>部门管理</el-menu-item>
              </router-link>
              <router-link to="/emp">
                <el-menu-item index="3-2"><el-icon><Avatar /></el-icon>员工管理</el-menu-item>
              </router-link>
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon><Compass /></el-icon>
                <span>数据信息统计</span>
              </template>
              <router-link to="empReport">
                <el-menu-item index="4-1"><el-icon><Histogram /></el-icon>员工信息统计</el-menu-item>
              </router-link>
              <router-link to="stuReport">
                <el-menu-item index="4-2"><el-icon><Share /></el-icon>学员信息统计</el-menu-item>
              </router-link>
              <router-link to="log">
                <el-menu-item index="4-3"><el-icon><List /></el-icon>日志信息统计</el-menu-item>
              </router-link>
            </el-sub-menu>
          </el-menu>
        </el-aside>


        
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      
    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(to right, #87CEEB, #ADD8E6); /* 从天蓝色到浅天蓝色的渐变 */
  border-radius: 8px; /* 添加圆角，使设计更平滑 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加轻微阴影，增强立体感 */
  margin: 20px 0;
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool{
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.left-content{
  margin: 0 20px;
}
</style>
