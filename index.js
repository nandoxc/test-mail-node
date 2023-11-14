import express from "express";
import nodemailer from "nodemailer";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CLIENT_ID,
    pass: process.env.CLIENT_SECRET,
  },
});

app.use(express.json());

app.post("/enviar-correo", (req, res) => {
  console.log(req.body);
  const { to, subject, html } = req.body;

  const mailOptions = {
    from: process.env.CLIENT_ID,
    to,
    subject,
    html,
    attachments: req.body.attachments.map((attachment) => ({
      filename: attachment.filename,
      content: fs.createReadStream(attachment.path),
    })),
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

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
