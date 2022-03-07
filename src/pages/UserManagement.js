import React, { useState, useEffect } from 'react'
import { Spin, Button as ButtonIcon, } from 'antd'
import { DeleteOutlined, } from '@ant-design/icons'
import DataTable from '../components/DataTable'
import BoxCard from '../components/BoxCard'
import { Button } from '../components/styles/globalStyles'
import ModalAddEmployee from '../components/modal/Modal.AddEmployee'
import * as API from '../utils/apis'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function UserManagement() {

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: '50px'
    },
    {
      title: 'รหัสเจ้าหน้าที่',
      dataIndex: 'employeeId',
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firsname',
    },
    {
      title: 'นามสกุล',
      dataIndex: 'lastname',
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'phone',
    },
    {
      title: 'อีเมลล์',
      dataIndex: 'email',
    },
  ]
  const [isLoad, setIsLoad] = useState(false)
  const [userUnregist, setUserUnregist] = useState([])
  const [userRegisted, setUserRegistered] = useState([])
  const [showModalAdd, setShowModalAdd] = useState(false)

  useEffect(() => {
    getEmpInformation()
  }, [])

  const getEmpInformation = async () => {
    try {
      setIsLoad(true)
      const response = await API.getEmployees();
      const data = await response?.data.data
      if (response.status === 200) {
        if (data && data.lenght !== 0) {
          let empArray = []
          let newEmpArray = []
          data.forEach((item) => {
            let emp = {
              id: item.ID,
              employeeId: item.Employee_ID,
              firstname: item.Firstname,
              lastname: item.Lastname,
              phone: item.Phone,
              email: item.Email,
              role: item.Role
            }
            if (emp.role === '-') {
              newEmpArray.push({ ...emp, key: userUnregist.length + 1, })
            } else {
              empArray.push({ ...emp, key: userRegisted.length + 1, })
            }
          })
          setUserUnregist(newEmpArray)
          setUserRegistered(empArray)
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
              setUserUnregist([])
              getEmpInformation()
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

  const buttonAdd = () => {
    return (<Button onClick={() => setShowModalAdd(true)} >เพิ่มเจ้าหน้าที่</Button>)
  }

  return (
    <div>
      <Spin tip="Loading..." spinning={isLoad}>
        <BoxCard title={"จัดการข้อมูลเจ้าหน้าที่"} headRight={buttonAdd()}>
          <h3>ข้อมูลเจ้าหน้าที่</h3>
          <div className='mt-3'>
            <h5 className='w-100 py-2 px-2' style={{ background: '#FFD365', borderRadius: '10px' }}><span className='px-2' style={{ color: 'white', backgroundColor: '#FF9F45', borderRadius: '10px' }}>ยังไม่ทำการสมัครเข้าใช้งาน</span></h5>
            <DataTable
              columns={[...columns,
              {
                title: 'การจัดการ',
                dataIndex: 'management',
                align: 'center',
                render: (_, record) => {
                  return (<div className='d-flex justify-content-center'>
                    <ButtonIcon type="primary" icon={<DeleteOutlined />} onClick={() => { handleRemove(record.id) }} danger></ButtonIcon>
                  </div>)
                }
              },
              ]}
              data={userUnregist}
              limitPositionLeft={true}
              option={{
                "showLimitPage": true,
                "rowClassname": "editable-row"
              }}>
            </DataTable>
          </div>
          <div className='mt-3'>
            <h5 className='w-100 py-2 px-2' style={{ background: '#D3ECA7', borderRadius: '10px' }}><span className='px-2' style={{ color: 'white', backgroundColor: '#A1B57D', borderRadius: '10px' }}>สมัครเข้าใช้งานแล้ว</span></h5>
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
            setUserUnregist([])
            getEmpInformation()
          }}
        ></ModalAddEmployee>}
    </div>
  )
}

export default UserManagement