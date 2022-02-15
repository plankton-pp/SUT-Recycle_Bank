import React, { useEffect, useState } from 'react'
import * as API from '../utils/apis'
import { useHistory } from 'react-router-dom'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
import BarChart from '../components/BarChart';
const MySwal = withReactContent(swal)

function GraphBar() {
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
            const response = await API.getReport5_3(year)
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
                        "#146356",
                        "#557C55",
                        "#C7B198",
                        "#F3C892",
                        "#DE834D"

                    ]

                    let dataToDataSet = []
                    let dataToLabel = [""]
                    sortedData.forEach((item, index) => {
                        if (index <= 4) {
                            dataToDataSet.push(
                                {
                                    label: item.Name,
                                    data: [item.Unit],
                                    fill: false,
                                    backgroundColor: colorSet[index],
                                    borderColor: colorSet[index],
                                }
                            )
                        }
                    })

                    let graphInfo = {
                        labels: [dataToLabel],
                        datasets: dataToDataSet
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
            <BarChart data={dataPerform} name={"graph"}></BarChart>
        </div>
    )
}

export default GraphBar