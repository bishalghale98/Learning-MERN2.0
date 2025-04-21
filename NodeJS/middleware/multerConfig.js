const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedFileTypes.includes(file.mimetype)) {
      cb(new Error("This file is not supported"));
      return;
    } else {
      cb(null, "./storage");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Pre-configure and export the upload middleware
const upload = multer({
  storage: storage,
});

module.exports = upload; // Only export the configured instance
