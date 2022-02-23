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

function ManagePrice() {

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
        checkTypeNoProduct: true,
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
            align: 'left',
        },
        {
            title: 'ชื่อวัสดุ',
            dataIndex: 'name',
            width: '200px',
            align: 'left',
        },
        {
            title: 'หน่วย',
            dataIndex: 'unit',
            align: 'center',
            width: '100px',
        },
        {
            title: 'รายละเอียด',
            dataIndex: 'detail',
            align: 'left',
            width: '200px',
        },
        {
            title: 'มูลค่าต่อหน่วย (บาท)',
            dataIndex: 'pricePerUnit',
            width: '150px',
            align: 'right',
            editable: true,
            render: (_, record) => {
                if (form && form.data.length > 0) {
                    return (<div>
                        < InputText type="text" idName="update-typename"
                            // as={"textarea"}
                            // rows={2}
                            disabled={record.disabled}
                            value={form.data[record.key - 1].pricePerUnit}
                            handleChange={(value) => {
                                let dataList = [...form.data]
                                dataList[record.key - 1].pricePerUnit = value
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
                    </div>
                )
            },
        },
    ];

    useEffect(() => {
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

        if (typeOptionList && typeOptionList.length > 0 && contentTab.length === 0 && defaultLenght === 0) {
            getProducts(typeOptionList)
        }
    }, [typeOptionList, contentTab]);

    const getType = async () => {
        setIsLoad(true)
        try {
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
                    setIsLoad(false)
                }
            }
        } catch (error) {
            setIsLoad(false)
            console.log(error)
        }
    }

    const getProducts = async (optionList) => {
        setIsLoad(true)
        try {
            const response = await API.getProducts();
            const data = await response?.data.data;
            if (response.status === 200) {
                let filteredDataProds = []
                data.forEach((item, index) => {
                    let type = optionList.filter(element => item.Type_ID === element.value)[0];
                    filteredDataProds.push({
                        key: index + 1,
                        id: item.Product_ID,
                        name: item.Name,
                        type: type.label,
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
                    container = filteredDataProds.filter(element => element.type === filteredGroup.label);
                } else {
                    container = [...filteredDataProds]
                }
                setContentTab(container)
                setDefaultLenght(data.length)
                setIsLoad(false)
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
                showConfirmButton: true,
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
                    setDefaultLenght(0)
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

    const handleSave = (prodsForm) => {
        if (changedState || countChanged > 0) {
            MySwal.fire({
                text: `ยืนยันบันทึกการเปลี่ยนแปลง`,
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
                            let type = typeOptionList.filter((element) => { return item.type === element.label })
                            if (item.status !== "query") {
                                if (item.status === "edit") {
                                    let pack = {
                                        productid: Number(item.id),
                                        typeid: Number(type[0].value),
                                        name: String(item.name),
                                        price: Number(item.pricePerUnit),
                                        updateby: Number(item.updateBy),
                                        detail: String(item.detail),
                                        unitdetail: String(item.unit),
                                        feeid: Number(item.feeId),
                                    }
                                    updateProd(pack)
                                }
                            }
                        })
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
                                setDefaultLenght(0)

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
                let checkChanged = contentTab[index].pricePerUnit !== formList[index].pricePerUnit
                //save
                formList[index] = {
                    ...formList[index],
                    disabled: true,
                    updateByName: checkChanged ? (Firstname + ' ' + Lastname) : formList[index].updateByName,
                    updateBy: checkChanged ? ID : formList[index].updateBy,
                    updateDate: checkChanged ? helper.dateElement(now) : formList[index].updateDate,
                    status: checkChanged ? (formList[index].status === "add" ? 'add' : 'edit') : formList[index].status,
                }
                setContentTab(formList)
            } else {
                console.log("array is empty");
            }
            setOnEditKey('')
            return true
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
                        let checkChanged = onSavelist[onEditIndex].pricePerUnit !== contentTab[onEditIndex].pricePerUnit
                        //
                        setChangedState(checkChanged)
                        onSavelist[onEditIndex] = {
                            ...onSavelist[onEditIndex],
                            disabled: true,
                            updateByName: checkChanged ? (Firstname + ' ' + Lastname) : onSavelist[onEditIndex].updateByName,
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
                    } else {
                        console.log("array is empty");
                    }
                    setOnEditKey(key)
                }
                return true
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
                return true
            } else {
                console.log("array is empty");
                return true
            }
        }
    };

    const buttonFilter = () => {
        return (
            <div>
                <Row gutter={[10, 0]}>
                    <Col style={{ width: "200px" }}>
                        <InputSelect
                            classLabel="bold"
                            optionsList={filterOptionList}
                            selectValue={filteredGroup}
                            handleChange={(value) => {
                                setDefaultLenght(0)
                                setFilteredGroup(value)
                            }}
                        />
                    </Col>
                </Row>
            </div>)
    }

    return (
        <Spin tip="Loading..." spinning={isLoad}>
            <div>
                <BoxCard title={"รายการวัสดุ"} headRight={buttonFilter()}>
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
                                    <Button color="white" bg="#96CC39" width={'80px'} disabled={false} className="cursor-p" onClick={() => {
                                        if (onEditKey !== '') {
                                            handleChange(onEditKey)
                                            handleSave(form)
                                        } else {
                                            handleSave(form)
                                        }
                                    }}>บันทึก</Button>
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

export default ManagePrice;