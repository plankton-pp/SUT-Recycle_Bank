import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { Button as ButtonIcon, Spin, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { Button } from '../components/styles/globalStyles';
import BoxCard from '../components/BoxCard';
import DataTable from '../components/DataTable';
import * as API from '../utils/apis'
import * as helper from '../utils/helper'

import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/logoutAction';

import InputText from '../components/InputText';
import InputSelect from '../components/InputSelect';

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function ManageProducts() {

    const [defaultLenght, setDefaultLenght] = useState(0);
    const [contentTab, setContentTab] = useState([]);
    const [typeOptionList, setTypeOptionList] = useState([])
    const [isLoad, setIsLoad] = useState(false)
    const [changedState, setChangedState] = useState(false);
    const [onEditKey, setOnEditKey] = useState('');
    const [countChanged, setCountChanged] = useState(0);
    const history = useHistory();
    const dispatch = useDispatch();
    const [filteredGroup, setFilteredGroup] = useState({ value: '', label: 'ทั้งหมด' })
    const [filterOptionList, setFilterOptionList] = useState([])

    const { ID, Firstname, Lastname } = JSON.parse(helper.sessionGet('login'))

    const initForm = {
        data: [],
        removedDataId: [],
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
            title: 'Id',
            dataIndex: 'id',

        },
        {
            title: 'ประเภท',
            dataIndex: 'type',
            width: '150px',
            render: (_, record) => {
                return (<div>
                    <InputSelect
                        disabled={record.disabled}
                        classLabel="bold"
                        optionsList={typeOptionList}
                        selectValue={record.type}
                        handleChange={(value) => {
                            let dataList = [...form.data]
                            dataList[record.key - 1].type = value
                            setForm({ ...form, data: dataList })
                        }}
                    />
                </div>)
            },
        },
        {
            title: 'ชื่อวัสดุ',
            dataIndex: 'name',
            width: '200px',
            align: 'center',
            editable: true,
            render: (_, record) => {
                if (form && form.data.length > 0) {
                    return (<div>
                        < InputText type="text" idName="update-typename"
                            // as={"textarea"}
                            // rows={2}
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
            title: 'หน่วย',
            dataIndex: 'unit',
            align: 'center',
            width: '100px',
            editable: true,
            render: (_, record) => {
                if (form && form.data.length > 0) {
                    return (<div>
                        < InputText type="text" idName="update-detail"
                            disabled={record.disabled}
                            value={form.data[record.key - 1].unit}
                            handleChange={(value) => {
                                let dataList = [...form.data]
                                dataList[record.key - 1].unit = value
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
            title: 'รายละเอียด',
            dataIndex: 'detail',
            align: 'center',
            width: '200px',
            editable: true,
            render: (_, record) => {
                if (form && form.data.length > 0) {
                    return (<div>
                        < InputText type="text" idName="update-detail"
                            as={"textarea"}
                            rows={2}
                            disabled={record.disabled}
                            value={form.data[record.key - 1].detail}
                            handleChange={(value) => {
                                let dataList = [...form.data]
                                dataList[record.key - 1].detail = value
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
            title: 'มูลค่าต่อหน่วย (บาท)',
            dataIndex: 'pricePerUnit',
            width: '150px',
            align: 'right',
        },
        {
            title: 'Update Date',
            dataIndex: 'updateDate',
            align: 'center',
        },
        {
            title: 'Update By',
            dataIndex: 'updateByName',
        },
        {
            title: 'การจัดการ',
            dataIndex: 'management',
            align: 'center',
            width: '120px',
            render: (_, record) => {
                return (
                    <div>
                        {onEditKey !== record.key ?
                            <ButtonIcon
                                style={{ backgroundColor: 'orange', borderColor: 'orange', color: 'white', marginRight: '10px' }}
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setChangedState(true)
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
        // console.log("filter: ", filteredGroup);
        setTypeOptionList([])
        setContentTab([])
    }, [filteredGroup]);

    useEffect(() => {
        if (changedState) {
            setCountChanged(countChanged + 1)
        }
    }, [changedState]);

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

        if (typeOptionList && typeOptionList.length === 0) {
            setForm({ ...form, data: [] })
            getType()
        }

        if (typeOptionList && typeOptionList.length > 0 && contentTab.length === 0) {
            getProducts(typeOptionList)
        }
    }, [typeOptionList, contentTab]);

    const getType = async () => {

        try {
            setIsLoad(true)
            const response = await API.getTypes();
            const data = await response?.data.data;
            let optionList = []
            if (response.status === 200) {
                //loop
                if (data) {
                    data.forEach((item, index) => {
                        optionList.push({
                            value: item.Type_ID,
                            label: item.Name,
                        })
                    })
                    let filterOption = [...optionList]
                    filterOption.unshift({ value: "", label: "ทั้งหมด" })
                    setFilterOptionList(filterOption)
                    setTypeOptionList(optionList)
                }
            }
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
            console.log(error)
        }
    }

    const getProducts = async (optionList) => {

        try {
            setIsLoad(true)
            const response = await API.getProducts();
            const data = await response?.data.data;
            if (response.status === 200) {
                if (optionList && optionList.length > 0) {
                    let filteredDataProds = []
                    console.log("query: ", data);
                    data.forEach((item, index) => {
                        let check = optionList.filter(element => item.Type_ID === element.value)
                        filteredDataProds.push({
                            key: index + 1,
                            id: item.Product_ID,
                            name: item.Name,
                            type: check[0],
                            typeOptionList: optionList,
                            detail: item.Detail,
                            unit: item.Unit_Detail,
                            pricePerUnit: Number(item.Price_per_unit).toFixed(2),
                            feeId: item.Fee_ID,
                            createDate: helper.dateElement(item.Create_Date),
                            updateDate: helper.dateElement(item.Update_Date.length > 0 ? item.Update_Date : item.Create_Date),
                            createByName: String(item.Create_By),
                            updateByName: String(item.Update_By).length > 4 ? String(item.Update_By) : String(item.Create_By),
                            createBy: String(item.CreateBy),
                            updateBy: String(item.UpdateBy).length > 0 ? String(item.UpdateBy) : String(item.CreateBy),
                            disabled: true,
                            status: 'query',
                        })
                    })
                    let container = []
                    if (filteredGroup.value !== "") {
                        container = filteredDataProds.filter(element => element.type.value === filteredGroup.value);
                    } else {
                        container = [...filteredDataProds]
                    }
                    setContentTab(container)
                    setDefaultLenght(data.length)
                    setIsLoad(false)
                }
            }
        } catch (error) {
            setIsLoad(false)
            if (error.response && error.response.status === 401) {
                dispatch(logout({ history }))
            }
            console.log(error)
        }
    }

    const handleCancel = () => {
        if (changedState || countChanged > 0) {
            MySwal.fire({
                text: `ยกเลิกการเปลี่ยนแปลงทั้งหมด `,
                icon: "question",

                confirmButtonColor: '#E72525',
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then((value) => {
                if (value.isConfirmed) {
                    //init state
                    setChangedState(false)
                    setContentTab([])
                    setTypeOptionList([])
                    setOnEditKey('')
                    setCountChanged(0)
                }
            })
        } else {
            //close()
        }
    }

    const updateProd = async (data) => {
        try {
            setIsLoad(true)
            const response = await API.updateProduct(data)
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
        }
    }
    const addProd = async (data) => {
        try {
            setIsLoad(true)
            const response = await API.addProduct(data)
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
        }
    }

    const removeProd = async (id) => {
        try {
            setIsLoad(true)
            const response = await API.deleteProductById(id)
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
        }
    }

    const addNewProds = () => {
        setChangedState(true)
        let date = new Date()
        let now = String(date.getTime() / 1000)
        const newRecord = {
            key: contentTab.length + 1,
            id: "",
            name: "",
            createDate: helper.dateElement(now),
            updateDate: helper.dateElement(now),
            createByName: (Firstname+' '+Lastname),
            updateByName: (Firstname+' '+Lastname),
            createBy: ID,
            updateBy: ID,
            disabled: false,
            status: 'add',
            type: filteredGroup.value === "" ? { value: "", label: "" } : filteredGroup,
            typeOptionList: typeOptionList,
            detail: "",
            unit: "kg",
            pricePerUnit: 0.00,
            feeid: '0'
        };
        setOnEditKey(contentTab.length + 1)
        setContentTab([...contentTab, newRecord])
    }

    const handleSave = (prodsForm) => {
        if (changedState || countChanged > 0) {
            MySwal.fire({
                text: `ยืนยันบันทึกการเปลี่ยนแปลง `,
                icon: "question",

                confirmButtonColor: '#96CC39',
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then((value) => {
                if (value.isConfirmed && prodsForm && prodsForm.data.length > 0) {
                    try {
                        let validator = false
                        prodsForm.data.forEach(async (item) => {
                            if (item.status !== "query") {
                                if (item.status === "edit") {
                                    let pack = {
                                        productid: Number(item.id),
                                        typeid: Number(item.type.value),
                                        name: String(item.name),
                                        price: Number(item.pricePerUnit),
                                        updateby: Number(item.updateBy),
                                        detail: String(item.detail),
                                        unitdetail: String(item.unit),
                                    }
                                    updateProd(pack)
                                } else {
                                    let pack = {
                                        typeid: Number(item.type.value),
                                        name: String(item.name),
                                        price: Number(item.pricePerUnit),
                                        createby: Number(item.createBy),
                                        detail: String(item.detail),
                                        unitdetail: String(item.unit),
                                        feeid: String(item.feeid),
                                    }
                                    addProd(pack)
                                }
                            }
                        })

                        if (prodsForm.removedDataId.length > 0) {
                            prodsForm.removedDataId.forEach((item) => {
                                removeProd(item)
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
                                confirmButtonText: "ตกลง",
                            }).then(() => {
                                //init state
                                setChangedState(false)
                                setContentTab([])
                                setTypeOptionList([])
                                setOnEditKey('')
                                setCountChanged(0)
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
                //close()
            })
        } else {
            //close()
        }
    }

    const handleChange = (key) => {
        let index = key - 1
        if (onEditKey && onEditKey == key) {
            if (contentTab && contentTab.length > 0 && key > -1) {
                //array
                let formList = [...form.data]
                let date = new Date()
                let now = String(date.getTime() / 1000)
                let nameChanged = formList[index].name !== contentTab[index].name
                let typeChanged = contentTab[index].type !== formList[index].type
                let detailChanged = contentTab[index].detail !== formList[index].detail
                let unitChanged = contentTab[index].unit !== formList[index].unit
                let checkChanged = nameChanged || typeChanged || typeChanged || detailChanged || unitChanged || (defaultLenght !== form.data.length)
                //|| (defaultLenght !== form.data.length)
                setChangedState(checkChanged)
                if (formList[index].name.length <= 0) {
                    return MySwal.fire({
                        text: `กรุณากรอกข้อมูลชื่อวัสดุ `,
                        icon: "warning",
                        confirmButtonColor: '#96CC39',
                        confirmButtonText: "ตกลง",
                    })
                } else if (String(formList[index].type.value).length <= 0) {
                    return MySwal.fire({
                        text: `กรุณาระบุประเภทของวัสดุ `,
                        icon: "warning",
                        confirmButtonColor: '#96CC39',
                        confirmButtonText: "ตกลง",
                    })
                } else {
                    //save
                    formList[index] = {
                        ...formList[index],
                        disabled: true,
                        createByName: formList[index].status === "add" ? (Firstname+' '+Lastname) : formList[index].createByName,
                        updateByName: checkChanged ? (Firstname+' '+Lastname) : formList[index].updateByName,
                        updateBy: checkChanged ? ID : formList[index].updateBy,
                        updateDate: checkChanged ? helper.dateElement(now) : formList[index].updateDate,
                        status: checkChanged ? (formList[index].status === "add" ? 'add' : 'edit') : formList[index].status,
                    }
                    setContentTab(formList)
                }

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
                        let nameChanged = onSavelist[onEditIndex].name !== contentTab[onEditIndex].name
                        let typeChanged = onSavelist[onEditIndex].name !== contentTab[onEditIndex].name
                        let detailChanged = onSavelist[onEditIndex].detail !== contentTab[onEditIndex].detail
                        let unitChanged = onSavelist[onEditIndex].unit !== contentTab[onEditIndex].unit
                        let checkChanged = nameChanged || typeChanged || detailChanged || unitChanged || (defaultLenght !== onSavelist.length)
                        //
                        setChangedState(checkChanged)
                        if (onSavelist[onEditIndex].name.length <= 0) {
                            return MySwal.fire({
                                text: `กรุณากรอกข้อมูลชื่อวัสดุ `,
                                icon: "warning",

                                confirmButtonColor: '#96CC39',
                                confirmButtonText: "ตกลง",
                            })
                        } else if (onSavelist[onEditIndex].type.value.length <= 0) {
                            return MySwal.fire({
                                text: `กรุณาระบุประเภทของวัสดุ `,
                                icon: "warning",

                                confirmButtonColor: '#96CC39',
                                confirmButtonText: "ตกลง",
                            })
                        } else {
                            onSavelist[onEditIndex] = {
                                ...onSavelist[onEditIndex],
                                disabled: true,
                                createByName: onSavelist[index].status === "add" ? (Firstname+' '+Lastname) : onSavelist[onEditIndex].createByName,
                                updateByName: checkChanged ? (Firstname+' '+Lastname) : onSavelist[onEditIndex].updateByName,
                                updateBy: checkChanged ? ID : onSavelist[onEditIndex].updateBy,
                                updateDate: checkChanged ? helper.dateElement(now) : onSavelist[onEditIndex].updateDate,
                                status: checkChanged ? onSavelist[index].status === "add" ? "add" : 'edit' : onSavelist[index].status,
                            }
                            //edit
                            onSavelist[index] = {
                                ...onSavelist[index],
                                disabled: false,
                            }
                            setContentTab(onSavelist)
                        }
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
            addNewProds()
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
        return (
            <div>
                <Row gutter={[10, 0]}>
                    <Col style={{ width: "200px" }}>
                        <InputSelect
                            classLabel="bold"
                            optionsList={filterOptionList}
                            selectValue={filteredGroup}
                            handleChange={(value) => {
                                setFilteredGroup(value)
                            }}
                        />
                    </Col>
                    <Col>
                        <Button onClick={() => handleAdd()}>เพิ่มรายการ</Button>
                    </Col>
                </Row>
            </div>)
    }

    return (
        <Spin tip="Loading..." spinning={isLoad}>
            <div>
                <BoxCard title={"รายการวัสดุ"} headRight={buttonAdd()}>
                    <Row gutter={[10, 0]}>
                        <Col>
                            <h6 style={{ color: 'red' }}>{"*หมายเหตุ : ไม่สามารถปรับราคารับซื้อได้ในเมนูนี้"}</h6>
                        </Col>
                    </Row>
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
                                    <Button color="white" bg="#96CC39" width={'80px'} disabled={!changedState && countChanged === 0} className="cursor-p" onClick={() => { handleSave(form) }}>บันทึก</Button>
                                </Col>
                                <Col>
                                    <Button color="white" bg="#E72525" width={'80px'} className="cursor-p" onClick={() => { handleCancel() }}>ยกเลิก</Button>
                                </Col>
                            </Row>
                        </div>
                    </Spin>
                </BoxCard>
            </div>
        </Spin>
    );
}

export default ManageProducts;