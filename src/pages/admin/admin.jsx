import React, { Component } from "react";
import { Layout } from "antd";
import { Switch, Redirect, Route, withRouter} from "react-router-dom";
import menuList from "../../config/menuConfig";
import LeftNav from "./../../components/left-nav/LeftNav";
import Header from "../../components/header/Header";
import RecordQuery from "./../../components/recordQuery/RecordQuery";
import TextAnalysis from "./../../components/recordQuery/TextAnalysis";
import AIAnalysis from "../../components/AIAnalysis/AIAnalysis";
import RecordUpload from "../../components/recordUpload/RecordUpload";
import PatientQuery from "../../components/patientQuery/PatientQuery";
//
import NewPatient from "../../components/newPatient/NewPatient";
import StatisticAnalysis from "../../components/StatisticAnalysis/StatisticAnalysis";
import AccessControl from "../../components/accessControl/accessControl";

import "./admin.less";

const { Sider, Content } = Layout;
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      // 如果当前item对象的key与path一样,item的title就是需要显示的title
      if (item.path === path) {
        title = item.title;
      } else if (item.children) {
        // 如果当前item有子项，在所有子item中查找匹配的
        const cItem = item.children.find(
          (cItem) => path.indexOf(cItem.path) === 0
        );
        if (cItem) {
          // 如果存在说明匹配成功
          title = cItem.title;
        }
      }
    });
    return title;
  };

  render() {
    console.log(this.props.location)
    return (
      <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          style={{ height: "100vh" }}
          className="sider"
        >
          <LeftNav path={this.props.location.pathname}></LeftNav>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }} />
          {/* <Breadcrumb className="my-breadcrumb">
            <Breadcrumb.Item>{this.getTitle()}</Breadcrumb.Item>
          </Breadcrumb> */}
          <Content>
            <Switch>
              <Redirect from="/admin" exact to="/admin/recordQuery" />
              <Route path="/admin/recordQuery" component={RecordQuery} />
              <Route path="/admin/patientQuery" component={PatientQuery} />
              <Route path="/admin/textAnalysis/:id" component={TextAnalysis} />
              <Route path="/admin/AIAnalysis" component={AIAnalysis} />
              <Route path="/admin/statisticAnalysis" component={StatisticAnalysis} />
              <Route path="/admin/accessControl" component={AccessControl} />
              <Route path="/admin/recordUpload" component={RecordUpload} />
              <Route path="/admin/newPatient" component={NewPatient} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Admin);
