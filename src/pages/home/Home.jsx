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
  console.log(22222);
  exp.setTime(exp.getTime()-1 * 24 * 60 * 60 * 1000);
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
      name: "",
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
              name: data.trueName,
            })
          }
        })
  }

  render() {
    const { name} = this.state;
    return (
      <Layout>
        <Header
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            background: "darkBlue",
            fontSize: "24px",
          }}
        >
          <div style={{ display: "flex" }}>
            <h1 style={{ color: "#ffffff" }}>颈椎病智慧医疗系统</h1>
            <div
              style={{
                width: 500,
                height: 40,
                position: "absolute",
                right: 40,
                color: "#ffffff",
              }}
            >
              <span>欢迎您，{name}医生</span>
              <span
                style={{ marginLeft: 80, color: "white" }}
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
            background: "darkBlue",
            fontSize: "24px",
          }}
        >

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
                  <span className="text">点击新建新患者个人信息</span>
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
                  <span className="text">点击进行患者信息查询管理</span>
                </div>
              </Link>
            </Col>
            <Col span={8}>
              <Link to="/admin/AIAnalysis">
                <div
                  className="cardSelect"
                  style={{
                    backgroundColor: "#1890ff",
                  }}
                >
                  <div>
                    <FileAddOutlined className="icon" />
                    AI智能检测分析
                  </div>
                  <span className="text">
                    点击进行AI智能检测分析
                  </span>
                </div>
              </Link>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 30 }}>
            <Col span={8}>
              <Link to="/admin/statisticAnalysis">
                <div
                  className="cardSelect"
                  style={{
                    backgroundColor: "#722ed1",
                  }}
                >
                  <div>
                    <MonitorOutlined className="icon" />
                    统计分析
                  </div>
                  <span className="text">点击进行统计分析</span>
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
                  <span className="text">点击进行用户权限控制</span>
                </div>
              </Link>
            </Col>
          </Row>
          <img
            src="yiliao.png"
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
