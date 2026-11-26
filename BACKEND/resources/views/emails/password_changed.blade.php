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
        .info-box {
            background-color: #f8fafc;
            border-left: 4px solid #0857d0;
            padding: 16px;
            margin: 20px 0;
            text-align: left;
            font-size: 14px;
            color: #334155;
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
        <h1>Password Changed Successfully</h1>
        <p>The password for your Desipath account was recently updated.</p>
        <div class="info-box">
            <strong>Security Notice:</strong>
            <p style="margin: 8px 0 0;">If you made this change, you can safely ignore this notice. If you did not make this change, please contact Desipath support immediately or reset your password to secure your account.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Desipath. All rights reserved.
        </div>
    </div>
</body>
</html>
