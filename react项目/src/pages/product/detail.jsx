import React, { Component } from 'react'
import {Card,List,Icon} from 'antd'
import LinkButton from '../../components/link-button'
import {IMG_URL} from '../../utils/constants'
import{reqCategoryById} from '../../api'
const Item = List.Item

export default class ProductDetail extends Component {
    state = {
        cName1:'',//一级分类
        cName2:''//二级分类
    }
    async componentDidMount(){
        const {categoryId,pCategoryId} = this.props.location.state.product
        if(pCategoryId === "0"){
            const result = await reqCategoryById(categoryId)
            const {name} = result.data
            this.setState({cName1:name})
        }else{
            //二级
            debugger
            // const result1 = await reqCategoryById(pCategoryId)
            // const result2 = await reqCategoryById(categoryId)
            // const cName1 = result1.data.name
            // const cName2 = result2.data.name
            //一次性发送多个请求
           const result = await Promise.all([reqCategoryById(pCategoryId),reqCategoryById(categoryId)])
            const cName1 = result[0].data.name
            const cName2 = result[1].data.name

            this.setState({cName1:cName1,cName2:cName2})
        }
        
    }
    render() {
        const {name,desc,price,detail,imgs} = this.props.location.state.product
        const {cName1,cName2} = this.state
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{fontSize:'20px',marginRight:10}} 
                    onClick={() => this.props.history.goBack()}></Icon>
                </LinkButton>
                
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <Item>
                    <span className='left'>商品名称：</span>
                    <span>{name}</span>
                </Item>
                <Item>
                    <span className='left'>商品描述：</span>
                    <span>{desc}</span>
                </Item>
                <Item>
                    <span className='left'>商品价格：</span>
                    <span>{price}</span>
                </Item>
                <Item>
                    <span className='left'>所属分类：</span>
                    <span>{cName1} {cName2? '->'+cName2:''}</span>
                </Item>
                <Item>
                    <span className='left'>商品图片：</span>
                    <span>
                        {
                            imgs.map(img =>(
                                <img key={img} className='product-img' src={IMG_URL + img}/>
                            ))
                        }
                        {/* <img className='product-img' src='/images/computer1.jpg' alt='img'/>
                        <img className='product-img' src='/images/computer2.jpg' alt='img'/> */}
                    </span>
                </Item>
                <Item>
                    <span className='left'>商品详情：</span>
                    <span dangerouslySetInnerHTML={{__html: detail || '<h1 style="color:red;">内部赶紧回家回家后</h1>'}}>  
                    </span>
                </Item>
            </Card>
        )
    }
}
