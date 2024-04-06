import nodemailer from 'nodemailer';
import { appConfig } from '@/config/app.config';

export enum EmailType {
  VerifyUser = 'VERIFY_USER',
  ResetPassword = 'RESET_PASSWORD',
}

const optionConfig = {
  host: appConfig.host,
  port: Number(appConfig.port),
  auth: {
    user: appConfig.user,
    pass: appConfig.password,
  },
};

export const sendMail = async ({
  name,
  email,
  emailType,
  url,
}: {
  name: string;
  email: string;
  emailType: EmailType;
  url: string;
}) => {
  const transporter = nodemailer.createTransport(optionConfig);
  const subject =
    emailType === EmailType.VerifyUser
      ? 'Verify your account'
      : 'Reset your password';
  const options = {
    from: 'no-reply@vivek.io',
    to: email,
    subject,
    html: `
        <div>
            <h3>${subject}</h3>
            <p>Hi, ${name}</p>
            <p>
            <a href="${url}">Click Here</a> to ${subject.toLowerCase()}.
            </p>
            <p>or copy and paste the link below in your browser ${url}</p>
        </div>
    `,
  };

  try {
    const info = await transporter.sendMail(options);

    return info;
  } catch (err) {
    throw new Error('Fail to send email.');
  }
};
