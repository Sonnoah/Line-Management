const { formatTimestamp } = require("./utils");
const row = require("./row");

function declinedFlex(data) {
  return {
    type: "flex",
    altText: "Leave request declined",
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#EF4444",
        contents: [
          {
            type: "text",
            text: "DECLINED",
            weight: "bold",
            size: "20px",
            align: "center",
            color: "#FFFFFF",
          },
          {
            type: "text",
            text: "Your leave request has been declined",
            size: "12px",
            align: "center",
            color: "#FFECEC",
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
            text: `Rejected at ${formatTimestamp(data.approvedAt)}`,
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

module.exports =  declinedFlex;