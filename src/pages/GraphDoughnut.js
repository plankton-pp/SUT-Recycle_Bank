import React, { useEffect, useState } from 'react'
import DoughnutChart from '../components/DoughnutChart'
import * as API from '../utils/apis'
import { useHistory } from 'react-router-dom'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)


function GraphLine() {
    const history = useHistory()
    const data = {
        labels: [""],
        datasets: [
            {
                label: "ไม่พบข้อมูล",
                data: [0],
                fill: true,
                backgroundColor: "rgba(75,192,192)",
                borderColor: "rgba(75,192,192,1)"
            },
        ]
    };
    const [dataPerform, setDataPerform] = useState(data)
    const [topData, setTopData] = useState([])
    useEffect(() => {
        getReportLine()
    }, [])

    const getReportLine = async () => {
        try {
            const year = new Date().getFullYear() + 543
            const response = await API.getReport5_4(year)
            const data = await response?.data.data
            if (response.status === 200) {
                if (data && data.length > 0) {
                    let checkHaveData = []
                    let filteredData = []
                    //get item have unit
                    data.forEach((item, index) => {
                        if (item.Unit !== null) {
                            checkHaveData.push(Number(item.Unit))
                            filteredData.push(item)
                        }
                    })
                    //sort unit value
                    let sortedUnit = checkHaveData.sort((a, b) => { return b - a })
                    let uniqUnit = [];
                    sortedUnit.forEach((element) => {
                        if (!uniqUnit.includes(element)) {
                            uniqUnit.push(element);
                        }
                    });
                    //sort data item top 5 max unit
                    let sortedData = []
                    uniqUnit.forEach((element) => {
                        filteredData.forEach((item) => {
                            if (item.Unit === element) {
                                sortedData.push(item)
                            }
                        })
                    })

                    const colorSet = [
                        "#678983",
                        "#99A799",
                        "#B4C6A6",
                        "#D3E4CD",
                        "#DAD992",
                    ]

                    let dataToDataSet = []
                    let dataToLabel = []
                    let bgData = []
                    sortedData.forEach((item, index) => {
                        if (index <= 4) {
                            dataToLabel.push(item.Role)
                            dataToDataSet.push(item.Unit)
                            bgData.push(colorSet[index])
                        }
                    })

                    let graphInfo = {
                        labels: dataToLabel,
                        datasets: [{
                            data: dataToDataSet,
                            backgroundColor: bgData,
                        }]

                    }
                    setDataPerform(graphInfo)
                }
            } else {
                MySwal.fire({
                    text: `ไม่พบข้อมูลสัดส่วน `,
                    icon: "error",
                    showConfirmButton: true,
                    confirmButtonText: "ตกลง",
                }).then((value) => {
                    if (value.isConfirmed) {
                        history.push("/index")
                    }
                })
            }
        } catch (error) {

        }
    }
    return (
        <div>
            <DoughnutChart data={dataPerform}></DoughnutChart>
            {/* <h1>Chart</h1> */}
        </div>
    )
}

export default GraphLine