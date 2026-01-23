const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const axios = require("axios");

admin.initializeApp();
const db = getFirestore();

const LINE_CHANNEL_ACCESS_TOKEN = defineSecret("LINE_CHANNEL_ACCESS_TOKEN");

/* =====================================================
  Leave Request
===================================================== */
exports.onLeaveRequestCreated = onDocumentCreated(
  {
    document: "Request/{docId}",
    region: "us-central1",
    secrets: [LINE_CHANNEL_ACCESS_TOKEN],
  },
  async (event) => {
    const requestData = event.data.data();
    const docId = event.params.docId;

    if (!requestData?.userId) return;

    const userSnap = await db
      .collection("Users")
      .doc(requestData.userId)
      .get();

    const userData = userSnap.exists ? userSnap.data() : {};

    const payload = {
      ...requestData,
      pictureUrl: userData.pictureUrl,
      displayName: userData.displayName,
    };

    await pushMessage(requestData.userId, userFlex(payload));

    const adminSnap = await db
      .collection("Users")
      .where("role", "==", "Admin")
      .get();

    const adminIds = adminSnap.docs.map(d => d.data().userId);

    if (adminIds.length) {
      await multicastMessage(adminIds, {
        type: "flex",
        altText: "New Leave Request",
        contents: adminFlex(docId, payload),
      });
    }
  }
);

/* =====================================================
   LINE Webhook (Approve / Reject)
===================================================== */
exports.lineWebhook = onRequest(
  {
    region: "us-central1",
    secrets: [LINE_CHANNEL_ACCESS_TOKEN],
  },
  async (req, res) => {
    const event = req.body.events?.[0];
    if (!event || event.type !== "postback") {
      return res.sendStatus(200);
    }

    const params = new URLSearchParams(event.postback.data);
    const action = params.get("action");
    const docId = params.get("docId");

    if (!docId) return res.sendStatus(200);

    const adminSnap = await db
      .collection("Users")
      .doc(event.source.userId)
      .get();

    if (!adminSnap.exists || adminSnap.data().role !== "Admin") {
      await pushMessage(event.source.userId, {
        type: "text",
        text: "Unauthorized Action: You lack the necessary authority to approve this transaction.",
      });
      return res.sendStatus(200);
    }

    const reqSnap = await db.collection("Request").doc(docId).get();
    if (!reqSnap.exists) return res.sendStatus(200);

    const status = reqSnap.data().status;
    if (status === "approved" || status === "rejected") {
      await pushMessage(event.source.userId, {
        type: "text",
        text: "This transaction is already complete.",
      });
      return res.sendStatus(200);
    }

    // update
    await db.collection("Request").doc(docId).update({
      status: action === "approve" ? "approved" : "rejected",
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      approvedBy: event.source.userId,
    });

    await pushMessage(event.source.userId, {
      type: "text",
      text: `Request ${action.toUpperCase()} successfully.`,
    });

    res.sendStatus(200);
  }
);


/* =====================================================
   Helper: ส่งข้อความ LINE
===================================================== */
async function pushMessage(to, message) {
  return axios.post(
    "https://api.line.me/v2/bot/message/push",
    { to, messages: [message] },
    {
      headers: {
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN.value()}`,
        "Content-Type": "application/json",
      },
    }
  );
}

async function multicastMessage(to, message) {
  return axios.post(
    "https://api.line.me/v2/bot/message/multicast",
    { to, messages: [message] },
    {
      headers: {
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN.value()}`,
        "Content-Type": "application/json",
      },
    }
  );
}

/* =====================================================
   Flex Message: USER
===================================================== */
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

/* =====================================================
   Flex Message: ADMIN (Approve / Reject)
===================================================== */
function adminFlex(docId, data) {

  const avatar =
  data.pictureUrl && data.pictureUrl.startsWith("http")
    ? data.pictureUrl
    : "https://firebasestorage.googleapis.com/v0/b/pt-test-b0dc9.firebasestorage.app/o/user.png?alt=media&token=e695e669-2e82-4dee-82fc-b191982257b3";

  return {
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
                  color: "#FFFFFF",
                  align: "start",
                  size: "18px",
                },
                {
                  type: "text",
                  size: "10px",
                  color: "#FFFFFF",
                  weight: "regular",
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
      backgroundColor: "#5E936C",
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
    },

    footer: {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#5E936C",
              action: {
                type: "postback",
                label: "Approve",
                data: `action=approve&docId=${docId}`,
              },
            },
          ],
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              style: "secondary",
              action: {
                type: "postback",
                label: "Decline",
                data: `action=reject&docId=${docId}`,
              },
            },
          ],
          margin: "md",
        },
      ],
    },
  };
}

/* =====================================================
   Row helper
===================================================== */
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


function formatTimestamp(ts) {
  if (!ts) return "-";

  const date =
    typeof ts?.toDate === "function"
      ? ts.toDate()
      : new Date(ts);

  if (isNaN(date)) return "-";

  return date.toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
    dateStyle: "long",
    timeStyle: "medium",
    hour12: false,
  });
}
