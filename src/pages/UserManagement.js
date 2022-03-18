import React, { useState, useEffect } from 'react'
import { Spin, Button as ButtonIcon, Row, Col } from 'antd'
import { DeleteOutlined, } from '@ant-design/icons'
import InputText from '../components/InputText'
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
      width: '120px'
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
      title: 'โทรศัพท์มือถือ',
      dataIndex: 'phone',
      width: '150px'
    },
    {
      title: 'อีเมล',
      dataIndex: 'email',
    },
  ]
  const [isLoad, setIsLoad] = useState(false)
  const [userUnregist, setUserUnregist] = useState([])
  const [userRegisted, setUserRegistered] = useState([])
  const [userUnregistFiltered, setUserUnregistFiltered] = useState([])
  const [userRegistedFiltered, setUserRegisteredFiltered] = useState([])

  const [showModalAdd, setShowModalAdd] = useState(false)

  const [searchEmpUnregistKeyword, setSearchEmpUnregistKeyword] = useState("");
  const [searchEmpRegisteredKeyword, setSearchEmpRegisteredKeyword] = useState("");

  useEffect(() => {
    getEmpInformation()
  }, [])

  useEffect(() => {
    searchEmpUnregist(searchEmpUnregistKeyword)
  }, [searchEmpUnregistKeyword])

  useEffect(() => {
    searchEmpRegistered(searchEmpRegisteredKeyword)
  }, [searchEmpRegisteredKeyword])

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
              newEmpArray.push({ ...emp, key: newEmpArray.length + 1, })
            } else {
              empArray.push({ ...emp, key: empArray.length + 1, })
            }
          })
          setUserUnregist(newEmpArray)
          setUserRegistered(empArray)
          setUserUnregistFiltered(newEmpArray)
          setUserRegisteredFiltered(empArray)
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
        confirmButtonColor: '#E72525',
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
              setUserRegisteredFiltered([])
              setUserUnregistFiltered([])
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

  const refreshEmpUnregist = async () => {
    setSearchEmpUnregistKeyword("")
  }

  const refreshEmpRegistered = async () => {
    setSearchEmpRegisteredKeyword("")
  }

  const searchEmpUnregist = async (keyword) => {
    try {
      let filteredData = userUnregist.filter((item) => {
        return String(item.employeeId).includes(keyword) || String(item.email).includes(keyword)
      })
      setUserUnregistFiltered(filteredData)
    } catch (error) {
      console.log(error)
    }
  }

  const searchEmpRegistered = async (keyword) => {
    try {
      let filteredData = userRegisted.filter((item) => {
        return String(item.employeeId).includes(keyword) || String(item.firstname).includes(keyword)|| String(item.lastname).includes(keyword)|| String(item.phone).includes(keyword)|| String(item.email).includes(keyword)
      })
      setUserRegisteredFiltered(filteredData)
    } catch (error) {
      console.log(error)
    }
  }

  const buttonAdd = () => {
    return (<Button onClick={() => setShowModalAdd(true)} >เพิ่มเจ้าหน้าที่</Button>)
  }

  return (
    <div>
      <Spin tip="Loading..." spinning={isLoad}>
        <BoxCard title={"จัดการข้อมูลเจ้าหน้าที่"} headRight={buttonAdd()}>
          {/* <h4>ข้อมูลเจ้าหน้าที่</h4> */}
          <div className='mt-3'>
            <h5 className='w-100 py-2 px-2' style={{ background: '#FFD365', borderRadius: '10px' }}><span className='px-2' style={{ color: 'white', backgroundColor: '#FF9F45', borderRadius: '10px' }}>ยังไม่ทำการสมัครเข้าใช้งาน</span></h5>
            <div>
              <Row gutter={[10, 10]} className='mb-4'>
                <Col>
                  <div className='pt-2'>
                    <h5>{`คำค้นหา:`}</h5>
                  </div>
                </Col>
                <Col span={12}>
                  <InputText type="text" idName="search-emp-unregistered-keyword"
                    placeholder="รหัสสมาชิก, อีเมล" classLabel="bold"
                    value={searchEmpUnregistKeyword}
                    handleChange={(value) => {
                      setSearchEmpUnregistKeyword(value)
                    }}
                  />
                </Col>
                <Col>
                  <Button className={'mr-2'} bg={'#3C3C3C'} width={'80px'} color={'#fff'} onClick={() => { refreshEmpUnregist() }}>ล้าง</Button>
                </Col>
              </Row>
            </div>
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
              data={userUnregistFiltered}
              limitPositionLeft={true}
              option={{
                "showLimitPage": true,
                "rowClassname": "editable-row"
              }}>
            </DataTable>
          </div>
          <div className='mt-3'>
            <h5 className='w-100 py-2 px-2' style={{ background: '#D3ECA7', borderRadius: '10px' }}><span className='px-2' style={{ color: 'white', backgroundColor: '#A1B57D', borderRadius: '10px' }}>สมัครเข้าใช้งานแล้ว</span></h5>
            <div>
              <Row gutter={[10, 10]} className='mb-4'>
                <Col>
                  <div className='pt-2'>
                    <h5>{`คำค้นหา:`}</h5>
                  </div>
                </Col>
                <Col span={12}>
                  <InputText type="text" idName="search-emp-registered-keyword"
                    placeholder="รหัสสมาชิก, ชื่อ, นามสกุล, โทรศัพท์มือถือ, อีเมล" classLabel="bold"
                    value={searchEmpRegisteredKeyword}
                    handleChange={(value) => {
                      setSearchEmpRegisteredKeyword(value)
                    }}
                  />
                </Col>
                <Col>
                  <Button className={'mr-2'} bg={'#3C3C3C'} width={'80px'} color={'#fff'} onClick={() => { refreshEmpRegistered() }}>ล้าง</Button>
                </Col>
              </Row>
            </div>
            <DataTable
              columns={columns}
              data={userRegistedFiltered}
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