import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
const Item = Form.Item
/**
 * 添加角色的组件
 */
class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        
    }
    componentWillMount(){
        this.props.setForm(this.props.form);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
         //指定Itme布局的配置对象
         const formItemLayout = {
            labelCol: { span: 4 },//左侧label宽度
            wrapperCol: { span: 16 } //右侧输入框宽度
        }
        
        return (
            <Form {...formItemLayout}>
                <Item label = '角色名称'>
                    {
                        getFieldDecorator('roleName', {
                            initialValue: '',
                            rules: [
                                {required: true, message:'角色名称必须输入'}
                            ]
                        })(
                            <Input placeholder='请输入角色名称'></Input>
                        )
                    }
                   
                </Item>

            </Form>
        )
    }
}
export default Form.create()(AddForm)