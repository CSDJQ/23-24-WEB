<template>
  <div class="contain">
    <el-page-header @back="goBack" v-if="viewType === 'Trend'">
      <template #content>
        <span class="text-large font-600 mr-3">股票历史价格曲线图</span>
      </template>
    </el-page-header>

    <div class="mark" v-if="viewType==='Mark'">
      <el-row class="type">
        <el-col :span="4" :class="{selected:selectedType === '沪市股票'}" @click="selectedType = '沪市股票';refreshMark();">沪市股票</el-col>
        <el-col :span="4" :class="{selected:selectedType === '创业板股票'}" @click="selectedType = '创业板股票';refreshMark();">创业板股票</el-col>
        <el-col :span="4" :class="{selected:selectedType === '深市股票'}" @click="selectedType = '深市股票';refreshMark();">深市股票</el-col>
      </el-row>

      <el-table :data="stockMark" @cell-click="handleCellClick" :cell-style="cellStyle">
        <el-table-column prop="Code" label="代码"></el-table-column>
        <el-table-column prop="Name" label="名称"></el-table-column>
        <el-table-column prop="Price" label="最新价格"></el-table-column>
        <el-table-column prop="Crange" label="当日涨跌幅"></el-table-column>
        <el-table-column prop="Cprice" label="当日涨跌价格"></el-table-column>
        <el-table-column v-if="this.isLogin" prop="Select" label="加入待交易">
        <template #default="scoped">
          <el-icon size="20px" v-show="this.selectedStock.find(item => item.Code === scoped.row.Code)" >  
            <Remove />  
          </el-icon>
          <el-icon size="20px" v-show="!this.selectedStock.find(item => item.Code === scoped.row.Code)" >
            <CirclePlusFilled />
          </el-icon>
        </template>
        </el-table-column>
      </el-table>
      
      <el-col class="tips">{{ this.timeDisplayer }}秒后刷新</el-col>
    </div>

    
    <div class="trend" v-if="viewType ==='Trend'">
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
      stockTrend: [], // 从后端动态获取的股票价格数据  
      selectedCode:'',
      selectedName:'',
      isLogin: false,
      selectedStock:[],
      startTime:0,
    };
  },
  methods:{
    refreshMark(){
        this.timeDisplayer=5;
        axios.get('http://127.0.0.1:12345/getMarketPrice').then(response =>{
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
        this.stockMark = filteredData;
      }).catch(error => {
        console.error(error);
        alert('refreshMark error');
      })
    },
    setTimer(){
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
    handleCellClick(row, column){
      if (column.property === 'Code' || column.property === 'Name') {
        this.cleanTimer();  //清除Mark的更新定时器
        this.viewType = 'Trend';
        this.selectedCode = row.Code;
        this.selectedName = row.Name;
        this.initChart();
        this.setTimer();  //设置Trend的更新定时器
      }else if(column.property === 'Select'){
        const existingItem = this.selectedStock.find(item => item.Code === row.Code);
        if(existingItem){
          this.selectedStock = this.selectedStock.filter(item => item.Code !== row.Code);
        }else{
          this.selectedStock.push({Code:row.Code, Name:row.Name});
        }
      }
    },
    refreshTrend(){
      this.timeDisplayer = 5;
      axios.get('http://127.0.0.1:12345/getStockPrice?code='+this.selectedCode).then(reponse =>{
        this.stockTrend = reponse.data;
        this.updateChart();
      })
    },
    initChart() {
      axios.get('http://127.0.0.1:12345/getStockPrice?code='+this.selectedCode).then(reponse =>{
        this.stockTrend = reponse.data;
        this.$nextTick(() => {
        // 获取当前时间戳 
        const now = Date.now();
        // 计算开始时间的时间戳（毫秒）
        this.startTime = now - (this.stockTrend.length * 5 * 1000);
        const startTimeStamp = this.startTime;
        const xAxisData = [];  
        for (let i = 0; i < this.stockTrend.length; i++) {
          const dataPointTimeStamp = startTimeStamp + (i * 5 * 1000);
          const date = new Date(dataPointTimeStamp);
          const dateString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });   
          xAxisData.push(dateString);  
        }
          // 基于准备好的dom，初始化echarts实例  
          chartInstance = echarts.init(this.$refs.chart);
          const titleOption = {  
            text: this.selectedName + '股票历史曲线图'
          };  
          const tooltipOption = {  
            trigger: 'axis' 
          };
          const xAxisOption = {  
            type: 'category',  
            data:xAxisData
          };
          const yAxisOption = {  
            type: 'value'  
          };
          const seriesOption = {  
            data: this.stockTrend, // Y轴数据
            type: 'line'
          };
          // dataZoom 组件配置  
          const dataZoomOption = [  
            {  
              type: 'slider', // 滑动条型dataZoom 组件  
              start: 80, 
              end: 100 
            },  
            {  
              type: 'inside', // 内置型dataZoom 组件  
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
          // 显示图表  
          chartInstance.setOption(option);
        });
      })
    },
    updateChart() {
      if (chartInstance) {
        const startTimeStamp = this.startTime;

        // 初始化X轴数据数组  
        const xAxisData = [];
        for (let i = 0; i < this.stockTrend.length; i++) {
          const dataPointTimeStamp = startTimeStamp + (i * 5 * 1000);
          const date = new Date(dataPointTimeStamp);   
          const dateString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          xAxisData.push(dateString);  
        }  

        const xAxisOption = {  
          type: 'category',
          data:xAxisData
        };
        const yAxisOption = {  
          type: 'value'  
        };
        const seriesOption = [{  
          data: this.stockTrend, 
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
    cellStyle (row) {
      if (row.row.Crange[0] === '+' && (row.columnIndex === 3||row.columnIndex ===4)) {
        return { color: 'red' };
      } 
      else if(row.row.Crange[0] === '-' && (row.columnIndex === 3||row.columnIndex ===4)){
        return { color: 'green' };
      }
      return;
    },
  },
  mounted() {
    this.refreshMark();
    this.setTimer();
    const username = sessionStorage.getItem('username');
    if (username) {
      this.isLogin = true;
      const selectedStock = sessionStorage.getItem('selectedStock');
      if(selectedStock){
        this.selectedStock = JSON.parse(selectedStock);
      }
    }else{
      this.isLogin = false;
    }
  },
  beforeUnmount(){
    this.cleanTimer();
    sessionStorage.setItem('selectedStock', JSON.stringify(this.selectedStock));
  },
}
</script>

<style scoped>
.contain .el-table {
  table-layout: fixed;
  width: 100%;
  margin-top: 20px;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  color: #212e3e;
  background-color: #eaf0f8 !important;
}

::v-deep .el-table--enable-row-hover .el-table__body tr > td:nth-child(1):hover,
::v-deep .el-table--enable-row-hover .el-table__body tr > td:nth-child(2):hover {
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}

.contain .type .el-col{
  padding: 15px 5px;
  margin: 10px 0;
  font-size: 20px;
  letter-spacing: 5px;
  cursor: pointer;
  border-radius:50px;
  border: 10px solid #fff;
}

.contain .type .el-col::before {  
  content: "";  
  position: absolute;  
  top: 10px;  
  left: 0;  
  right: 0;  
  bottom: 10px;  
  width:50%;
  background-color: #fff; /* 上层半透明蓝色背景 */  
  border-radius:50px;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  z-index: -1;
}

.type .selected {
  background-color: #e6eef9;
  color: #185ee0;
  transition: color 0.15s ease-in;
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
