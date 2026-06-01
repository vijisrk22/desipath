<x-mail::message>
# Travel Post Published!

Hi {{ $post->user->name }},

Great news! Your travel companion {{ $type }} has been published successfully on Desipath.

**Post Details:**
- **Travel Direction:** {{ str_replace('_', ' ', $post->travel_direction) }}
- **Travel Date:** {{ $post->travel_date ? \Carbon\Carbon::parse($post->travel_date)->format('M d, Y') : 'Flexible' }}

Other travelers on the same route can now see your post and connect with you.

<x-mail::button :url="config('app.url') . '/travel-companion/my-posts'">
View My Posts
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} Team
</x-mail::message>
