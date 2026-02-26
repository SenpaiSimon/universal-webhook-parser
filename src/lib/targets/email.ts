import type { ParsedResult } from "$lib/runner/parser/types";
import { db } from "$lib/server/db";
import type { EmailTargetSettings } from "./types";
import { createTransport } from "nodemailer"

type TemplateData = Record<string, any>;

/**
 * Replaces placeholders like {data.key1} with actual values from an object.
 */
function resolveTemplate(template: string, data: TemplateData): string {
  // Regex explains: find "{", capture everything until "}", then find "}"
  const regex = /\{([^}]+)\}/g;

  return template.replace(regex, (match, path: string) => {
    // Split "data.key1" into ["data", "key1"]
    const keys = path.split('.');
    
    // Reduce the object down to the specific value
    const result = keys.reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : undefined;
    }, data);

    // Return the value found, or the original {match} if not found.
    if (result === undefined) {
      return match;
    }
    if (typeof result === 'object' && result !== null) {
      return JSON.stringify(result, null, 2);
    }
    return String(result);
  });
}

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