import React, { useState, useEffect } from 'react';
import { Button as ButtonIcon, Spin, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom'
import { DeleteOutlined, EditOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { Button } from '../components/styles/globalStyles';
import BoxCard from '../components/BoxCard';
import DataTable from '../components/DataTable';
import * as API from '../utils/apis'
import * as helper from '../utils/helper'

import InputText from '../components/InputText';

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function ManageTypes() {

    const [contentTab, setContentTab] = useState([]);
    const [isLoad, setIsLoad] = useState(false)
    const [changedState, setChangedState] = useState(false);
    const [onEditKey, setOnEditKey] = useState('');
    
    const username = JSON.parse(helper.sessionGet('login')).Username



    const initForm = {
        data: [],
        removedDataId: [],
        updatedList: [],
        typename: [],
    }

    const [form, setForm] = useState(initForm);

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },
        {
            title: 'TypeId',
            dataIndex: 'id',

        },
        {
            title: 'ชื่อประเภท',
            dataIndex: 'name',
            width: '200px',
            editable: true,
            render: (_, record) => {
                if (form && form.data.length > 0) {
                    return (<div>
                        < InputText type="text" idName="update-typename"
                            disabled={record.disabled}
                            value={form.data[record.key - 1].name}
                            handleChange={(value) => {
                                let dataList = [...form.data]
                                dataList[record.key - 1].name = value
                                setForm({ ...form, data: dataList })
                            }}
                        />
                    </div>)
                } else {
                    return (<div>{record.name}</div>)
                }
            }
        },
        {
            title: 'Create Date',
            dataIndex: 'createDate',
            sorter: {
                compare: (a, b) => a.createDate - b.createDate,
                multiple: 1,
            },
            // width: '100px',
            align: 'center',
        },
        {
            title: 'Update Date',
            dataIndex: 'updateDate',
            sorter: {
                compare: (a, b) => a.updateDate - b.updateDate,
                multiple: 1,
            },
            // width: '100px',
            align: 'center',
        },
        {
            title: 'Create By',
            dataIndex: 'createBy',
        },
        {
            title: 'Update By',
            dataIndex: 'updateBy',
        },
        {
            title: 'การจัดการ',
            dataIndex: 'management',
            align: 'center',
            render: (_, record) => {
                return (
                    <div>
                        {onEditKey !== record.key ?
                            <ButtonIcon
                                style={{ backgroundColor: 'orange', borderColor: 'orange', color: 'white', marginRight: '10px' }}
                                icon={<EditOutlined />}
                                onClick={() => {
                                    handleChange(record.key)
                                }}
                                danger>
                            </ButtonIcon>
                            :
                            <ButtonIcon
                                style={{ backgroundColor: '#96CC39', borderColor: '#96CC39', color: 'white', marginRight: '10px' }}
                                icon={<CheckSquareOutlined />}
                                onClick={() => {
                                    setChangedState(true)
                                    handleChange(record.key)
                                }}
                                danger>
                            </ButtonIcon>
                        }
                        <ButtonIcon type="primary" icon={<DeleteOutlined />} onClick={() => { handleRemove(record.key, record.id, record.status) }} danger></ButtonIcon>
                    </div>
                )
            },
        },
    ];

    useEffect(() => {
        if (contentTab && contentTab.length > 0) {
            let reIndexList = []
            contentTab.forEach((item, index) => {
                reIndexList.push({
                    ...item,
                    key: index + 1,
                })
            })
            setForm({ ...form, data: reIndexList })
            reIndexList = null
        }
        if (contentTab && contentTab.length === 0) {
            setForm({ ...form, data: [] })
            getTypeAPI()
        }
    }, [contentTab]);

    const getTypeAPI = async () => {
        try {
            setIsLoad(true)
            const response = await API.getTypes();
            const data = await response?.data.data;
            if (response.status === 200) {
                let filteredDataType = []
                //loop
                if (data) {
                    data.forEach((item, index) => {
                        filteredDataType.push({
                            key: index + 1,
                            id: item.Type_ID,
                            name: item.Name,
                            disabled: true,
                            createDate: helper.dateElement(item.Create_Date),
                            updateDate: helper.dateElement(item.Update_Date.length > 0 ? item.Update_Date : item.Create_Date),
                            createBy: String(item.Create_By),
                            updateBy: String(item.Update_By).length > 4 ? String(item.Update_By) : String(item.Create_By),
                            status: 'query',
                        })
                    })
                    setContentTab(filteredDataType)
                    setIsLoad(false)
                }
            }
        } catch (error) {
            setIsLoad(false)
            console.log(error)
        }
    }

    const handleCancel = () => {
        if (changedState) {
            MySwal.fire({
                text: `ยกเลิกการเปลี่ยนแปลงทั้งหมด `,
                icon: "question",
                 
                confirmButtonColor: '#E72525',
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then((value) => {
                if (value.isConfirmed) {
                    setContentTab([])
                }
            })
        } else {
            setContentTab([])
        }

    }

    const updateType = async (data) => {
        try {
            setIsLoad(true)
            const response = await API.updateType(data)
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
        }

    }
    const addType = async (data) => {
        try {
            setIsLoad(true)
            const response = await API.addType(data)
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
        }
    }

    const removeType = async (id) => {
        try {
            setIsLoad(true)
            const response = await API.deleteTypeById(id)
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
        }
    }

    const addNewType = () => {
        let date = new Date()
        let now = String(date.getTime() / 1000)
        const newRecord = {
            key: contentTab.length + 1,
            id: "",
            name: "",
            createDate: helper.dateElement(now),
            updateDate: helper.dateElement(now),
            createBy: username,
            updateBy: username,
            disabled: false,
            status: 'add',
        };
        setOnEditKey(contentTab.length + 1)
        setContentTab([...contentTab, newRecord])
    }

    const handleSave = (typeForm) => {
        if (changedState) {
            MySwal.fire({
                text: `ยืนยันบันทึกการเปลี่ยนแปลง `,
                icon: "question",
                 
                confirmButtonColor: '#96CC39',
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then((value) => {
                if (value.isConfirmed && typeForm && typeForm.data.length > 0) {
                    try {
                        let validator = false
                        typeForm.data.forEach(async (item) => {
                            if (item.status !== "query") {
                                if (item.status === "edit") {
                                    let pack = {
                                        id: item.id,
                                        name: item.name,
                                        updateby: item.updateBy,
                                    }
                                    updateType(pack)
                                } else {
                                    let pack = {
                                        name: item.name,
                                        createby: item.createBy
                                    }
                                    addType(pack)
                                }
                            }
                        })

                        if (typeForm.removedDataId.length > 0) {
                            typeForm.removedDataId.forEach((item) => {
                                removeType(item)
                            })
                        }
                        if (validator) {
                            MySwal.fire({
                                text: `บันทึกข้อมูลไม่สำเร็จ \nกรุณาทำรายการอีกครั้ง`,
                                icon: "error",
                                 
                                showCancelButton: true,
                                confirmButtonText: "ยกเลิก",
                            })
                        } else {
                            MySwal.fire({
                                text: `บันทึกข้อมูลสำเร็จ`,
                                icon: "success",
                                 
                                confirmButtonColor: '#96CC39',
                                showCancelButton: true,
                                confirmButtonText: "ตกลง",
                            }).then(() => {
                                setChangedState(false)
                                setContentTab([])
                                getTypeAPI()
                            })
                        }



                    } catch (error) {
                        MySwal.fire({
                            text: `บันทึกข้อมูลไม่สำเร็จ \nกรุณาทำรายการอีกครั้ง`,
                            icon: "error",
                             
                            showCancelButton: true,
                            confirmButtonText: "ยกเลิก",
                        })
                    }
                }
                // close()
            })
        } else {
            // close()
        }
    }

    const handleChange = (key) => {
        let index = key - 1
        if (onEditKey && onEditKey == key) {
            //save
            //do
            if (contentTab && contentTab.length > 0 && key > -1) {
                //array
                let dtlist = [...form.data]
                let date = new Date()
                let now = String(date.getTime() / 1000)
                let checkChanged = dtlist[index].name !== contentTab[index].name
                setChangedState(checkChanged)
                //object
                dtlist[index] = {
                    ...dtlist[index],
                    disabled: true,
                    updateBy: checkChanged ? username : dtlist[index].updateBy,
                    updateDate: checkChanged ? helper.dateElement(now) : dtlist[index].updateDate,
                    status: checkChanged ? (dtlist[index].status === "add" ? 'add' : 'edit') : dtlist[index].status,
                }
                setContentTab(dtlist)
            } else {
                console.log("array is empty");
            }
            setOnEditKey('')
        } else if (onEditKey !== "") {
            //swap
            MySwal.fire({
                text: `บันทึกการเปลี่ยนแปลงก่อนหน้า `,
                icon: "warning",
                 
                confirmButtonColor: '#96CC39',
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then((value) => {
                if (value.isConfirmed) {
                    if (contentTab && contentTab.length > 0 && key > -1) {
                        //save
                        let date = new Date()
                        let now = String(date.getTime() / 1000)
                        let onSavelist = [...form.data]
                        let onEditIndex = onEditKey - 1
                        let checkChanged = onSavelist[onEditIndex].name !== contentTab[onEditIndex].name
                        setChangedState(checkChanged)
                        onSavelist[onEditIndex] = {
                            ...onSavelist[onEditIndex],
                            disabled: true,
                            updateBy: checkChanged ? username : onSavelist[onEditIndex].updateBy,
                            updateDate: checkChanged ? helper.dateElement(now) : onSavelist[onEditIndex].updateDate,
                            status: checkChanged ? onSavelist[index].status === "add" ? "add" : 'edit' : onSavelist[index].status,
                        }
                        //edit
                        onSavelist[index] = {
                            ...onSavelist[index],
                            disabled: false,
                        }
                        setContentTab(onSavelist)
                    } else {
                        console.log("array is empty");
                    }
                    setOnEditKey(key)
                }
            })
        } else {
            //edit
            setOnEditKey(key)
            //change name to input
            if (contentTab && contentTab.length > 0 && key > -1) {
                //array
                let dtlist = [...contentTab]
                //opject
                dtlist[index] = {
                    ...dtlist[index],
                    disabled: false,
                }
                setContentTab(dtlist)
            } else {
                console.log("array is empty");
            }
        }
    };

    const handleAdd = () => {
        if (onEditKey !== "") {
            MySwal.fire({
                text: `บันทึกการเปลี่ยนแปลงก่อนหน้า `,
                icon: "warning",
                 
                confirmButtonColor: '#96CC39',
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then(async (value) => {
                if (value.isConfirmed) {
                    handleChange(onEditKey)
                }
            })
        } else {
            addNewType()
        }
    };

    const handleRemove = (key, id, status) => {
        let updatedList = [...contentTab]
        if (contentTab && contentTab.length > 0 && key > -1) {
            if (status !== 'add') {
                setChangedState(true)
                setForm({ ...form, removedDataId: [...form.removedDataId, id] })
            } else {
                setOnEditKey("")
            }
            updatedList.splice(key - 1, 1)
            setContentTab(updatedList)
        } else {
            console.log("array is empty");
        }
    }

    const buttonAdd = () => {
        return (<Button onClick={() => handleAdd()}>เพิ่มรายการ</Button>)
    }

    return (
        <div>
            <BoxCard title={"ประเภทวัสดุ"} headRight={buttonAdd()}>
                <Spin tip="Loading..." spinning={isLoad}>
                    <div className='mb-3'>
                        <DataTable
                            columns={columns}
                            data={form.data}
                            limitPositionLeft={true}
                            option={{
                                "showLimitPage": true,
                                "rowClassname": "editable-row"
                            }}>
                        </DataTable>
                    </div>
                    <div className="d-flex justify-content-end" >
                        <Row gutter={[10, 0]}>
                            <Col>
                                <Button color="white" bg="#96CC39" width={'80px'} className="cursor-p" disabled={!changedState} onClick={() => { handleSave(form) }}>บันทึก</Button>
                            </Col>
                            <Col>
                                <Button color="white" bg="#E72525" width={'80px'} className="cursor-p" onClick={() => { handleCancel() }}>ยกเลิก</Button>
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </BoxCard>
        </div>
    );
}

export default ManageTypes;
