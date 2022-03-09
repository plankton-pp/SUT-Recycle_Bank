import React, { useState, useEffect } from 'react'
import { Spin, Button as ButtonIcon, Checkbox, Row, Col } from 'antd'
import { DeleteOutlined, } from '@ant-design/icons'
import DataTable from '../components/DataTable'
import BoxCard from '../components/BoxCard'
import { Button } from '../components/styles/globalStyles'
import ModalAddEmployee from '../components/modal/Modal.AddEmployee'
import * as API from '../utils/apis'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function MemberManagement() {

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: '50px'
    },
    {
      title: 'รหัสสมาชิก',
      dataIndex: 'memberId',
      width: '120px'
    },
    {
      title: 'ประเภท',
      dataIndex: 'role',
      width: '150px'
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firstname',
      width: '150px'
    },
    {
      title: 'นามสกุล',
      dataIndex: 'lastname',
      width: '150px'
    },
    {
      title: 'เบอร์โทร 1',
      dataIndex: 'phone1',
      width: '150px'
    },
    {
      title: 'เบอร์โทร 2',
      dataIndex: 'phone2',
      width: '150px'
    },
    {
      title: 'อีเมลล์',
      dataIndex: 'email',
    },
    {
      title: <div><span style={{ color: 'red' }}>*</span>หมายเหตุ</div>,
      dataIndex: 'remark',
    },
  ]
  const [typeOptionList, setTypeOptionList] = useState([])
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  const [checkedList, setCheckedList] = useState([]);

  const [isLoad, setIsLoad] = useState(false)
  const [userRegisted, setUserRegistered] = useState([])
  const [showModalAdd, setShowModalAdd] = useState(false)

  useEffect(() => {
    getMemberType()
    getMemberInformation()
  }, [])

  const onChangeCheckbox = (list) => {
    setCheckedList(list);
    setIndeterminate(!Boolean(list.lenght) && list.length < typeOptionList.length);
    setCheckAll(list.length === typeOptionList.length);
    getMemberInformation()
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? typeOptionList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    getMemberInformation()
  };

  const getMemberType = async () => {
    try {
      setIsLoad(true)
      const response = await API.getMemberType()
      const data = response?.data.data
      if (response.status === 200) {
        if (data && data.length > 0) {
          let typeArray = []
          data.forEach((item) => {
            typeArray.push(item.MemberType)
          })
          setTypeOptionList(typeArray)
          setCheckedList(typeArray)
        }
      } else {
        throw response.status
      }
      setIsLoad(false)
    } catch (error) {
      setIsLoad(false)
      console.log(error);
      MySwal.fire({
        text: `ไม่สามารถแสดงข้อมูลประเภทสมาชิกที่ได้\n${String(error)}`,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      })
    }
  }

  const getMemberInformation = async () => {
    try {
      setIsLoad(true)
      const response = await API.getMember();
      const data = await response?.data.data
      if (response.status === 200) {
        if (data && data.lenght !== 0) {
          let memberArray = []
          data.forEach((item) => {
            let emp = {
              id: item.ID,
              memberId: item.ID,
              firstname: item.Firstname,
              lastname: item.Lastname,
              phone1: item.Phone_number,
              phone2: item.Phone_number2,
              email: item.Email,
              role: item.Role,
              remark: item.Remark,
            }
            memberArray.push({ ...emp, key: memberArray.length + 1, })
          })
          let filteredData = memberArray.filter(item => {
            return checkedList.includes(item.role)
          })
          console.log("cheLis: ", checkedList);
          // console.log("fd: ", filteredData);
          setUserRegistered(memberArray)
          setIsLoad(false)
        } else {
          throw 'empty data'
        }
      } else {
        throw 'status 400'
      }
    } catch (error) {
      setIsLoad(false)
      console.log(error);
      MySwal.fire({
        text: `ไม่สามารถแสดงข้อมูลเจ้าหน้าที่ได้\n${String(error)}`,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      })
    }
  }

  const handleRemove = async (removeId) => {
    try {
      setIsLoad(true)
      MySwal.fire({
        text: `ยืนยันการบันทึกรายการ `,
        icon: "question",

        confirmButtonColor: '#96CC39',
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (value) => {
        if (value.isConfirmed) {
          const response = await API.deleteEmployee(removeId)
          if (response.status === 200) {
            MySwal.fire({
              text: `แก้ไขข้อมูลสำเร็จ`,
              icon: "success",
              confirmButtonColor: '#96CC39',
              confirmButtonText: "ตกลง",
            }).then(() => {
              setUserRegistered([])
              getMemberInformation()
            })
          } else {
            throw 'status 400'
          }
        }
      })
      setIsLoad(false)
    } catch (error) {
      setIsLoad(false)
      console.log(error);
      MySwal.fire({
        text: `ระบบไม่สามารถแก้ไขข้อมูลได้ \n กรุณาทำรายการอีกครั้งในภายหลัง`,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      })
    }
  }

  const renderCheckBoxType = () => {
    //options={typeOptionList}
    //value={checkedList}
    return (
      <div>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          ทั้งหมด
        </Checkbox>
        <Checkbox.Group value={checkedList} onChange={(value) => { onChangeCheckbox(value) }}>
          <Row>
            {typeOptionList && typeOptionList.length > 0 && typeOptionList.map(item => {
              return (<>
                <Col span={8}>
                  <Checkbox value={String(item)}>{item}</Checkbox>
                </Col>
              </>)
            })}
          </Row>
        </Checkbox.Group>
      </div>
    )
  }

  const renderButtonAdd = () => {
    return (<Button onClick={() => setShowModalAdd(true)} >เพิ่มเจ้าหน้าที่</Button>)
  }

  return (
    <div>
      <Spin tip="Loading..." spinning={isLoad}>
        <BoxCard title={"จัดการข้อมูลสมาชิก"} headRight={renderButtonAdd()}>
          <div className='mt-3'>
            <h5 className='w-100 py-2 px-2' style={{ background: '#D3ECA7', borderRadius: '10px' }}><span className='px-2' style={{ color: 'white', backgroundColor: '#A1B57D', borderRadius: '10px' }}>ประเภทสมาชิก</span></h5>
            <div style={{ width: '50%' }}>
              {renderCheckBoxType()}
            </div>

          </div>
          <div className='mt-3'>
            <h5 className='w-100 py-2 px-2' style={{ background: '#D3ECA7', borderRadius: '10px' }}><span className='px-2' style={{ color: 'white', backgroundColor: '#A1B57D', borderRadius: '10px' }}>ข้อมูลสมาชิก</span></h5>
            <DataTable
              columns={columns}
              data={userRegisted}
              limitPositionLeft={true}
              option={{
                "showLimitPage": true,
                "rowClassname": "editable-row"
              }}>
            </DataTable>
          </div>
        </BoxCard>
      </Spin>

      {showModalAdd &&
        <ModalAddEmployee
          show={showModalAdd}
          close={() => {
            setShowModalAdd(false)
            setUserRegistered([])
            getMemberInformation()
          }}
        ></ModalAddEmployee>}
    </div>
  )
}

export default MemberManagement