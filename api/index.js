









import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  // Add your production domain here
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Quickpes Services Backend is active.");
});

// Quickpes Brand Constants
const BRAND_NAME = "Quickpes Services";
const BRAND_LOCATION = "Beckenham, London";
const BRAND_PHONE = "07424 398243";
const BRAND_EMAIL = "info@pestcontrolbeckenham.uk";

const QUICKPES_NAVY = "#0A2240";
const QUICKPES_GOLD = "#b99547";
const QUICKPES_BG = "#f9f5ed";

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, postcode, service, message } = req.body;

    if (!name || !email || !phone || !postcode || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `[New Lead] ${BRAND_NAME} - ${service || "General Inquiry"}`,
      html: `
        <body style="font-family: Arial, sans-serif; background-color: ${QUICKPES_BG}; padding: 20px; margin: 0;">
          <div style="max-width: 620px; margin: auto; background: #ffffff; border-top: 6px solid ${QUICKPES_NAVY}; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(10,34,64,0.12);">
            <div style="background-color:${QUICKPES_NAVY}; padding: 28px 24px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; text-transform:uppercase; letter-spacing:0.08em;">New Service Request</h1>
              <p style="margin:8px 0 0; color:${QUICKPES_GOLD}; font-size:13px; font-weight:bold;">${BRAND_NAME} • ${BRAND_LOCATION}</p>
            </div>
            <div style="padding: 28px;">
              <p style="color:#64748b; font-size:14px; margin-bottom:22px;">A new pest control enquiry has been submitted from the website.</p>
              <div style="background:#f8fafc; border-left:4px solid ${QUICKPES_GOLD}; padding:14px 16px; margin-bottom:12px;"><strong>Name:</strong> ${name}</div>
              <div style="background:#f8fafc; border-left:4px solid ${QUICKPES_GOLD}; padding:14px 16px; margin-bottom:12px;"><strong>Email:</strong> ${email}</div>
              <div style="background:#f8fafc; border-left:4px solid ${QUICKPES_GOLD}; padding:14px 16px; margin-bottom:12px;"><strong>Phone:</strong> ${phone}</div>
              <div style="background:#f8fafc; border-left:4px solid ${QUICKPES_GOLD}; padding:14px 16px; margin-bottom:12px;"><strong>Postcode:</strong> ${postcode}</div>
              <div style="background:#f8fafc; border-left:4px solid ${QUICKPES_GOLD}; padding:14px 16px; margin-bottom:12px;"><strong>Service:</strong> ${service || "General Inquiry"}</div>
              <div style="background:#fff7ed; border:1px solid rgba(185,149,71,0.25); padding:18px; border-radius:10px; margin-top:20px;">
                <strong>Message:</strong><p style="margin:10px 0 0; color:#334155; line-height:1.6;">${message}</p>
              </div>
              <div style="margin-top:28px; padding:16px; background:${QUICKPES_NAVY}; border-radius:10px; text-align:center;">
                <p style="margin:0; color:#ffffff; font-size:12px; letter-spacing:0.08em; text-transform:uppercase;">Quickpes Lead Notification</p>
                <p style="margin:6px 0 0; color:${QUICKPES_GOLD}; font-size:13px;">${BRAND_PHONE} • ${BRAND_EMAIL}</p>
              </div>
            </div>
          </div>
        </body>
      `,
    });

    res.status(200).json({ success: true, message: "Lead sent successfully." });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ success: false, message: "Failed to send request." });
  }
});

app.post("/api/callback", async (req, res) => {
  try {
    const { name, postcode, phone } = req.body;
    if (!name || !postcode || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${BRAND_NAME} Callback" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `[Callback Request] ${BRAND_NAME} - ${name}`,
      html: `
        <body style="margin:0; padding:40px 10px; background-color:${QUICKPES_BG}; font-family: Arial, sans-serif;">
          <div style="max-width:560px; margin:0 auto; background-color:#ffffff; border-radius:16px; border-top: 6px solid ${QUICKPES_NAVY}; padding:30px;">
            <div style="text-align:center; margin-bottom:20px;">
              <h1 style="color:${QUICKPES_NAVY}; text-transform:uppercase;">Callback Request</h1>
              <p style="color:${QUICKPES_GOLD}; font-weight:bold;">${BRAND_NAME} • ${BRAND_LOCATION}</p>
            </div>
            <div style="padding:15px; background:#f8fafc; border-left:4px solid ${QUICKPES_GOLD}; margin-bottom:10px;"><strong>Name:</strong> ${name}</div>
            <div style="padding:15px; background:#f8fafc; border-left:4px solid ${QUICKPES_GOLD}; margin-bottom:10px;"><strong>Postcode:</strong> ${postcode}</div>
            <div style="padding:15px; background:#f8fafc; border-left:4px solid ${QUICKPES_GOLD}; margin-bottom:10px;"><strong>Phone:</strong> ${phone}</div>
            <div style="text-align:center; margin-top:20px; font-size:12px; color:#64748b;">${BRAND_PHONE} • ${BRAND_EMAIL}</div>
          </div>
        </body>
      `,
    });

    res.status(200).json({ success: true, message: "Callback request sent." });
  } catch (error) {
    console.error("Callback Error:", error);
    res.status(500).json({ success: false, message: "Callback failed." });
  }
});

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`${BRAND_NAME} server running on port ${PORT}`));

export default app;