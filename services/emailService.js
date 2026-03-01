const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendLeadEmail = async (data) => {
    const { name, phone, businessType, message } = data;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "brtworks21@gmail.com",
        subject: "🚀 New Website Lead - localbrand.web",
        html: `
      <h2>New Lead Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Business Type:</strong> ${businessType}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
    });
};

module.exports = { sendLeadEmail };
