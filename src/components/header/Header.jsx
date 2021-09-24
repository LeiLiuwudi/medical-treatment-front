import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./header.less";
import { formatDateToSecond } from "../../utils/dateUtils";
import { Modal, Button, Table } from "antd";
import {QuestionCircleOutlined} from '@ant-design/icons';

import menuList from "./../../config/menuConfig";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: formatDateToSecond(Date.now()), // 当前时间字符串
      dayPictureUrl: "", // 天气图片url
      weather: "", // 天气的文本
      ModalVisiable: false,
    };
  }

  getTime = () => {
    // 每隔1s获取当前时间, 并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formatDateToSecond(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };

  getWeather = () => {
    // todo
    // 调用接口请求异步获取数据
    fetch(
      "https://www.tianqiapi.com/api/?version=v6&cityid=101210101&appid=81135576&appsecret=17HDf3Q1"
    ).then((res) => {
      res.json().then((result) => {
        this.setState({
          weather: result.wea,
          dayPictureUrl: require(`./banana/${result.wea_img}.png`),
        });
      });
    });
    // const {dayPictureUrl, weather} = await reqWeather('北京')
    // 更新状态
    // this.setState({dayPictureUrl, weather})
  };
  deleteCookie = (name) => {
    var exp = new Date();
    console.log(22222);
    exp.setTime(exp.getTime()-1 * 24 * 60 * 60 * 1000);
    var val = this.getCookie(name);
    if(val!=null){
      document.cookie= name + "="+val+";expires="+exp.toGMTString();
    }
  }
  
  getCookie = (name) => {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  }

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

  /**
   * 退出登录
   */
  logout = () => {
    this.deleteCookie("token");
    console.log(111111111);
    this.props.history.replace("/login");
  };

  componentDidMount() {
    this.getTime();
    this.getWeather();
  }

  /*
  当前组件卸载之前调用
   */
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.intervalId);
  }

  handleCancel = () => {
    this.setState({
      ModalVisiable: false,
    });
  };

  showDialog = () => {
    this.setState({
      ModalVisiable: true,
    });
  };

  render() {
    const { currentTime, dayPictureUrl, weather} = this.state;
    const title = this.getTitle();
    const columns = [
      {
        title: "系统名称",
        dataIndex: "name",
      },
      {
        title: "版本号",
        dataIndex: "version",
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
      },
    ];
    const data = [
      {
        key: "1",
        name: "颈椎病智慧医疗系统",
        version: "0.0.1",
        updateTime: "2021-09-01",
      },
      {
        key: "2",
        name: "颈椎病智慧医疗系统",
        version: "0.0.2",
        updateTime: "2021-09-19",
      },
    ];
    return (
      <div className="header">
        <span className="page-title">{title}</span>
        <div className="header-right">
          <span className="currentTime">{currentTime}</span>
          <span style={{ marginRight: "10px" }}>
            <span>天气：{weather}</span>
            <img
              style={{ width: "24px", height: "24px", marginLeft: "5px" }}
              src={dayPictureUrl}
              alt="天气"
            />
          </span>
          <QuestionCircleOutlined onClick={this.showDialog}/>
          <span className="logout" onClick={this.logout}>
            退出
          </span>
        </div>
        <Modal
          title="关于"
          visible={this.state.ModalVisiable}
          onCancel={this.handleCancel}
          footer={[<Button onClick={this.handleCancel}>关闭</Button>]}
        >
          <div className="about-content">
            <h3 className="table-title">颈椎病智慧医疗系统</h3>
            <Table
              columns={columns}
              dataSource={data}
              bordered
              pagination={false}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Header);
