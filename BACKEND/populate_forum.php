<?php

use App\Models\ForumPost;
use App\Models\ForumComment;
use App\Models\User;
use Illuminate\Support\Str;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$userIds = User::limit(10)->pluck('id')->toArray();
if (empty($userIds)) {
    echo "No users found. Please create users first.\n";
    exit;
}

$categories = [
    'H1B Visa discussion' => [
        ['title' => 'Latest H1B CAP 2025 Updates and Lottery Odds', 'content' => "Anyone else nervous about the upcoming H1B cap season? I've been hearing rumors that registration numbers might be lower this year due to stricter multiple registration rules. Does anyone have data on this?"],
        ['title' => '221(g) Administrative Processing at Hyderabad Consulate - My Experience', 'content' => "Just had my interview at the Hyderabad consulate and received a white 221(g) slip. They asked for my project description and client letter. How long does it usually take to get a clearance these days?"],
        ['title' => 'Switching from H1B to H4 EAD - Processing Times in 2024', 'content' => "Considering moving from H1B to H4 EAD to take a break from the IT grind. What are the current processing times at California Service Center? Can we still apply for H4 and EAD concurrently?"],
        ['title' => 'H1B Stamping in Mexico vs Canada - Which is safer for TCN?', 'content' => "I'm planning to go for my first-time H1B stamping. Canada dates are hard to find. Is Mexico still a viable option for Third Country Nationals? Any recent experiences in Matamoros or Tijuana?"],
        ['title' => 'Change of Employer while H1B Extension is Pending', 'content' => "I have an H1B extension pending with Employer A. Now I have a great offer from Employer B. Can they file a transfer based on the pending extension, or do I need to wait for the approval first?"],
        ['title' => 'Impact of Proposed H1B Fee Increases on Small Consulting Firms', 'content' => "The USCIS recently proposed significant fee hikes for H1B filings. As someone working for a mid-sized firm, I'm worried about how this affects hiring. Will companies start preferring local talent over sponsorship?"],
        ['title' => 'Understanding the \'Prevailing Wage\' Requirement for H1B', 'content' => "I'm currently in salary negotiations. How exactly is the prevailing wage determined for a 'Software Developer' role in the Bay Area vs Austin? Does the Level 1 vs Level 2 distinction still matter as much?"],
        ['title' => 'Can I work remotely from India for 2 months on H1B?', 'content' => "My family has an emergency in India. My manager is okay with me working from there for 8 weeks. Are there any tax or H1B compliance issues I should be aware of? I have a valid visa stamp."],
        ['title' => 'H1B Grace Period: What happens if I can\'t find a job in 60 days?', 'content' => "Sadly, I was part of a recent layoff. Today is Day 15 of my grace period. If I don't find a job by Day 60, what are my options to stay in the US legally while I continue my search? B1/B2 change of status?"],
        ['title' => 'Premium Processing for H1B Transfers - Is it worth the $2805?', 'content' => "My new employer is asking if I want to pay for premium processing out of pocket (since it's for 'personal' convenience). Is it worth the steep price tag just to get a decision in 15 days?"],
    ],
    'Indian Cooking' => [
        ['title' => 'Secret ingredient for that restaurant-style Dal Makhani?', 'content' => "I've tried everything, from slow cooking for 12 hours to adding tons of butter. But I still can't get that smoky flavor they have in Bukhara or local favorites. Is it the charcoal dhungar method?"],
        ['title' => 'Tips for making soft Phulkas/Roti that stay soft for 12 hours.', 'content' => "My rotis are great when fresh but turn into papads by lunchtime. I use Aashirvaad Select. Should I add milk or oil to the dough? Any kneading tips?"],
        ['title' => 'Air Fryer Samosas - Do they actually taste good?', 'content' => "Trying to eat healthy. Has anyone perfected the air fryer samosa? Every time I try, the crust is either too dry or doesn't have that flaky texture."],
        ['title' => 'Best brand of Basmati Rice available in US Costcos?', 'content' => "I usually buy Royal Basmati, but lately, the aroma seems missing. Is the Zebra brand better? Or should I stick to the Indian store brands like Daawat Ultima?"],
        ['title' => 'How to perfectly ferment Idli batter in cold US winters?', 'content' => "It's 20 degrees outside and my batter hasn't risen in 24 hours. I tried the Oven-with-light-on method but no luck. Should I use a heating pad or an Instant Pot?"],
        ['title' => 'Quick 15-minute dinner recipes for busy IT professionals.', 'content' => "Exhausted after standups and sprints. Please share your go-to Indian meals that take less than 20 mins. One-pot khichdi and pasta are getting boring!"],
        ['title' => 'Substitutes for Curry Leaves when you can\'t find them fresh.', 'content' => "My local Walmart doesn't stock Kadi Patta. Can I use dried ones? Or is there any other leaf that gives a similar nutty aroma?"],
        ['title' => 'Is it safe to use a traditional Pressure Cooker on a Glass Top Stove?', 'content' => "Just moved to a new house with an induction/glass top. My old Hawkins whistle cooker is heavy. Will it crack the glass? Should I switch to a flat-bottomed steel one?"],
        ['title' => 'Homemade Paneer - Why does mine always turn out crumbly?', 'content' => "I use whole milk and lemon juice. The taste is good but it doesn't hold shape during frying. Any tips on pressing it correctly?"],
        ['title' => 'Authentic Hyderabadi Biryani - Kachchi vs Pakki method?', 'content' => "Planning a party for 20 people. I want to try the raw meat (Kachchi) method for the first time. Is it too risky for a large crowd?"],
    ],
    'Real estate in USA' => [
        ['title' => 'Buying a home in 2024 - Is it better to wait for rate cuts?', 'content' => "Market is crazy even with 7% rates. If the Fed cuts rates, won't prices just skyrocket further due to more competition? Maybe it's better to buy now and refinance later?"],
        ['title' => 'Understanding \'School Ratings\' vs \'Neighborhood Safety\'.', 'content' => "Found a great house but GreatSchools rating is 4/10. However, the niche.com safety rating is A+. How much weight should I give to elementary school ratings if I don't have kids yet?"],
        ['title' => 'Conventional vs FHA loans - Which is better for first-time buyers?', 'content' => "I have a 10% down payment. My lender is pushing for FHA because of my 720 score. But I heard PMI stays forever in FHA. Is that true?"],
        ['title' => 'How to negotiate the \'Buyer Agent Commission\' after the NAR settlement?', 'content' => "With the new rules, I might have to pay my agent directly. What is a reasonable percentage to offer for a $500k house? Is 2% the new norm?"],
        ['title' => 'Investing in Rental Property in Texas - Is it still profitable?', 'content' => "Property taxes are insane in Austin and Dallas. After mortgage and taxes, the cash flow is barely $100. Is it still a good long-term appreciation play?"],
        ['title' => 'Roof replacement costs in New Jersey - Any reliable contractors?', 'content' => "Got a quote for $18k for a 2500 sq ft roof. Is that reasonable? They are suggesting GAF Timberline shingles."],
        ['title' => 'Solar Panels - Are they a good investment or a scam?', 'content' => "Salesmen are knocking every day promising $0 electricity bills. But I heard it makes selling the house difficult if the panels are leased. Any thoughts?"],
        ['title' => 'Closing Costs - What hidden fees should I look out for?', 'content' => "Looking at my Loan Estimate. There is a $2000 \"Processing Fee\" from the lender. Can I ask them to waive this? What else is negotiable?"],
        ['title' => 'Dealing with HOA - My experience with strict regulations.', 'content' => "My HOA just sent me a warning for having a \"non-approved\" flower pot on my porch. Is this normal? How do you guys handle \"Karens\" in the neighborhood?"],
        ['title' => 'Refinancing from 7% to 6% - Is it worth the closing costs?', 'content' => "My current mortgage is 1 year old. I can drop my rate by 1%. The closing costs are $4500. My break-even is 22 months. Should I pull the trigger or wait for 5%?"],
    ],
    'New to USA' => [
        ['title' => 'Getting your first US Driving License - State specific tips.', 'content' => "I'm in New Jersey. They say I need \"6 points of ID\". I have my passport and I-94. What else counts? Is the written test hard?"],
        ['title' => 'Building Credit Score from scratch - Secured cards vs Authorized users.', 'content' => "Just landed 2 weeks ago. No SSN yet (applied). Can I start building credit with just my passport? Which bank is most immigrant-friendly?"],
        ['title' => 'Why is US Healthcare so complicated? My first ER experience.', 'content' => "Went to the ER for a small cut. Received a bill for $3000 even with insurance! Why did they charge a \"Facility Fee\"? How do I negotiate this?"],
        ['title' => 'Essential things to bring from India (and what to leave behind).', 'content' => "Packing my bags for my MS flight. Should I bring a pressure cooker and mixie? Or just buy an Instant Pot and Ninja in the US?"],
        ['title' => 'Cultural shocks I faced in my first month in the US.', 'content' => "People saying \"How are you?\" but not actually wanting to know. The massive portion sizes at restaurants. And the lack of public transport! What shocked you the most?"],
        ['title' => 'How to find a good apartment in a safe locality as a newcomer.', 'content' => "Searching on Zillow and Apartments.com. How do I know if an area is \"ghetto\" or safe? Are there any specific websites for crime stats?"],
        ['title' => 'Opening your first Bank Account - Chase vs Bank of America?', 'content' => "Chase is offering a $200 bonus for new accounts. But BofA has more ATMs in my college town. Which one has better mobile app features?"],
        ['title' => 'Winter clothing Guide - Do I really need a $1000 Canada Goose jacket?', 'content' => "I'm moving to Chicago. People are scaring me about the wind. Is Uniqlo Heattech enough or should I invest in a heavy parka?"],
        ['title' => 'Staying in touch with family - Best calling apps/SIM cards.', 'content' => "What is the cheapest way to call India landlines? Also, which US carrier has the best international roaming plans?"],
        ['title' => 'Making friends in the US - Meetups vs Local community groups.', 'content' => "It feels lonely here sometimes. I tried Bumble BFF but it was awkward. Are there any Indian community groups in the Bay Area for non-IT folks?"],
    ],
    'About Studies' => [
        ['title' => 'MS in CS vs Data Science - Which has better job prospects in 2025?', 'content' => "I have a background in Electronics. I'm confused between a general CS degree or a specialized DS degree. Given the AI boom, is DS over-saturated?"],
        ['title' => 'Scholarship opportunities for international students in Ivy League.', 'content' => "I have a 330 GRE and 9.5 GPA. Do I have a chance at full funding for a PhD? Or are scholarships mostly reserved for citizens?"],
        ['title' => 'Dealing with \'Placement Stress\' during the current tech slowdown.', 'content' => "I've applied to 200 companies and got 0 callbacks. The recession talk is scary. How are you guys keeping your mental health in check?"],
        ['title' => 'On-campus jobs - How to secure a TA/RA position early.', 'content' => "I want to cover my living expenses. Should I email professors before I even land in the US? What should I include in my CV?"],
        ['title' => 'GRE vs GMAT - Which one should I take for an MBA?', 'content' => "I want to apply for a Tech MBA. Some schools say they accept both. Is there any hidden preference for GMAT in top-tier B-schools?"],
        ['title' => 'Living on-campus vs off-campus - Pros and Cons.', 'content' => "On-campus is expensive but safe. Off-campus is cheap but I'll need a car. What did you guys choose for your first year?"],
        ['title' => 'Internship search tips - Networking on LinkedIn effectively.', 'content' => "Cold messaging recruiters isn't working. Should I focus on getting referrals from alumni? How do I approach them without sounding desperate?"],
        ['title' => 'Managing finances as a student - Budgeting $1000 a month.', 'content' => "Rent is $600. Groceries are $200. Is $200 enough for everything else? Please share your cost-cutting tips for Indian students."],
        ['title' => 'Writing a winning Statement of Purpose (SOP).', 'content' => "How much should I talk about my childhood vs my technical projects? Is it okay to mention that I want to work in the US after graduation?"],
        ['title' => 'OPT/CPT rules - Navigating the immigration paperwork.', 'content' => "I just got an internship offer. When should I apply for CPT? Does it affect my 3-year OPT after graduation?"],
    ],
    'Kids' => [
        ['title' => 'Best Kumon vs Russian Math for 2nd graders?', 'content' => "Kumon seems like a lot of repetition. Russian Math is more logic-based. Which one helped your child more with school math?"],
        ['title' => 'Screen time limits for toddlers - What works for you?', 'content' => "My 3-year-old is obsessed with Cocomelon. We try to limit to 30 mins but it always ends in a tantrum. Any educational alternatives?"],
        ['title' => 'Finding a good Telugu/Hindi teacher for kids in the US.', 'content' => "I want my kids to speak their mother tongue. Are there any online classes that are engaging for 6-year-olds?"],
        ['title' => 'Summer Camps - When to start booking for 2025?', 'content' => "I heard the popular STEM and YMCA camps fill up by February. Is it too late to look for this year?"],
        ['title' => 'Dealing with \'Pickey Eaters\' - Indian lunchbox ideas.', 'content' => "My daughter hates cold Rotis. What Indian food stays good in a thermos? Pasta is the only thing she finishes!"],
        ['title' => 'Piano vs Violin - Which instrument should a 5-year-old start with?', 'content' => "We want to start music lessons. Piano seems more foundational but Violin is more portable. Any teacher recommendations in Plano, TX?"],
        ['title' => 'Weekend activities for kids in the Tri-state area.', 'content' => "Looking for something beyond the local park. Any good interactive museums or indoor play areas for a rainy day?"],
        ['title' => 'Encouraging reading habits - Favorite books for 8-10 year olds.', 'content' => "My son just finished Harry Potter. What's next? Wings of Fire or Percy Jackson? He likes adventure and mythology."],
        ['title' => 'Birthday party ideas - How to keep it fun and budget-friendly.', 'content' => "Hosting 15 kids at home. Should I hire an entertainer or just do DIY games? Any good themes for a boy's 7th birthday?"],
        ['title' => 'Transitioning from Daycare to Kindergarten - Emotionally preparing the child.', 'content' => "My son is starting public school next month. He's very shy. How do I help him make friends and deal with the longer school hours?"],
    ]
];

