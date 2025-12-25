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
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "PROTOOL (Thailand) Co., Ltd.",
                "align": "center",
                "color": "#ffffff8f",
                "size": "10px"
              },
              {
                "type": "text",
                "text": "New Leave Request",
                "weight": "bold",
                "style": "normal",
                "color": "#FFFFFF",
                "align": "center",
                "size": "18px"
              }
            ]
          }
        ],
        "backgroundColor": "#464F69"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Full Name",
                    "size": "14px",
                    "color": "#555555",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": data.name,
                    "size": "14px",
                    "color": "#111111",
                    "align": "start"
                  }
                ],
                "margin": "5px"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Types of Leave",
                    "size": "14px",
                    "color": "#555555",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": data.type,
                    "size": "14px",
                    "color": "#111111",
                    "align": "start"
                  }
                ],
                "margin": "5px"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Start Date",
                    "size": "14px",
                    "color": "#555555",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": data.start_date,
                    "size": "14px",
                    "color": "#111111",
                    "align": "start"
                  }
                ],
                "margin": "5px"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "End Date",
                    "size": "14px",
                    "color": "#555555",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": data.end_date,
                    "size": "14px",
                    "color": "#111111",
                    "align": "start"
                  }
                ],
                "margin": "5px"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Total Days",
                    "size": "14px",
                    "color": "#555555",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": data.total_day+" วัน",
                    "size": "14px",
                    "color": "#111111",
                    "align": "start"
                  }
                ],
                "margin": "5px"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "Remarks",
                    "size": "14px",
                    "color": "#555555",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": data.note || "-",
                    "size": "14px",
                    "color": "#111111",
                    "margin": "3px",
                    "align": "start"
                  }
                ],
                "margin": "5px"
              }
            ],
            "margin": "5px"
          }
        ]
      },
      "styles": {
        "footer": {
          "separator": true
        }
      }
    }
    

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
  }
);
