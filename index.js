import express from "express";
import multer from "multer";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type,Authorization",
  })
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CLIENT_ID,
    pass: process.env.CLIENT_SECRET,
  },
});

app.post("/enviar-correo", upload.single("attachment"), (req, res) => {
  const { to, subject, message } = req.body;

  const mailOptions = {
    from: process.env.CLIENT_ID,
    to,
    subject,
    text: message,
    attachments: [
      {
        filename: req.file.originalname,
        content: req.file.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
      return res
        .status(500)
        .json({ error: "Error al enviar el correo electrónico." });
    }
    res.json({ message: "Correo electrónico enviado con éxito.", info });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
