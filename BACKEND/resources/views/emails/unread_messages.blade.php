<!DOCTYPE html>
<html>
<head>
    <title>Unread Messages</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #0857d0; text-align: center; margin-bottom: 20px;">You have unread messages!</h2>
        
        <p>Hi {{ $user->name }},</p>
        
        <p>You have <strong>{{ $unreadCount }}</strong> unread message(s) waiting for you in your Desipath Inbox.</p>
        
        <p>Don't keep them waiting! Click the button below to reply and keep the conversation going.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url(env('FRONTEND_URL', 'http://localhost:3000') . '/inbox') }}" style="background-color: #0857d0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Inbox</a>
        </div>
        
        <p style="font-size: 13px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            If you're unable to click the button, copy and paste this link into your browser:<br>
            <a href="{{ url(env('FRONTEND_URL', 'http://localhost:3000') . '/inbox') }}">{{ url(env('FRONTEND_URL', 'http://localhost:3000') . '/inbox') }}</a>
        </p>
    </div>
</body>
</html>
