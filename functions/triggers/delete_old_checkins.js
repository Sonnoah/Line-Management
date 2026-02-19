const { onSchedule } = require("firebase-functions/v2/scheduler");
const { multicastMessage, LINE_CHANNEL_TOKEN } = require("../services/line_service");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const { admin } = require("../config/firebase");

const db = admin.firestore();
const bucket = admin.storage().bucket();

exports.deleteOldCheckins = onSchedule(
  {
    schedule: "0 3 10,26 * *",
    timeZone: "Asia/Bangkok",
    region: "us-central1",
    secrets: [LINE_CHANNEL_TOKEN],
  },
  async () => {

    logger.info("Running cleanup job...");

    // const now = admin.firestore.Timestamp.now();

    // const cutoff = admin.firestore.Timestamp.fromMillis(
    //   now.toMillis() - 7 * 24 * 60 * 60 * 1000
    // );

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // แปลงเป็น Firestore Timestamp
    const cutoff = admin.firestore.Timestamp.fromDate(twoMonthsAgo);


    const snapshot = await db
      .collection("Checkins")
      .where("status", "==", "DONE")
      .where("createdAt", "<", cutoff)
      .get();

    if (snapshot.empty) {
      logger.info("No old checkins found.");
      return;
    }

    for (const doc of snapshot.docs) {
      const checkinId = doc.id;

      try {
        //  ลบรูป IN
        await bucket
          .file(`checkins/${checkinId}_IN.jpg`)
          .delete()
          .catch(() => {});

        //  ลบรูป OUT
        await bucket
          .file(`checkins/${checkinId}_OUT.jpg`)
          .delete()
          .catch(() => {});

        //  ลบ Firestore
        await doc.ref.delete();

        logger.info(`Deleted checkin ${checkinId}`);
      } catch (err) {
        logger.error("Delete error:", err);
      }
    }

    const today = new Date().getDate();

    if ((today === 10 || today === 26) && snapshot.size > 0) {
      const adminSnap = await db
        .collection("Users")
        .where("role", "==", "Admin")
        .get();

    const adminIds = adminSnap.docs.map(d => d.data().userId);

    if (adminIds.length) {
    await multicastMessage(adminIds, {
        type: "flex",
        altText: `Cleanup completed`, 
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
                            url: "https://firebasestorage.googleapis.com/v0/b/pt-test-b0dc9.firebasestorage.app/o/trash.png?alt=media&token=858c3277-118c-4305-b14c-504a469400c0",
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
                            text: `Cleanup completed. Deleted ${snapshot.size} docs.`,
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
        }  
    });
    }   
}

    logger.info(`Cleanup completed. Deleted ${snapshot.size} docs.`);
  }
);
