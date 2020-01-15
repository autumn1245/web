import React, { Component } from "react";
import { Form, Icon, Input, Button, message } from "antd";
import { Redirect } from "react-router-dom";
import "./login.less";
import logo from "../../asserts/images/logo.png";
import { reLogin } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
const Item = Form.Item;
/**
 * 登陆路由组件
 */
class Login extends Component {
  /**
   * 登陆提交
   */
  handleSubmit = evt => {
    evt.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        //请求登陆
        const { username, password } = values;
        const reslut = await reLogin(username, password);
        // console.log('请求成功',res.data);
        if (reslut.status === 0) {
          //
          message.success("登陆成功");
          const user = reslut.data;
          //只保存在内存中
          memoryUtils.user = user;
          storageUtils.saveUser(user);
          //跳转
          this.props.history.replace("/admin");
        } else {
          message.error("登陆失败");
        }
        //提交ajax请求 验证 测试
      } else {
        return message.warning("用户名或者密码输入错误！");
      }
    });
  };
  /**
   *对输入密码进入验证
   */
  validatePwd = (rule, value, callback) => {
    if (!value) {
      callback("密码必须输入");
    } else if (value.length < 4) {
      callback("密码不能小于4位");
    } else if (value.length > 12) {
      callback("密码不能大于12位");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback("密码必须是英文、数字、或者下划线");
    } else {
      callback();
    }
  };

  render() {
    //如果用户已经登陆 直接跳转到管理页面
    const user = memoryUtils.user;
    if (user && user._id) {
      return <Redirect to="/" />;
    }

    //const { form } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目:后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator("username", {
                rules: [
                  { required: true, message: "用户名必须输入" },
                  { min: 4, message: "用户名不少于4个字符" },
                  { max: 12, message: "用户名不超过12个字符" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "用户名必须是字母，数字，下划线"
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator("password", {
                rules: [{ validator: this.validatePwd }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                {" "}
                登陆
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}

const WrapLogin = Form.create({})(Login);
export default WrapLogin;
