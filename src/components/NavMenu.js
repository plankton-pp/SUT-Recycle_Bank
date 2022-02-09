import React from 'react'
import NavLayout from '../components/NavLayout'

function NavMenu() {
    const content = {
        index: { name: 'Home' },
        deposit: { name: 'ฝากวัสดุ' },
        management: { name: 'การจัดการ' },
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
