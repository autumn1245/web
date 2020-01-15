import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import { formateDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'

export default class Role extends Component {
    state = {
        roles: [],
        role: {},
        isShowAdd: false, //是否显示添加页面
        isShowAuth: false //是否显示权限界面
    }
    constructor(props) {
        super(props)

        this.auth = React.createRef()
    }
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }
    getRoles = async () => {
        const results = await reqRoles()
        if (results.status === 0) {
            const roles = results.data
            this.setState({
                roles
            })
        }
    }
    onRow = (role) => {
        return {
            onClick: event => {
                //alert('jnb')
                this.setState({
                    role
                })
            }
        }
    }
    addRole = (name) => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ isShowAdd: false })
                const { roleName } = values
                this.form.resetFields()
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    message.success('添加角色成功')
                    const role = result.data
                    // this.setState({
                    //     roles: [
                    //         ...this.state.roles, role
                    //     ]
                    // })
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                    //this.getRoles()
                } else {
                    message.error('添加角色失败')
                }

            }
        })


    }

    updateRole = async () => {
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()//Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdateRole(role)
        this.setState({ isShowAuth: false })
        if (result.status === 0) {

            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限修改')

            } else {
                message.success('设置权限角色成功')
                this.setState({ roles: [...this.state.roles] })
            }

            //this.getRoles()
        }
    }
    handleCancel = () => {
        this.setState({ isShowAdd: false })
    }
    componentWillMount() {
        this.initColumn()
    }
    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => { this.setState({ isShowAdd: true }) }}>创建角色</Button> &nbsp;&nbsp;
                <Button type='primary' onClick={() => { this.setState({ isShowAuth: true }) }} disabled={!role._id}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    rowSelection={{ type: 'radio' }}
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                    rowSelection={{
                        type: 'radio', selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm setForm={(form) => { this.form = form }} />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({ isShowAuth: false })

                    }}
                >
                    <AuthForm role={role} ref={this.auth} />
                </Modal>


            </Card>
        )
    }
}
