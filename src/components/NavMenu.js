import React from 'react'
import NavLayout from '../components/NavLayout'
import * as helper from '../utils/helper'

function NavMenu() {
    const content = {
        index: { name: 'Home' },
        deposit: { name: 'ฝากวัสดุ' },
        price: { name: 'ราคารับซื้อ' },
        audit: { name: 'รายการบัญชีออมทรัพย์' },
        report: { name: 'เอกสาร' },

    }
    return (
        <div>
            <NavLayout
                content={content}
            />
        </div>
    )
}

export default NavMenu
