const { formatTimestamp } = require("./utils");
const row = require("./row");


function userFlex(data) {
  
  const avatar =
  data.pictureUrl && data.pictureUrl.startsWith("http")
    ? data.pictureUrl
    : "https://firebasestorage.googleapis.com/v0/b/pt-test-b0dc9.firebasestorage.app/o/user.png?alt=media&token=e695e669-2e82-4dee-82fc-b191982257b3";

  return {
    type: "flex",
    altText: "Leave Request",
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "image",
                        url: avatar,
                        aspectMode: "cover",
                        size: "full",
                        align: "center",
                      },
                    ],
                    maxWidth: "52px",
                    maxHeight: "52px",
                    justifyContent: "center",
                    cornerRadius: "100px",
                  },
                ],
                width: "72px",
                height: "72px",
                justifyContent: "center",
                alignItems: "center",
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "image",
                        url: "https://firebasestorage.googleapis.com/v0/b/pt-test-b0dc9.firebasestorage.app/o/logo.png?alt=media&token=57f46cf7-9134-45ef-aee1-5e16b4518342",
                        aspectMode: "fit",
                        align: "start",
                        position: "relative",
                        size: "50px",
                      },
                    ],
                    maxHeight: "20px",
                    justifyContent: "center",
                  },
                  {
                    type: "text",
                    text: "Leave Request",
                    weight: "bold",
                    align: "start",
                    size: "18px",
                  },
                  {
                    type: "text",
                    size: "10px",
                    align: "start",
                    text: formatTimestamp(data.timestamp),
                  },
                ],
                justifyContent: "center",
                paddingAll: "5px",
              },
            ],
          },
        ],
      paddingAll: "15px",
      backgroundColor: "#FBF8EF"
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          row("Full Name", data.name),
          row("Type", data.type),
          row("Start", data.start_date),
          row("End", data.end_date),
          row("Total", `${data.total_day || "-"} day`),

          {
            type: "box",
            layout: "vertical",
            margin: "sm",
            contents: [
              {
                type: "text",
                text: "Remark",
                weight: "bold",
                size: "14px",
              },
              {
                type: "text",
                text: data.note || "-",
                size: "14px",
                wrap: true,
              },
            ],
          },
        ],
        paddingAll: "20px",
      },
    },
  };
}

module.exports = userFlex;
