import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Template } from './template';
import * as fs from 'fs/promises';
import * as path from 'path';
import { SendEmailPayload } from './models';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async send(payload: SendEmailPayload): Promise<void> {
    const body =
      payload.html ??
      (await this.getEmailTemplate(payload.template, payload.variables));

    if (!body) {
      throw new Error(
        `Email template ${payload.template} not found or could not be rendered.`,
      );
    }

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: [payload.to],
      subject: payload.subject,
      html: body,
      attachments: payload.attachments,
    });
  }

  private async getEmailTemplate(
    template: Template,
    variables: Record<string, string>,
  ): Promise<string> {
    try {
      const templatePath = path.join(
        __dirname,
        '..',
        '..',
        'core',
        'email-templates',
        `${template}.html`,
      );
      let body = await fs.readFile(templatePath, 'utf-8');

      // Replace variables in the template
      variables = {
        ...(variables || {}),

        // Default variables can be added here if needed
        website_base_url:
          process.env.FRONTEND_URL || 'https://csediualumni.com',
      };
      for (const [key, value] of Object.entries(variables)) {
        body = body.replace(new RegExp(`{{ ${key} }}`, 'g'), value);
      }

      return body;
    } catch (error) {
      console.error(`Error loading email template: ${error.message}`);
      return '';
    }
  }
}
