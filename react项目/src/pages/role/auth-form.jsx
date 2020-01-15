import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig";
const Item = Form.Item;
const { TreeNode } = Tree;
/**
 * 添加角色的组件
 */
export default class AnthForm extends Component {
  static propTypes = {
    role: PropTypes.object
  };
  constructor(props) {
    super(props);
    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus
    };
  }
  getMenus = () => {
    return this.state.checkedKeys;
  };
  getTreeNodes = menuList => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      );
      return pre;
    }, []);
  };
  onCheck = checkedKeys => {
    console.log("onCheck", checkedKeys);
    this.setState({ checkedKeys });
  };

  componentWillMount() {
    /**
         * <TreeNode title="平台权限" key="all">
                        <TreeNode title="parent 1-0" key="0-0-0">
                            <TreeNode title="leaf" key="0-0-0-0"/>
                            <TreeNode title="leaf" key="0-0-0-1"/>
                        </TreeNode>
                        <TreeNode title="parent 1-1" key="0-0-1">
                            <TreeNode title='sss' key="0-0-1-0" />
                        </TreeNode>
                    </TreeNode>
         */
    this.treeNodes = this.getTreeNodes(menuList);
  }
  //初始化不会调用 接收新的属性时调用 在render之前
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus;
    this.setState({ checkedKeys: menus });
  }
  render() {
    const { role } = this.props;
    const { checkedKeys } = this.state;
    //指定Itme布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label宽度
      wrapperCol: { span: 16 } //右侧输入框宽度
    };
    return (
      <div>
        <Item label="角色名称">
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    );
  }
}
