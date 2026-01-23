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
   1️⃣ เมื่อมี Leave Request ใหม่
===================================================== */
exports.onLeaveRequestCreated = onDocumentCreated(
  {
    document: "Request/{docId}",
    region: "us-central1",
    secrets: [LINE_CHANNEL_ACCESS_TOKEN],
  },
  async (event) => {
    const data = event.data.data();
    const docId = event.params.docId;

    if (!data?.userId) return;

    /* 👉 ส่งให้ USER */
    await pushMessage(data.userId, userFlex(data));

    /* 👉 ดึง ADMIN */
    const adminSnap = await db
      .collection("Users")
      .where("role", "==", "Admin")
      .get();

    const adminIds = adminSnap.docs.map(d => d.data().userId);

    /* 👉 ส่งให้ ADMIN */
    if (adminIds.length) {
      await multicastMessage(adminIds, adminFlex(docId, data));
    }
  }
);

/* =====================================================
   2️⃣ LINE Webhook (Approve / Reject)
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

    /* 👉 update Firestore */
    await db.collection("Request").doc(docId).update({
      status: action === "approve" ? "approved" : "rejected",
      approvedAt: new Date(),
    });

    /* 👉 แจ้ง admin ที่กด */
    await pushMessage(event.source.userId, {
      type: "text",
      text: `✅ Request ${action.toUpperCase()} แล้ว`,
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
  return {
    type: "flex",
    altText: "New Leave Request",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#464F69",
        contents: [
          {
            type: "text",
            text: "PROTOOL (Thailand) Co., Ltd.",
            size: "10px",
            color: "#ffffff8f",
            align: "center",
          },
          {
            type: "text",
            text: "New Leave Request",
            size: "18px",
            weight: "bold",
            color: "#FFFFFF",
            align: "center",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          row("Full Name", data.name),
          row("Type", data.type),
          row("Start", data.start_date),
          row("End", data.end_date),
          row("Total", `${data.total_day} วัน`),
          row("Remark", data.note),
        ],
      },
    },
  };
}

/* =====================================================
   Flex Message: ADMIN (Approve / Reject)
===================================================== */
function adminFlex(docId, data) {
  return {
    type: "flex",
    altText: "Leave Request (Admin)",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          row("Name", data.name),
          row("Type", data.type),
          row("Start", data.start_date),
          row("End", data.end_date),
          row("Total", `${data.total_day} วัน`),
        ],
      },
      footer: {
        type: "box",
        layout: "horizontal",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#22c55e",
            action: {
              type: "postback",
              label: "Approve",
              data: `action=approve&docId=${docId}`,
            },
          },
          {
            type: "button",
            style: "secondary",
            color: "#ef4444",
            action: {
              type: "postback",
              label: "Reject",
              data: `action=reject&docId=${docId}`,
            },
          },
        ],
      },
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
    margin: "md",
    contents: [
      {
        type: "text",
        text: label,
        size: "14px",
        color: "#555555",
        weight: "bold",
        flex: 3,
      },
      {
        type: "text",
        text: value || "-",
        size: "14px",
        color: "#111111",
        wrap: true,
        flex: 5,
      },
    ],
  };
}
