<template>
    <div class="contain">
        <h3 class="remainder">账户余额：{{ this.balance }}</h3>
        <el-table :data="Inventory" :stripe="true">
            <el-table-column prop="Code" label="代码"></el-table-column>
            <!-- <el-table-column prop="Name" label="名称"></el-table-column> -->
            <el-table-column prop="Amount" label="持仓数量"></el-table-column>
            <el-table-column prop="AVG_Cost" label="买入均价"></el-table-column>
            <!-- <el-table-column prop="Latest_P" label="最新均价"></el-table-column> -->
            <!-- <el-table-column prop="Prof" label="盈亏金额"></el-table-column> -->
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
            throw new Error('Username not found');  
            }  
    
            const responseBalance = await fetch(`/api/getBalance?username=${username}`);  
            if (!responseBalance.ok) {  
            throw new Error('Failed to fetch balance');  
            }  
            this.balance = await responseBalance.text();  
    
            const responseInventory = await fetch(`/api/getInventory?username=${username}`);  
            if (!responseInventory.ok) {  
            throw new Error('Failed to fetch inventory');  
            }  
            const inventoryData = await responseInventory.json(); // 解析为JSON格式

            this.Inventory = inventoryData;
            // // 请求最新价格（打包成函数给timer调用）
            // const responseMark = await fetch(`http://127.0.0.1:12345/getMarketPrice`);  
            // inventoryData.forEach(item => {
                
            // if (item.Code === 'A') {
            //     // 向字典添加一个键值对
            //     item.NewKey = 'New Value';
            // }
            // });

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
