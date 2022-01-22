import React from 'react'
import NavBar from '../components/NavBar'

function NavMenu() {
    const content = {
        index: { name: 'Home'},
        deposit: { name: 'ฝากวัสดุ'},
        price: { name: 'ราคารับซื้อ'},
        audit: { name: 'รายการบัญชีออมทรัพย์'},
        report: { name: 'เอกสาร'},

    }
    return (
        <div>
            <NavBar
                content={content}
            />
        </div>
    )
}

export default NavMenu
