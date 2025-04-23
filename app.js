const express = require("express");
const app = express();
app.use(express.json());

const fs = require("fs");

const ConnectToDatabase = require("./database/index");
const Book = require("./model/bookModel");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

ConnectToDatabase();

const upload = require("./middleware/multerConfig");

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Bishal Ghale",
    age: "18",
    Message: "Backend",
    anything: "bishal",
  });
});

//add book
app.post("/book", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image uploaded. Please upload an image to proceed.",
    });
  }

  if (req.file.size > 2097152) {
    return res.status(400).json({
      success: false,
      message: "Image size exceeds 2MB. Please upload a smaller image.",
    });
  }

  const {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
  } = req.body;

  await Book.create({
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
    imagePath: "http://localhost:3000/" + req.file.filename, // ✅ Only the URL string
  });

  res.status(200).json({
    success: true,
    message: "Upload Successfully",
  });
});

//all book
app.get("/book", async (req, res) => {
  const books = await Book.find(); //return array
  res.status(200).json({
    message: "Books fetch successfully",
    data: books,
  });
});

//single book
app.get("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id); //return object
    res.json({
      message: "Single Book fetch successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Book not found",
    });
  }
});

//update
app.patch("/book/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id; //kun book ho
  const {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
  } = req.body; //k update garne
  const oldDates = await Book.findById(id);

  if (req.file) {
    const oldImagePath = oldDates?.imagePath;
    if (oldImagePath) {
      const localHostUrlLength = "http://localhost:3000/".length;

      const newOldImagePath = oldImagePath.slice(localHostUrlLength);
      fs.unlink(`./storage/${newOldImagePath}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }

  if (req?.file?.size > 2097152) {
    return res.status(400).json({
      success: false,
      message: "Image size exceeds 2MB. Please upload a smaller image.",
    });
  }

  await Book.findByIdAndUpdate(id, {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
    imagePath: req.file
      ? "http://localhost:3000/" + req.file.filename
      : oldDates.imagePath, // Save the file path if needed
  });
  res.status(200).json({
    success: true,
    message: "Book update successfully",
  });
});

//delete
app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;
  const book = await Book.findById(id);

  const imageUrl = book.imagePath;

  const urlObj = new URL(imageUrl);
  const imagePath = urlObj.pathname;

  fs.unlink(`./storage${imagePath}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Images Deleted successfully");
    }
  });

  await Book.findByIdAndDelete(id);
  res.status(200).json({
    message: "Book delete successfully",
  });
});

//give access to storage folder
app.use(express.static("./storage/"));

app.listen(3000, () => {
  console.log("server start in 3000");
});
