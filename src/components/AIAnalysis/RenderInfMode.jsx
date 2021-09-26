import React, { Component } from "react";
import moment from "moment";
import { Input, Form, Select, DatePicker, Button, Steps, Message } from "antd";
import API from "../../api/api";
import { treatList, chineseMedicine } from "../../utils/medicalInfo";
import PicturesWall from "./pictureWall";
import FileWall from "./FileWall";
import _ from "lodash";

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

export default class RenderInfMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infCurrentStep: 0, // 近红外当前步骤
      infBeforeInfo: {
        infraBeforeFile: undefined, // 图片
        infraBeforeTxt: undefined, // 温度矩阵
        infraBeforeDesc: "", // 描述
        infraBeforeExcp: "", // 异常
        timeBefore: "", // 时间
        medicationBefore: "", // 用药情况
        chief: "", // 主诉
      },
      infMiddleInfo: {
        treat: [], // 治疗方案
        treatDetail: "", //治疗具体情况
        treatMedicine: [], // 治疗用药
        timeMiddle: "", //治疗时间
      },
      infAfterInfo: {
        infraAfterFile: undefined, // 路径
        infraAfterTxt: undefined, //温度矩阵
        infraAfterDesc: "", // 描述
        infraAfterExcp: "", // 异常
        timeAfter: "", // 时间
        medicationAfter: "", // 用药情况
      },
      beforeFile: {
        imgInfoBefore: {},
        txtInfoBefore: {},
      }, // 治疗前上传的文件信息
      afterFile: {
        imgInfoAfter: {},
        txtInfoAfter: {},
      }, // 治疗后上传的文件信息
    };
  }

  // 更改近红外当前步骤
  handleInfStepChange = (current) => {
    this.setState({ infCurrentStep: current });
  };

  // 处理图片变化
  handleImageChange = async (fileInfo, process) => {
    console.log("fileInfo", fileInfo);
    let { file } = fileInfo;

    // 本次治疗前
    if (process === "before") {
      let newInfBeforeInfo = this.state.infBeforeInfo;
      newInfBeforeInfo.infraBeforeFile = file.originFileObj;

      // 图片信息
      let newbeforeFile = this.state.beforeFile;
      newbeforeFile.imgInfoBefore = file.originFileObj;

      this.setState({
        infBeforeInfo: newInfBeforeInfo,
        beforeFile: newbeforeFile,
      });
    }
    // 本次治疗后
    if (process === "after") {
      let newInfAfterInfo = this.state.infAfterInfo;
      newInfAfterInfo.infraAfterFile = file.originFileObj;
      // 图片信息
      let newaferFile = this.state.afterFile;
      newaferFile.imgInfoAfter = file.originFileObj;

      this.setState({
        infAfterInfo: newInfAfterInfo,
        afterFile: newaferFile,
      });
    }
  };

  // 处理文件变化
  handleFileChange = async (fileInfo, process) => {
    let { file } = fileInfo;

    // 本次治疗前
    if (process === "before") {
      let newInfBeforeInfo = this.state.infBeforeInfo;
      newInfBeforeInfo.infraBeforeTxt = file.originFileObj;

      // 文件信息
      let newbeforeFile = this.state.beforeFile;
      newbeforeFile.txtInfoBefore = file.originFileObj;

      this.setState({
        infBeforeInfo: newInfBeforeInfo,
        beforeFile: newbeforeFile,
      });
    }
    // 本次治疗后
    if (process === "after") {
      let newInfAfterInfo = this.state.infAfterInfo;
      newInfAfterInfo.infraAfterTxt = file.originFileObj;
      // 文件信息
      let newaferFile = this.state.afterFile;
      newaferFile.txtInfoAfter = file.originFileObj;

      this.setState({
        infAfterInfo: newInfAfterInfo,
        afterFile: newaferFile,
      });
    }
  };

  // 处理治疗前
  handleSaveBeforeTreat = async (values) => {
    let { infraDesc, infraExcp, medicine } = values;
    let newInfBeforeInfo = this.state.infBeforeInfo;
    newInfBeforeInfo.infraBeforeDesc = infraDesc;
    newInfBeforeInfo.infraBeforeExcp = infraExcp;
    newInfBeforeInfo.timeBefore = moment().format("YYYY-MM-DD HH:mm");
    newInfBeforeInfo.medicationBefore = medicine;
    await this.setState({
      infBeforeInfo: newInfBeforeInfo,
    });
    Message.success("保存成功！");
  };

  // 处理治疗中
  handleTreat = async (values) => {
    let { chineseMedicine, date, treat, treatDetail } = values;
    let newInfMiddleInfo = this.state.infMiddleInfo;
    newInfMiddleInfo.treat = treat;
    newInfMiddleInfo.treatMedicine = chineseMedicine;
    newInfMiddleInfo.timeMiddle = moment(date).format("YYYY-MM-DD HH:mm");
    newInfMiddleInfo.treatDetail = treatDetail;
    await this.setState({
      infMiddleInfo: newInfMiddleInfo,
    });
    Message.success("保存成功！");
  };

  // 处理治疗后
  handleSaveAfterTreat = async (values) => {
    let { infraDesc, infraExcp, medicine } = values;
    let newInfAfterInfo = this.state.infAfterInfo;
    newInfAfterInfo.infraAfterDesc = infraDesc;
    newInfAfterInfo.infraAfterExcp = infraExcp;
    newInfAfterInfo.timeAfter = moment().format("YYYY-MM-DD HH:mm");
    newInfAfterInfo.medicationAfter = medicine;
    await this.setState({
      infAfterInfo: newInfAfterInfo,
    });
    Message.success("保存成功！");
  };

  // todo 提交到后台
  handleSubmitInfInfo = () => {
    console.log("提交！");
    const { patientInfo } = this.props;
    let { infBeforeInfo, infMiddleInfo, infAfterInfo } = this.state;
    let param = {
      patientId: _.get(patientInfo, "id"),
      medicalHistory: _.get(patientInfo, "medicalHistory"),
    };
    let handleInfMiddle = {};
    handleInfMiddle.timeMiddle = moment(infMiddleInfo.timeMiddle);
    handleInfMiddle.treatDetail = infMiddleInfo.treatDetail;
    handleInfMiddle.treat = infMiddleInfo.treat.join(",");
    handleInfMiddle.treatMedicine = infMiddleInfo.treatMedicine.join(",");

    Object.assign(param, infBeforeInfo, handleInfMiddle, infAfterInfo);
    let tBefore = param.timeBefore;
    let tAfter = param.timeAfter;
    param.timeBefore = moment(tBefore);
    param.timeAfter = moment(tAfter);

    let formData = new FormData();
    for (let key in param) {
      formData.append(key, param[key]);
    }

    API.uploadRecord(formData).then((res) => {
      console.log("res", res);
      if (res.code === "200") {
        Message.success("提交成功！");
      } else {
        Message.error(res.msg);
      }
    });

    // 把文件信息传给父组件AddRecord组件
    this.props.handleFile({
      fileBefore: this.state.beforeFile,
      fileAfter: this.state.afterFile,
    });
  };

  render() {
    const { patientInfo, treatCount } = this.props;
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    return (
      <div style={{ paddingBottom: "30px" }}>
        <Steps
          current={this.state.infCurrentStep}
          onChange={this.handleInfStepChange}
        >
          <Step title="本次治疗前" />
          <Step title="本次治疗中" />
          <Step title="本次治疗后" />
        </Steps>
        <div
          style={{
            margin: "auto",
          }}
        >
          {this.state.infCurrentStep === 0 && (
            <div>
              <h2
                style={{
                  marginTop: "30px",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {`上传 ${_.get(patientInfo, "id")}_${_.get(
                  patientInfo,
                  "name"
                )} 第 ${treatCount} 次治疗前的红外热像图及说明`}
              </h2>
              <Form
                {...layout}
                layout="horizontal"
                onFinish={this.handleSaveBeforeTreat}
                initialValues={{
                  infraDesc: this.state.infBeforeInfo.infraBeforeDesc,
                  infraExcp: this.state.infBeforeInfo.infraBeforeExcp,
                  medicine: this.state.infBeforeInfo.medicationBefore,
                  chief: this.state.infBeforeInfo.chief,
                }}
              >
                <div>
                  <Form.Item
                    label="红外热像"
                    className="imageFile"
                    name="infraFile"
                  >
                    <PicturesWall
                      handleImageChange={(fileUrl) =>
                        this.handleImageChange(fileUrl, "before")
                      }
                      fileInfo={this.state.beforeFile}
                    />
                  </Form.Item>
                  <Form.Item
                    label="温度矩阵"
                    className="temMatrix"
                    name="infTemMatrix"
                  >
                    <FileWall
                      handleFileChange={(fileUrl) =>
                        this.handleFileChange(fileUrl, "before")
                      }
                      fileInfo={this.state.beforeFile}
                    />
                  </Form.Item>
                  <Form.Item
                    label="描述"
                    style={{ marginLeft: 0 }}
                    name="infraDesc"
                  >
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Form.Item label="异常" name="infraExcp">
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Form.Item label="用药情况" name="medicine">
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Form.Item label="主诉" name="chief">
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <div
                    style={{
                      width: "200px",
                      display: "flex",
                      margin: "auto",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        flexGrow: 1,
                      }}
                    >
                      保存
                    </Button>
                    <Button
                      type="primary"
                      style={{
                        flexGrow: 1,
                        marginLeft: "20px",
                      }}
                      onClick={() => {
                        this.setState({ infCurrentStep: 1 });
                      }}
                    >
                      下一步
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
          {this.state.infCurrentStep === 1 && (
            <div>
              <h2
                style={{
                  marginTop: "30px",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {`选择 ${_.get(patientInfo, "id")}_${_.get(
                  patientInfo,
                  "name"
                )}  的第 ${treatCount} 次治疗方案`}
              </h2>
              <Form
                {...layout}
                className="treat"
                onFinish={this.handleTreat}
                initialValues={{
                  treat: this.state.infMiddleInfo.treat,
                  chineseMedicine: this.state.infMiddleInfo.treatMedicine,
                  date: this.state.infMiddleInfo.timeMiddle
                    ? moment(this.state.infMiddleInfo.timeMiddle)
                    : "",
                  treatDetail: this.state.infMiddleInfo.treatDetail,
                }}
              >
                <Form.Item label="选择治疗方案" name="treat">
                  <Select
                    mode="multiple"
                    showArrow="true"
                    placeholder="请选择治疗方案"
                    onChange={this.handleTreatChange}
                  >
                    {treatList.map((item, index) => {
                      return (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item label="选择药物配方" name="chineseMedicine">
                  <Select
                    mode="multiple"
                    showArrow="true"
                    placeholder="请选择药物配方"
                    onChange={this.handleTreatChange}
                  >
                    {chineseMedicine.map((item, index) => {
                      return (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item label="就诊时间" name="date">
                  <DatePicker placeholder="选择时间"></DatePicker>
                </Form.Item>
                <Form.Item label="治疗情况说明" name="treatDetail">
                  <TextArea
                    style={{ height: 32 }}
                    autoSize={{ minRows: 2, maxRows: 10 }}
                    placeholder="请输入..."
                  />
                </Form.Item>
                <div
                  style={{
                    width: "300px",
                    display: "flex",
                    margin: "auto",
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      flexGrow: 1,
                      marginRight: "20px",
                    }}
                    onClick={() => {
                      this.setState({ infCurrentStep: 0 });
                    }}
                  >
                    上一步
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      flexGrow: 1,
                    }}
                  >
                    保存
                  </Button>
                  <Button
                    type="primary"
                    style={{
                      flexGrow: 1,
                      marginLeft: "20px",
                    }}
                    onClick={() => {
                      this.setState({ infCurrentStep: 2 });
                    }}
                  >
                    下一步
                  </Button>
                </div>
              </Form>
            </div>
          )}
          {this.state.infCurrentStep === 2 && (
            <div>
              <h2
                style={{
                  marginTop: "30px",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {`上传 ${_.get(patientInfo, "id")}_${_.get(
                  patientInfo,
                  "name"
                )}  第 ${treatCount} 次治疗后的红外热像图及说明`}
              </h2>
              <Form
                {...layout}
                layout="horizontal"
                onFinish={this.handleSaveAfterTreat}
                initialValues={{
                  infraDesc: this.state.infAfterInfo.infraAfterDesc,
                  infraExcp: this.state.infAfterInfo.infraAfterExcp,
                  medicine: this.state.infAfterInfo.medicationAfter,
                }}
              >
                <div>
                  <Form.Item
                    label="红外热像"
                    className="imageFile"
                    name="infraFile"
                  >
                    <PicturesWall
                      handleImageChange={(fileUrl) =>
                        this.handleImageChange(fileUrl, "after")
                      }
                      fileInfo={this.state.afterFile}
                    />
                  </Form.Item>
                  <Form.Item
                    label="温度矩阵"
                    className="temMatrix"
                    name="infTemMatrix"
                  >
                    <FileWall
                      handleFileChange={(fileUrl) =>
                        this.handleFileChange(fileUrl, "after")
                      }
                      fileInfo={this.state.beforeFile}
                    />
                  </Form.Item>
                  <Form.Item
                    label="描述"
                    style={{ marginLeft: 0 }}
                    name="infraDesc"
                  >
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Form.Item label="异常" name="infraExcp">
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Form.Item label="用药情况" name="medicine">
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>

                  <div
                    style={{
                      width: "300px",
                      display: "flex",
                      margin: "auto",
                    }}
                  >
                    <Button
                      type="primary"
                      style={{
                        flexGrow: 1,
                        marginRight: "20px",
                      }}
                      onClick={() => {
                        this.setState({ infCurrentStep: 1 });
                      }}
                    >
                      上一步
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        flexGrow: 1,
                      }}
                    >
                      保存
                    </Button>
                    <Button
                      type="primary"
                      style={{
                        flexGrow: 1,
                        marginLeft: "20px",
                      }}
                      onClick={this.handleSubmitInfInfo}
                    >
                      确认提交
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
    );
  }
}
