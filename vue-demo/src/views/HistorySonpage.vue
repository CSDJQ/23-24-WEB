<template>
    <div class="contain">
        <el-table :data="History" :stripe="true">
            <el-table-column prop="TradeTime" label="交易时间"></el-table-column>
            <el-table-column prop="Code" label="代码"></el-table-column>
            <el-table-column prop="Name" label="名称"></el-table-column>
            <el-table-column prop="Direction" label="交易方向"></el-table-column>
            <el-table-column prop="KnockPrice" label="成交均价"></el-table-column>
            <el-table-column prop="Amount" label="数量"></el-table-column>
        </el-table>
    </div>
    <!-- http://127.0.0.1:12345/getTradeRecord?username=test
返回：
用户交易记录，Amount=，Code=股票代码，Direction=交易方向（0=买，1=卖），KnockPrice=成交价格，No=交易单号（自动生成的UUID），Price=挂单价格，State=交易状态（说明见后），TradeTime=交易时间
[
    {
        "Amount": 100,
        "Code": "601398",
        "Direction": 0,
        "KnockPrice": 4.7,
        "No": "1ac6f47e-f104-49ff-81c2-3fc8ab90da1c",
        "Price": 5,
        "State": 2,
        "TradeTime": "2024-03-11 22:14:26"
    }
] -->
</template>

<script>
export default{
    data(){
        return {
            History:[],
        }
    },
    mounted(){
        
    }
}
</script>

<style scoped>

</style>
