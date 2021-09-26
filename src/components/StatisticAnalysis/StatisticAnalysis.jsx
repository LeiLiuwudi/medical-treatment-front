import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Message,
  Progress,
  message,
} from "antd";
import ReactEcharts from "echarts-for-react";
import API from "../../api/api";
import _ from "lodash";
import { getAge } from "../../utils/dateUtils";
import RenderHistoryTable from "./RenderHistoryTable";

class StatisticAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientInfo: {}, // 患者基本信息
      existPatient: false,
      historyRecords: [], // 历史治疗记录
      anaResultVisible: false,
      percent: 0, // 进度条进度
      progressVisible: false, // 是否显示进度条
    };
  }

  getOption = () => {
    let { historyRecords } = this.state;
    const option = {
      title: {
        text: "脊椎疾病严重程度",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: ["脊椎疾病严重程度等级"],
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          name: "治疗次数",
          data: historyRecords.map((item) => `第${item.treatCount}次`),
          position: "bottom",
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "脊椎疾病严重程度等级",
        },
      ],
      series: [
        {
          name: "脊椎疾病严重程度等级",
          type: "line",
          stack: "总量",
          label: {
            normal: {
              show: true,
              position: "top",
            },
          },
          areaStyle: {},
          data: historyRecords.map((item) => item.classificationBefore),
        },
      ],
    };
    return option;
  };

  queryPatient = (v) => {
    let param = v;
    API.getPatient(param).then((res) => {
      console.log("getPatient", res);
      const { data, code, msg } = res;
      if (code === "200" && data.length > 0) {
        this.setState({
          patientInfo: data[0],
          existPatient: true,
        });
      } else if( code ==='200' && data.length ===0 ){
        Message.error('该患者不存在');
      }else{
        Message.error(msg);
      }
    });
  };

  // 获取历史治疗记录
  queryHistory = (v) => {
    let param = v;
    API.getHistoryRecords(param).then((res) => {
      console.log("getHistoryRecords 历史治疗记录", res);
      let records = _.get(res, "data");
      records.sort((a, b) => {
        return a.treatCount - b.treatCount;
      });
      this.setState({
        historyRecords: records,
        treatCount: records.length + 1,
      });
    });
  };

  handleQueryInfo = (v) => {
    this.queryPatient(v);
    this.queryHistory(v);
  };

  handleDownload = () => {
    const { patientInfo } = this.state;
    window.location.href =
      "http://10.16.98.192:9090/record/download?id=" + _.get(patientInfo, "id") 
      + "&description=" + " 经过脊椎疾病相关治疗方案，经红外热成像技术的客观分析可见，患者脊椎疾病严重程度有了明显的改善。";
    // window.open("http://10.16.98.192:9090/record/download?id=" + _.get(patientInfo, "id") 
    // + "&description=" + " 经过脊椎疾病相关治疗方案，经红外热成像技术的客观分析可见，患者脊椎疾病严重程度有了明显的改善。") ;
    // const param = {
    //   id: _.get(patientInfo, "id"),
    //   description: "经过脊椎疾病相关治疗方案，经红外热成像技术的客观分析可见，患者脊椎疾病严重程度有了明显的改善。",
    // }
    // API.downloadRecord(param).then((res) => {});
  }

  handleAnalysis = () => {
    this.setState({
      progressVisible: true,
    });
    let timer = setInterval(() => {
      let percent = this.state.percent + 10;
      if (percent > 100) {
        percent = 100;
        clearImmediate(timer);
        this.setState({
          anaResultVisible: true,
        });
      }
      this.setState({ percent });
    }, 500);
  };

  // 查询表单
  renderSearch = () => {
    return (
      <Form
        layout="inline"
        style={{ marginBottom: 30 }}
        onFinish={this.handleQueryInfo}
      >
        <Form.Item name="patientId" label="患者id：">
          <Input style={{ width: 100, marginRight: 15 }} placeholder="患者id" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  };
  render() {
    let { existPatient, patientInfo } = this.state;
    return (
      <div className="main-content">
        {/* {this.renderSearch()} */}
        
      </div>
    );
  }
}

export default StatisticAnalysis;
