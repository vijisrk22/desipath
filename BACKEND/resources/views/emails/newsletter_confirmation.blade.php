<!DOCTYPE html>
<html>
<head>
    <title>Confirm your Desipath Subscription</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1565D8;">Welcome to Desipath!</h2>
    <p>Thank you for subscribing to our newsletter. We're excited to share updates on local events, rentals, jobs, and community news with you.</p>
    <p>Please click the button below to confirm your subscription and opt-in to receive our emails:</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ url('/newsletter/confirm/' . $token) }}" 
           style="background-color: #1565D8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
           Confirm Subscription
        </a>
    </div>
    
    <p>If you didn't request this, you can safely ignore this email.</p>
    
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">
    <p style="font-size: 12px; color: #999;">
        &copy; {{ date('Y') }} Desipath. All rights reserved.
    </p>
</body>
</html>
