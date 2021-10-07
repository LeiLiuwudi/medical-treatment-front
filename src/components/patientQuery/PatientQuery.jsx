import React, { Component } from "react";
import "./patient-query.less";
import {
  Input,
  Button,
  Select,
  Table,
  Form,
  Row,
  Message,
  Drawer,
  Col,
  Modal,
} from "antd";
import API from "../../api/api";
import { Link } from "react-router-dom";
// import ReactEcharts from "echarts-for-react";
import UpdateModal from "./UpdataModal";
const { Option } = Select;
const { TextArea } = Input;

Date.prototype.toLocaleString = function () {
  return (
    this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate()
  );
};

class PatientQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableDataLoading: true,
      updateInfoModalVisible: false,
      patientInfo: {},
      patientInfo1:{},
      similarPatientInfo:{},
      modalPatientInfo: {}, // 一条record
      currentTablePage: 1,
      drawerSwitch: false,
      similarAnalysisId:1,
      modalSwitch: false,
      helpSwitch: false,
      tableSwitch: false,
      updateSwitch: false,
      chosenIndex: 0,
      pStyle: {
        fontSize: "16px",
        color: "rgba(0,0,0,0.85)",
        lineHeight: "24px",
        display: "block",
        marginBottom: "16px",
      },
      listData: [],
      totalNum: 0,
      pageNum: 1,
      pageSize: 10,

      doctorList: [],
      diseaseList: [
        "正常",
        "颈椎疲劳",
        "颈椎劳损",
        "颈椎强行性病变"
      ],
      selectAuxliMedicine: [],
      selectMainMedicine: [
        <Option key={"环磷酰胺"}>{"环磷酰胺"}</Option>,
        <Option key={"阿霉素"}>{"阿霉素"}</Option>,
        <Option key={"依托泊甙"}>{"依托泊甙"}</Option>,
      ],
    };
  }

  // 抽屉等组件关闭
  onClose = () => {
    this.setState({
      drawerSwitch: false,
      tableSwitch: false,
    });
  };

  // 删除按钮实现
  remove(id) {
    this.setState({
      chosenIndex: id,
      modalSwitch: true,
    });
  }

  showHelp() {
    let param = {
      id: this.state.similarAnalysisId,
    };
    let similarId = 2;
    API.similarRecord(param)
      .then((response) => {
        similarId = response.id
      })
      .catch((error) => {
        console.log(error);
      });
    param = {
      id: this.state.similarAnalysisId,
      similarId: similarId
    }
    API.textComparison(param)
      .then((response) => {
        let _code = response.code;
        let data = response.data;
        // let _msg = response.msg;
        if (_code === "200") {
         this.setState({
           patientInfo1: data[0],
           similarPatientInfo: data[1],
         })
         this.setState({
          helpSwitch: true,
        });
        } else {
          Message.info("对比分析后台报错，请稍后重试");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  showUpdate() {
    this.setState({
      updateSwitch: true,
    });
  }

  // 查看详情按钮实现
  show(record) {
    let newPatientInfo = {};
    Object.keys(record).map((item) => {
      newPatientInfo[item] = record[item] === null ? "暂无" : record[item];
    });
    this.setState({
      similarAnalysisId: record.id,
      drawerSwitch: true,
      patientInfo: newPatientInfo,
    });
  }

  //  检测数据按钮实现
  detectionData(record) {
    let newPatientInfo = {};
    Object.keys(record).map((item) => {
      newPatientInfo[item] = record[item] === null ? "暂无" : record[item];
    });
    this.setState({
      tableSwitch: true,
      patientInfo: newPatientInfo,
    });
  }

  helpConfirm = () => {
    this.setState({
      helpSwitch: false,
    });
  };
  updateCancel = () => {
    this.setState({
      updateSwitch: false,
    });
  };

  // 删除确认
  confirm = () => {
    let param = {
      id: this.state.chosenIndex,
    };
    API.deletePatient(param)
      .then((response) => {
        let _code = response.code;
        // let _msg = response.msg;
        if (_code === "200") {
          Message.info("删除成功！");
          this.queryPatient();
          this.setState({
            modalSwitch: false,
          });
        } else {
          Message.info("病历删除失败，请稍后重试！");
          this.setState({
            modalSwitch: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 删除取消
  cancel = () => {
    Message.info("删除操作已取消");
    this.setState({
      modalSwitch: false,
    });
  };

  // 计算年龄
  calculateAge(time) {
    let date = new Date(time);
    let today = new Date().getTime();
    return Math.ceil((today - date) / 31536000000);
  }


  showUpdateInfoModal = (record) => {
    this.setState({
      updateInfoModalVisible: true,
      modalPatientInfo: record,
    });
  };
  // 获取病种列表接口
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

  handleSearchReset = () => {
    let config = {
      name: undefined,
      doctorId: undefined,
      initialDiagnosis: undefined,
    };
    this.refs.patientQueryForm.setFieldsValue(config);
    this.queryPatient();
  };

  // 获取患者信息列表
  queryPatient = () => {
    this.setState({
      tableDataLoading: true,
    });
    let param = {};
    let values = this.refs.patientQueryForm.getFieldsValue();
    for (const [, value] of Object.entries(values)) {
      if (value) {
        param = {
          name: values.name,
          doctorId: values.doctorId,
          initialDiagnosis: values.initialDiagnosis,
        };
      }
    }

    // 获取患者列表的API，成功
    API.queryPatient(param).then((res) => {
      console.log("getPatient", res);
      const { data, code, msg } = res;
      if (code === "200") {
        this.setState({
          listData: data,
          tableDataLoading: false,
        });
      } else {
        Message.error(msg);
      }
    });
  };

  // 分页页数改变触发函数
  // pageChange = (page) => {
  //   this.setState({
  //     pageNum: page,
  //   });
  //   this.queryPatient();
  // };

  // 页面渲染前执行函数
  componentDidMount() {
    this.queryPatient();
    this.getDoctorList();
  }
  // 患者查询表单
  renderSearch = () => {
    const {doctorList, diseaseList} = this.state;
    const doctorOptions = doctorList.map((item) => {
      return <Option key={item.id} value={item.id}>{item.name}</Option>
    })
    return (
      <Form
        layout="inline"
        style={{ marginBottom: 30, display: "flex" }}
        onFinish={this.queryPatient}
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
        <Form.Item name="initialDiagnosis" label="初步诊断：">
        <Select placeholder="请选择诊断结果" style={{ width: 160 }}>
        
        {diseaseList.map((item) => {
          return (
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        })}
      
      </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={this.handleSearchReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    );
  };

  handleModalVisible = (isvisible) => {
    this.setState({
      updateInfoModalVisible: isvisible,
    });
  };
  query = () => {
    this.queryPatient();
  }

  // 渲染的页面
  render() {
    const tableColumns = [
      {
        title: "患者姓名",
        dataIndex: "name",
        width: "6%",
      },
      {
        title: "主治医生",
        dataIndex: "doctorName",
        width: "6%",
      },
      {
        title: "性别",
        dataIndex: "gender",
        width: "6%",
        render: (gender) => {
          return gender === 1 ? "男" : "女";
        },
      },
      {
        title: "年龄",
        dataIndex: "birthday",
        width: "6%",
        render: (birthday) => {
          return this.calculateAge(birthday);
        },
      },
      {
        title: "职业",
        dataIndex: "profession",
        width: "8%",
      },
      {
        title: "初步诊断结果",
        dataIndex: "initialDiagnosis",
        width: "10%",
      },
      {
        title: "病历详情",
        dataIndex: "detail",
        width: "14%",
        align: "center",
        render: (text, record, index) => {
          return (
            <Button
              type="primary"
              // size="small"
              style={{ marginRight: "5px" }}
              onClick={() => this.show(record)}
            >
              病历详情
            </Button>
          );
        },
      },
      {
        title: "操作",
        width: "28%",
        key: "action",
        align: "center",
        render: (text, record, index) => {
          return (
            <div>
              <Link to={`/admin/newPatient`} target="_blank">
                <Button
                  type="primary"
                  style={{
                    marginRight: "5px",
                    backgroundColor: "green",
                    borderColor: "greem",
                  }}
                >
                  新增病历
                </Button>
              </Link>
              <Button
                type="primary"
                style={{
                  marginRight: "5px",
                  backgroundColor: "blue",
                  borderColor: "blue",
                }}
                onClick={() => this.showUpdateInfoModal(record)}
              >
                更新患者信息
              </Button>
              <Button
                type="primary"
                style={{
                  marginRight: "5px",
                  backgroundColor: "red",
                  borderColor: "red",
                }}
                onClick={() => this.remove(record.id)}
              >
                删除本条病历
              </Button>
            </div>
          );
        },
      },
    ];

    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条`;
      },
      total: this.state.listData.length, //数据总数
      defaultCurrent: 1, //默认当前页
      current: this.state.currentTablePage, //当前页
      pageSize: 8, //每页条数
      onChange: (page, pageSize) => {
        console.log("page", page, pageSize);
        //页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
          currentTablePage: page,
        });
      },
    };

    return (
      <div className="main-content">
        {this.renderSearch()}
        <Table
          bordered
          pagination={paginationProps}
          columns={tableColumns}
          dataSource={this.state.listData}
          scroll={{ x: "max-content" }} // 表格横向滚动，防止溢出
          loading={this.state.tableDataLoading}
        ></Table>
        <Drawer
          title="患者病历"
          placement="right"
          width="640"
          closable={false}
          onClose={this.onClose}
          visible={this.state.drawerSwitch}
        >
          <div className="demo-drawer-profile">
            <Row>
              <Col span={12}>
                <strong>患者姓名:</strong>
                <span style={{ marginLeft: 20 }}>
                  {this.state.patientInfo.name}
                </span>
              </Col>
              <Col span={12}>
                <strong>主治医生:</strong>
                <span style={{ marginLeft: 45 }}>
                  {this.state.patientInfo.doctorName}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <strong>性别:</strong>
                <span style={{ marginLeft: 50 }}>
                  {this.state.patientInfo.gender === 1 ? "男" : "女"}
                </span>
              </Col>
              <Col span={12}>
                <strong>生日:</strong>
                <span style={{ marginLeft: 72 }}>
                  {new Date(this.state.patientInfo.birthday).toLocaleString()}
                </span>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <strong>职业:</strong>
                <span style={{ marginLeft: 50 }}>
                  {this.state.patientInfo.profession}{" "}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <strong>主诉：</strong>
                <div className="setformat">{this.state.patientInfo.chiefComplaint}</div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <strong>现病史：</strong>
                <div className="setformat">{this.state.patientInfo.presentHistory}</div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <strong>既往史：</strong>
                <div className="setformat">{this.state.patientInfo.pastHistory}</div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <strong>初步诊断：</strong>
                <div className="setformat">{this.state.patientInfo.initialDiagnosis}</div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <strong>诊断依据：</strong>
                <div className="setformat">{this.state.patientInfo.diagnoseBasis}</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button type="primary" onClick={() => this.showHelp()}>
                  相似电子病历对比分析
                </Button>
              </Col>
            </Row>
          </div>
        </Drawer>

        <Modal
          visible={this.state.modalSwitch}
          title="请确认操作"
          onOk={this.confirm}
          onCancel={this.cancel}
        >
          <p>本次删除操作不可逆 确认删除本条数据？</p>
        </Modal>
        <Modal
          visible={this.state.helpSwitch}
          title="相似电子病历对比分析"
          onOk={this.helpConfirm}
          width={1000}
          onCancel={this.helpConfirm}
        >
          <div className="parent">
          <div className="current-record">
            <h3>当前电子病历</h3>
            <div>
            <Row>
              <Col>
                <strong>患者姓名:</strong>
                <span style={{ marginLeft: 20 }}>
                  {this.state.patientInfo1.name}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>主治医生:</strong>
                <span style={{ marginLeft: 20 }}>
                  {this.state.patientInfo1.doctorName}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>性别:</strong>
                <span style={{ marginLeft: 50 }}>
                  {this.state.patientInfo1.gender === 1 ? "男" : "女"}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>生日:</strong>
                <span style={{ marginLeft: 50 }}>
                  {new Date(this.state.patientInfo1.birthday).toLocaleString()}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>职业:</strong>
                <span style={{ marginLeft: 50}}>
                  {this.state.patientInfo1.profession}{" "}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>主诉：</strong>
                <div className="setformat" dangerouslySetInnerHTML={{__html:this.state.patientInfo1.chiefComplaint}}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>现病史：</strong>
                <div className="setformat" dangerouslySetInnerHTML={{__html:this.state.patientInfo1.presentHistory}}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>既往史：</strong>
                <div className="setformat" dangerouslySetInnerHTML={{__html:this.state.patientInfo1.pastHistory}}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>初步诊断：</strong>
                <div className="setformat">{this.state.patientInfo1.initialDiagnosis}</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>诊断依据：</strong>
                <div className="setformat">{this.state.patientInfo1.diagnoseBasis}</div>
              </Col>
            </Row>
          </div>
          </div>
          <div style={{float:"left",marginTop: 10, marginLeft: 10, marginRight: 10, width: 1, background: "darkgray"}}></div> 
          <div className="similar-record">
            <h3>相似电子病历</h3>
            <div>
            <Row>
              <Col>
                <strong>患者姓名:</strong>
                <span style={{ marginLeft: 20 }}>
                  {this.state.similarPatientInfo.name}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>主治医生:</strong>
                <span style={{ marginLeft: 20 }}>
                  {this.state.similarPatientInfo.doctorName}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>性别:</strong>
                <span style={{ marginLeft: 50 }}>
                  {this.state.similarPatientInfo.gender === 1 ? "男" : "女"}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>生日:</strong>
                <span style={{ marginLeft: 50 }}>
                  {new Date(this.state.similarPatientInfo.birthday).toLocaleString()}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>职业:</strong>
                <span style={{ marginLeft: 50}}>
                  {this.state.similarPatientInfo.profession}{" "}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>主诉：</strong>
                <div className="setformat" dangerouslySetInnerHTML={{__html:this.state.similarPatientInfo.chiefComplaint}}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>现病史：</strong>
                <div className="setformat" dangerouslySetInnerHTML={{__html:this.state.similarPatientInfo.presentHistory}}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>既往史：</strong>
                <div className="setformat" dangerouslySetInnerHTML={{__html:this.state.similarPatientInfo.pastHistory}}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>初步诊断：</strong>
                <div className="setformat">{this.state.similarPatientInfo.initialDiagnosis}</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>诊断依据：</strong>
                <div className="setformat">{this.state.similarPatientInfo.diagnoseBasis}</div>
              </Col>
            </Row>
          </div>
          </div>
          </div>
        </Modal>
        <UpdateModal
          visible={this.state.updateInfoModalVisible}
          handleModalVisible={this.handleModalVisible}
          modalPatientInfo={this.state.modalPatientInfo}
          queryPatient={this.queryPatient}
        />
      </div>
    );
  }
}

export default PatientQuery;
