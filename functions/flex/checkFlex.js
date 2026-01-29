function checkFlex({
  title, dateText, color, userName, timeText, photoUrl, lat, lng,
}) {
  return {
    type: "flex",
    altText: `${title} - ${userName}`,
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: color,
        paddingAll: "12px",
        contents: [
          {
            type: "text",
            text: title,
            weight: "bold",
            size: "lg",
            align: "center",
            color: "#FFFFFF",
          },
          {
            type: "text",
            text: dateText,
            size: "sm",
            align: "center",
            color: "#FFFFFF",
            margin: "sm",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "image",
            url: photoUrl,
            size: "full",
            aspectRatio: "4:3",
            aspectMode: "cover",
            action: {
              type: "uri",
              uri: photoUrl,
            },
          },
          {
            type: "text",
            text: `Name: ${userName}`,
            wrap: true,
          },
          {
            type: "text",
            text: `Time: ${timeText}`,
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "link",
            action: {
              type: "uri",
              label: "Location",
              uri: `https://www.google.com/maps?q=${lat},${lng}`,
            },
          },
        ],
      },
    },
  };
}
exports.checkFlex = checkFlex;
