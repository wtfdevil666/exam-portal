import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,     
  port: Number(process.env.SMTP_PORT) || 587, 
  secure: true,                   
  auth: {
    user: process.env.SMTP_USER,   
    pass: process.env.SMTP_PASS,   
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,   
      to,                            
      subject,                       
      text,                          
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email: %s', error);
  }
};
