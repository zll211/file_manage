<template>
  <div class="main-container">
    <div class="common-header">
      <hzzt-title>数据统计</hzzt-title>
    </div>
    <div class="common-table">
      <div class="common-table-header flex justify-content-between align-items-center">
        <el-tabs style="width: 100%;">
          <el-tab-pane label="分类统计" style="width: 100%;">
            <div v-show="!noPieData" id="classifiy" class="cate-style">
              <div id="pie" style="width: 34vw;height: 500px"></div>
              <div id="bar" style="width: 34vw;height: 500px"></div>
            </div>
            <div v-show="noPieData" class="cate-style align-items-center justify-content-center">暂无统计数据</div>
          </el-tab-pane>
          <el-tab-pane label="录入统计" style="width: 100%;">
            <div class="line-head">
              <el-date-picker
                v-model="selectMonth"
                :type="dateType"
                style="margin-right: 7px"
                placeholder="选择时间"
                value-format="yyyy-MM"
                @change="datePicker">
              </el-date-picker>
              <div>
                <el-button style="margin-right: 7px" type="text" disabled>查看周期：</el-button>
                <el-select v-model="statisticsPeriod" placeholder="周" @change="handleChange">
                  <el-option
                    v-for="item in statisticsPeriodOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div id="line" style="width: 70vw;height: 460px;margin:50px auto"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {statisticsService} from "./statistics.service";

  var echarts = require('echarts');
  export default {
    components: {
      hzztTitle,
    },
    data() {
      return {
        activeTabName: '分类统计',
        barXAxisData: [],
        barSeriesData: [],
        data: [],
        dateType: 'month',
        keyword: '',
        loading: false,
        lineXAxisData: [],
        lineSeriesData: [],
        lineLegendData: [],
        noPieData: true,
        pieSeriesData: [],
        pieLegendData: [],
        selectMonth: '',
        statisticsPeriod: 'day',
        statisticsPeriodOptions: [{
          value: 'day',
          label: '天'
        }, {
          value: 'week',
          label: '周'
        }, {
          value: 'month',
          label: '月'
        }],
        tabList: [{
          label: '分类统计',
          name: '分类统计',
        }, {
          label: '录入统计',
          name: '录入统计',
        }]
      }
    },
    created() {
      /*this.queryPie();
      this.getDefaultTime();
      this.queryLine();*/
    },
    mounted() {
      this.queryPie();
      this.getDefaultTime();
      this.queryLine();
    },
    methods: {
      // 饼图数据查询
      queryPie() {
        statisticsService.queryPie()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              if (body?.data?.length > 0) {
                this.pieSeriesData = [];
                this.pieLegendData = [];
                body.data.forEach((item) => {
                  this.pieSeriesData.push({
                    value: item.count,
                    name: item.cate_name,
                    id: item.cate_id
                  });
                  this.pieLegendData.push(item.cate_name)
                });
                this.noPieData = false;
                this.drawPie();
                this.queryBar(body.data[0].cate_id) //柱状图默认显示第一类里的二级分类
              }
            } else {
              this.noPieData = true;
            }
          }).catch(() => this.noPieData = true);
      },
      // 分类统计饼图
      drawPie() {
        let t = this;
        let myChartPie = echarts.init(document.getElementById('pie'));
        let option = {
          title: [
            {
              text: '切片占比统计',
            }
          ],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {//图例
            x: 'center',
            y: 'bottom',
            data: this.pieLegendData
          },
          series: [
            {
              name: '切片占比统计',
              type: 'pie',
              radius: '30%',
              data: this.pieSeriesData
            }
          ]
        };
        myChartPie.setOption(option);

        function eConsole(param) {
          //param.dataIndex 获取当前点击索引，
          let index = param.dataIndex;
          // console.log("option.series[0].data[num].id",option.series[0].data[num].id);
          t.queryBar(option.series[0].data[index].id)
        }

        myChartPie.off("click");//绑定前先解除，避免重复加载
        myChartPie.on("click", eConsole);
      },
      // 柱状图数据查询
      queryBar(id) {
        statisticsService.queryBar(id)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              if (body.data?.length > 0) {
                this.barXAxisData = [];
                this.barSeriesData = [];
                body.data.forEach((item) => {
                  this.barXAxisData.push(item.cate_name);
                  this.barSeriesData.push({
                    value: item.count,
                    name: item.cate_name,
                    id: item.cate_id,
                  });
                });
                this.drawBar()
              }
            }
          }).catch(() => {

        })
      },
      // 分类统计柱状图
      drawBar() {
        let t = this;
        let myChartBar = echarts.init(document.getElementById('bar'));
        let option = {
          color: ['#3398DB'],
          title: [
            {
              text: '切片对比统计',
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              data: this.barXAxisData,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              type: 'bar',
              data: this.barSeriesData,
            }
          ]
        };
        myChartBar.setOption(option);

        function eConsole(param) {
          // let index = param.dataIndex;
          // console.log(param.data.id);
          t.queryBar(param.data.id);
        }

        myChartBar.off("click");//绑定前先解除，避免重复加载
        myChartBar.on("click", eConsole);
      },

      // 查询线形图数据
      queryLine() {
        let params = {
          unit: this.statisticsPeriod,
          date: this.selectMonth
        };
        let xData = [];
        let lineSeries = [];
        statisticsService.queryLine(params)
          .then((data) => {
            if (data.body?.ret_code === 0) {
              // console.log("data.body.data",data.body.data);
              for (let i in data.body.data) {
                xData.push(i);
                lineSeries.push(data.body.data[i])
              }
              this.lineXAxisData = xData;
              this.lineSeriesData = lineSeries;
              /*console.log("this.lineSeriesData",this.lineSeriesData);
              console.log("this.lineXAxisData",this.lineXAxisData);*/
              this.drawLine()
            }
          })
      },
      //录入统计
      drawLine() {
        let myChartEntry = echarts.init(document.getElementById('line'));
        let option = {
          title: {
            text: '切片数量统计',
            left: 'left'
          },
          grid: {
            top: 80,
            left: '2%',
            right: '3%',
            bottom: 20,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,//坐标轴是否留白
            data: this.lineXAxisData
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.lineSeriesData,
            type: 'line'
          }]
        };
        myChartEntry.setOption(option);
        window.onresize = function () {
          myChartEntry.resize();
        }
      },
      handleClick(tab, event) {
        // console.log(tab, event);
        // console.log("activeTabName", this.activeTabName);
      },
      handleChange(value) {
        if (value === 'month') {
          this.dateType = 'year';
        } else {
          this.dateType = 'month';
        }
        this.statisticsPeriod = value;
        this.queryLine();
      },
      //日期选择器
      datePicker(date) {
        this.queryLine();
      },
      //日期选择器获取当前时间
      getDefaultTime() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        this.selectMonth = year + "-" + month;
      }
    }
  }
</script>

<style scoped lang="scss">
  .common-table-header {
    margin: 0 0 25px;
    .line-head {
      display: flex;
      justify-content: flex-end;
    }
  }

  .cate-style {
    width: 70vw;
    height: 500px;
    margin: 50px auto;
    display: flex
  }

  .el-select {
    width: 70px;
  }
</style>
