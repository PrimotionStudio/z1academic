import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { SendEmailBody } from "@/types/EmailBody";

export async function sendMail(vars: SendEmailBody) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const filePath = path.join(
      process.cwd(),
      "src/templates",
      "email-template.html",
    );
    let html = await fs.readFile(filePath, "utf8");

    Object.entries(vars).forEach(([key, val]) => {
      const re = new RegExp(`{{${key}}}`, "g");
      html = html.replace(re, val || "");
    });

    if (!vars.action_url) {
      html = html.replace(/{{#if action_url}}[\s\S]*?{{\/if}}/, "");
    } else {
      html = html.replace(/{{#if action_url}}|{{\/if}}/g, "");
    }

    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_SCHOOL_NAME}" <${process.env.SMTP_USER}>`,
      to: vars.to,
      subject: vars.subject,
      html,
      text: `${vars.intro_text}\n\n${vars.body_text}\n\n`,
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
