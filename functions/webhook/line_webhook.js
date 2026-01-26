const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const { db } = require("../config/firebase");
const { pushMessage, LINE_CHANNEL_ACCESS_TOKEN } = require("../services/line_service");
const { formatTimestamp } = require("../flex/utils");
const approvedFlex = require("../flex/approved_flex");
const declinedFlex = require("../flex/declined_flex");

exports.lineWebhook = onRequest(
  {
    region: "us-central1",
    secrets: [LINE_CHANNEL_ACCESS_TOKEN],
  },
  async (req, res) => {
    try {
      const event = req.body.events?.[0];
      if (!event || event.type !== "postback") {
        return res.sendStatus(200);
      }

      const params = new URLSearchParams(event.postback.data);
      const action = params.get("action");
      const docId = params.get("docId");

      if (!docId || !action) {
        return res.sendStatus(200);
      }

      /* ================== Check Admin ================== */
      const adminSnap = await db
        .collection("Users")
        .doc(event.source.userId)
        .get();

      if (!adminSnap.exists || adminSnap.data().role !== "Admin") {
        await pushMessage(event.source.userId, {
          type: "text",
          text: "❌ You are not authorized to perform this action.",
        });
        return res.sendStatus(200);
      }

      /* ================== Get Request ================== */
      const reqRef = db.collection("Request").doc(docId);
      const reqSnap = await reqRef.get();

      if (!reqSnap.exists) {
        await pushMessage(event.source.userId, {
          type: "text",
          text: "❌ Request not found.",
        });
        return res.sendStatus(200);
      }

      const reqData = reqSnap.data();

      if (reqData.status === "approved" || reqData.status === "declined") {
        await pushMessage(event.source.userId, {
          type: "flex",
          altText: "This request has already been processed.",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  spacing: "xl",
                  paddingAll: "10px",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      width: "50px",
                      height: "50px",
                      cornerRadius: "100px",
                      backgroundColor: "#FFE829",
                      contents: [
                        {
                          type: "box",
                          layout: "horizontal",
                          paddingAll: "10px",
                          offsetEnd: "1px",
                          contents: [
                            {
                              type: "image",
                              url: "https://https://firebasestorage.googleapis.com/v0/b/pt-test-b0dc9.firebasestorage.app/o/warning.png?alt=media&token=92477c03-5d07-4f90-8302-caa1dc4d2d14.googleapis.com/v0/b/pt-test-b0dc9.firebasestorage.app/o/paper.png?alt=media&token=b872201a-6b88-4341-94d5-c167282c95c5",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      justifyContent: "center",
                      margin: "lg",
                      contents: [
                        {
                          type: "text",
                          size: "md",
                          wrap: true,
                          align: "start",
                          contents: [
                            {
                              type: "span",
                              size: "14px",
                              text: "This request has already been processed."
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              paddingAll: "5px",
            },
          },
      });
        return res.sendStatus(200);
      }

      /* ================== Prepare Data ================== */
      const newStatus = action === "approve" ? "approved" : "declined";
      const adminData = adminSnap.data();

      let requesterName = "User";
      if (reqData.userId) {
        const userSnap = await db
          .collection("Users")
          .doc(reqData.userId)
          .get();

        if (userSnap.exists) {
          const userData = userSnap.data();
          requesterName =
            (userData.username && userData.username.trim()) ||
            (userData.displayName && userData.displayName.trim()) ||
            (reqData.name && reqData.name.trim()) ||
            "User";
        }
      }

      const approvedByName =
        (adminData.username && adminData.username.trim()) ||
        adminData.displayName ||
        "Admin";

      /* ================== Update Firestore ================== */
      await reqRef.update({
        status: newStatus,
        approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: event.source.userId,
        approvedByName,
      });

      /* ================== Notify Requester ================== */
      if (reqData.userId) {
        await pushMessage(
          reqData.userId,
          newStatus === "approved"
            ? approvedFlex({
                ...reqData,
                approvedAt: new Date(),
                approvedByName,
              })
            : declinedFlex({
                ...reqData,
                approvedAt: new Date(),
                approvedByName,
              })
        );
      }

      /* ================== Notify Admin ================== */
  await pushMessage(event.source.userId, {
    type: "flex",
    altText: `You have ${newStatus} ${requesterName}'s request from ${formatTimestamp(
      reqData.timestamp
    )}.`,
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            spacing: "xl",
            paddingAll: "10px",
            contents: [
              {
                type: "box",
                layout: "vertical",
                width: "50px",
                height: "50px",
                cornerRadius: "100px",
                backgroundColor: "#6ECCFF",
                contents: [
                  {
                    type: "box",
                    layout: "horizontal",
                    paddingAll: "10px",
                    offsetEnd: "1px",
                    contents: [
                      {
                        type: "image",
                        url: "https://firebasestorage.googleapis.com/v0/b/pt-test-b0dc9.firebasestorage.app/o/paper.png?alt=media&token=b872201a-6b88-4341-94d5-c167282c95c5",
                      },
                    ],
                  },
                ],
              },
              {
                type: "box",
                layout: "vertical",
                justifyContent: "center",
                margin: "lg",
                contents: [
                  {
                    type: "text",
                    size: "md",
                    wrap: true,
                    align: "start",
                    contents: [
                      {
                        type: "span",
                        size: "14px",
                        text: `You have ${newStatus} ${requesterName}'s request from ${formatTimestamp(
                          reqData.timestamp
                        )}`,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        paddingAll: "5px",
      },
    },
});


      return res.sendStatus(200);
    } catch (error) {
      console.error("lineWebhook error:", error);
      return res.sendStatus(500);
    }
  }
);
