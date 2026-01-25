function row(label, value) {
  return {
    type: "box",
    layout: "horizontal",
    margin: "sm",
    contents: [
      {
        type: "text",
        text: label,
        weight: "bold",
        size: "14px",
        flex: 3,
      },
      {
        type: "text",
        text: value || "-",
        size: "14px",
        flex: 5,
        wrap: true,
      },
    ],
  };
}

module.exports = row;
