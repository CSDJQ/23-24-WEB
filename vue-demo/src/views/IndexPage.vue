<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-page-header>
                    <!-- 面包屑插槽 -->
                    <template #breadcrumb>
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item to="/">Home</el-breadcrumb-item>
                            <el-breadcrumb-item>Page</el-breadcrumb-item>
                        </el-breadcrumb>
                    </template>

                    <!-- 图标插槽 -->
                    <template #icon>
                        <div class="block">
                            <el-avatar :size="avatarSize" :src="circleUrl" />
                        </div>
                    </template>

                    <!-- 标题插槽 -->
                    <template #title>
                        游客
                    </template>

                    <!-- 额外内容插槽 -->
                    <template #extra>
                        <el-button type="primary">Register</el-button>
                        <el-button>Login</el-button>
                    </template>
                </el-page-header>
            </el-header>
            <el-container>
                <el-aside class="side">
                    <router-link to="/home">
                        <el-row><el-icon><House /></el-icon>首页</el-row>
                    </router-link>
                    <router-link to="/shop">
                    <el-row><el-icon><CreditCard /></el-icon>交易</el-row>
                    </router-link>
                    <router-link to="/have">
                    <el-row><el-icon><ShoppingBag /></el-icon>持仓</el-row>
                    </router-link>
                    <router-link to="/history">
                    <el-row><el-icon><Tickets /></el-icon>历史订单</el-row>
                    </router-link>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({
  circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  avatarSize: 'small',
})


const { circleUrl, avatarSize} = toRefs(state)
</script>


<style scoped>
.common-layout .el-header {
    height: 80px;
}

.common-layout .side {
    width: auto;
    height: 100%;
    background-color: var(--lightest);
}

.common-layout .side .el-row{
    padding: 20px;
    width:150px;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.3s;
}

.common-layout .side .el-row:hover{
    background-color: var(--normal);
    color: var(--text--lightest);
}

.common-layout .side .el-row .el-icon{
    position:relative;
    top:2px;
}
</style>
