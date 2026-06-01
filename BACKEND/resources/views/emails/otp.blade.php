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
        <h1>Verify Your Email</h1>
        <p>Thank you for joining Desipath! Use the following code to activate your account:</p>
        <div class="otp-box">
            {{ $otp }}
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <div class="footer">
            &copy; {{ date('Y') }} Desipath. All rights reserved.
        </div>
    </div>
</body>
</html>
