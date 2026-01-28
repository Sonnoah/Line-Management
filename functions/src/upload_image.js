const { admin } = require("../config/firebase");

async function uploadBase64ToStorage(base64, path) {
  const bucket = admin.storage().bucket();

  const buffer = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const file = bucket.file(path);

  await file.save(buffer, {
    metadata: {
      contentType: "image/jpeg",
    },
    resumable: false,
  });

  await file.makePublic();

  return file.publicUrl();
}

module.exports = { uploadBase64ToStorage };
