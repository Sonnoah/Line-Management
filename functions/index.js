const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const axios = require("axios");
const { defineSecret } = require("firebase-functions/params");

const LINE_CHANNEL_ACCESS_TOKEN = defineSecret("LINE_CHANNEL_ACCESS_TOKEN");

exports.sendReportToLine = onDocumentCreated(
  {
    document: "request/{docId}",
    region: "us-central1",
    secrets: [LINE_CHANNEL_ACCESS_TOKEN],
  },
  async (event) => {
    const data = event.data.data();

    const userId = data.userId;
    if (!userId) return;

  const message = {
    type: "flex",
    altText: "New Leave Request",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "PROTOOL (Thailand) Co., Ltd.",
            align: "center",
            color: "#ffffff8f",
            size: "10px"
          },
          {
            type: "text",
            text: "New Leave Request",
            weight: "bold",
            color: "#FFFFFF",
            align: "center",
            size: "18px"
          }
        ],
        backgroundColor: "#464F69"
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          row("Full Name", data.name),
          row("Types of Leave", data.type),
          row("Start Date", data.start_date),
          row("End Date", data.end_date),
          row("Total Days", `${data.total_day} วัน`),
          {
            type: "box",
            layout: "vertical",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "Remarks",
                weight: "bold",
                color: "#555555",
                size: "14px"
              },
              {
                type: "text",
                text: data.note || "-",
                size: "14px",
                wrap: true
              }
            ]
          }
        ]
      }
    }
  };

  function row(label, value) {
    return {
      type: "box",
      layout: "horizontal",
      margin: "md",
      contents: [
        {
          type: "text",
          text: label,
          size: "14px",
          color: "#555555",
          weight: "bold",
        },
        {
          type: "text",
          text: value || "-",
          size: "14px",
          color: "#111111",
          wrap: true
        }
      ]
    };
  }

    try {
      await axios.post(
        "https://api.line.me/v2/bot/message/push",
        {
          to: userId,
          messages: [message],
        },
        {
          headers: {
            Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN.value()}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("LINE sent success");
    } catch (err) {
      console.error("LINE ERROR:", err.response?.data || err.message);
    }
  }
);
