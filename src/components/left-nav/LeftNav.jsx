import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from "antd";
import {
  UserAddOutlined,
  SolutionOutlined,
  FileAddOutlined,
  MonitorOutlined,
  AlertOutlined,
  SettingOutlined,
} from "@ant-design/icons";
// import logo from "../../assets/images/logo.jpg";
import kangfu from "../../assets/images/kangfu.jpg";

import "./left-nav.less";

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPath: "/admin/home",
      menuList: [
        {
          title: "新增患者病历",
          path: "/admin/newPatient",
          icon: <UserAddOutlined />,
        },
        {
          title: "患者信息查询管理",
          path: "/admin/patientQuery",
          icon: <SolutionOutlined />,
        },
        {
          title: "AI智能检测分析",
          path: "/admin/AIAnalysis",
          icon: <FileAddOutlined />,
        },
        {
          title: "统计分析",
          path: "/admin/statisticAnalysis",
          icon: <AlertOutlined />,
        },
        {
          title: "权限控制",
          path: "/admin/accessControl",
          icon: <SettingOutlined />,
        },
      ],
    };
  }

  handleChangeColor = (path) => {
    this.setState({
      currentPath: path,
    });
  };

  /**
   * 根据menu的数组生成对应的数组标签
   * 使用 map() + 递归
   */
  getMenuNodes_map = (menuList) => {
    return menuList.map((item) => {
      if (!item.children) {
        return (
          <Menu.Item
            key={item.path}
            onClick={() => this.handleChangeColor(item.path)}
            className={
              this.state.currentPath === item.path ? "blueColor" : null
            }
          >
            <Link to={item.path}>
              {item.icon}
              <span style={{ fontSize: "18px" }}>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        return (
          <SubMenu
            key={item.path}
            onClick={() => this.handleChangeColor(item.path)}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes_map(item.children)}
          </SubMenu>
        );
      }
    });
  };
  componentDidMount() {
    this.setState({
      currentPath: this.props.path,
    });
  }

  render() {
    const { menuList } = this.state;
    return (
      <div className="left-nav">
        <Link
          to="/home"
          className="left-nav-header"
          onClick={() => this.handleChangeColor("/admin/home")}
        >
          <h2>颈椎病辅助康复</h2>
        </Link>
        <Menu mode="inline" theme="dark" selectable={false}>
          {this.getMenuNodes_map(menuList)}
        </Menu>
      </div>
    );
  }
}
export default LeftNav;
