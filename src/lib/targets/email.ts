import { resolveTemplate } from "$lib/helpers/templateResolver";
import type { ParsedResult } from "$lib/runner/parser/types";
import { db } from "$lib/server/db";
import type { EmailTargetSettings } from "./types";
import { createTransport } from "nodemailer"

export async function HandleEmailTarget(payload: ParsedResult, settings: any) {
  const { recipients, subjectTemplate, bodyTemplate } = settings as EmailTargetSettings;

  const emailSettings = await db.query.settingsEmail.findFirst();

  if(!emailSettings) {
    throw new Error("Email settings not configured");
  }

  // check if we have the necessary email settings
  if(!emailSettings.smtpServer || !emailSettings.smtpPort || !emailSettings.username || !emailSettings.password || !emailSettings.fromAddress) {
    throw new Error("Incomplete email settings");
  }

  // create transporter
  const transporter = createTransport({
    host: emailSettings.smtpServer,
    port: parseInt(emailSettings.smtpPort),
    secure: parseInt(emailSettings.smtpPort) === 465, // true for 465, false for other ports
    auth: {
      user: emailSettings.username,
      pass: emailSettings.password
    }
  });

  // parse user input templates with payload
  const resolvedSubject = resolveTemplate(subjectTemplate, payload as any);
  const resolvedBody = resolveTemplate(bodyTemplate, payload as any);

  // send emails
  const splitRecipients = recipients.split(",");
  for(const recipient of splitRecipients) {
    const res = await transporter.sendMail({
      from: emailSettings.fromAddress,
      to: recipient,
      subject: resolvedSubject,
      text: resolvedBody
    });

    if(res.rejected.length > 0) {
      throw new Error(`Failed to send email to ${recipient}: ${res.rejected.join(", ")}`);
    }
  }
}