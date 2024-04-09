import { Hono } from 'hono';
import { cors } from 'hono/cors'
const app = new Hono();

//allow every domain to use this API
app.use('/contact/*', cors())

// Define an array of field names
const fieldsToExtract = ['name', 'email', 'message', 'newField1', 'newField2', 'honeypot'];

// Replace with your Discord webhook URL
const discordWebhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';

app.post('/contact', async (c) => {
  const body = await c.req.parseBody();
  
  // Check honeypot field
  if (body.honeypot) {
    console.log('Potential spam detected: honeypot field filled out.');
    return c.text('Potential spam detected.', 400);
  }
  
  // Extract fields dynamically based on the defined array
  const formData = {};
  for (const field of fieldsToExtract) {
    formData[field] = body[field];
  }

  // Get current timestamp
  const timestamp = new Date().toISOString();

  // Construct Discord embed message
  const discordMessage = {
    embeds: [{
      title: '🟡 New Contact Form Submission',
      description: `⌛**Timestamp:** ${timestamp}`,
      fields: fieldsToExtract.map(field => ({
        name: '📌 '+field,
        value: '〰〰 '+formData[field] || 'Not provided',
        inline: false, // Display each field on a new line
      })),
    }],
  };

  // Send data to Discord webhook
  const response = await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discordMessage),
  });

  if (!response.ok) {
    console.error('Failed to send message to Discord:', await response.text());
    return c.text('Error submitting the form.', 500);
  }

  // Include timestamp in user response
  return c.text(`Form submitted successfully! (Submitted at ${timestamp})`, 200);
});

export default app;
