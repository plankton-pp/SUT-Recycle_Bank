import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import InputSelect from './InputSelect';


function DataTable({ columns, data, option }) {
    const initLimitSelectValue = [{ value: 5, label: 5 }];
    const [limitSelectValue, setLimitSelectValue] = useState(initLimitSelectValue)
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setSelectedRow] = useState([]);

    const limitValueList = [
        { value: 5, label: 5 },
        { value: 10, label: 10 },
        { value: 25, label: 25 },
        { value: 50, label: 50 },
        { value: 75, label: 75 },
        { value: 100, label: 100 },
    ];
    const [limitList, setLimitList] = useState([])

    const start = () => {
        setRowKeys([]);
        setSelectedRow([])
        if (option) {
            option.select([])
        }
    };

    const rowSelection = {
        selectedRowKeys,
        selectedRows,
        onChange: (selectedRowKeys, row) => {
            setRowKeys(selectedRowKeys);
            setSelectedRow(row)

            if (option) {
                option.select([selectedRowKeys, row])
            }
        },
    };

    useEffect(() => {
        setLimitList(limitValueList);
    }, []);

    useEffect(() => {
        if (option && option.clearSelectedRow) {
            start()
        }
    }, [option]);


    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    }

    const renderTable = () => {
        if (option && option.type === 'selection') {
            return (
                <Table
                    rowSelection={{
                        type: 'radio',
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    onChange={onChange}
                    onRow={(record) => ({
                        onClick: () => {
                            rowSelection.onChange([record.key], [record])
                        },
                    })}
                    pagination={{ pageSize: limitSelectValue[0].value, position: 'bottomLeft' }} />
            )
        } else {
            return (
                <Table
                    columns={columns}
                    dataSource={data}
                    onChange={onChange}
                    pagination={{ pageSize: limitSelectValue[0].value, position: 'bottomLeft' }} />
            )
        }
    }



    return <div>
        <div className="d-flex align-items-center justify-content-start mb-2 ">
            <InputSelect
                star={false} mode="filter"
                idName="limit" classFormGroup="mb-1"
                selectValue={limitSelectValue}
                optionsList={limitList}
                handleChange={(value) => {
                    setLimitSelectValue([value])
                }}
            />
        </div>
        {
            renderTable()
        }
    </div>;
}

export default DataTable;
