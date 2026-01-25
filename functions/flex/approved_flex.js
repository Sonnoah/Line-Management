const { formatTimestamp } = require("./utils");
const row = require("./row");

function approvedFlex(data) {
  return {
    type: "flex",
    altText: "Leave request approved",
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#5EDD60",
        contents: [
          {
            type: "text",
            text: "APPROVED",
            weight: "bold",
            size: "20px",
            align: "center",
            color: "#FFFFFF",
          },
          {
            type: "text",
            text: "Your leave request has been approved",
            size: "12px",
            align: "center",
            color: "#E8FFF0",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "20px",
        contents: [
          row("Name", data.name),
          row("Type", data.type),
          row("Start Date", data.start_date),
          row("End Date", data.end_date),
          row("Total", `${data.total_day || "-"} day`),
          {
            type: "box",
            layout: "vertical",
            margin: "sm",
            contents: [
              { type: "text", text: "Remark", weight: "bold", size: "14px" },
              { type: "text", text: data.note || "-", size: "14px", wrap: true },
            ],
          },
          {
            type: "text",
            text: `Approved at ${formatTimestamp(data.approvedAt)}`,
            size: "10px",
            align: "center",
            color: "#999999",
            margin: "md",
          },
           {
            type: "text",
            text: `by ${data.approvedByName || "-"}`,
            size: "10px",
            align: "center",
            color: "#999999",
          },
        ],
      },
    },
  };
}

module.exports =  approvedFlex;