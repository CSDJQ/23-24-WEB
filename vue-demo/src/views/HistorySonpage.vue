<template>
    <div class="contain">

        <div class="container">  
            <div class="btn-container left">  
            以表格形式  
            <input type="checkbox" name="" id="" v-model="onOff"/> 
            以卡片形式
            </div>  
            <div class="btn-container right">  
            只显示有效单  
            <input type="checkbox" name="" id="" v-model="isPressed" @change="ChangeFilter" />  
            </div>  
        </div>  

        <el-table :data="showHistory" v-if="!this.onOff">
            <el-table-column label="类别">
                <template v-slot:default="scope">  
                    {{ stateContent(scope.row.State)}}
                </template>  
            </el-table-column>
            <el-table-column prop="TradeTime" label="交易时间"></el-table-column>
            <el-table-column prop="Code" label="代码"></el-table-column>
            <el-table-column prop="Name" label="名称"></el-table-column>
            <el-table-column label="交易方向">  
            <template v-slot:default="scope">  
                {{ scope.row.Direction === 0 ? '买入' : '卖出' }}  
            </template>  
            </el-table-column>
            <el-table-column label="挂单或成交金额">
                <template v-slot:default="scope">  
                    {{ scope.row.State === 2 ? scope.row.KnockPrice : scope.row.Price }}  
                </template> 
            </el-table-column>
            <el-table-column prop="Amount" label="数量"></el-table-column>
      </el-table>

        <div class="card-container" v-else>
            <div class="card" :class="{'gray-color':isFail(item.State)}" v-for="(item, index) in showHistory" :key="index">
                <el-row>
                    <el-col :span="6" class="text-left">{{ stateContent(item.State)}}</el-col>
                    <el-col :span="6" class="text-left">{{ item.Name }}</el-col>
                    <el-col :span="6" class="text-left">{{ item.Code }}</el-col>
                    <el-col :span="6" class="text-right" :class="{ 'sell-color': item.Direction, 
                        'buy-color': !item.Direction, 'gray-color': isFail(item.State) }">
                        {{ item.Direction ? '卖出' : '买入' }}
                    </el-col>
                </el-row>
                <el-row v-if="item.State!=2">
                    <el-col class="text-left">挂单价格：{{ item.Price }}</el-col>
                </el-row>
                <el-row v-else>
                    <el-col :span="12" class="text-left">成交金额：{{ item.Amount * item.KnockPrice }}</el-col>
                    <el-col :span="12" class="text-left">成交价格：{{ item.KnockPrice }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" class="text-left">交易数量：{{ item.Amount }}</el-col>
                    <el-col :span="12" class="text-left">交易时间：{{ item.TradeTime }}</el-col>
                </el-row>
            </div>
        </div>
        
        <div v-if="History.length <= 0">
            <p><strong>无历史订单数据</strong></p>
        </div>
    </div>
</template>

<script>
export default{
    data(){
        return {
            History:[],
            showHistory:[],
            isPressed: true,
            onOff:false,
        }
    },
    methods:{
        async getTradeRecord(){
            try{
                const username = sessionStorage.getItem('username');
                if(!username){
                    throw new Error('Username not found');
                }
                const responseRecord = await fetch(`http://127.0.0.1:12345/getTradeRecord?username=${username}`);
                if(!responseRecord.ok){
                    throw new Error('Failed to fetch record');
                }
                const History =await responseRecord.json();
                const responseMark = await fetch('http://127.0.0.1:12345/getMarketPrice');
                if (!responseMark.ok) {  
                throw new Error('Failed to fetch Mark');  
                }
                const MarkData = await responseMark.json();
                // 制作一个以 Code 为键的对象
                const markDataMap = {};
                MarkData.forEach(item => {
                    markDataMap[item.Code] = { Name: item.Name };
                });

                const result = History.map(item => {
                    const code = item.Code;
                    const { Name } = markDataMap[code];
                    // 返回新对象，包含原始对象的数据以及 Price 和 Name
                    return {
                        ...item,
                        Name,
                    };
                });
                this.History = result;
                this.showHistory = this.History.filter(item => !this.isFail(item.State));
            }catch(error){
                console.log(error);
            }
        },
        ChangeFilter(event) { 
            if (event.target.checked) {
                // 如果checkbox被选中，执行某些操作
                this.showHistory = this.History.filter(item => !this.isFail(item.State));
            } else {  
                // 如果checkbox被取消选中，执行其他操作
                this.showHistory = this.History;
            }
        }, 
    },
    mounted(){
        this.getTradeRecord();
    },
    computed:{
        stateContent() {
            return function(state) {
                switch(state){
                    case 0: return '错误';
                    case 1: return '委托成功';
                    case 2: return '交易成功';
                    case 3: return '废单';
                    case 4: return '账户余额不足';
                    case 5: return '持仓余额不足';
                }
            }
        },
        isFail() {
            return function(state) {
                return state != 1 && state != 2;
            };
        },
        isSuccessfulTrade() {
            return function(state) {
                return state == 2;
            };
        }
    }
}
</script>

<style scoped>
.contain {
  display: flex;
  flex-direction: column;
}

.container {  
  display: flex;  
  justify-content: space-between; /* 两端对齐 */  
  align-items: center; /* 垂直居中 */  
} 

.btn-container {
  align-self: flex-start;
  margin-top: 10px;
  margin-left: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #676c6e;
}

.card-container {
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, 640px);
    justify-content: center;
}

.card {
    width: 600px;
    height: 130px;
    margin: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: box-shadow 0.3s ease;
}

.card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

input[type="checkbox"] {
  position: relative;
  width: 30px;
  height: 15px;
  -webkit-appearance: none;
  background: #c6c6c6;
  outline: none;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  transition: background 300ms linear;
}

input:checked[type="checkbox"] {
  background: #446d97;
}

input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  box-shadow:  0 2px 5px rgba(0,0,0,0.2);
  transition: left 300ms linear;
  transform: scale(1.1);
}

input:checked[type="checkbox"]::before {
  left: 15px;
}

.contain strong{
    color: gray;
    font-size: 20px;
}

.contain .el-row {
  margin-bottom: 5px;
}

.contain .el-row:nth-child(1):after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #ccc;
    display: block;
}

.contain .el-col {
  padding: 5px;
}

.contain .text-left {
  text-align: left;
}

.contain .text-right {
  text-align: right;
}

.sell-color {
    color: red;
    font-weight: bold;
}

.buy-color {
    color: green;
    font-weight: bold;
}

.contain .gray-color {
    color: gray !important;
}

</style>
