<template>
    <div class="contain">
        <h3 class="remainder">账户余额：{{ this.balance }}</h3>
        <el-table :data="Inventory">
            <el-table-column prop="Code" label="代码"></el-table-column>
            <el-table-column prop="Name" label="名称"></el-table-column>
            <el-table-column prop="Amount" label="持仓数量"></el-table-column>
            <el-table-column prop="AVG_Cost" label="买入均价"></el-table-column>
            <el-table-column prop="Latest_P" label="最新均价"></el-table-column>
            <el-table-column prop="Prof" label="盈亏金额"></el-table-column>
      </el-table>
      <el-col class="tips">{{ this.timeDisplayer }}秒后刷新</el-col>
    </div>
</template>

<script>
import { setInterval } from 'core-js';


export default{
    data(){
        return{
            Inventory: [],
            balance: 0,
            timer: null,
            timeDisplayer: 5,
        }
    },
    methods:{
        setTimer(){
            this.timeDisplayer = 5;
            this.timer = setInterval(() => {
                if(this.timeDisplayer > 0){
                    this.timeDisplayer--;
                }else{
                    this.refresh(this.Inventory);
                    this.timeDisplayer = 5;
                }
            },1000);
        },
        cleanTimer(){
            if(this.timer){
                clearInterval(this.timer);  
                this.timer = null;
            }
        },
        async fetchData() {  
        try {  
            const username = sessionStorage.getItem('username');  
            if (!username) {  
            throw new Error('Username not found');  
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

            this.refresh(inventoryData);

        } catch (error) {  
            console.error(error);  
            window.alert("Error fetching data!");  
        }  
        },
        async refresh(inventoryData){
            try{
                 // 获取数据
                const responseMark = await fetch('http://127.0.0.1:12345/getMarketPrice');
                if (!responseMark.ok) {  
                throw new Error('Failed to fetch Mark');  
                }
                const MarkData = await responseMark.json();
                // 制作一个以 Code 为键的对象，以便更轻松地查找所需数据
                const markDataMap = {};
                MarkData.forEach(item => {
                    markDataMap[item.Code] = { Latest_P: item.Price, Name: item.Name };
                });

                // 使用 map 方法遍历 this.Inventory，为每个对象添加 Price 和 Name 键
                const result = inventoryData.map(item => {
                    const code = item.Code;
                    const { Latest_P, Name } = markDataMap[code];
                    const prof = (Latest_P - item.AVG_Cost).toFixed(2);
                    const Prof = prof > 0 ? '+'+prof : prof;
                    // 返回新对象，包含原始对象的数据以及 Price 和 Name
                    return {
                        ...item,
                        Latest_P,
                        Name,
                        Prof
                    };
                });
                this.Inventory = result;
            } catch (error) {  
                console.error(error);  
                window.alert("Error fetching data!");  
            } 
        }
    },
    mounted(){
        this.setTimer()
        this.fetchData();
    },
    beforeUnmount(){
        this.cleanTimer();
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
.contain .tips{
  margin:20px 0 0 0;
  padding: 0;
  color: gray;
  font-size: 15px;
}
</style>
