import React, { Component } from "react";
import {
  Card,
  Form,
  Input,
  Icon,
  Cascader,
  Upload,
  Button,
  message
} from "antd";
import LinkButton from "../../components/link-button";
import PicturesWall from "./pictures-wall";
import Editor from "./rich-text-editor";
import { reqCategory, reqAddOrUpdateProduct } from "../../api";
const { Item } = Form;
const { TextArea } = Input;
/**
 * product的添加和更新的子路由组件
 */

class ProductAddUpdate extends Component {
  state = { options: [] };
  constructor(props) {
    super(props);
    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef();
    this.editor = React.createRef();
    //this.editor = React.createRef()
  }
  getCategorys = async parentId => {
    const results = await reqCategory(parentId);
    if (results.status === 0) {
      const categorys = results.data;
      //如果是一级分类
      //debugger
      if (parentId === "0") {
        this.initOptions(categorys);
      } else {
        return categorys; //二级列表
      }
    }
  };
  initOptions = async categorys => {
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }));
    //如果是二级分类商品更新
    const { isUpdate, product } = this;
    const { pCategoryId, categoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      //获取二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      //生成下拉二级列表
      const childrenOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }));
      //找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId);
      //关联到对应的一级option
      targetOption.children = childrenOptions;
    }
    this.setState({ options });
  };
  submit = () => {
    //进行表单验证
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        //alert('发送ajax')
        //收集数据 封装成product对象
        const { name, desc, price, categoryIds } = values;
        let categoryId, pCategoryId;
        if (categoryIds.length === 1) {
          pCategoryId = "0";
          categoryId = categoryIds[0];
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const imgs = this.pw.current.getImgs();
        const detail = this.editor.current.getDetail();

        const product = {
          name,
          desc,
          price,
          imgs,
          detail,
          pCategoryId,
          categoryId
        };
        if (this.isUpdate) {
          product._id = this.product._id;
        }

        //2 调用接口 添加或者更新
        const result = await reqAddOrUpdateProduct(product);

        //3、结果显示
        if (result.status === 0) {
          message.success(`${this.isUpdate ? "更新" : "添加"}商品成功`);
          this.props.history.goBack();
        } else {
          message.error(`${this.isUpdate ? "更新" : "添加"}商品失败`);
        }

        //console.log(imgs,detail);
      }
    });
  };
  //自定义验证价格
  validatorPrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback();
    } else {
      callback("价格必须大于0");
    }
  };
  //用于加载下一级列表的回调函数
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    //显示loading
    targetOption.loading = true;

    //根据选中的分类 请求二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    //隐藏loading
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      const cOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }));
      targetOption.children = cOptions;
    } else {
      //当前选中的没有二级分类
      targetOption.isLeaf = true;
    }

    this.setState({
      options: [...this.state.options]
    });
  };

  onChange = (value, selectedOptions) => {
    //console.log(value, selectedOptions);
  };

  componentDidMount() {
    this.getCategorys("0");
  }
  componentWillMount() {
    const product = this.props.location.state;
    this.isUpdate = !!product;
    //保存商品 如果没有 保存的是一个空对象 避免报错
    this.product = product || {};
  }
  render() {
    const { isUpdate, product } = this;
    debugger;
    const { pCategoryId, categoryId, imgs, detail } = product;
    //用来接收级联分类数组id
    let categoryIds = [];
    if (isUpdate) {
      //一级分类商品
      if (pCategoryId === "0") {
        categoryIds.push(categoryId);
      } else {
        //二级分类商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }
    //指定Itme布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 }, //左侧label宽度
      wrapperCol: { span: 8 } //右侧输入框宽度
    };
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{ fontSize: 20 }}></Icon>
        </LinkButton>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );
    const { getFieldDecorator } = this.props.form;
    //级联选择
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              initialValue: product.name,
              rules: [{ required: true, message: "必须输入商品名称" }]
            })(<Input placeholder="请输入商品名称"></Input>)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              initialValue: product.desc,
              rules: [{ required: true, message: "必须输入商品描述" }]
            })(
              <TextArea
                placeholder="请输入商品描述"
                autosize={{ minRows: 2, maxRows: 6 }}
              ></TextArea>
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              initialValue: product.price,
              rules: [
                { required: true, message: "必须输入商品价格" },
                { validator: this.validatorPrice }
              ]
            })(
              <Input
                type="number"
                placeholder="请输入商品价格"
                addonAfter="元"
              ></Input>
            )}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categoryIds", {
              initialValue: categoryIds,
              rules: [{ required: true, message: "必须选中商品分类" }]
            })(
              <Cascader
                placeholder="选择商品分类"
                options={this.state.options} //需要显示的列表数据 数组形式
                loadData={this.loadData} //当选择某个列表项项 加载下一级的列表监听回调
                onChange={this.onChange}
                changeOnSelect
              />
            )}
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <Editor ref={this.editor} detail={detail} />
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}
export default Form.create()(ProductAddUpdate);
