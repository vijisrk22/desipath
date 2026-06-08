<!DOCTYPE html>
<html>
<head>
    <title>Listing Reported</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>A listing has been reported</h2>
    
    <p><strong>Listing ID:</strong> {{ $listingId }}</p>
    <p><strong>Listing Title:</strong> {{ $listingTitle }}</p>
    
    <p><strong>Reason for reporting:</strong></p>
    <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
        {{ $reason }}
    </blockquote>
    
    <p><strong>Listing URL:</strong> <a href="{{ $listingUrl }}">{{ $listingUrl }}</a></p>
    
    <br>
    <p>Please review this listing.</p>
</body>
</html>
