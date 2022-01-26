import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import InputSelect from './InputSelect';


function DataTable({ columns, data }) {
    const initLimitSelectValue = [{ value: 5, label: 5 }];
    const [limitSelectValue, setLimitSelectValue] = useState(initLimitSelectValue)
    const limitValueList = [
        { value: 5, label: 5 },
        { value: 10, label: 10 },
        { value: 25, label: 25 },
        { value: 50, label: 50 },
        { value: 75, label: 75 },
        { value: 100, label: 100 },
    ];
    const [limitList, setLimitList] = useState([])

    useEffect(() => {
        setLimitList(limitValueList);
    }, []);


    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    }

    return <div>
        <div className="d-flex align-items-center justify-content-start mb-2 ">
            <InputSelect
                star={false} mode="filter"
                idName="limit" classFormGroup="mb-1"
                selectValue={limitSelectValue}
                optionsList={limitList}
                handleChange={(value) => {
                    console.log([value]);
                    setLimitSelectValue([value])
                }}
            />
        </div>
        <Table columns={columns} dataSource={data} onChange={onChange} pagination={{ pageSize: limitSelectValue[0].value, position: 'bottomLeft' }} />
    </div>;
}

export default DataTable;
