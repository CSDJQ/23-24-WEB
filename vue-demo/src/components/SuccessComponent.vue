<template>
    <div class="contain">
        <el-icon size="150px"><CircleCheckFilled /></el-icon>
        <p>{{ this.tip }}</p>
        <p>{{ this.timeDisplayer }}秒后跳转回首页</p>
        <el-button @click="this.$router.push('/home');">点击立刻返回首页</el-button>  
    </div>
</template>

<script>
export default{
    data(){
        return{
            tip:'',
            timeDisplayer: 0,
            timer:null,
        }
    },
    methods:{
        setTimer(){
        // console.log('settime');
        this.timeDisplayer = 5;
        this.timer = setInterval(() => {
            if(this.timeDisplayer > 0){
                this.timeDisplayer--;
            }else{
                this.$router.push('/home');
            }
        },1000)
        },
        cleanTimer(){
        if (this.timer) {  
            clearInterval(this.timer);  
            this.timer = null;
        }  
        },
    },
    mounted(){
        this.tip = this.$route.params.message;
        this.setTimer();
    },
    beforeUnmount(){
        this.cleanTimer();
    }
}
</script>

<style scoped>
.contain{
    margin:100px auto;
}
.contain .el-icon{
    color: var(--normal);
}
.contain p{
    margin: 20px;
    font-size: 30px;

}
</style>
