
import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategory, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {
    state = {
        loading: false,
        categorys: [],//一级分类列表,
        subCategorys: [],//二级分类列表数据
        parentId: '0', //当前需要显示的分类列表的parentId
        parentName: '',//父分类显示名称
        showStatus: 0,//标识添加/更新 对话框显示状态 0 不显示 1 显示添加 2 显示更新

    }
    /*
    *
     * 初始化Table所有列的数据
     */
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name'
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {/* 如何向事件回调函数传递参数：先定义一个匿名函数 在函数调用处理的函数并传入数据 */}
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}

                    </span>
                )
            }
        ]

    }
    /**
     * 异步获取一级分类/二级列表
     */
    getCategorys = async (parentId) => {
        //在请求前  显示loading
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        //const { parentId } = this.state
        const result = await reqCategory(parentId);
        //请求结束  不显示laoding
        this.setState({ loading: false })
        if (result.status === 0) {
            const categorys = result.data;
            //取出分类数组数据
            if (parentId === '0') {
                this.setState({ categorys })
            } else {
                this.setState({ subCategorys: categorys })
            }


        } else {
            message.error('获取分类列表失败')
        }
    }
    /**
     * 显示到一级分类列表
     * 
     */

    showCategorys = () => {
        //更新为一级列表的显示状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }
    /**
     * 显示指定一级分类的二级分类列表
     */
    showSubCategorys = (category) => {
        //先更新状态 setState 是一种异步更新 setState()不能立即获取最新的状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { //回调函数
            //在状态更新且render()后执行 就是说 在改变状态后 再执行
            this.getCategorys()
        })


    }
    /**
     * 添加分类
     * 
     */
    addCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //1、隐藏对话框
                this.setState({
                    showStatus: 0
                })
                //收集数据 提交请求
                const { parentId, categoryName } = this.form.getFieldsValue();
                //清除输入数据
                this.form.resetFields()

                const result = await reqAddCategory(categoryName, parentId)
                if (result.status === 0) {
                    //3、重新显示当前分类列表
                    if (parentId === this.state.parentId) {
                        this.getCategorys()
                    } else if (parentId === '0') {
                        //在二级分类列表下 添加一级分类项 重新获取一级分类列表 但不需要显示一级分类列表
                        this.getCategorys('0')

                    }

                }
            }
        })


    }

    /**
      * 更新分类
    */
    updateCategory = () => {
        //先进行表单验证
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //1、隐藏对话框
                this.setState({
                    showStatus: 0
                })
                const categoryId = this.category._id;
                //const categoryName = this.form.getFieldValue('categoryName');
                const { categoryName } = values;

                //清除输入数据
                this.form.resetFields()
                //2、发请求 更新分类
                const result = await reqUpdateCategory({ categoryId, categoryName })
                if (result.status === 0) {
                    //3、重新显示分类列表
                    this.getCategorys()
                }

            }
        })


    }

    /**
     * 显示添加 对话框
     */

    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    /**
     * 显示更新 对话框
     */
    showUpdate = (category) => {
        //保存点击类
        this.category = category;
        this.setState({
            showStatus: 2
        })
    }

    /**
     * 响应点击取消 隐藏对话框
     */
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields()
        //隐藏确认框
        this.setState({
            showStatus: 0
        })
    }
    //为第一次render 准备数据
    componentWillMount() {
        this.initColumns();
    }
    //异步请求
    componentDidMount() {
        this.getCategorys()
    }
    render() {
        //读取状态数据
        const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state;
        //读取指定的分类
        const category = this.category || {};

        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{ marginRight: 5 }}></Icon>
                <span>{parentName}</span>
            </span>
        );
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus' />
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 8, showQuickJumper: true }}
                >

                </Table>

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categorys={categorys} parentId={parentId} setForm={(form) => { this.form = form }} />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm={(form) => { this.form = form }} />
                </Modal>
            </Card>
        )
    }
}
