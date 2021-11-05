import React, { Component } from "react";
import {
  Form,
  Select,
  Message
} from "antd";
import ReactEcharts from "echarts-for-react";
import API from "../../api/api";
import _ from "lodash";
import { getAge } from "../../utils/dateUtils";
import RenderHistoryTable from "./RenderHistoryTable";
const { Option } = Select;
const timeList = [
  {
    "key":"全部",
    "value": "all"
  },
  {
    "key":"近一周",
    "value": "weekly"
  },
  {
    "key":"近一月",
    "value": "monthly"
  },
  {
    "key":"近一年",
    "value": "yearly"
  },
]
const chartType = [
  {
    "key":"直方图",
    "value":"bar"
  },
  {
    "key":"折线图",
    "value":"line"
  },
  {
    "key":"饼状图",
    "value":"pie"
  }
]

class StatisticAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryNumberChartType:'pie',
      patientNumberChartType:'line',
      xOfPatientNumber: [],
      yOfPatientNumber: [],
      xOfCategoryNumber: [],
      yOfCategoryNumber: [],
    };
  }

  getCategoryNumberPieOption = () => {
    const {xOfCategoryNumber, yOfCategoryNumber} = this.state;
    const data = []
    for(var i=0;i<xOfCategoryNumber.length;i++){
      let obj = {
        value: yOfCategoryNumber[i],
        name: xOfCategoryNumber[i]
      }
      data.push(obj)
    }
    return {
      title : {
          text: '某站点用户访问来源',
          x:'center'
      },
      tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: xOfCategoryNumber
      },
      series : [
          {
              name: '患者数量',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:data,
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
    }
  }

  getCategoryNumberOption = () => {
    const { categoryNumberChartType, xOfCategoryNumber, yOfCategoryNumber} = this.state;
    return {
      title: {
          text: '新增患者数量统计',
          x: 'center',
          textStyle: { //字体颜色
              color: '#ccc'
          }
      },
      tooltip: {},
      xAxis: {
          data: xOfCategoryNumber
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: categoryNumberChartType,
          data: yOfCategoryNumber
        }
      ]
    };
  }

  getPatientNumberPieOption = () => {
    const {xOfPatientNumber, yOfPatientNumber} = this.state;
    const data = []
    for(var i=0;i<xOfPatientNumber.length;i++){
      let obj = {
        value: yOfPatientNumber[i],
        name: xOfPatientNumber[i]
      }
      data.push(obj)
    }
    return {
      title : {
          text: '新增患者数量统计',
          x:'center'
      },
      tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: xOfPatientNumber
      },
      series : [
          {
              name: '患者数量',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:data,
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
    }
  }

  getPatientNumberOption = () => {
    const { patientNumberChartType, xOfPatientNumber, yOfPatientNumber} = this.state;
    return {
      title: {
          text: '新增患者数量统计',
          x: 'center',
          textStyle: { //字体颜色
              color: '#ccc'
          }
      },
      tooltip: {},
      xAxis: {
          data: xOfPatientNumber
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: patientNumberChartType,
          data: yOfPatientNumber
        }
      ]
    };
  }
  handlePatientNumberSearch = ()=> {
    let param = {
      typeCode:1
    };
    let values = this.refs.staticIndicators.getFieldsValue();
    for (const [, value] of Object.entries(values)) {
      if (value) {
        param = {
          time: values.time,
          typeCode: 1
        };
      }
    }
    API.statisticCount(param).then((res) => {
      const { data, code, msg } = res;
      if (code === "200") {
        this.setState({
          xOfPatientNumber: data.xaxisData,
          yOfPatientNumber: data.yaxisData,
        });
      } else {
        Message.error(msg);
      }
    });
  }

  handleCategoryNumberSearch = ()=> {
    let param = {
      typeCode:2
    };
    API.statisticCount(param).then((res) => {
      const { data, code, msg } = res;
      if (code === "200") {
        this.setState({
          xOfCategoryNumber: data.xaxisData,
          yOfCategoryNumber: data.yaxisData,
        });
      } else {
        Message.error(msg);
      }
    });
  }

  changePatientNumberChartType = (value) => {
    this.setState({
      patientNumberChartType:value
    })
  }

  changeCategoryNumberChartType = (value) => {
    this.setState({
      categoryNumberChartType: value
    })
  }

  componentDidMount() {
    this.handlePatientNumberSearch();
    this.handleCategoryNumberSearch();
  }

  renderSearch = () => {
    const timeOptions = timeList.map((item) => {
      return <Option key={item.value} value={item.value}>{item.key}</Option>
    })
    const chartTypeOptions = chartType.map((item) => {
      return <Option key={item.value} value={item.value}>{item.key}</Option>
    })
    return (
      <Form
        layout="inline"
        style={{ marginBottom: 30 }}
        ref="staticIndicators"
      >
        <Form.Item name="time">
        <Select style={{ width: 160 }} onChange={this.handlePatientNumberSearch} defaultValue='all'>
          {timeOptions}
        </Select>
        </Form.Item>
        <Form.Item name="chartType">
        <Select style={{ width: 160 }} onChange={this.changePatientNumberChartType} defaultValue='line'>
          {chartTypeOptions}
        </Select>
        </Form.Item>
      </Form>
    );
  };

  render() {
    const {patientNumberChartType, categoryNumberChartType} = this.state;
    const chartTypeOptions = chartType.map((item) => {
      return <Option key={item.value} value={item.value}>{item.key}</Option>
    })
    return (
      <div className="main-content">
        <div>
          <h2 style={{ marginBottom: "30px" }}>
            新增患者数量统计
          </h2>
        </div>
        {this.renderSearch()}
        {patientNumberChartType != 'pie' && <ReactEcharts option={this.getPatientNumberOption()}  />}
        {patientNumberChartType == 'pie' && <ReactEcharts option={this.getPatientNumberPieOption()}  />}
        <hr/>
        <div>
          <h2 style={{ marginBottom: "30px" }}>
            患病类别数量统计
          </h2>
        </div>
        <Select style={{ width: 160 }} onChange={this.changeCategoryNumberChartType} defaultValue='pie'>
          {chartTypeOptions}
        </Select>
        {categoryNumberChartType != 'pie' && <ReactEcharts option={this.getCategoryNumberOption()}  />}
        {categoryNumberChartType == 'pie' && <ReactEcharts option={this.getCategoryNumberPieOption()}  />}
        <hr/>
        <div>
          <h2 style={{ marginBottom: "30px" }}>
            智能分析使用频率统计
          </h2>
        </div>
      </div>
    );
  }
}

export default StatisticAnalysis;
