import styled from 'styled-components'

export const TableSyled = styled.div`
    .table-bordered th {
        border-top: 1px solid #8F8F8F !important;
        border-bottom: 1px solid #8F8F8F !important;
        border-right: 0px solid #8F8F8F !important;
        border-left: 0px solid #8F8F8F !important;
    }
    .table-bordered td {
        border: 0px solid #8F8F8F !important;
    }

    .table-striped tbody tr:nth-of-type(odd) {
        background-color: #E8F1F4 !important;
    }
`

export const DataTableSyled = styled.table`
    .table-bordered td, .table-bordered th {
        border: 0px solid #8F8F8F !important;
    }

    th {
        // text-align: center;
        padding: 0.5rem !important;
        vertical-align: middle !important;
    }
`