$replies = [
    "I totally agree! I went through the same thing last year.",
    "Thanks for sharing this, very helpful info for the community.",
    "Does anyone else have a different perspective on this?",
    "This is exactly what I was looking for. Appreciate the detailed post!",
    "Great points. I would also add that networking is key in this situation.",
    "I have a slightly different experience, but I see where you are coming from.",
    "Following this thread. I am in a similar boat.",
    "Could you please share more details about the timeline?",
    "Wow, I didn't know that. Thanks for the heads up!",
    "Interesting! I'll have to try this out and report back."
];

foreach ($categories as $category => $posts) {
    foreach ($posts as $p) {
        $authorId = $userIds[array_rand($userIds)];
        $post = ForumPost::create([
            'user_id' => $authorId,
            'title' => $p['title'],
            'content' => $p['content'],
            'category' => $category,
            'votes' => rand(5, 50),
            'slug' => Str::slug($p['title']) . '-' . rand(1000, 9999),
        ]);
        
        echo "Created post: {$post->title}\n";
        
        // Add 2-4 random replies
        $numReplies = rand(2, 4);
        for ($i = 0; $i < $numReplies; $i++) {
            $replyAuthorId = $userIds[array_rand($userIds)];
            ForumComment::create([
                'user_id' => $replyAuthorId,
                'post_id' => $post->id,
                'content' => $replies[array_rand($replies)],
                'votes' => rand(1, 10),
            ]);
        }
    }
}

echo "Successfully populated forum with 60 high-fidelity posts and replies!\n";
