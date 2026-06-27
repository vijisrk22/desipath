<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Confirmed - Desipath</title>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f9fafb; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; max-width: 400px; width: 100%; }
        h1 { color: #10B981; margin-bottom: 15px; font-size: 24px; }
        p { color: #4B5563; line-height: 1.5; margin-bottom: 25px; }
        a { display: inline-block; background-color: #1565D8; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; transition: background-color 0.2s; }
        a:hover { background-color: #104eab; }
        svg { width: 64px; height: 64px; color: #10B981; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1>Thank You!</h1>
        <p>{{ $message }}</p>
        <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}">Return to Desipath</a>
    </div>
</body>
</html>
