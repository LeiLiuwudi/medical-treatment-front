import React, { Component, Fragment } from "react";
import { Descriptions, Button, Card, Message, Empty } from "antd";
import ReactEcharts from "echarts-for-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./print.less";
import API from "../../api/api";
class Print extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medcineList: [],
      nonMedicineList: [],
      patientData: undefined,
      taskData: undefined,
      testType: undefined,
      channelOne: {},
      channelTwo: {},
      channelThree: {},
      channelFour: {}
    };
  }
  componentDidMount() {
    API.getMedicineList({}).then(res => {
      this.setState({
        medcineList: res.data
      });
    });
    API.getNonMedicineList({}).then(res => {
      this.setState({
        nonMedicineList: res.data
      });
    });
    let id = this.props.match.params.id;
    this.searchInfo(id);
  }
  searchInfo = id => {
    let param = {
      medId: id
    };
    API.InquirePatientTaskList(param).then(res => {
      console.log(res);
      this.setState({
        patientData: res.data[0].patient,
        taskData: res.data[0].task,
        testType: res.data[0].type
      });
      API.getBloodOxygenData({ path: res.data[0].task.dataPath }).then(res => {
        if (res.code === "200") {
          let fourChannelsData = res.data.fourChannelsData;
          let channel = [
            "channelOne",
            "channelTwo",
            "channelThree",
            "channelFour"
          ];
          fourChannelsData.map((item, index) => {
            if (item) {
              let timeList = [];
              let toiList = [];
              let dtHbList = [];
              let thiList = [];
              let dhbList = [];
              let dhbO2List = [];
              item.map((itemList, i) => {
                timeList.push(itemList.time);
                toiList.push(itemList.toi);
                dtHbList.push(itemList.dtHb);
                thiList.push(itemList.thi);
                dhbList.push(itemList.dhb);
                dhbO2List.push(itemList.dhbO2);
              });
              channel[index] = Object.assign(
                {},
                { timeList: timeList },
                { toiList: toiList },
                { dtHbList: dtHbList },
                { thiList: thiList },
                { dhbList: dhbList },
                { dhbO2List: dhbO2List }
              );
              if (index === 0) {
                this.setState({
                  channelOne: channel[index]
                });
              }
              if (index === 1) {
                this.setState({
                  channelTwo: channel[index]
                });
              }
              if (index === 2) {
                this.setState({
                  channelThree: channel[index]
                });
              }
              if (index === 3) {
                this.setState({
                  channelFour: channel[index]
                });
              }
            }
          });
        } else {
          Message.error("?????????????????????");
        }
      });
    });
  };

  handlePrintClick = () => {
    html2canvas(this.refs.pdf, { scale: 2 }).then(canvas => {
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;

      //??????pdf??????html???????????????canvas??????;
      var pageHeight = (contentWidth / 595.28) * 841.89;
      //?????????pdf???html????????????
      var leftHeight = contentHeight;
      //pdf????????????
      var position = 0;
      //a4????????????[595.28,841.89]???html???????????????canvas???pdf??????????????????
      var imgWidth = 555.28;
      var imgHeight = (555.28 / contentWidth) * contentHeight;

      var pageData = canvas.toDataURL("image/jpeg", 1.0);

      var pdf = new jsPDF("", "pt", "a4");
      //???????????????????????????????????????html?????????????????????????????????pdf???????????????(841.89)
      //??????????????????pdf????????????????????????????????????
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, "JPEG", 20, 20, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, "JPEG", 20, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          //?????????????????????
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save(
        `${this.state.patientData.name}_${this.state.patientData.medId}.pdf`
      );
    });
  };

  getOptionChannelOne = () => {
    return {
      title: {
        text: "??????1"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["toi", "dtHb", "thi", "dhb", "dhbO2"]
      },
      grid: {
        left: "4%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: this.state.channelOne.timeList
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "toi",
          type: "line",
          stack: "??????",
          data: this.state.channelOne.toiList
        },
        {
          name: "dtHb",
          type: "line",
          stack: "??????",
          data: this.state.channelOne.dtHbList
        },
        {
          name: "thi",
          type: "line",
          stack: "??????",
          data: this.state.channelOne.thiList
        },
        {
          name: "dhb",
          type: "line",
          stack: "??????",
          data: this.state.channelOne.dhbList
        },
        {
          name: "dhbO2",
          type: "line",
          stack: "??????",
          data: this.state.channelOne.dhbO2List
        }
      ]
    };
  };
  getOptionChannelTwo = () => {
    return {
      title: {
        text: "??????2"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["toi", "dtHb", "thi", "dhb", "dhbO2"]
      },
      grid: {
        left: "4%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: this.state.channelTwo.timeList
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "toi",
          type: "line",
          stack: "??????",
          data: this.state.channelTwo.toiList
        },
        {
          name: "dtHb",
          type: "line",
          stack: "??????",
          data: this.state.channelTwo.dtHbList
        },
        {
          name: "thi",
          type: "line",
          stack: "??????",
          data: this.state.channelTwo.thiList
        },
        {
          name: "dhb",
          type: "line",
          stack: "??????",
          data: this.state.channelTwo.dhbList
        },
        {
          name: "dhbO2",
          type: "line",
          stack: "??????",
          data: this.state.channelTwo.dhbO2List
        }
      ]
    };
  };
  getOptionChannelThree = () => {
    return {
      title: {
        text: "??????3"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["toi", "dtHb", "thi", "dhb", "dhbO2"]
      },
      grid: {
        left: "4%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: this.state.channelThree.timeList
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "toi",
          type: "line",
          stack: "??????",
          data: this.state.channelThree.toiList
        },
        {
          name: "dtHb",
          type: "line",
          stack: "??????",
          data: this.state.channelThree.dtHbList
        },
        {
          name: "thi",
          type: "line",
          stack: "??????",
          data: this.state.channelThree.thiList
        },
        {
          name: "dhb",
          type: "line",
          stack: "??????",
          data: this.state.channelThree.dhbList
        },
        {
          name: "dhbO2",
          type: "line",
          stack: "??????",
          data: this.state.channelThree.dhbO2List
        }
      ]
    };
  };
  getOptionChannelFour = () => {
    return {
      title: {
        text: "??????4"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["toi", "dtHb", "thi", "dhb", "dhbO2"]
      },
      grid: {
        left: "4%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: this.state.channelFour.timeList
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "toi",
          type: "line",
          stack: "??????",
          data: this.state.channelFour.toiList
        },
        {
          name: "dtHb",
          type: "line",
          stack: "??????",
          data: this.state.channelFour.dtHbList
        },
        {
          name: "thi",
          type: "line",
          stack: "??????",
          data: this.state.channelFour.thiList
        },
        {
          name: "dhb",
          type: "line",
          stack: "??????",
          data: this.state.channelFour.dhbList
        },
        {
          name: "dhbO2",
          type: "line",
          stack: "??????",
          data: this.state.channelFour.dhbO2List
        }
      ]
    };
  };

  render() {
    const WCSTTask = {
      ????????????: "ta",
      ???????????????: "cr",
      ?????????????????????: "pcr",
      ???????????????: "te",
      ????????????????????????: "pe",
      ??????????????????: "pr",
      ???????????????????????????: "ppr",
      ??????????????????: "pse",
      ???????????????????????????: "ppe",
      ??????????????????: "npe",
      ???????????????????????????: "pnpe",
      ????????????????????????: "clr",
      ????????????????????????: "pclr",
      ???????????????: "cc",
      ????????????????????????????????????: "tcfc",
      ????????????????????????: "fm",
      ???????????????: "l2l",
      ??????: "useTime"
    };
    const patientData = this.state.patientData;
    const taskData = this.state.taskData;
    const testType = this.state.testType;
    let medicine = "";
    let nonMedicine = "";
    if (taskData) {
      if (taskData.medArray.length > 0) {
        taskData.medArray.map((item, index) => {
          this.state.medcineList.map(listItem => {
            if (item === listItem.id) {
              medicine += `${listItem.name}  `;
            }
          });
        });
      }
      if (taskData.nonMedArray.length > 0) {
        taskData.nonMedArray.map((item, index) => {
          this.state.nonMedicineList.map(listItem => {
            if (item === listItem.id) {
              nonMedicine += `${listItem.name}  `;
            }
          });
        });
      }
    }
    const title = this.state.patientData
      ? `${this.state.patientData.name}_${this.state.patientData.medId}`
      : "";
    return (
      <div
        style={{
          margin: "10px 50px",
          position: "relative",
          overflow: "auto",
          width: "calc(100% - 100px)"
        }}
      >
        <Button
          type="primary"
          style={{ position: "absolute", right: "20px" }}
          onClick={this.handlePrintClick}
        >
          ???????????????????????????
        </Button>
        <div ref="pdf" style={{ padding: "16px" }}>
          <h1 style={{ width: "260px", margin: "auto" }}>{title}</h1>
          <div>
            {patientData !== undefined &&
              taskData !== undefined &&
              testType !== undefined && (
                <Descriptions bordered title="????????????">
                  <Descriptions.Item label="????????????">
                    {patientData.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="????????????">
                    {testType}
                  </Descriptions.Item>
                  <Descriptions.Item label="????????????">
                    {patientData.medId}
                  </Descriptions.Item>
                  <Descriptions.Item label="????????????">
                    {patientData.gender === 1 ? "???" : "???"}
                  </Descriptions.Item>
                  <Descriptions.Item label="????????????">
                    {patientData.age}
                  </Descriptions.Item>
                  <Descriptions.Item label="????????????(kg)">
                    {patientData.weight}
                  </Descriptions.Item>
                  <Descriptions.Item label="????????????(cm)">
                    {patientData.height}
                  </Descriptions.Item>
                  <Descriptions.Item label="?????????????????????">
                    {taskData.medArray.length > 0 ? medicine : "???????????????"}
                  </Descriptions.Item>
                  <Descriptions.Item label="???????????????????????????">
                    {taskData.medInt ? taskData.medInt : "?????????"}
                  </Descriptions.Item>
                  <Descriptions.Item label="???????????????">
                    {taskData.nonMedArray.length > 0 ? nonMedicine : "?????????"}
                  </Descriptions.Item>
                  <Descriptions.Item label="?????????????????????">
                    {taskData.time}
                  </Descriptions.Item>
                </Descriptions>
              )}
          </div>
          <div>
            {testType === 0 && (
              <Fragment>
                <Descriptions
                  bordered
                  title="??????????????????"
                  style={{ marginTop: "20px" }}
                >
                  {Object.keys(WCSTTask).map((item, index) => {
                    let k = WCSTTask[item];
                    return (
                      <Descriptions.Item key={index} label={item}>
                        {taskData[k]}
                      </Descriptions.Item>
                    );
                  })}
                </Descriptions>
              </Fragment>
            )}
          </div>
          <div className="curve" style={{ marginTop: "24px" }}>
            <Card>
              <h2
                style={{
                  color: "gray",
                  borderBottom: "2px solid #e8e8e8"
                }}
              >
                ??????1???????????????
              </h2>
              {Object.keys(this.state.channelOne).length > 0 && (
                <ReactEcharts
                  option={this.getOptionChannelOne()}
                ></ReactEcharts>
              )}
              {Object.keys(this.state.channelOne).length === 0 && <Empty />}
            </Card>
            <Card>
              <h2
                style={{
                  color: "gray",
                  borderBottom: "2px solid #e8e8e8"
                }}
              >
                ??????2???????????????
              </h2>
              {Object.keys(this.state.channelTwo).length > 0 && (
                <ReactEcharts
                  option={this.getOptionChannelTwo()}
                  lazyUpdate={true}
                ></ReactEcharts>
              )}
              {Object.keys(this.state.channelTwo).length === 0 && <Empty />}
            </Card>
            <Card>
              <h2
                style={{
                  color: "gray",
                  borderBottom: "2px solid #e8e8e8"
                }}
              >
                ??????3???????????????
              </h2>
              {Object.keys(this.state.channelThree).length > 0 && (
                <ReactEcharts
                  option={this.getOptionChannelThree()}
                ></ReactEcharts>
              )}
              {Object.keys(this.state.channelThree).length === 0 && <Empty />}
            </Card>
            <Card>
              <h2
                style={{
                  color: "gray",
                  borderBottom: "2px solid #e8e8e8"
                }}
              >
                ??????4???????????????
              </h2>
              {Object.keys(this.state.channelFour).length > 0 && (
                <ReactEcharts
                  option={this.getOptionChannelFour()}
                ></ReactEcharts>
              )}
              {Object.keys(this.state.channelFour).length === 0 && <Empty />}
            </Card>
          </div>
          <h2 style={{ marginTop: "24px", fontWeight: "bold" }}>
            ?????????????????????
          </h2>
          <p>??????????????????</p>
        </div>
      </div>
    );
  }
}

export default Print;
