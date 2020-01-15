import React, { Component } from "react";
import { Card, Button, Modal, Table, message } from "antd";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import { PAGE_SIZE } from "../../utils/constants";
import { reqUsers, reqDeleteUser, reqAddUserOrUpdateUser } from "../../api";
import UserForm from "./user-form";

export default class User extends Component {
  state = {
    users: [],
    roles: [],
    isShow: false
  };

  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username"
      },
      {
        title: "邮箱",
        dataIndex: "email"
      },
      {
        title: "电话",
        dataIndex: "phone"
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formateDate
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: role_id => this.roleNames[role_id]
      },
      {
        title: "操作",
        render: user => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      }
    ];
  };
  showUpdate = user => {
    this.user = user;
    this.setState({ isShow: true });
  };
  deleteUser = user => {
    Modal.confirm({
      title: `确定删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success("删除用户成功");
          this.getUsers();
        }
      },
      onCancel() {}
    });
  };
  //根据roles数组生成对象形式
  initRoleNames = roles => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    this.roleNames = roleNames;
  };
  getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.initRoleNames(roles);
      this.setState({
        users,
        roles
      });
    }
  };
  addOrUpdateUser = async () => {
    //收集数据
    const user = this.form.getFieldsValue();
    this.form.resetFields();

    if (this.user && this.user._id) {
      user._id = this.user._id;
    }
    const result = await reqAddUserOrUpdateUser(user);
    if (result.status === 0) {
      message.success(`${this.user ? "修改" : "添加"}成功`);
      this.setState({ isShow: false });
      this.getUsers();
    }
  };
  showAdd = () => {
    this.user = null;
    this.setState({ isShow: true });
  };
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUsers();
  }
  render() {
    const title = (
      <Button type="primary" onClick={this.showAdd}>
        创建用户
      </Button>
    );
    const { users, isShow, roles } = this.state;
    const user = this.user || {};
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        ></Table>

        <Modal
          title={user._id ? "修改用户" : "添加用户"}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields();
            this.setState({ isShow: false });
          }}
        >
          <UserForm
            setForm={form => (this.form = form)}
            roles={roles}
            user={user}
          ></UserForm>
        </Modal>
      </Card>
    );
  }
}
