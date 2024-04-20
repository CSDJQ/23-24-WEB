<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-page-header>
                    <!-- 图标插槽 -->
                    <template #icon>
                        <div class="block">
                            <el-avatar  :src="circleUrl" />
                        </div>
                    </template>

                    <!-- 标题插槽 -->
                    <template #title>
                        {{ Name }}
                    </template>

                    <!-- 额外内容插槽 -->
                    <template #extra>
                        <el-button  @click="clickRegister">Register/Login</el-button>
                    </template>
                </el-page-header>
            </el-header>
            <el-container>
                <el-aside class="side" v-if=isLogin>
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
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'; 

const router = useRouter();  

const state = reactive({
  circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  isLogin: false,
  Name: '游客',
})

const { circleUrl, isLogin, Name } = toRefs(state)

function clickRegister(){
    router.push('/toLogin');
}

onMounted(() => {
    const username = sessionStorage["username"];
    if (username) {
        Name.value = username;
        isLogin.value = true;
    }
})

</script>


<style scoped>
.common-layout .el-header {
    height: 57px;
}

.common-layout .side {
    width: auto;
    height: 100%;
    background-color: var(--lightest);
}

.common-layout .side .el-row{
    padding: 30px;
    width:200px;
    border-radius: 8px;
    justify-content: center;
    letter-spacing: 2px;
    transition: all 0.3s;
}

.common-layout .side .el-row:hover{
    background-color: var(--normal);
    color: var(--text--lightest);
}

.common-layout .side .el-row .el-icon{
    position:relative;
    top:3px;
    margin-right: 3px;
}
</style>
