export interface EmailTemplateProps {
  link: string;
  name: string;
  description: string;
  buttonLabel: string;
}

export const EmailTemplate = ({ link, name, description, buttonLabel }: EmailTemplateProps) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Hello ${name},</h2>
      <p>${description}</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${link}" 
            style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                  color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
          ${buttonLabel}
        </a>
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #777; font-size: 0.9em;">This link will expire in 24 hours.</p>
    </div>
  `;
};
