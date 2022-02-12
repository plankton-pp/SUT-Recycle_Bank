import * as API from './apis'

export const getReportType1 = async () => {
    let reportGroup = []
    try {

    } catch (error) {
        console.log(error);
    }
}

export const getReportType2 = async (role) => {
    let reportGroup = [];
    try {
        const response = await API.getReport2(role);
        const data = await response?.data;
        if (response.status && !response?.data.error) {
            console.log("report2: ", data);
        }
    } catch (error) {
        console.log(error);
    }
}

export const getReportType5 = async (year) => {
    let reportGroup = [];
    try {
        const response = await API.getReport5_1({ "Year": year });
        const data = await response?.data.data;
        if (response.status && !response?.data.error) {
            let docs = {}
            docs = {
                key: 1,
                docId: "doc_5-1",
                name: "รายงานสรุปผลดำเนินงานประจำปี" + year,
                catagory: "5",
                table: []
            }
            if (data && data.lenght > 0) {
                data.forEach((item) => {
                    docs.table.push({
                        "Month": item.Month,
                        "Unit": item.Unit,
                        "Member_Price": String(Number(item.Member_Price).toFixed(2)),
                        "Bank_Price": String(Number(item.Bank_Price).toFixed(2)),
                        "Total_Price": String(Number(item.Total_Price).toFixed(2)),
                    })
                })
                reportGroup.push(docs)
            } else {
                reportGroup.push(docs)
            }
        }
    } catch (error) {
        console.log(error);
    }

    try {
        const response = await API.getReport5_2({ "year": year });
        const data = await response?.data.data;
        if (response.status && !response?.data.error) {
            let docs = {}
            docs = {
                key: 2,
                docId: "doc_5-2",
                name: "รายงานสรุปค่าตอบแทนและรายได้เข้ากองทุนสิ่งแวดล้อมประจำปี" + year,
                catagory: "5",
                table: []
            }
            if (data) {
                data.forEach((item) => {
                    docs.table.push({
                        "month": item.month,
                        "Bank": String(Number(item.Bank).toFixed(2)),
                        "Emp": String(Number(item.Emp).toFixed(2)),
                        "Fund": String(Number(item.Fund).toFixed(2)),
                    })
                })
                reportGroup.push(docs)
            } else {
                reportGroup.push(docs)
            }
        }
    } catch (error) {
        console.log(error);
    }

    return reportGroup
}