import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import RenderInfMode from "./RenderInfMode";
import RenderCTMode from "./RenderCTMode";
import RenderMRIMode from "./RenderMRIMode";
import RenderHistoryTable from "../StatisticAnalysis/RenderHistoryTable";
import _ from "lodash";
import {
  Input,
  Form,
  Select,
  Modal,
  Button,
  Message,
  Tabs,
  Table,
  Progress,
  Image
} from "antd";
import { UploadOutlined } from '@ant-design/icons';
import "./AI-analysis.less";
import API from "../../api/api";
import { getDesFromClassification } from "../../utils/diseaseInfo";
import { getAge } from "../../utils/dateUtils";

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class AIAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyRecordVisible: false, // 是否显示历史治疗记录 Modal
      historyNIRSVisible: false, // 是否显示近红外记录 Modal
      currentTablePage: 1, // 历史治疗记录表格当前页码
      existPatient: false, // 是否有患者信息
      patientInfo: {}, // 患者基本信息
      patientId: "", // 患者id
      patientName: "",
      doctorList:[],
      patientList:[],
      exactSearch: false,
      repeatSwitch: false,
      recognizeList:[],
      birthday:"",
      detectId: -1,
      detectNeck: false,
      gender:"",
      profession:"",
      addInfrareImage: false,
      evalutionList:[
        {
          count:1,
          percent:'-',
          temperature: 37.5
        },
        {
          count:2,
          percent:'-21.4%',
          temperature: 37.1
        },
        {
          count:3,
          percent:'27.3%',
          temperature: 37.5
        },
        {
          count:4,
          percent:'0%',
          temperature: 37.5
        },
        {
          count:5,
          percent:'21.4%',
          temperature: 37.9
        },
      ],
      imgResult:"",
      curFileBase64:"",
      anaResultVisible: false,
      percent: 0, // 进度条进度
      progressVisible: false, // 是否显示进度条
      historyRecords: [], // 患者历史治疗记录
      treatCount: 0, // 治疗次数
      evalutionResult:[],
      analysisFileBefore: {
        img: "",
        txt: {},
      }, // 分析需要上传的内容
      analysisFileAfter: {
        img: "",
        txt: {},
      }, // 分析需要上传的内容
      anaResultBefore: { imgUrl: "", classification: "", loading: false }, // 治疗前的智能分析结果
      anaResultAfter: { imgUrl: "", classification: "", loading: false }, //治疗后的智能分析结果
    };
  }

  // 子组件传来的 图片、 txt 信息
  handleFile = async (v) => {
    const imgInfoBefore = _.get(v, "fileBefore.imgInfoBefore");
    const txtInfoBefore = _.get(v, "fileBefore.txtInfoBefore");
    const imgInfoAfter = _.get(v, "fileAfter.imgInfoAfter");
    const txtInfoAfter = _.get(v, "fileAfter.txtInfoAfter");
    let new_analysisFileBefore = this.state.analysisFileBefore;
    new_analysisFileBefore.img = await getBase64(imgInfoBefore);
    new_analysisFileBefore.txt = txtInfoBefore;
    let new_analysisFileAfter = this.state.analysisFileAfter;
    new_analysisFileAfter.img = await getBase64(imgInfoAfter);
    new_analysisFileAfter.txt = txtInfoAfter;
    this.setState({
      analysisFileBefore: new_analysisFileBefore,
      analysisFileAfter: new_analysisFileAfter,
    });
  };

  getDoctorList() {
    API.getDoctorList()
      .then((res) => {
        let _data = res.data;
        let _code = res.code;
        if (_code === "200") {
          this.setState({
            doctorList: _data,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //   页面渲染前执行函数
  componentDidMount() {
    this.getDoctorList();
  }

  // 查询表单
  renderSearch = () => {
    const {doctorList} = this.state;
    const doctorOptions = doctorList.map((item) => {
      return <Option key={item.id} value={item.id}>{item.name}</Option>
    })
    return (
      <Form
        layout="inline"
        style={{ marginBottom: 30 }}
        onFinish={this.handleSearch}
        ref="patientQueryForm"
      >
        <Form.Item name="name" label="患者姓名：">
          <Input placeholder="患者姓名" style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="doctorId" label="主治医生：">
        <Select placeholder="请选择医生" style={{ width: 160 }}>
          {doctorOptions}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  };

  handleSearch = (v) => {
    this.queryPatient(v);
  };

  // 患者基本信息查询
  queryPatient = (v) => {
    let param = {};
    let values = this.refs.patientQueryForm.getFieldsValue();
    for (const [, value] of Object.entries(values)) {
      if (value) {
        param = {
          name: values.name,
          doctorId: values.doctorId,
        };
      }
    }

    // 获取患者列表的API，成功
    API.queryPatient(param).then((res) => {
      console.log("getPatient", res);
      const { data, code, msg } = res;
      if (code === "200") {
        this.setState({
          patientList: data,
        });
        if(data.length == 0){
          Message.info("没有找到符合查询条件的病患信息");
        }else{
          this.setState({
            repeatSwitch: true,
          })
        }
      } else {
        Message.error(msg);
      }
    });
  };

  // 获取历史治疗记录
  queryHistory = (v) => {
    let param = {};
    if (typeof v === "object") {
      param = v;
    } else {
      // 判断搜索框输入的参数是id还是name(包括搜索框输入，url获取id 这两种)
      if (isNaN(v)) {
        param.patientName = v;
      } else {
        param.patientId = v;
      }
    }
    API.getHistoryRecords(param).then((res) => {
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

  // 上传治疗前的内容
  handleSaveBeforeTreat = () => {
    const values = this.refs.beforeTreatForm.getFieldsValue();
    let param = values;
    param.time = new Date();
    API.saveBeforeTreat(param).then((res) => {
      if ((res.code = "200")) {
        Message.success("上传成功！");
      } else {
        Message.error("上传失败！");
      }
    });
  };

  // 本次治疗的记录
  handleTreat = () => {
    const values = this.refs.treatForm.getFieldsValue();
    let param = values;
    API.treat(param).then((res) => {
      if ((res.code = "200")) {
        Message.success("上传成功！");
      } else {
        Message.error("上传失败！");
      }
    });
  };

  // 上传本次治疗后的内容
  handleSaveAfterTreat = () => {
    const values = this.refs.afterTreatForm.getFieldsValue();
    console.log(values);
    let param = values;
    API.saveAfterTreat(param).then((res) => {
      if ((res.code = "200")) {
        Message.success("上传成功！");
      } else {
        Message.error("上传失败！");
      }
    });
  };

  // 分析治疗前
  handleAnalysisBefore = () => {
    console.log("this.state.patientId", this.state.patientId);
    let anaResultBefore = this.state.anaResultBefore;
    anaResultBefore.loading = true;
    this.setState({
      anaResultBefore,
    });
    let formData = new FormData();
    formData.append("original_img", this.state.analysisFileBefore.img);
    formData.append("temp_matrix", this.state.analysisFileBefore.txt);
    formData.append("treatCount", this.state.treatCount);
    formData.append("patientId", this.state.patientId);
    formData.append("process", "before");

    API.getAnalyseResult(formData)
      .then((res) => {
        let new_anaResultBefore = this.state.anaResultBefore;
        new_anaResultBefore.imgUrl = _.get(res, "neck_area");
        new_anaResultBefore.classification = _.get(res, "classification");
        this.setState({
          anaResultBefore: new_anaResultBefore,
        });
      })
      .catch((err) => {
        Message.error("分析失败！");
      })
      .finally(() => {
        let new_anaResultBefore = this.state.anaResultBefore;
        new_anaResultBefore.loading = false;
        this.setState({
          anaResultBefore: new_anaResultBefore,
        });
      });
  };

  // 分析治疗后
  handleAnalysisAfter = () => {
    let anaResultAfter = this.state.anaResultAfter;
    anaResultAfter.loading = true;
    this.setState({
      anaResultAfter,
    });
    var formData = new FormData();
    formData.append("original_img", this.state.analysisFileAfter.img);
    formData.append("temp_matrix", this.state.analysisFileAfter.txt);
    formData.append("treatCount", this.state.treatCount);
    formData.append("patientId", this.state.patientId);
    formData.append("process", "after");
    API.getAnalyseResult(formData)
      .then((res) => {
        let new_anaResultAfter = this.state.anaResultAfter;
        new_anaResultAfter.imgUrl = _.get(res, "neck_area");
        new_anaResultAfter.classification = _.get(res, "classification");
        this.setState({
          anaResultAfter: new_anaResultAfter,
        });
      })
      .catch((err) => {
        Message.error("分析失败！");
      })
      .finally(() => {
        let new_anaResultAfter = this.state.anaResultAfter;
        new_anaResultAfter.loading = false;
        this.setState({
          anaResultAfter: new_anaResultAfter,
        });
      });
  };

  // 是否显示历史治疗记录
  showHistoryRecord = () => {
    this.setState({
      historyRecordVisible: true,
    });
  };

  historyRecordCancel = () => {
    this.setState({
      repeatSwitch: false,
    });
  };
  addImageCancle = () => {
    this.setState({
      addInfrareImage: false,
    });
  }

  detectCancle = () => {
    this.setState({
      detectNeck: false
    })
  }

  // 是否显示近红外记录
  showHistoryNIRS = () => {
    this.setState({
      historyNIRSVisible: true,
    });
  };

  historyNIRSCancle = () => {
    this.setState({
      historyNIRSVisible: false,
    });
  };

  changeState = (record) => {
    console.log(record);
    this.setState({
      patientInfo:record,
      repeatSwitch: false,
      exactSearch: true,
    })
    let param = {
      patientId: record.id,
    }
    this.getRecognizeList(param);
  }
  
  getRecognizeList = (param) => {
    API.getRecognizeList(param).then((res) => {
      const { data, code, msg } = res;
      if (code === "200") {
        this.setState({
          recognizeList: data,
        });
      } else {
        Message.error(msg);
      }
    });
  }

  // 渲染近红外记录的曲线
  renderNIRSLine = () => {
    let option = {
      legend: {},
      tooltip: {
        trigger: "axis",
        showContent: false,
      },
      dataset: {
        source: [
          [
            "product",
            "2020-05-21",
            "2020-05-30",
            "2020-06-02",
            "2020-06-07",
            "2020-06-12",
            "2020-06-19",
          ],
          ["Matcha Latte", 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
          ["Milk Tea", 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
          ["Cheese Cocoa", 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
          ["Walnut Brownie", 55.2, 67.1, 69.2, 72.4, 53.9, 39.1],
        ],
      },
      xAxis: { type: "category" },
      yAxis: { gridIndex: 0 },
      grid: { top: "10%" },
      series: [
        { type: "line", smooth: true, seriesLayoutBy: "row" },
        { type: "line", smooth: true, seriesLayoutBy: "row" },
        { type: "line", smooth: true, seriesLayoutBy: "row" },
        { type: "line", smooth: true, seriesLayoutBy: "row" },
      ],
    };
    return <ReactEcharts option={option} />;
  };

  recognizeClassification = () => {
    let param = {
      id: this.state.detectId,
    };
    API.recognizeResult(param)
      .then((response) => {
        let param1 = {
          patientId: this.state.patientInfo.id,
        }
        this.getRecognizeList(param1);
        this.setState({
          detectNeck: false
        })
      })
  }
  
  detect = (id) =>{
    let param = {
      id: id,
    };
    this.setState({
      detectId: id,
    })
    API.cutResult(param)
      .then((response) => {
        console.log(response.result)
        this.setState({
          imgResult: response.result,
          detectNeck: true
        })
      })
      .catch((error) => {
        Message.error("未检测到颈部区域");
      });
    
  }

  beforeUpload = (f) =>{
    return false;
  }

  show = () => {
    this.setState({
      addInfrareImage: true
    })
  }
  
  onFinish = async(values) =>{
    let param = values;
    param.infraImage = this.state.curFileBase64;
    API.upload(param).then((res) => {
      if (res.code === "200") {
        Message.success("上传成功！");
        let param ={
          patientId: this.state.patientInfo.id,
        }
        this.getRecognizeList(param);
        this.setState({
          addInfrareImage: false,
        })
      } else {
        Message.warning(res.msg);
      }
    });
  }

  handleChange = async(e) => {
    let base64 = await getBase64(e.target.files[0]);
    console.log(base64);
    this.setState({
      curFileBase64: base64,
    })
  }

  getOption = ()=>{
    let count = this.state.treatCount
    var numArr = new Array(count)
    for(var i=1;i<=count;i++){
        numArr[i-1] = i;
    }
    let xData = numArr.map((item) => {
      return "第"+item+"次治疗"
    })
    let option = {
        title: {  //标题
            text: '与正常图像多尺度熵的欧式距离变化趋势',
            x: 'center',
            textStyle: { //字体颜色
                color: '#ccc'
            }
        },
        tooltip:{ //提示框组件
            trigger: 'axis'
        },
        xAxis: { //X轴坐标值
            data: xData
        },
        yAxis: {
            type: 'value' //数值轴，适用于连续数据
        },
        series : [
            {
                name:'距离', //坐标点名称
                type:'line', //线类型
                data:this.state.evalutionResult //坐标点数据
            }
        ]
    }
    return option;
}

  handleAnalysis = () => {
    this.setState({
      progressVisible: true,
    });
    let param = {
      id: this.state.patientInfo.id
    }
    API.effectEvaluation(param)
      .then((response) => {
        console.log(111111, response.result)
        this.setState({
          treatCount: response.count,
          evalutionResult: response.result
        })
      })
    let timer = setInterval(() => {
      let percent = this.state.percent + 10;
      if(this.state.evalutionResult.length >1){
        percent = 100;
        clearImmediate(timer);
        this.setState({
          anaResultVisible: true,
        });
      }else if (percent > 90) {
        percent = 90;
        
      }
      this.setState({ percent });
    }, 1000);
  };

  // 渲染整体的页面
  render() {
    const { exactSearch, patientInfo, imgResult} = this.state;
    const base64 = 'data:image/jpeg;base64,' + imgResult;
    const innerHtml = "<img src='"+ base64 + "' width=200 height=100/>"
    const columns = [
        {
          title: "id",
          dataIndex: "id",
          width: "6%",
          align: "center",
        },
        {
          title: "患者姓名",
          dataIndex: "patientName",
          width: "6%",
          align: "center",
        },
        {
          title: "红外热像",
          dataIndex: "infraredPath",
          width: "6%",
          align: "center",
          render: (text, record, index) => {
            const src = "http://localhost:8001/" + text;
            return <img src={src} alt="" crossOrigin="anonymous" width="100px" height="100px"/>
          }
        },
        {
          title: "就诊时间",
          dataIndex: "createTime",
          width: "6%",
          align: "center",
        },
        {
          title: "识别结果",
          dataIndex: "recognizeResult",
          width: "6%",
          align: "center",
          render: (text,record,index) => {
            return (text == "" || text == null || text == undefined) ? 
            <span>
              <span style={{color:"red"}}>未检测</span>
              <Button
              type="primary"
              // size="small"
              style={{ marginLeft: "5px" }}
              onClick={() => this.detect(record.id)}
            >
              点击进行检测
            </Button>
            </span> : text;
          }
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "10%",
          align: "center",
          render: (text, record, index) => {
            return (
              <Button
                type="primary"
                // size="small"
                style={{ marginRight: "5px" }}
                onClick={() => this.show()}
              >
                添加新的红外热像拍摄记录
              </Button>
            );
          },
        },
    ]
    const evalutionColumns = [
      {
        title: "治疗次数",
        dataIndex: "count",
        width: "6%",
        align: "center",
      },
      {
        title: "与正常图像相比环比变化",
        dataIndex: "percent",
        width: "6%",
        align: "center",
      },
      {
        title: "红外图像局部最高温度",
        dataIndex: "temperature",
        width: "6%",
        align: "center",
      },
    ]
    return (
      <div
        className="main-content"
      >
        {!exactSearch && (<div
          className="left"
        >
          <div>
            <h2 style={{ marginBottom: "30px" }}>
              请输入需要添加分析的患者信息：
            </h2>
            {this.renderSearch()}
          </div>
        </div>)}

        <Modal
          title={"符合查询条件的病患记录"}
          visible={this.state.repeatSwitch}
          onCancel={this.historyRecordCancel}
          width="90%"
          style={{
            position: "absolute",
            top: "8px",
            left: "5%",
          }}
          footer={null}
        >
          <div
            className="history"
            style={{
              width: "100%",
              height: "70vh",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          >
            <RenderHistoryTable historyRecords={this.state.patientList} changeState={this.changeState}/>
          </div>
        </Modal>
        <Modal
          title={"为当前患者添加新的红外热像记录"}
          visible={this.state.addInfrareImage}
          onCancel={this.addImageCancle}
          footer={null}
        >
          <Form
            name="infrare"
            onFinish={this.onFinish}
            scrollToFirstError
          >
          <Form.Item
            name="patientId"
            label="患者id"
            initialValue={patientInfo.id}
            rules={[
              {
                required: true,
                message: "请输入患者id",
              },
            ]}
          >
            <Input placeholder="请输入患者id" disabled/>
          </Form.Item>
          <Form.Item
            name="patientName"
            label="患者姓名"
            initialValue={patientInfo.name}
            rules={[
              {
                required: true,
                message: "请选择患者姓名",
              },
            ]}
          >
            <Input placeholder="请选择患者姓名" disabled/>
          </Form.Item>
          <Form.Item
            name="infraImage"
            label="红外热像"
            rules={[
              {
                required: true,
                message: "请上传红外热像",
              },
            ]}
          >
            <Input type="file" onChange={this.handleChange}/>
            {/* <Upload name="logo"  
            beforeUpload={this.beforeUpload}
          >
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </Upload> */}
          </Form.Item>
          <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 150,
              marginLeft: 150,
            }}
          >
            确定上传新的记录
          </Button>
        </Form.Item>
        </Form>
        </Modal>
         { exactSearch && (<div><div
          className="left"
        >
          <div>
            <h2 style={{ marginBottom: "30px" }}>
              当前患者的红外热像拍摄记录
            </h2>
            <h3>
              当前患者：{patientInfo.name}_____{patientInfo.gender == 1 ? "男":"女"}_____{patientInfo.profession}
            </h3>
          </div>
        </div>
        <Table
          bordered="true"
          columns={columns}
          dataSource={this.state.recognizeList}
          // scroll={{ x: "max-content", y: 600 }}
        /></div>)}
        {exactSearch && this.state.recognizeList.length==0 && (
          <Button
          type="primary"
          // size="small"
          style={{ marginRight: "5px" }}
          onClick={() => this.show()}
        >
          去添加新的红外热像拍摄记录
        </Button>
        )}
        {exactSearch && this.state.recognizeList.length!=0 && (
          <Button
          type="primary"
          // size="small"
          style={{ marginRight: "5px" }}
          onClick={this.handleAnalysis}
        >
          点击进行阶段性治疗效果分析
        </Button>
        )}
        {this.state.progressVisible && (
              <Progress
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                percent={this.state.percent}
              />
            )}
        {this.state.anaResultVisible && (
              <div className="anal">
                <h2>智能分析图形结果</h2>
                <div className='parent'>
                  <div className='chart'>
                    <ReactEcharts option={this.getOption()} theme="ThemeStyle" />
                  </div>
                  <div className='table'>
                    <Table
                      bordered="true"
                      columns={evalutionColumns}
                      dataSource={this.state.evalutionList}
                    />
                  </div>
                </div>
                
                <p>
                  经过深度学习智能模型分析，该患者病情未见明显好转，效果不显著，建议更换治疗方案。
                </p>
                <h2>智能分析文本报告</h2>
                <p>
                  结合患者主诉和临床表现，考虑颈椎强行性病变可能性，建议住院观察，以期进一步的判断
                </p>
                <Button 
                  type="primary" 
                  style={{ marginBottom: 20 }} 
                  onClick={this.handleDownload}
                >
                  下载报告
                </Button>
              </div>
            )}
        <Modal
          title={"检测到的颈部区域"}
          visible={this.state.detectNeck}
          onCancel={this.detectCancle}
          footer={null}
        >
          <div dangerouslySetInnerHTML={{__html:innerHtml}} style={{textAlign:'center'}}/>
          <br/>
          <br/>
          <div style={{textAlign:'center'}}><Button type="primary" onClick={this.recognizeClassification}>点击继续进行病种分类检测</Button></div>
        </Modal>
      </div>
    );
  }
}

export default AIAnalysis;
