function buildFlexMessage({
  title,
  color,
  userName,
  timeText,
  photoUrl,
  lat,
  lng,
}) {
  return {
    type: "flex",
    altText: `${title} Notification`,
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
            aspectRatio: "1:1",
            aspectMode: "cover",
            cornerRadius: "12px",
            action: {
              type: "uri",
              uri: photoUrl, 
            },
          },
          {
            type: "box",
            layout: "baseline",
            contents: [
              { type: "text", text: "Name", weight: "bold", flex: 2 },
              { type: "text", text: userName, flex: 5, wrap: true },
            ],
          },
          {
            type: "box",
            layout: "baseline",
            contents: [
              { type: "text", text: "Time", weight: "bold", flex: 2 },
              { type: "text", text: timeText, flex: 5 },
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#1E90FF",
            action: {
              type: "uri",
              label: "📍 View Location",
              uri: `https://www.google.com/maps?q=${lat},${lng}`,
            },
          },
        ],
      },
    },
  };
}
