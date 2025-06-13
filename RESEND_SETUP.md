# Resend Email Setup Guide

## 1. Get Your Resend API Key

1. Go to [Resend.com](https://resend.com) and create an account
2. Navigate to your dashboard and create a new API key
3. Copy the API key (it starts with `re_`)

## 2. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
# Resend API Configuration
RESEND_API_KEY=re_your_actual_api_key_here

# Email Configuration - Replace with your email
NOTIFICATION_EMAIL=your-email@example.com

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Domain Configuration (Optional but Recommended)

For production, you should:

1. Add your domain to Resend
2. Verify your domain
3. Update the `from` addresses in the API route to use your verified domain

Example:
```typescript
from: 'TenderPost Signup <onboarding@resend.dev>'
```

**Note**: For development/testing, you can use `onboarding@resend.dev` which is provided by Resend for testing purposes.

## 4. Test the Integration

1. Start your development server: `npm run dev`
2. Go to your website and try signing up with an email
3. Check your email for the notification

## 5. Email Templates

The system sends two emails:

1. **Notification Email** - Sent to you when someone signs up
2. **Welcome Email** - Sent to the user who signed up

Both emails are beautifully designed with HTML templates and include:
- Professional styling
- Responsive design
- Brand colors and gradients
- Emojis and engaging content

## 6. Troubleshooting

- Make sure your API key is correct
- Check that your notification email is valid
- Verify your domain is set up correctly in Resend
- Check the browser console and server logs for errors

## 7. Production Considerations

- Use environment variables for sensitive data
- Set up proper error handling
- Consider rate limiting for the signup endpoint
- Monitor email delivery rates in Resend dashboard 