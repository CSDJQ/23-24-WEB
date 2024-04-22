<template>
    <div class="contain">
        <h3 class="remainder">账户余额：{{ this.balance }}</h3>
        <el-table :data="Inventory" :stripe="true">
            <el-table-column prop="Code" label="代码"></el-table-column>
            <!-- <el-table-column prop="Name" label="名称"></el-table-column> -->
            <el-table-column prop="Amount" label="持仓数量"></el-table-column>
            <!-- <el-table-column prop="Cost" label="买入价"></el-table-column>
            <el-table-column prop="Latest_P" label="最新价"></el-table-column>
            <el-table-column prop="Prof" label="盈亏金额"></el-table-column> -->
      </el-table>
    </div>
</template>

<script>
export default{
    data(){
        return{
            Inventory: [],
            balance: 0,
        }
    },
    methods:{
        async fetchData() {  
        try {  
            const username = sessionStorage.getItem('username');  
            if (!username) {  
            throw new Error('Username not found in sessionStorage');  
            }  
    
            const responseBalance = await fetch(`http://127.0.0.1:12345/getBalance?username=${username}`);  
            if (!responseBalance.ok) {  
            throw new Error('Failed to fetch balance');  
            }  
            this.balance = await responseBalance.text();  
    
            const responseInventory = await fetch(`http://127.0.0.1:12345/getInventory?username=${username}`);  
            if (!responseInventory.ok) {  
            throw new Error('Failed to fetch inventory');  
            }  
            const inventoryData = await responseInventory.json(); // 解析为JSON格式
            this.Inventory = inventoryData;
        } catch (error) {  
            console.error(error);  
            window.alert("Error fetching data!");  
        }  
        }  
    },
    mounted(){
        this.fetchData();  
    },
}
</script>

<style scoped>
.contain .remainder{
    margin:20px;
    text-align: left;
    font-size: 25px;
    font-weight: bold;
}
</style>
