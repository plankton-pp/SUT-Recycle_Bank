import React from "react";
import { Bar } from "react-chartjs-2";

function BarChart({ data }) {
    return (
        <div><Bar data={data} width={"300px"} height={"300px"} options={{ maintainAspectRatio: false }} /></div>
    )
}

export default BarChart
