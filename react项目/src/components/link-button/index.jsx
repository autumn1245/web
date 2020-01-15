import React from 'react'
import './index.less'

/**
 * 自定义外形像a标签一样的按钮  
 * @param {props} props 
 */
export default function LinkButton(props) {

    return (
        <button {...props} className='link-button'>{props.children}</button>
    )
}
