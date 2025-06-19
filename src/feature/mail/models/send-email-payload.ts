import { Template } from '../template';

export class SendEmailPayload {
  /**
   * to whom the email should be sent
   */
  to: string[];

  /**
   * subject of the email
   */
  subject: string;

  /**
   * Optional HTML content for email. If not provided, the email will be rendered using a template.
   */
  html?: string;

  /**
   * Predefined email template to use for rendering the email body.
   * If `html` is provided, this will be ignored.
   */
  template?: Template;

  /**
   * Optional variables to replace in the email template.
   * This is only used if a template is provided and `html` is not set.
   *
   * Example:
   * ```json
   * {
   *  "variables": {
   *   "username": "John Doe",
   *   "verificationLink": "https://example.com/verify?token=abc123"
   *  }
   * }
   * ```
   */
  variables?: Record<string, string>;

  /**
   * Optional attachments to include in the email.
   * This is an array of objects, each containing the file path and optional filename.
   */
  attachments?: Array<{
    filename: string;
    path?: string; // Path to the file on disk or URL to download
    
    // Either path or content should be provided, not both
    content?: Buffer | string;
    contentType?: string;
  }>;
}
