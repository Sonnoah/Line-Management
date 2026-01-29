function checkFlex({
  title,
  color,
  dateText,
  userName,
  timeText,
  photoUrl,
  lat,
  lng,
}) {
  return {
    type: "flex",
    altText: `${title} - ${userName}`,
    contents: {
      type: "bubble",

      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: title,
            size: "lg",
            color: "#FFFFFF",
            weight: "bold",
          },
          {
            type: "text",
            text: dateText,
            color: "#FFFFFF",
            size: "sm",
          },
        ],
        alignItems: "center",
        paddingAll: "12px",
      },

      hero: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: photoUrl,
                size: "full",
                aspectMode: "cover",
                aspectRatio: "20:13",
                action: {
                  type: "uri",
                  uri: photoUrl,
                },
              },
            ],
            cornerRadius: "20px",
          },
        ],
        paddingStart: "20px",
        paddingEnd: "20px",
        paddingTop: "10px",
      },

      body: {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Name",
                    size: "sm",
                    flex: 1,
                    weight: "bold",
                  },
                  {
                    type: "text",
                    text: userName,
                    wrap: true,
                    size: "sm",
                    flex: 5,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Time",
                    size: "sm",
                    flex: 1,
                    weight: "bold",
                  },
                  {
                    type: "text",
                    text: timeText,
                    wrap: true,
                    size: "sm",
                    flex: 5,
                  },
                ],
              },
            ],
          },
        ],
      },

      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "link",
            height: "sm",
            action: {
              type: "uri",
              label: "Location",
              uri: `https://www.google.com/maps?q=${lat},${lng}`,
            },
          },
        ],
        flex: 0,
      },

      styles: {
        header: {
          backgroundColor: color,
        },
      },
    },
  };
}

exports.checkFlex = checkFlex;
