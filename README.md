# Hono Contact Form API (Cloudflare Workers based)

![GitHub last commit](https://img.shields.io/github/last-commit/Sigmakib2/cf-workers-contact-form-api)

A worker-based contact form API made using Hono JS which can be hosted on Cloudflare workers! Submissions can be sent to Discord and stored in a database.

## Cloudflare Workers vs. Other APIs

| Feature                     | Cloudflare Workers           | Other APIs                    |
|-----------------------------|------------------------------|-------------------------------|
| Free Tier Requests          | 100,000 per day              | Varies (often limited)        |
| Pricing                     | Free                         | Paid (based on usage)         |
| Scalability                 | Highly scalable              | Varies (some limited scalability) |
| Performance                 | Low-latency global network   | Varies (dependent on provider)|
| Edge Computing              | Yes                          | Varies (some providers offer) |
| Rate Limits                 | Generous free tier           | Varies (often with strict limits) |
| Flexibility                 | Support for multiple programming languages | Varies (some limited to specific languages) |
| Integration                 | Seamless integration with Cloudflare services | Varies (may require additional setup) |
| Learning Curve              | Beginner-friendly            | Varies (dependent on API complexity) |
| Community Support           | Active community             | Varies (dependent on API popularity) |
| Documentation               | Extensive documentation      | Varies (may lack comprehensive documentation) |

Cloudflare Workers offer an impressive free tier, providing 100,000 requests per day, making it an attractive choice for developers seeking cost-effective solutions for their projects. Additionally, Cloudflare's global network ensures low-latency responses, making it suitable for a wide range of applications.


## Features

1. **CORS Support:** Enables Cross-Origin Resource Sharing (CORS) to allow requests from any domain, enhancing interoperability with frontend applications.

2. **Dynamic Field Extraction:** Extracts form fields dynamically based on the `fieldsToExtract` array, providing flexibility in handling different types of form submissions.

3. **Honeypot Field Detection:** Includes a honeypot field (`honeypot`) to catch spam bots, identifying potential spam submissions and preventing them from being processed.

4. **Discord Integration:** Sends form submissions to a Discord channel via a webhook (`discordWebhookUrl`), providing real-time notifications for new submissions.

5. **Error Handling:** Implements error handling mechanisms to handle failed attempts to send data to the Discord webhook, logging errors and returning appropriate HTTP response codes.

6. **Timestamp Inclusion:** Includes a timestamp (`timestamp`) in the Discord message payload, aiding in tracking and organizing submissions based on submission time.

7. **Cloudflare Worker Compatibility:** Implied compatibility with Cloudflare Workers, allowing for easy deployment and scalability on the Cloudflare platform.

    - **Hono JS Framework:** Built on the Hono JS framework for easy routing and handling of HTTP requests.
    - **Discord Integration:** Sends contact form submissions to a Discord channel via webhook for real-time notifications.
    - **Database Storage:** Capable of storing submissions in a database for future reference or analysis, you can use Cloudflare's D1 DB.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine.
- A Cloudflare account so that you can use the Cloudflare Workers.
- A Discord webhook URL for receiving submissions.

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Sigmakib2/cf-workers-contact-form-api.git
2. Install dependencies:

    ```sh
    npm install
3. Run Local server:
    ```sh
    npm run dev
### Configure with your webhook

After cloning this project open that with your code editor. Go to the index.ts file in **src** folder. Go to the line with this code:

```javascript
const discordWebhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';
```
Now replace this ```YOUR_DISCORD_WEBHOOK_URL``` with your own Discord webhook. Don't know how to get webhook url? Here is a doc for help:
https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks

So, dere is a demo:

```javascript
const discordWebhookUrl = 'https://discord.com/api/webhooks/123.../abc...';
```
## Test API

### Manual Testing:

1. Install the required dependencies and start the server again if you changed the webhook url. Server will open at http://127.0.0.1:8787/

2. Now, you can test the API manually using a tool like cURL or by creating a simple HTML form. Example using cURL:

    ```perl
    curl -X POST http://127.0.0.1:8787/contact -d "name=John&email=john@example.com&message=Hello"
    ```
3. Check the console output of the server to see the logs and responses and also you will see the submission in the Discord channel.

### Testing with Postman:

1. If you haven't already, download and install [Postman](https://www.postman.com/downloads/).

2. Launch Postman and create a new request.

3. Set the request method to POST.

4. Enter the request URL: `http://127.0.0.1:8787/contact`.

5. Go to the "Body" tab, select "x-www-form-urlencoded", and add key-value pairs for the form fields you want to test (e.g., name, email, message).

6. Optionally, you can add a honeypot field with a value to simulate spam detection.

7. Click "Send" to make the request.

8. You should receive a response in the Postman interface, and you can check the server console for any logs or errors.

## Honeypot Technique

A honeypot is a technique used to detect and mitigate spam submissions in web forms. It involves adding an additional form field that is hidden from regular users but visible to bots. Since bots typically fill out all fields in a form, including hidden ones, submissions that have data in the honeypot field are likely to be spam.

In the provided code, a honeypot field is included in the form data processing logic. Let's explain how it works with a simple example:

```javascript
// Check honeypot field
if (body.honeypot) {
  console.log('Potential spam detected: honeypot field filled out.');
  return c.text('Potential spam detected.', 400);
}
```
In this code snippet, the server checks if the honeypot field in the request body is filled out. If it is, the server logs a message indicating potential spam and returns a 400 (Bad Request) response. You can change the name of honeypot to avoid smart bots.

```html
<form action="http://127.0.0.1:8787/contact" method="post">
  <input type="text" name="name" placeholder="Your Name" required><br>
  <input type="email" name="email" placeholder="Your Email" required><br>
  <textarea name="message" placeholder="Your Message" required></textarea><br>
  <!-- Honeypot Field: -->
  <input type="text" name="honeypot" style="display:none;">
  <!-- End of Honeypot Field -->
  <button type="submit">Submit</button>
</form>
```

It is better to set the honeypot field CSS style in saparate file because most of the bots avoids the saparate css or assets.

In the HTML form example above, we've included a honeypot field within the form. This field is hidden from regular users using the style="display:none;" attribute, making it invisible on the webpage. However, bots that automatically fill out forms are likely to complete this hidden field.

When a user submits the form, all visible fields are filled out as expected. However, since bots also fill out hidden fields, they may inadvertently populate the honeypot field.

When a request is sent to the server with the form data, the server checks if the honeypot field has any data. If it does, the server recognizes it as a potential spam submission and handles it accordingly.

This is a simple example of how a honeypot can be implemented to help prevent spam submissions in web forms.

## Deploy Project

If you have a Cloudflare account, you can deploy to Cloudflare. Just run below command:

```sh
npm run deploy
```
If you face any problem, just read the sources below:

- https://hono.dev/getting-started/cloudflare-workers
- https://developers.cloudflare.com/workers/get-started/guide/#4-deploy-your-project

## Acknowledgements
- Hono JS: The Hono JS framework used for building the contact form API.
- Cloudflare Workers: Cloudflare Workers for hosting the API.
- Discord Webhooks: Discord webhooks for integrating with Discord channels.

Contributions are welcome!