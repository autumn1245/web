import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'
const Item = Form.Item
const Option = Select.Option
/**
 * 添加用户或者修改用户
 */
class UserForm extends PureComponent {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object

    }
    componentWillMount() {
        this.props.setForm(this.props.form);
    }
    render() {
        const { getFieldDecorator } = this.props.form;

        const { roles, user } = this.props
        //指定Itme布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },//左侧label宽度
            wrapperCol: { span: 16 } //右侧输入框宽度
        }

        return (
            <Form {...formItemLayout}>
                <Item label='用户名'>
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username,
                            rules: [
                                { required: true, message: '名称必须输入' }
                            ]
                        })(
                            <Input placeholder='请输入用户名'></Input>
                        )
                    }

                </Item>

                {
                    user._id ? null : (
                        <Item label='密码'>
                            {
                                getFieldDecorator('password', {
                                    initialValue: user.password,
                                    rules: [
                                        { required: true, message: '名称必须输入' }
                                    ]
                                })(
                                    <Input type='password' placeholder='请输入密码'></Input>
                                )
                            }

                        </Item>
                    )
                }



                <Item label='手机号'>
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                            rules: [
                                { required: true, message: '名称必须输入' }
                            ]
                        })(
                            <Input placeholder='请输入手机号'></Input>
                        )
                    }

                </Item>

                <Item label='邮箱'>
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email,
                            rules: [
                                { required: true, message: '名称必须输入' }
                            ]
                        })(
                            <Input placeholder='请输入邮箱'></Input>
                        )
                    }

                </Item>

                <Item label='角色'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                            rules: [
                                { required: true, message: '名称必须输入' }
                            ]
                        })(
                            <Select>
                                {
                                    roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                                }
                            </Select>
                        )
                    }

                </Item>

            </Form>
        )
    }
}
export default Form.create()(UserForm)