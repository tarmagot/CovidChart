import React from "react";
import Chart from "../component/Chart";
import "./MainPage.css";
const MaintPage = () => {
  return (
    <div className="mainpage">
      <label className="title">Covid Global Cases by SNG</label>
      <Chart />
    </div>
  );
};

export default MaintPage;
