<template>
    <div class="contain">
        <!-- @cell-click="handleCellClick" -->
        <h3 class="remainder">账户余额：{{ this.balance }}</h3>
        <h3 class="tip">{{ this.tip }}</h3>
        <el-table :data="selectedStock" :stripe="true">
            
            <el-table-column label="取消" width="60px">
                <template #default="scoped">  
                    <el-icon size="20px"  @click="clickRemove(scoped.row)"><Remove /></el-icon>
                </template>
            </el-table-column>

            <el-table-column prop="Code" label="代码"></el-table-column>
            <el-table-column prop="Name" label="名称"></el-table-column>
            <el-table-column label="交易方向">
                <template #default="scope">  
                    <el-select v-model="scope.row.Trade" placeholder="请选择"  @click="clearTip">  
                        <el-option label="买入" value="buy"></el-option>  
                        <el-option label="卖出" value="sell"></el-option>  
                    </el-select>  
                </template>  
            </el-table-column>
            <el-table-column label="挂单价格">
                <template #default="scope">  
                    <el-input v-model="scope.row.Price" placeholder="请输入挂单价格"  @click="clearTip"></el-input>  
                </template>  
            </el-table-column>
            <el-table-column label="挂单数量">
                <template #default="scope">  
                    <el-input v-model="scope.row.Amount" type="number" placeholder="请输入挂单数量"  @click="clearTip"></el-input>  
                </template>  
            </el-table-column>
            <el-table-column label="单笔提交" width="100px"  @click="clearTip">
                <template #default="scope">
                    <el-button @click="handleSubmit(scope.row)">提交</el-button>  
                </template>  
            </el-table-column>
      </el-table>
    </div>
</template>

<script>

export default{
    data(){
        return{
            selectedStock:[],
            balance: 0,
            tip:'',
        }
    },
    methods:{
        clickRemove(row){
            this.selectedStock = this.selectedStock.filter(item => item.Code !== row.Code)
            this.clearTip();
        },
        handleSubmit(row){
            if (row.Code && row.Trade && row.Price && row.Amount) {
                // http://127.0.0.1:12345/trade?username={用户名}&code={股票代码}&direction={交易方向}&price={挂单价格}&amount={挂单数量}
                const url = "/api/trade?username=" + sessionStorage.getItem('username') + "&code="
                    + row.Code + "&direction=" + row.Trade + "&price=" + row.Price + "&amount=" + row.Amount;
                fetch(url)
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    var message = '';
                    switch(data){
                        case '0':this.tip = '用户错误或股票代码不存在';break;//系统无用户/用户名不存在/股票代码不存在等情况时
                        case '1':{
                            message = '委托成功';
                            this.selectedStock = this.selectedStock.filter(item => item.Code !== row.Code);
                            this.$router.push({ name: 'Success', params: { message } });
                            break;
                        }//买入价低于最新价，或卖出价高于最新价，只记录委托成功，后续不会自动成交
                        case '2':{
                            message = '交易成功';
                            this.selectedStock = this.selectedStock.filter(item => item.Code !== row.Code);
                            this.$router.push({ name: 'Success', params: { message } });
                            break;
                        }//以最新价买入或卖出
                        case '3':this.tip = '买入价或卖出价超出价格变动范围'; break;
                        case '4':this.tip = '账户余额不足'; break;
                        case '5':this.tip = '持仓余额不足'; break;
                        default:this.tip = '未知错误'; break;
                    }
                })
            }else{
                this.tip = '提交失败，不能为空';
            }
            
            // 错误=0，		
            // 委托成功=1，	
            // 交易成功=2，	
            // 废单=3，		
            // 账户余额不足=4，
            // 持仓余额不足=5
// 挂单价格超出涨跌幅限制→废单
// 买入时：
// 挂单金额小于股票实时价格→委托成功
// 账户余额小于（股票实时价格*挂单数量）→账户余额不足
// 其它情况→交易成功
// 卖出时：
// 用户未持有指定股票 或 持有数量小于挂单数量→持仓余额不足
// 挂单价格大于股票实时价格→委托成功
// 其它情况→交易成功
// 每次交易成功时，成交价会在实时价格基础上浮动1%，但不超过涨跌幅限制，同时修改用户的持仓和账户余额数据。

        },
        clearTip() {
            this.tip = '';
        }
    },
    mounted() {
        const selectedStock = sessionStorage.getItem('selectedStock');
        if(selectedStock){
            this.selectedStock = JSON.parse(selectedStock);
        }
        const url = "/api/getBalance?username=" + sessionStorage.getItem('username');
        fetch(url)
        .then(response => response.text())
        .then(data =>{
            if(data == -1){
                window.alert("Error!")
            }else{
                this.balance = data;
            }
        })
    },
    beforeUnmount(){
        sessionStorage.setItem('selectedStock', JSON.stringify(this.selectedStock));
    }
}

</script>

<style scoped>
.contain .remainder{
    margin:20px;
    text-align: left;
    font-size: 22px;
    font-weight: bold;
}
.contain .tip{
    margin:20px;
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    color: red;
}
</style>
