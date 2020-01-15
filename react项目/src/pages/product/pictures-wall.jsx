import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from 'prop-types'
import { reqDeleteImg } from '../../api'
import { IMG_URL } from '../../utils/constants'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {
    static propTypes = {
        imgs: PropTypes.array
    }
    constructor(props) {
        super(props)
        //
        let fileList = [];
        const { imgs } = this.props
        //debugger
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: IMG_URL + img
            }))
        } else {

        }
        this.state = {
            previewVisible: false, //是否显示大图预览
            previewImage: '', //大图的地址url
            fileList
        }
    }

    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    /**
     * file 当前操作的图片文件
     * filelist //所有上传图片的数组 filelist
     */

    handleChange = async ({ file, fileList }) => {

        //当上传成功 将当前上传的file的信息修正
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传图片成功')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') { // 删除图片
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功!')
            } else {
                message.error('删除图片失败!')
            }
        }

        //在操作过程中 更新filelist状态
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload"
                    accept='image/*' //只接收图片格式
                    name='image' //请求参数名
                    listType="picture-card"
                    fileList={fileList} //所有上传图片的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
