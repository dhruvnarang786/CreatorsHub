const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export const sendAdminNotification = async (studioName: string, ownerName: string, city: string) => {
  if (!RESEND_API_KEY || !ADMIN_EMAIL) {
    console.warn("Email service skipped: Missing API Key or Admin Email");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "CreatorsHub <notifications@creatorshub.com>",
        to: ADMIN_EMAIL,
        subject: `🚨 New Studio Alert: ${studioName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
            <h2 style="color: #7C3AED;">New Studio Registered!</h2>
            <p>A new studio has been listed and is waiting for your approval.</p>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p><strong>Studio:</strong> ${studioName}</p>
              <p><strong>Owner:</strong> ${ownerName}</p>
              <p><strong>City:</strong> ${city}</p>
            </div>
            <a href="${window.location.origin}/admin/approvals" style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Review & Approve Now</a>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">© 2024 CreatorsHub Admin Team</p>
          </div>
        `,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to send admin email:", error);
  }
};

export const sendOwnerApprovalEmail = async (ownerEmail: string, ownerName: string, studioName: string) => {
  if (!RESEND_API_KEY) return;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "CreatorsHub <hello@creatorshub.com>",
        to: ownerEmail,
        subject: `✨ Your Studio is Live on CreatorsHub!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
            <h2 style="color: #7C3AED;">Congratulations, ${ownerName}!</h2>
            <p>We've reviewed your listing and we're excited to let you know that <strong>${studioName}</strong> is now LIVE on the CreatorsHub marketplace.</p>
            <p>Creators can now discover and book your space.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${window.location.origin}/dashboard/owner" style="display: inline-block; background: #0A0A1A; color: white; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold;">View Your Dashboard</a>
            </div>
            <p>Happy Shoots!</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">The CreatorsHub Team</p>
          </div>
        `,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to send owner approval email:", error);
  }
};

export const sendBookingStatusUpdateEmail = async (
  creatorEmail: string,
  creatorName: string,
  studioName: string,
  status: string
) => {
  if (!RESEND_API_KEY) return;

  const isConfirmed = status === "confirmed";
  const subject = isConfirmed
    ? `✅ Booking Confirmed for ${studioName}!`
    : `❌ Booking Rejected for ${studioName}`;

  const message = isConfirmed
    ? `Good news! The owner of <strong>${studioName}</strong> has accepted your booking request. Please head over to your dashboard to complete the payment.`
    : `Unfortunately, the owner of <strong>${studioName}</strong> could not accept your booking request at this time.`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "CreatorsHub <hello@creatorshub.com>",
        to: creatorEmail,
        subject: subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
            <h2 style="color: ${isConfirmed ? "#10B981" : "#EF4444"};">${
          isConfirmed ? "Booking Confirmed!" : "Booking Update"
        }</h2>
            <p>Hi ${creatorName},</p>
            <p>${message}</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${
                window.location.origin
              }/dashboard/creator" style="display: inline-block; background: #0A0A1A; color: white; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold;">View Your Dashboard</a>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">The CreatorsHub Team</p>
          </div>
        `,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to send booking status email:", error);
  }
};
