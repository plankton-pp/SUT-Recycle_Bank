import React, { useState, useEffect } from 'react';
import { Table } from 'antd';


function DataTable({ columns, data, height, option }) {
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setSelectedRow] = useState([]);

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
        if (option && option.clearSelectedRow) {
            start()
        }
    }, [option]);


    const onChange = (pagination, filters, sorter, extra) => {

        // setLimitSelectValue([value])
        // console.log('params', pagination, filters, sorter, extra);
    }

    const renderTable = () => {
        if (option && option.type === 'selection') {
            return (
                <Table
                    rowSelection={{
                        type: option.selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    onRow={(record) => ({
                        onClick: () => {
                            rowSelection.onChange([record.key], [record])
                        },
                    })}
                    pagination={{pageSizeOptions:[5,10,25,50,100],defaultPageSize:5}}
                />
            )
        } else {
            return (
                <Table
                    style={{ height: height }}
                    columns={columns}
                    dataSource={data}
                    onChange={onChange}
                    pagination={{pageSizeOptions:[5,10,25,50,100],defaultPageSize:5}}
                    />
            )
        }
    }



    return <div>
        {
            renderTable()
        }
    </div>;
}

export default DataTable;
