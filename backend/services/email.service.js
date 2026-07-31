import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter = null;

// Create transporter only if credentials exist
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.log("⚠️ Email configuration error:", error.message);
    } else {
      console.log("✅ Email server is ready");
    }
  });
} else {
  console.log("⚠️ Email service disabled (Development Mode)");
}

// Common email sender
const sendMail = async (mailOptions) => {
  if (!transporter) {
    console.log("⚠️ Email skipped (Development Mode)");
    return {
      success: true,
      message: "Email service disabled",
    };
  }

  try {
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Email Error:", error);

    return {
      success: false,
      error,
    };
  }
};

export const sendWelcomeEmail = async (email, fullName, role) => {
  try {
    const mailOptions = {
      from: `"AI-HireHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to AI-HireHub!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to AI-HireHub! 🎉</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>Welcome to AI-HireHub, your AI-powered hiring platform! We're excited to have you on board as a <strong>${role}</strong>.</p>
              <p>With AI-HireHub, you can:</p>
              <ul>
                <li>📄 Upload and analyze your resume with AI</li>
                <li>🎯 Get AI-powered job recommendations</li>
                <li>💼 Apply to jobs with smart matching</li>
                <li>🤖 Generate AI cover letters</li>
                <li>📊 Track your applications</li>
              </ul>
              <p>Get started by completing your profile and uploading your resume!</p>
              <a href="${process.env.FRONTEND_URL}/profile" class="button">Complete Your Profile</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The AI-HireHub Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 AI-HireHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Welcome email error:", error);
    return { success: false, error };
  }
};

export const sendApplicationEmail = async (email, fullName, jobTitle, companyName) => {
  try {
    const mailOptions = {
      from: `"AI-HireHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Application Submitted: ${jobTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Submitted Successfully! 🎯</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully!</p>
              <p>What happens next?</p>
              <ul>
                <li>📋 The recruiter will review your application</li>
                <li>🤖 Our AI will match your skills with the job requirements</li>
                <li>📧 You'll receive updates on your application status</li>
              </ul>
              <p>You can track your application status in your dashboard.</p>
              <a href="${process.env.FRONTEND_URL}/profile" class="button">View Your Applications</a>
              <p>Good luck with your application!</p>
              <p>Best regards,<br>The AI-HireHub Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 AI-HireHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Application email error:", error);
    return { success: false, error };
  }
};

export const sendInterviewEmail = async (email, fullName, jobTitle, companyName, interviewDate, interviewTime) => {
  try {
    const mailOptions = {
      from: `"AI-HireHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Interview Scheduled: ${jobTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .interview-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Interview Scheduled! 🎉</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>Congratulations! You have been selected for an interview for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
              <div class="interview-details">
                <h3>Interview Details:</h3>
                <p><strong>Date:</strong> ${interviewDate}</p>
                <p><strong>Time:</strong> ${interviewTime}</p>
                <p><strong>Format:</strong> Video Interview (link will be sent separately)</p>
              </div>
              <p>Tips for your interview:</p>
              <ul>
                <li>📚 Review the job description and requirements</li>
                <li>💡 Prepare examples of your relevant experience</li>
                <li>❓ Practice common interview questions</li>
                <li>🔍 Research the company</li>
              </ul>
              <a href="${process.env.FRONTEND_URL}/profile" class="button">View Application Details</a>
              <p>We wish you the best of luck!</p>
              <p>Best regards,<br>The AI-HireHub Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 AI-HireHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Interview email error:", error);
    return { success: false, error };
  }
};

export const sendApplicationStatusEmail = async (email, fullName, jobTitle, companyName, status) => {
  try {
    let subject, message, color;

    switch (status) {
      case "accepted":
        subject = `Congratulations! You're Hired: ${jobTitle} at ${companyName}`;
        message = "Congratulations! You have been selected for the position!";
        color = "#10b981";
        break;
      case "rejected":
        subject = `Application Update: ${jobTitle} at ${companyName}`;
        message = "Thank you for your interest. Unfortunately, your application was not selected.";
        color = "#ef4444";
        break;
      default:
        subject = `Application Update: ${jobTitle} at ${companyName}`;
        message = `Your application status has been updated to: ${status}`;
        color = "#667eea";
    }

    const mailOptions = {
      from: `"AI-HireHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${color} 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: ${color}; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>${message}</p>
              <p><strong>Position:</strong> ${jobTitle}</p>
              <p><strong>Company:</strong> ${companyName}</p>
              <p><strong>Status:</strong> ${status.toUpperCase()}</p>
              <a href="${process.env.FRONTEND_URL}/profile" class="button">View Your Applications</a>
              <p>Thank you for using AI-HireHub!</p>
              <p>Best regards,<br>The AI-HireHub Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 AI-HireHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Status email error:", error);
    return { success: false, error };
  }
};

export const sendNewJobAlert = async (email, fullName, jobTitle, companyName, jobLocation) => {
  try {
    const mailOptions = {
      from: `"AI-HireHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `New Job Matching Your Profile: ${jobTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .job-card { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Job Alert! 🔔</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>We found a new job that matches your profile!</p>
              <div class="job-card">
                <h3>${jobTitle}</h3>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Location:</strong> ${jobLocation}</p>
              </div>
              <p>This job matches your skills and experience based on our AI analysis.</p>
              <a href="${process.env.FRONTEND_URL}/jobs" class="button">View Job Details</a>
              <p>Don't miss this opportunity!</p>
              <p>Best regards,<br>The AI-HireHub Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 AI-HireHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Job alert email error:", error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (email, fullName, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"AI-HireHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>We received a request to reset your password. Click the button below to reset it:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <div class="warning">
                <p><strong>⚠️ Important:</strong></p>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Never share your password with anyone</li>
                </ul>
              </div>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <p>Best regards,<br>The AI-HireHub Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 AI-HireHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
 return { success: true };
  } catch (error) {
    console.error("Password reset email error:", error);
    return { success: false, error };
  }
};
