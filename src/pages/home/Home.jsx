import React, { Component } from "react";
import { Layout, Col, Row, Message } from "antd";
import { Link, withRouter} from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import {
  UserAddOutlined,
  SolutionOutlined,
  FileAddOutlined,
  MonitorOutlined,
  AlertOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import API from "../../api/api";

import "./home.less";

export const deleteCookie = (name) => {
  var exp = new Date();
  exp.setTime(exp.getTime()-1);
  var val = getCookie(name);
  if(val!=null){
    document.cookie= name + "="+val+";expires="+exp.toGMTString();
  }
}

export const getCookie = (name) => {
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
const { Header, Content } = Layout;
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: '',
      doctorId: 0,
    };
  }

  logout = () => {
    deleteCookie("token");
    this.props.history.replace("/login");
  };


  componentDidMount(){
   const params = {
     token: getCookie('token'),
   }
   API.getUser(params)
        .then((res) => {
          const {code, msg, data } = res;
          if (code !== "200") {
            Message.error(msg);
          } else {
            this.setState({
              department: data.department,
              doctorId: data.id,
            })
          }
        })
  }

  render() {
    const { doctorId, department} = this.state;
    return (
      <Layout>
        <Header
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            background: "rgb(57,141,238)",
            fontSize: "24px",
          }}
        >
          <div style={{ display: "flex" }}>
            <h1 style={{ color: "#ffffff" }}>颈椎诊疗辅助系统</h1>
            <div
              style={{
                width: 500,
                height: 40,
                position: "absolute",
                right: 40,
                color: "#ffffff",
              }}
            >
              <UserOutlined
                style={{ color: "blue", fontSize: "30px", marginRight: "10px" }}
              />
              <span>科室：{department} </span>
            <span style={{ marginLeft: 10 }}> 医生id: {doctorId}</span>
              <span
                style={{ marginLeft: 10 }}
                className="logout"
                onClick={this.logout}
              >
                退出
              </span>
            </div>
          </div>
        </Header>
        <Content
          className="site-layout"
          style={{
            padding: "20px 50px",
            height: "100vh",
            marginTop: 64,
            marginBottom: 0,
            background: "rgb(236,236,236)",
            fontSize: "24px",
          }}
        >
          {/* <a
            href="/operationGuide/operation-guide.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginBottom: "20px",
              display: "block",
              fontWeight: "bold",
            }}
          >
            点击查看操作指南
          </a> */}
          <Row gutter={16}>
            <Col span={8}>
              <Link to="/admin/newPatient">
                <div
                  className="cardSelect"
                  style={{
                    backgroundColor: "#52c41a",
                  }}
                >
                  <div>
                    <UserAddOutlined className="icon" />
                    新建患者个人信息
                  </div>
                  <span className="text">点击添加新患者信息</span>
                </div>
              </Link>
            </Col>
            <Col span={8}>
              <Link to="/admin/patientQuery">
                <div
                  className="cardSelect"
                  style={{
                    backgroundColor: "#13c2c2",
                  }}
                >
                  <div>
                    <SolutionOutlined className="icon" />
                    患者信息查询管理
                  </div>
                  <span className="text">患者信息查询管理</span>
                </div>
              </Link>
            </Col>
            <Col span={8}>
              <Link to="/admin/addRecord">
                <div
                  className="cardSelect"
                  style={{
                    backgroundColor: "#1890ff",
                  }}
                >
                  <div>
                    <FileAddOutlined className="icon" />
                    新增治疗（病历）记录
                  </div>
                  <span className="text">
                    新增患者病历记录
                  </span>
                </div>
              </Link>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 30 }}>
            <Col span={8}>
              <Link to="/admin/recordQuery">
                <div
                  className="cardSelect"
                  style={{
                    backgroundColor: "#722ed1",
                  }}
                >
                  <div>
                    <MonitorOutlined className="icon" />
                    病历查询
                  </div>
                  <span className="text">病历信息查询管理</span>
                </div>
              </Link>
            </Col>
            <Col span={8}>
              <Link to="/admin/AIAnalysis">
                <div
                  className="cardSelect"
                  style={{
                    backgroundColor: "#eb2f96",
                  }}
                >
                  <div>
                    <AlertOutlined className="icon" />
                    智能分析
                  </div>
                  <span className="text">人工智能分析治疗结果</span>
                </div>
              </Link>
            </Col>
            <Col span={8}>
              <Link to="/admin/accessControl">
                <div
                  className="cardSelect"
                  style={{
                    backgroundColor: "#a0d911",
                  }}
                >
                  <div>
                    <SettingOutlined className="icon" />
                    权限控制
                  </div>
                  <span className="text">用户权限控制</span>
                </div>
              </Link>
            </Col>
          </Row>
          <img
            src="医疗.png"
            alt=""
            style={{
              width: "100%",
              marginTop: "30px",
            }}
          />
        </Content>
      </Layout>
    );
  }
}

export default withRouter(Home);
