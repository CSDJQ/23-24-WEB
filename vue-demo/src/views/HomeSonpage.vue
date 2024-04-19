<template>
  <div class="contain">
    <el-row class="type">
      <el-col :span="8" :class="{selected:selectedType === '沪市股票'}" @click="selectedType = '沪市股票';refresh();">沪市股票</el-col>
      <el-col :span="8" :class="{selected:selectedType === '创业板股票'}" @click="selectedType = '创业板股票';refresh();">创业板股票</el-col>
      <el-col :span="8" :class="{selected:selectedType === '深市股票'}" @click="selectedType = '深市股票';refresh();">深市股票</el-col>
    </el-row>

    <el-table :data="datashow">
      <el-table-column prop="Code" label="代码"></el-table-column>
      <el-table-column prop="Name" label="名称"></el-table-column>
      <el-table-column prop="Price" label="最新价格"></el-table-column>
      <el-table-column prop="Crange" label="当日涨跌幅"></el-table-column>
      <el-table-column prop="Cprice" label="当日涨跌价格"></el-table-column>
      <el-table-column></el-table-column>
    </el-table>
  </div>
  
</template>

<script>
import axios from 'axios';

export default{
  data(){
    const initialData = {  
        "601398": 4.74,  
        "600519": 1701.0,  
        "600276": 48.06,  
        "600309": 86.72,  
        "600009": 47.37,  
        "603288": 63.98,  
        "600048": 12.83,  
        "600585": 25.6,  
        "600028": 6.09,  
        "600588": 19.43,  
        "300347": 86.81,  
        "300750": 224.09,  
        "300059": 15.1,  
        "300024": 15.3,  
        "300498": 17.28,  
        "300760": 314.71,  
        "300015": 28.27,  
        "300295": 13.33,  
        "300288": 19.55,  
        "300002": 10.87,  
        "000069": 4.71,  
        "002507": 23.97,  
        "002714": 42.84,  
        "000651": 34.34,  
        "000858": 168.2,  
        "002415": 34.95,  
        "002179": 43.12,  
        "000776": 15.02,  
        "002511": 12.07,  
        "002007": 22.03, 
    }
    return {
      datashow:[],
      initialData:initialData,
      selectedType:'沪市股票',
    };
  },
  methods:{
    refresh(){
        axios.get('/api/getMarketPrice').then(response =>{
        const data = response.data;
        
        let filteredData = data.filter(item => item.Code.toString().startsWith('6'));
        switch(this.selectedType){
          case '沪市股票':
          filteredData = data.filter(item => item.Code.toString().startsWith('6'));break;
          case '创业板股票':
          filteredData = data.filter(item => item.Code.toString().startsWith('0'));break;
          case '深市股票':
          filteredData = data.filter(item => item.Code.toString().startsWith('3'));break;
        }

        for(let i = 0; i < filteredData.length; i++){
          const code = filteredData[i].Code; 
          const initial_data = this.initialData[code];
          // 股票涨跌幅=(当前最新成交价（或收盘价）-开盘参考价)÷开盘参考价×100%
          const Cprice = filteredData[i].Price - initial_data;
          const rate = Cprice/initial_data * 100;
          filteredData[i].Crange = rate > 0 ? '+'+rate.toFixed(2)+'%':rate.toFixed(2)+'%';
          filteredData[i].Cprice = Cprice.toFixed(2);
        }

        // console.log(filteredData);
        // console.log(this.selectedType);

        this.datashow = filteredData;
      }).catch(error => {
        console.error(error);
      })
    }
  },
  mounted() {
    this.refresh();
  }
}

</script>

<style scoped>
.contain .type .el-col{
  margin: 20px 0;
  font-size: 20px;
  cursor: pointer;
}
.type .selected {
  color:brown;
}
</style>
