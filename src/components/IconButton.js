import React from 'react';
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

function IconButton({ type, content, data, event }) {
    const genButtonFromType = () => {
        if (type === 'delete') {
            return (<Button type="primary" icon={<DeleteOutlined></DeleteOutlined>} danger onClick={(data) => { event(data) }}>
                {content}
            </Button>)
        } else {
            return (<Button type="primary">
                {content}
            </Button>)
        }
    }

    return genButtonFromType();
}

export default IconButton;
