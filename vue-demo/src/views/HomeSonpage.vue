<template>
  <div class="contain">
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Title </span>
      </template>
    </el-page-header>

    <div class="mark" v-if="viewType==='Mark'">
      <el-row class="type">
        <el-col :span="4" :class="{selected:selectedType === '沪市股票'}" @click="selectedType = '沪市股票';refreshMark();">沪市股票</el-col>
        <el-col :span="4" :class="{selected:selectedType === '创业板股票'}" @click="selectedType = '创业板股票';refreshMark();">创业板股票</el-col>
        <el-col :span="4" :class="{selected:selectedType === '深市股票'}" @click="selectedType = '深市股票';refreshMark();">深市股票</el-col>
      </el-row>

      <el-table :data="stockMark" :stripe="true" @cell-click="handleCellClick">
        <el-table-column prop="Code" label="代码"></el-table-column>
        <el-table-column prop="Name" label="名称"></el-table-column>
        <el-table-column prop="Price" label="最新价格"></el-table-column>
        <el-table-column prop="Crange" label="当日涨跌幅"></el-table-column>
        <el-table-column prop="Cprice" label="当日涨跌价格"></el-table-column>
      </el-table>
      
      <el-col class="tips">{{ this.timeDisplayer }}秒后刷新</el-col>
    </div>

    
    <div class="trend" v-if="viewType==='Trend'">
      <div ref="chart" id="chart"></div>
      <el-col class="tips">{{ this.timeDisplayer }}秒后刷新</el-col>
    </div>
    
  </div>
  
</template>

<script>
import axios from 'axios';
import * as echarts from "echarts";

var chartInstance = null; // 用于存储ECharts实例  
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
      stockMark:[], 
      initialData:initialData,
      selectedType:'沪市股票',
      timer:null,
      timeDisplayer:5,
      viewType:'Mark',
      stockTrend: [], // 假设这是你从后端动态获取的股票价格数据  
      selectedCode:'',
    };
  },
  methods:{
    refreshMark(){
        this.timeDisplayer=5;
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
        this.stockMark = filteredData;
      }).catch(error => {
        console.error(error);
      })
    },
    setTimer(){
      // console.log('settime');
      
      this.timeDisplayer = 5;
      this.timer = setInterval(() => {
        if(this.timeDisplayer > 0){
          this.timeDisplayer--;
        }else{
          if(this.viewType === 'Mark')this.refreshMark();
          else this.refreshTrend();
        }
      },1000)
    },
    cleanTimer(){
      // console.log("release timer");
      if (this.timer) {  
        clearInterval(this.timer);  
        this.timer = null;
      }  
    },
    goBack() {
      // console.log('go back');
      this.cleanTimer(); //清除Trend的更新定时器
      this.selectedCode = '';
      this.viewType = 'Mark';
      this.refreshMark();
      this.setTimer();  //设置Mark的更新定时器
    },
    handleCellClick(row){
      this.cleanTimer();  //清除Mark的更新定时器
      this.viewType = 'Trend';
      this.selectedCode = row.Code;
      this.initChart();
      this.setTimer();  //设置Trend的更新定时器
      // console.log(this.stockTrend);
    },
    refreshTrend(){
      this.timeDisplayer = 5;
      axios.get('/api/getStockPrice?code='+this.selectedCode).then(reponse =>{
        this.stockTrend = reponse.data;
        this.updateChart();
        // console.log(this.stockTrend);
      })
    },
    initChart() {
      axios.get('/api/getStockPrice?code='+this.selectedCode).then(reponse =>{
        this.stockTrend = reponse.data;
        // console.log(this.stockTrend);
        this.$nextTick(() => {
          // 确保在拿到数据后调用 initChart
          // 基于准备好的dom，初始化echarts实例  
          chartInstance = echarts.init(this.$refs.chart);  
          
          // 拆分配置项和数据  
          const titleOption = {  
            text: '股票历史价格曲线图'  
          };  
          
          const tooltipOption = {  
            trigger: 'axis' // 坐标轴触发  
          };  
          
          const xAxisOption = {  
            type: 'category',  
            data: this.stockTrend.map((_, index) => `Day ${index + 1}`) // 假设X轴是日期序列  
          };  
          
          const yAxisOption = {  
            type: 'value'  
          };  
          
          const seriesOption = {  
            data: this.stockTrend, // Y轴数据  
            type: 'line' // 图表类型为折线图  
          }; 

          // dataZoom 组件配置  
          const dataZoomOption = [  
            {  
              type: 'slider', // 滑动条型 dataZoom 组件  
              start: 80, 
              end: 100 
            },  
            {  
              type: 'inside', // 内置型 dataZoom 组件  
              start: 80, 
              end: 100 
            }  
          ]; 
          
          // 合并所有配置项  
          const option = {  
            title: titleOption,  
            tooltip: tooltipOption,  
            xAxis: xAxisOption,  
            yAxis: yAxisOption,  
            series: [seriesOption],
            dataZoom: dataZoomOption
          };  
          
          // 使用刚指定的配置项和数据显示图表  
          chartInstance.setOption(option);
        });
        // console.log(this.stockTrend);
      })
    },
    updateChart() {
      if (chartInstance) {
        const xAxisOption = {  
          type: 'category',  
          data: this.stockTrend.map((_, index) => `Day ${index + 1}`) // 假设X轴是日期序列  
        };
        const yAxisOption = {  
          type: 'value'  
        };
        const seriesOption = [{  
          data: this.stockTrend, // 假设后端返回的数据中包含price字段  
          type: 'line'
        }]; 
          
        // 使用刚指定的配置项和数据显示图表。  
        chartInstance.setOption({  
          xAxis: xAxisOption,
          yAxis: yAxisOption,  
          series: seriesOption  
        }, false); // 第二个参数为false表示使用合并模式，不会清除之前的配置项  
      }  
    },  
  },
  mounted() {
    this.refreshMark();
    this.setTimer();
  },
  beforeUnmount(){
    this.cleanTimer();
  }
}
</script>

<style scoped>
.contain .el-table {
  table-layout: fixed;
  width: 100%;
}

.contain .type .el-col{
  padding: 15px;
  margin: 20px 0;
  font-size: 18px;
  cursor: pointer;
}

.type .selected {
  border-radius: 8px;
  background-color: var(--normal);
  color: var(--text--lightest);
}

.contain .tips{
  margin:20px 0 0 0;
  padding: 0;
  color: gray;
  font-size: 15px;
}

.contain .trend #chart{
  width: 800px;
  height: 500px;
  margin: 0 auto;
}
</style>
