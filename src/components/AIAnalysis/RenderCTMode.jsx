import React, { Component } from "react";
import {
  Upload,
  Input,
  Form,
  Icon,
  Modal,
  Select,
  DatePicker,
  Button,
  Steps,
} from "antd";

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const treatList = [
  "针灸",
  "推拿",
  "药物",
  "康复训练",
  "理疗",
  "爬行训练",
  "手术",
  "其他方法",
];

const chineseMedicine = [
  "石膏",
  "菊花",
  "知母",
  "柴胡",
  "银胡",
  "白薇",
  "决明子",
  "夏枯草",
  "栀子",
  "芦根",
  "牛黄",
  "玄参",
  "黄芩",
  "黄连",
  "黄柏",
  "龙胆草",
  "金银花",
  "连翘",
  "蒲公英",
  "白头翁",
  "与齿苋",
  "柴草根",
  "青葙子",
  "西瓜",
  "虎耳草",
];

export default class RenderCTMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infCurrentStep: 0,
      MRICurrentStep: 0,
      CTCurrentStep: 0,
      // 照片墙 start
      previewVisible: false,
      previewImage: "",
      fileList: [],
      // 照片墙 end
    };
  }

  handleInfStepChange = (current) => {
    console.log("onChange:", current);
    this.setState({ infCurrentStep: current });
  };

  handleSaveBeforeTreat = (values) => {
    console.log('保存！！！')
    // const values = this.refs.beforeTreatForm.getFieldsValue();
    console.log('values',values)
    let { infraFile, infraDesc, infraExcp, pulseExcp } = values;
    let param = values;
    param.time = new Date();
    // API.saveBeforeTreat(param).then((res) => {
    //   if ((res.code = "200")) {
    //     Message.success("上传成功！");
    //   } else {
    //     Message.error("上传失败！");
    //   }
    // });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
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
                上传本次治疗前的CT图像及说明
              </h2>
              <Form
                {...layout}
                layout="horizontal"
                ref="beforeTreatForm"
                onFinish={this.handleSaveBeforeTreat}
              >
                <div>
                  <Form.Item label="CT图像" className="CTFile" name="CTFile">
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    <Modal
                      visible={previewVisible}
                      footer={null}
                      onCancel={this.handleCancel}
                    >
                      <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={previewImage}
                      />
                    </Modal>
                  </Form.Item>
                  <Form.Item
                    label="描述"
                    style={{ marginLeft: 0 }}
                    name="infraDesc"
                  >
                    <TextArea
                      autoSize={{ minRows: 4, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Form.Item label="异常" name="infraExcp">
                    <TextArea
                      autoSize={{ minRows: 4, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Form.Item label="用药情况" name="pulseExcp">
                    <TextArea
                      autoSize={{ minRows: 4, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Button
                    onClick={this.handleSaveBeforeTreat}
                    type="primary"
                    style={{
                      margin: "auto",
                      display: "block",
                      marginBottom: "30px",
                    }}
                  >
                    保存
                  </Button>
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
                选择本次方案
              </h2>
              <Form {...layout} className="treat" ref="treatForm">
                <Form.Item label="选择治疗方案" name="treat">
                  <Select
                    mode="multiple"
                    showArrow="true"
                    placeholder="Please select"
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
                <Form.Item label="选择中药配方" name="chineseMedicine">
                  <Select
                    mode="multiple"
                    showArrow="true"
                    placeholder="Please select"
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
                  <DatePicker></DatePicker>
                </Form.Item>
                <Form.Item label="治疗情况说明" name="treatDetail">
                  <TextArea
                    style={{ height: 32 }}
                    autoSize={{ minRows: 4, maxRows: 10 }}
                    placeholder="请输入..."
                  />
                </Form.Item>
                <Button
                  onClick={this.handleTreat}
                  type="primary"
                  style={{ margin: "auto", display: "block" }}
                >
                  确定
                </Button>
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
                上传本次治疗后的CT图像及说明
              </h2>
              <Form {...layout} layout="horizontal" ref="afterTreatForm">
                <div>
                  <Form.Item label="CT图像" className="CTFile" name="CTFile">
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    <Modal
                      visible={previewVisible}
                      footer={null}
                      onCancel={this.handleCancel}
                    >
                      <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={previewImage}
                      />
                    </Modal>
                  </Form.Item>
                  <Form.Item
                    label="描述"
                    style={{ marginLeft: 0 }}
                    name="infraDesc"
                  >
                    <TextArea
                      autoSize={{ minRows: 4, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Form.Item label="异常" name="infraExcp">
                    <TextArea
                      autoSize={{ minRows: 4, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Form.Item label="用药情况" name="pulseExcp">
                    <TextArea
                      autoSize={{ minRows: 4, maxRows: 10 }}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    style={{ margin: "auto", display: "block" }}
                    onClick={this.handleSaveAfterTreat}
                  >
                    保存
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
    );
  }
}
