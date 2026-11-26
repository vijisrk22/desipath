<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .otp-box {
            background-color: #f4f7ff;
            border: 2px dashed #0857d0;
            padding: 20px;
            margin: 20px 0;
            font-size: 32px;
            font-weight: bold;
            color: #0857d0;
            letter-spacing: 10px;
        }
        .footer {
            font-size: 12px;
            color: #888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div style="margin-bottom: 24px;">
            <img src="https://qa.desipath.com/desipath-logo.png" alt="Desipath" style="height: 36px; width: auto;" />
        </div>
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password for your Desipath account. Use the code below to set a new password:</p>
        <div class="otp-box">
            {{ $otp }}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <div class="footer">
            &copy; {{ date('Y') }} Desipath. All rights reserved.
        </div>
    </div>
</body>
</html>
