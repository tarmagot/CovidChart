import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import randomColor from "randomcolor";
import ReactDOM from "react-dom";
import { DynamicBarChart } from "react-dynamic-charts";
import "react-dynamic-charts/dist/index.css"; // Don't forget to import the styles

const Chart = () => {
  const [items, setItems] = useState();
  const [date] = useState();

  useEffect(() => {
    if (!items) {
      async function fetchData() {
        const request = await axios
          .get(`/historical?lastdays=${15}`)
          .then((data) => {
            const resultData = data.data.map((item, index) => {
              return {
                id: index,
                label: item.country,
                value: null,
                color: null,
                timeline: item.timeline.cases,
              };
            });
            console.log("axios", resultData);
            addColor(resultData);
            //setItems(resultData);
          })
          .catch((err) => {
            return err;
          });

        return request;
      }

      fetchData();
    } else {
    }
  }, []);

  const addColor = (item) => {
    console.log("addcolor", item);
    for (var i = 0; i < item.length; i++) {
      item[i].color = randomColor({
        luminosity: "random",
        hue: "random",
      });
    }
    addValue(item);
  };

  const addValue = (item) => {
    let nowdate = [];
    let dataset = [];

    const dateTimeFormat = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
    });
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
    ] = dateTimeFormat.formatToParts(date);
    for (var i = 0; i < 15; i++) {
      nowdate[i] = `${month}/${day - (i + 1)}/${year.toString().substr(-2)}`;
      dataset[i] = {
        name: nowdate[i],
        values: [],
      };
      console.log(nowdate[i]);
      for (var j = 0; j < item.length; j++) {
        dataset[i].values[j] = {
          id: item[j].id,
          label: item[j].label,
          color: item[j].color,
          value: item[j].timeline[nowdate[i]],
        };
        //console.log("j:", j);
      }
    }
    let dataSort = dataset.sort((a, b) =>
      a.name.toString().substr(-3) > b.name.toString().substr(-3) ? 1 : -1
    );
    let data = { data: dataSort };
    resultSet(data);
  };

  const resultSet = (item) => {
    setItems(item);
  };

  let name = "abc";
  let count = 0;
  var last_id = "abc";
  const render = () => {
    return (
      <DynamicBarChart
        data={items.data}
        iterationTimeout={100}
        iterationTitleStyles={{ fontSize: 42, color: "green" }}
        labelStyles={{ fontSize: 26 }}
        onRunEnd={() => {
          count = count + 1;
          if (count % 2 == 0) {
            if (last_id != "") document.getElementById(last_id).remove();

            let nameid = name + count;
            last_id = nameid;
            let g = document.createElement("div");
            document.getElementById("app").appendChild(g);
            g.setAttribute("id", nameid);

            const ele = render();
            var eleId = document.getElementById(nameid);
            ReactDOM.render(ele, eleId);
          }
        }}
      />
    );
  };

  if (items) {
    return <div id="abc">{render()}</div>;
  } else {
    return <span>Loading...</span>;
  }
};
export default Chart;
