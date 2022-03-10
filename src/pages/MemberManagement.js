import React, { useState, useEffect } from 'react'
import { Spin, Checkbox, Row, Col } from 'antd'
import InputText from '../components/InputText'
import DataTable from '../components/DataTable'
import BoxCard from '../components/BoxCard'
import { Button } from '../components/styles/globalStyles'
import ModalAddMember from '../components/modal/Modal.RegistMember'
import * as API from '../utils/apis'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function MemberManagement() {

  const initMember = [
    {
      key: '',
      Acc_number: "",
      Bank: "",
      Email: "",
      Firstname: "",
      ID: "",
      Lastname: "",
      No_members: "",
      Password: "",
      Phone_number: "",
      Phone_number2: "",
      Remark: "",
      Role: "",
      Username: "",
    },

  ]

  const [showModalAdd, setShowModalAdd] = useState(false)

  const [searchKeyword, setSearchKeyword] = useState("");
  const [clearSelectedRow, setClearSelectedRow] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [onChangeSearch, setOnChangeSearch] = useState(false)
  const [memberData, setMemberData] = useState(initMember);

  const [isLoad, setIsLoad] = useState(false)
  const [typeOptionList, setTypeOptionList] = useState([])
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  const [checkedList, setCheckedList] = useState([]);

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: '50px'
    },
    {
      title: 'รหัสสมาชิก',
      dataIndex: 'ID',
      sorter: {
        compare: (a, b) => a.ID - b.ID,
        multiple: 1,
      },
      width: '120px',
    },
    {
      title: 'ชื่อ',
      dataIndex: 'Firstname',
      width: '200px',
    },
    {
      title: 'นามสกุล',
      dataIndex: 'Lastname',
      width: '200px',
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'Phone_number',
      width: '150px',
    },
    {
      title: 'อีเมล',
      dataIndex: 'Email',
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'Remark',
      width: '200px',
    },
  ];


  useEffect(() => {
    searchMember(searchKeyword)
    getMemberType()
  }, []);

  useEffect(() => {
    if (clearSelectedRow === true) {
      setSearchKeyword('')
      setClearSelectedRow(false)
    } else {
      if (!onChangeSearch) {
        setSearchKeyword(searchKeyword)
      }
    }
    searchMember(searchKeyword)
  }, [clearSelectedRow, searchKeyword, onChangeSearch]);

  useEffect(() => {
    // console.log(searchKeyword, checkedList);
    searchMember(searchKeyword)
  }, [checkedList])

  const onChangeCheckbox = (list) => {
    setCheckedList(list);
    setIndeterminate(!Boolean(list.lenght) && list.length < typeOptionList.length);
    setCheckAll(list.length === typeOptionList.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? typeOptionList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
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

  const getMemberInformation = () => {
    console.log(memberData);
    let filteredMember = memberData.filter((item, index) => {
      let textSearch = String(searchKeyword).toLowerCase();
      let checkMemId = String(item.ID).toLowerCase().includes(textSearch)
      let checkName = String(item.Firstname).toLowerCase().includes(textSearch)
      let checkLastname = String(item.Lastname).toLowerCase().includes(textSearch)
      let checkTel = String(item.Phone_number).toLowerCase().includes(textSearch)
      let checkEmail = String(item.Email).toLowerCase().includes(textSearch)
      //check data contain search
      let checkTrue = (checkMemId || checkName || checkLastname || checkTel || checkEmail)
      //then return item to array
      return checkTrue
    })

    filteredMember.forEach((item, index) => {
      item['key'] = index + 1
    })
    return filteredMember
  }

  const refreshRowMember = () => {
    setClearSelectedRow(!clearSelectedRow)
  }


  const onSelected = () => {
    // save(selectedData[1][0])
    // handleClose()
  }

  const searchMember = async (keyword) => {
    try {
      const response = searchKeyword.length > 0 ? await API.searchMember(searchKeyword) : await API.getMember();
      const data = await response?.data.data;
      if (response.status === 200) {
        if (data.length > 0) {
          let filteredData = data.filter((item) => {
            return checkedList.includes(String(item.Role))
          })
          setMemberData(filteredData)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderButtonAdd = () => {
    return (<Button onClick={() => setShowModalAdd(true)} >เพิ่มสมาชิก</Button>)
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

  return (
    <div>
      <Spin tip="Loading..." spinning={isLoad}>
        <BoxCard title={"จัดการข้อมูลสมาชิก"} headRight={renderButtonAdd()}>
          <div>
            <Row gutter={[10, 10]} className='mb-4'>
              <Col>
                <div className='pt-2'>
                  <h5>{`คำค้นหา:`}</h5>
                </div>
              </Col>
              <Col span={12}>
                <InputText type="text" idName="search-keyword"
                  placeholder="รหัสสมาชิก, ชื่อ, นามสกุล, เบอร์โทร, อีเมล" classLabel="bold"
                  value={searchKeyword}
                  handleChange={(value) => {
                    setOnChangeSearch(true)
                    setSearchKeyword(value)
                  }}
                />
              </Col>
              <Col>
                <Button className={'mr-2'} bg={'#3C3C3C'} width={'80px'} color={'#fff'} onClick={() => { refreshRowMember() }}>ล้าง</Button>
              </Col>
            </Row>
          </div>
          <div className='mt-3'>
            <h5 className='w-100 py-2 px-2' style={{ background: '#D3ECA7', borderRadius: '10px' }}>
              <span className='px-2' style={{ color: 'white', backgroundColor: '#A1B57D', borderRadius: '10px' }}>ประเภทสมาชิก</span>
            </h5>
            <div className='mx-5' style={{ width: '50%' }}>
              {renderCheckBoxType()}
            </div>
          </div>
          <div>
            <Row>
              <Col className='w-100'>
                <div className='mt-5'>
                  <h5 className='w-100 py-2 px-2' style={{ background: '#D3ECA7', borderRadius: '10px' }}>
                    <span className='px-2' style={{ color: 'white', backgroundColor: '#A1B57D', borderRadius: '10px' }}>ข้อมูลสมาชิก</span>
                  </h5>
                </div>
                <DataTable
                  columns={columns}
                  data={getMemberInformation()}
                  option={
                    {
                      "selectionType": "radio",
                      "type": 'selection',
                      "clearSelectedRow": clearSelectedRow,
                      "select": (data) => { setSelectedData(data) }
                    }
                  }
                >
                </DataTable>
              </Col>
            </Row>
          </div>
        </BoxCard>
      </Spin>

      {showModalAdd &&
        <ModalAddMember
          show={showModalAdd}
          close={() => {
            setShowModalAdd(false)
            getMemberInformation()
          }}
        ></ModalAddMember>}
    </div>
  )
}

export default MemberManagement