import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import "./index.less";
import logo from "../../asserts/images/logo.png";
const { SubMenu } = Menu;

/**
 * 左侧导航组件
 */
class leftNav extends Component {
  /**
   * 数组map + 递归
   */
  getMenuNodes_map = menuList => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        );
      }
    });
  };

  /**判断当前登陆用户 对当前item是否有权限 */
  hasAuth = item => {
    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;
    const { key, isPublic } = item;
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      return !!item.children.find(child => menus.indexOf(child.key) !== -1);
    } else {
      return false;
    }
  };
  /**
   * 数组reduce + 递归
   */
  getMenuNodes = menuList => {
    //如果当前用户有item的权限  才显示
    return menuList.reduce((pre, item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          pre.push(
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          const path = this.props.location.pathname;
          const cItem = item.children.find(
            cItem => path.indexOf(cItem.key) === 0
          );
          if (cItem) {
            this.openKey = item.key;
          }
          pre.push(
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          );
        }
      }
      return pre;
    }, []);
  };
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }
  render() {
    //debugger
    const menuNodes = this.menuNodes;
    //得当前请求路径
    let path = this.props.location.pathname;
    if (path.indexOf("/product") === 0) {
      //当前请求为商品或者子路由
      path = "/product";
    }
    //得到需要展开的子列表
    const openKey = this.openKey;
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="" />
          <h1>后台管理系统</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {menuNodes}

          {/* <Menu.Item key="1">
                        <Link to='/home'>
                            <Icon type="pie-chart" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="mail" />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="5">
                            <Link to='/category'>
                                <Icon type="mail" />
                                <span>品类管理</span>
                            </Link>
                            
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to='/product'>
                                <Icon type="mail" />
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu> */}
        </Menu>
      </div>
    );
  }
}

export default withRouter(leftNav);
