import React, { Component } from "react";
import { Modal } from "antd";
import { withRouter } from "react-router-dom";
import { reWeather } from "../../api";
import menuList from "../../config/menuConfig";
import { formateDate } from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../../components/link-button";
import "./index.less";

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    dayPictureUrl: "", // 天气图片的 url
    weather: ""
  };
  getTime = () => {
    this.setTime = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };
  getWeather = async () => {
    const { dayPictureUrl, weather } = await reWeather("上海");
    this.setState({ weather, dayPictureUrl });
  };
  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(
          cItem => path.indexOf(cItem.key) === 0
        );
        if (cItem) {
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
    Modal.confirm({
      content: "确定退出吗?",
      onOk: () => {
        console.log("OK");
        // 移除保存的 user
        storageUtils.removeUser();
        memoryUtils.user = {};
        // 跳转到 login
        this.props.history.replace("/login");
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  //第一次render之后执行
  componentDidMount() {
    //获取当前时间
    this.getTime();
    //获取当前天气
    this.getWeather();
  }
  componentWillUnmount() {
    clearInterval(this.setTime);
  }
  render() {
    const { currentTime, dayPictureUrl, weather } = this.state;
    const username = memoryUtils.user.username;
    const title = this.getTitle();
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
          {/* <a href="javascript:" onClick={this.logout}>退出</a> */}
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Header);
