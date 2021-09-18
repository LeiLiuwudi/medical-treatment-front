import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { Form, Icon, Input, Button, Message } from "antd";
import "./login.less";
import yiliao from "../../assets/images/yiliao.jpg";
import memoryUtils from "../../utils/memoryUtils";
import API from "../../api/api";

class Login extends Component {
  // 验证码
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      codeLength: 4,
      fontSizeMin: 20,
      fontSizeMax: 22,
      backgroundColorMin: 240,
      backgroundColorMax: 250,
      colorMin: 10,
      colorMax: 20,
      lineColorMin: 40,
      lineColorMax: 180,
      contentWidth: 96,
      contentHeight: 38,
    };
  }
  handleSubmit = (values) => {
    if (
      this.state.code.toLowerCase() !== values.verificationCode.toLowerCase()
    ) {
      Message.error("登录失败，验证码错误！");
      this.reloadPic();
    } else {
      let param = {
        username: values.username,
        password: values.password,
      };
      API.login(param)
        .then((res) => {
          const { code, msg, data} = res;
          if (code !== "200") {
            Message.error("登录失败，用户名或密码错误！");
          } else {
            Message.success("登录成功！");
            if(data.token&&data.exp){
              document.cookie = "token="+ data.token+";expires="+new Date(data.exp).toGMTString();
            }
            this.props.history.push('/home');
          }
        })
        .catch((err) => {
          Message.error(err + "登录失败！请重试！");
        });
    }
  };
  componentWillMount() {
    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.drawPic();
  }
  // 生成一个随机数
  // eslint-disable-next-line arrow-body-style
  randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  drawPic = () => {
    this.randomCode();
  };

  // 生成一个随机的颜色
  // eslint-disable-next-line react/sort-comp
  randomColor(min, max) {
    const r = this.randomNum(min, max);
    const g = this.randomNum(min, max);
    const b = this.randomNum(min, max);
    return `rgb(${r}, ${g}, ${b})`;
  }

  drawText(ctx, txt, i) {
    ctx.fillStyle = this.randomColor(this.state.colorMin, this.state.colorMax);
    const fontSize = this.randomNum(
      this.state.fontSizeMin,
      this.state.fontSizeMax
    );
    ctx.font = fontSize + "px SimHei";
    const padding = 10;
    const offset =
      (this.state.contentWidth - 40) / (this.state.code.length - 1);
    let x = padding;
    if (i > 0) {
      x = padding + i * offset;
    }
    let y = this.randomNum(
      this.state.fontSizeMax,
      this.state.contentHeight - 5
    );
    if (fontSize > 40) {
      y = 40;
    }
    const deg = this.randomNum(-10, 10);
    // 修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(txt, 0, 0);
    // 恢复坐标原点和旋转角度
    ctx.rotate((-deg * Math.PI) / 180);
    ctx.translate(-x, -y);
  }

  drawLine(ctx) {
    // 绘制干扰线
    for (let i = 0; i < 1; i++) {
      ctx.strokeStyle = this.randomColor(
        this.state.lineColorMin,
        this.state.lineColorMax
      );
      ctx.beginPath();
      ctx.moveTo(
        this.randomNum(0, this.state.contentWidth),
        this.randomNum(0, this.state.contentHeight)
      );
      ctx.lineTo(
        this.randomNum(0, this.state.contentWidth),
        this.randomNum(0, this.state.contentHeight)
      );
      ctx.stroke();
    }
  }

  drawDot(ctx) {
    // 绘制干扰点
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = this.randomColor(0, 255);
      ctx.beginPath();
      ctx.arc(
        this.randomNum(0, this.state.contentWidth),
        this.randomNum(0, this.state.contentHeight),
        1,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }

  reloadPic = () => {
    this.drawPic();
  };

  // 随机生成验证码
  randomCode() {
    let random = "";
    // 去掉了I l i o O,可自行添加
    const str = "QWERTYUPLKJHGFDSAZXCVBNMqwertyupkjhgfdsazxcvbnm1234567890";
    for (let i = 0; i < this.state.codeLength; i++) {
      const index = Math.floor(Math.random() * 57);
      random += str[index];
    }
    this.setState(
      {
        code: random,
      },
      () => {
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        ctx.textBaseline = "bottom";
        // 绘制背景
        ctx.fillStyle = this.randomColor(
          this.state.backgroundColorMin,
          this.state.backgroundColorMax
        );
        ctx.fillRect(0, 0, this.state.contentWidth, this.state.contentHeight);
        // 绘制文字
        for (let i = 0; i < this.state.code.length; i++) {
          this.drawText(ctx, this.state.code[i], i);
        }
        this.drawLine(ctx);
        this.drawDot(ctx);
      }
    );
  }

  render() {
    // const { current } = this.state;
    const suffix = (
      <div>
        <canvas
          onClick={this.reloadPic}
          ref={this.canvas}
          width="100"
          height="60"
        ></canvas>
      </div>
    );
    const user = memoryUtils.user;
    if (user && user._id) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="login-left-container">
              <h1>颈椎病智慧医疗系统</h1>
            </div>
          </div>
          <div className="login-right">
            <h2>用户登录</h2>
            <Form onFinish={this.handleSubmit} className="login-form">
              <Form.Item
                rules={[{ required: true, message: "请输入用户名!" }]}
                name="username"
              >
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "请输入密码!" }]}
                name="password"
              >
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "请输入验证码!" }]}
                name="verificationCode"
              >
                <div>
                  <Input
                    style={{ float: "left", width: 150, marginRight: 50 }}
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="验证码"
                  />
                  {suffix}
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  className="login-form-button"
                  // href="/home" // 正式环境去掉这一句
                >
                  登录
                </Button>
                <span style={{ color: "white", marginRight: "5px" }}>或</span>
                <Link to="/register" className="link">
                  现在注册!
                </Link>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="footer">——————— ZJU@2021 —————————</div>
      </div>
    );
  }
}
// const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(Login);
const WrappedNormalLoginForm = Login;
export default WrappedNormalLoginForm;
