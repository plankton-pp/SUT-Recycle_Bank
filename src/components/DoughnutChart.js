import React from "react";
import { Doughnut } from "react-chartjs-2";

function DoughnutChart({ data, option }) {
    return (
        <div><Doughnut
            data={data}
            width={"300px"}
            height={"300px"}
            options={{
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                },
            }} /></div>
    )
}

export default DoughnutChart
