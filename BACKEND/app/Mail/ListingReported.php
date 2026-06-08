<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ListingReported extends Mailable
{
    use Queueable, SerializesModels;

    public $listingId;
    public $listingTitle;
    public $reason;
    public $listingUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($listingId, $listingTitle, $reason, $listingUrl)
    {
        $this->listingId = $listingId;
        $this->listingTitle = $listingTitle;
        $this->reason = $reason;
        $this->listingUrl = $listingUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Listing Reported: ' . $this->listingTitle,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.listing_reported',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
