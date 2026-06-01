const fs = require('fs');

const categories = {
  'H1B Visa discussion': [
    {
      title: 'H1B 2025 Lottery Predictions',
      content: 'What are the chances this year with the new rule changes? Any inside info?',
      replies: [
        'I think the chances will be slightly better this year due to the new beneficiary-centric selection process.',
        'Honestly, it is still a lottery. Prepare for the worst and hope for the best.',
        'The new rules should eliminate the multiple registration abuse, so legitimate candidates have a better shot.'
      ]
    },
    {
      title: 'RFE for Specialty Occupation',
      content: 'Got an RFE for my software engineer role. It says my degree doesn\'t directly match. Any advice on how to respond?',
      replies: [
        'You need to get an expert opinion letter from a university professor evaluating your coursework.',
        'My company lawyers handled this by showing a detailed breakdown of my daily tasks mapping to my degree courses.',
        'Make sure to provide letters from previous employers proving you have progressive experience in this exact field.'
      ]
    },
    {
      title: 'H1B to Green Card Timeline',
      content: 'How long is it taking for EB2 India priority dates to move these days? It feels stuck forever.',
      replies: [
        'It is moving at a snail\'s pace. Unless there is legislative action, expect a multi-decade wait for recent filers.',
        'Keep an eye on the visa bulletin every month, but honestly, consider exploring EB1 if you qualify.',
        'I filed in 2014 and just got mine last year. The backlog for India is incredibly frustrating.'
      ]
    },
    {
      title: 'Traveling to India on H1B Dropbox',
      content: 'Has anyone recently used the dropbox facility in Chennai? How long did it take to get the passport back?',
      replies: [
        'I dropped mine off in January. It took exactly 18 days to get it back. Track it on the CEAC website.',
        'Chennai has been a bit slow recently. Expect 2-3 weeks minimum.',
        'Make sure all your documents match the checklist perfectly to avoid being called in for an interview (221g).'
      ]
    },
    {
      title: 'H1B Transfer during grace period',
      content: 'I was recently laid off and have 60 days. Just got an offer on day 45. Will premium processing save me?',
      replies: [
        'Yes! As long as the petition is filed before the 60 days are up, you are safe. Premium processing just gives you peace of mind faster.',
        'You don\'t even need premium processing to be safe, just the receipt notice before day 60. But premium is highly recommended.',
        'Congratulations on the new offer! Make sure the lawyers overnight the documents to USCIS.'
      ]
    },
    {
      title: 'H4 EAD Processing Time in 2025',
      content: 'Filed concurrently with H1B premium processing. The H1B was approved, but H4 EAD is still pending. Normal?',
      replies: [
        'Very normal. USCIS uncoupled the H4 EAD processing from H1B premium processing a while ago.',
        'It usually takes 3-5 months for the H4 EAD to be approved even if the H1B was premium.',
        'You can try expediting it if you have a severe financial loss or a pending job offer, but it is tough.'
      ]
    },
    {
      title: 'Is multiple registration still an issue?',
      content: 'Heard USCIS cracked down on multiple registrations. Will this increase our odds this year?',
      replies: [
        'Yes, the new system selects by passport number, not by registration. This is a huge win for fairness.',
        'The odds should mathematically improve, but the total number of unique applicants is still very high.',
        'Finally! The system was so broken before. Good luck to everyone this year.'
      ]
    },
    {
      title: 'Stamping in Canada or Mexico (TCN)',
      content: 'Can I go to Calgary for my first time H1B stamping instead of going back to India?',
      replies: [
        'Canada rarely accepts TCNs for first-time H1B stamping. It is mostly for renewals.',
        'If you got your degree in the US and changed status from F1 to H1B, sometimes Mexico accepts it. Check the consulate website.',
        'It is risky. If you get a 221g, you will be stuck outside the US and cannot re-enter.'
      ]
    },
    {
      title: 'Switching from F1 OPT to H1B',
      content: 'My employer is filing my H1B. Do I need to be worried about the cap gap if my OPT expires in June?',
      replies: [
        'If your H1B is picked and filed before your OPT expires, your work authorization is automatically extended until Sept 30th (Cap Gap).',
        'Make sure to get a new I-20 from your DSO showing the Cap Gap extension once the H1B is filed.',
        'You are perfectly fine, just don\'t travel internationally during the cap gap period.'
      ]
    },
    {
      title: 'Working from India on H1B',
      content: 'Need to go back for a family emergency. Can I work remotely from India for 2 months without tax implications?',
      replies: [
        'Usually, anything under 30 days is fine. For 2 months, your employer might need to file a new LCA or have tax implications.',
        'Check with your company\'s HR and mobility team. Every company has different policies regarding international remote work.',
        'Be careful with this. It can complicate your taxes in both the US and India.'
      ]
    },
    {
      title: '221g Administrative Processing',
      content: 'Got a blue slip in Hyderabad. They asked for client letter. How long does this usually take?',
      replies: [
        'It varies wildly. Sometimes 2 weeks, sometimes 6 months. Make sure you submit exactly what they asked for.',
        'I had the exact same issue last year. Submitted the client letter and got the approval in 3 weeks.',
        'Try to get a very detailed client letter stating your specific duties and the duration of the project.'
      ]
    },
    {
      title: 'H1B Amendment for location change',
      content: 'Moving from CA to TX but same employer and role. Is an amendment required or just an LCA?',
      replies: [
        'If the new location is outside the Metropolitan Statistical Area (MSA) of your current LCA, you absolutely need an H1B amendment.',
        'Yes, moving from CA to TX requires a new LCA AND an H1B amendment filed before you start working in TX.',
        'Do not move before the amendment is at least filed (receipt notice received).'
      ]
    },
    {
      title: 'Laid off on H1B - Options?',
      content: 'What are my real options if I can\'t find a job in 60 days? Switch to B2?',
      replies: [
        'Yes, filing a change of status to B2 (visitor) before day 60 will buy you time to keep looking for a job.',
        'Switching to B2 is very common now. Once you find an employer, they file an H1B petition with a change of status back from B2.',
        'If you have an I-140 approved, you can also look into switching to an H4 if your spouse is on H1B.'
      ]
    },
    {
      title: 'H1B Grace Period Clarification',
      content: 'Does the 60-day grace period start from the last working day or the severance end date?',
      replies: [
        'It strictly starts from your last day of actual employment (when you stop providing services), regardless of severance pay.',
        'Do not count on severance dates. USCIS looks at the date your employment was officially terminated.',
        'Consult an immigration lawyer immediately to confirm your exact timeline based on your termination letter.'
      ]
    },
    {
      title: 'Can I start an LLC on H1B?',
      content: 'I know I can\'t work for it, but can I be a passive investor/owner of an LLC while on H1B?',
      replies: [
        'You can be a passive shareholder, but you absolutely cannot perform any work or management duties for the LLC.',
        'It is a very grey area. Even signing contracts or answering emails for the LLC can be considered unauthorized work.',
        'Talk to a lawyer. Usually, you need a citizen or green card holder to actually run the day-to-day operations.'
      ]
    },
    {
      title: 'PERM Audit timelines',
      content: 'My PERM was audited in September 2025. Anyone have recent timelines for audit approvals?',
      replies: [
        'Audits are taking around 8-10 months right now. It is a long wait.',
        'My friend got audited in July and just heard back last month. So expect about 9 months.',
        'Make sure your employer responds to the audit request thoroughly and promptly to avoid denial.'
      ]
    },
    {
      title: 'I-140 Approved, changing jobs',
      content: 'My I-140 was approved 4 months ago. Should I wait for 6 months before switching to keep the priority date safe?',
      replies: [
        'Yes! Wait until exactly 180 days have passed since the approval date. If you leave before, the employer can withdraw it and you lose the PD.',
        'It is highly recommended to wait the 180 days. It makes the I-140 portable and secure.',
        'Don\'t risk it for a new job. That priority date is gold. Wait the extra 2 months.'
      ]
    },
    {
      title: 'Consular processing vs Change of Status',
      content: 'Which is better when transitioning from L1 to H1B?',
      replies: [
        'Change of Status is generally preferred because you don\'t have to leave the country and get a visa stamp to start working on H1B.',
        'If you do Consular processing, you remain on L1 until you actually leave, get the H1B stamp, and re-enter.',
        'Change of Status is much smoother, assuming you don\'t have upcoming international travel plans.'
      ]
    },
    {
      title: 'H1B stamping dates availability',
      content: 'It seems impossible to find dates in India for Nov/Dec. Any tips for grabbing canceled slots?',
      replies: [
        'Join Telegram groups that alert when slots open up. But be careful not to log in too many times or your account gets locked.',
        'Check the portal around 11 PM to 2 AM IST. That\'s when bulk cancellations usually drop.',
        'Consider looking at other consulates like Kolkata or Delhi if Chennai/Hyderabad are full.'
      ]
    },
    {
      title: 'Wife on H4 wants to study',
      content: 'Can my spouse enroll in a master\'s program on an H4 visa, or does she need to switch to F1?',
      replies: [
        'She can study full-time on an H4 visa without any issues! The only downside is she cannot work on-campus or get OPT/CPT.',
        'Studying on H4 is perfectly fine and often qualifies for in-state tuition depending on the state.',
        'If she wants to do internships (CPT) or work after graduation (OPT), she MUST switch to F1 before graduating.'
      ]
    }
  ],
  'Indian Cooking': [
    {
      title: 'Perfect Soft Rotis every time',
      content: 'What is the secret to making rotis that stay soft for hours? Mine turn into papad.',
      replies: [
        'Use warm water and a little bit of oil while kneading. Let the dough rest for at least 30 minutes covered with a damp cloth.',
        'The tawa needs to be very hot. If you cook them on low heat, they dry out and become hard.',
        'Store them immediately in an insulated casserole lined with a paper towel or cotton cloth to trap the steam.'
      ]
    },
    {
      title: 'Authentic Butter Chicken at Home',
      content: 'I can never get that restaurant style smokey flavor. I use kasuri methi, what else am I missing?',
      replies: [
        'You need to use the "dhungar" method! Heat a piece of charcoal, place it in a small bowl in the curry, add ghee, and cover the pot for 5 mins.',
        'Make sure you are charring the marinated chicken in the oven or on a grill before adding it to the gravy.',
        'Restaurant gravies use a lot more butter and heavy cream than we dare to use at home. Also, blend the gravy until it is silky smooth.'
      ]
    },
    {
      title: 'Best substitutes for Kadai Masala',
      content: 'Living in a small town in US, can\'t find specific spices. Suggestions for making it from scratch?',
      replies: [
        'Dry roast coriander seeds, cumin seeds, dried red chilies, and black peppercorns, then grind them coarsely.',
        'You really just need whole coriander seeds lightly crushed. That gives the signature kadai flavor.',
        'If you have garam masala, add extra crushed coriander seeds and a bit of fennel powder. It comes close.'
      ]
    },
    {
      title: 'Instant Pot Biryani - Not mushy!',
      content: 'Every time I try making biryani in the IP, the rice breaks. What rice to water ratio do you use?',
      replies: [
        'I use exactly 1 cup rice to 1.25 cups water. 5 minutes on high pressure, then a 10-minute natural release.',
        'Make sure you are soaking the basmati rice for 30 minutes, then draining it completely before adding it.',
        'Layering is key. Put the meat/gravy at the bottom, rice on top, and do not stir it before pressure cooking.'
      ]
    },
    {
      title: 'Cast Iron vs Non-stick for Dosas',
      content: 'Is it really worth seasoning a cast iron tawa for dosas, or should I stick to my Teflon pan?',
      replies: [
        'Cast iron 100%. It gives that perfect, even, golden-brown crispiness that non-stick pans simply cannot achieve.',
        'Once properly seasoned, cast iron is virtually non-stick anyway. Just rub half an onion with oil on it before spreading the batter.',
        'I switched to a Lodge cast iron griddle last year and my dosas have never been better. Highly recommend.'
      ]
    },
    {
      title: 'Freezing Indian Curries',
      content: 'Which curries freeze well for meal prep? Does paneer get rubbery when frozen?',
      replies: [
        'Gravies like makhani, palak, and chana masala freeze beautifully. Paneer can get slightly crumbly, so freeze the gravy and add fresh paneer when reheating.',
        'Rajma and Dal Makhani actually taste better after being frozen and reheated because the flavors deepen.',
        'Avoid freezing dishes with lots of potatoes or coconut milk, as the texture changes significantly upon thawing.'
      ]
    },
    {
      title: 'Where to buy fresh curry leaves in Winter?',
      content: 'I live in the Midwest and my local Indian store stops carrying them in Jan. Any online options?',
      replies: [
        'I buy a huge batch in November, wash them, dry them completely, and freeze them in a ziplock bag. They last all winter!',
        'You can sometimes find them on Etsy or specialized Indian grocery delivery websites like Weee!',
        'Try growing a small curry leaf plant indoors with a grow light! It takes effort but is worth it.'
      ]
    },
    {
      title: 'Making Paneer from scratch - Milk type?',
      content: 'Should I use whole milk, half and half, or heavy cream for the softest paneer?',
      replies: [
        'Always use whole milk. If you want it extra rich, add a few tablespoons of heavy cream right before it boils.',
        'Do not use ultra-pasteurized milk; it won\'t curdle properly. Find regular pasteurized whole milk.',
        'When you add the lemon juice or vinegar, turn off the heat immediately. Boiling the curds makes the paneer rubbery.'
      ]
    },
    {
      title: 'Healthy alternatives for deep frying snacks',
      content: 'Has anyone successfully air-fried samosas or pakoras without them tasting dry?',
      replies: [
        'For air-fryer samosas, the pastry needs to have enough fat (moyen) kneaded into the dough. Brush them with oil halfway through.',
        'Pakoras are tricky in the air fryer because the batter drips. Try making them in a paniyaram/appe pan instead!',
        'Use frozen samosas from the Indian store in the air fryer. They already have oil in the crust and crisp up perfectly.'
      ]
    },
    {
      title: 'Best brand of Basmati Rice in USA',
      content: 'Royal, Daawat, or Tilda? Which one gives the longest, least sticky grains?',
      replies: [
        'Tilda is consistently the best for long, separate grains, especially for biryani. It is pricier but worth it.',
        'Daawat Traditional or Kohinoor Extra Long are my go-to choices for everyday cooking.',
        'Make sure you are buying "Aged" basmati. The older the rice, the less sticky it will be when cooked.'
      ]
    },
    {
      title: 'Idli batter not fermenting',
      content: 'It is freezing here in Boston. My batter has been sitting for 24 hours and nothing. Help!',
      replies: [
        'Turn your oven light on and put the batter inside. The heat from the light bulb is enough to keep it warm.',
        'Try using the "Yogurt" setting on your Instant Pot if you have one. It ferments batter perfectly in 10-12 hours.',
        'Add a handful of poha (flattened rice) when grinding the batter. It really helps kickstart fermentation in cold weather.'
      ]
    },
    {
      title: 'Using canned tomatoes vs fresh for gravy',
      content: 'Does using canned crushed tomatoes drastically change the taste of Punjabi gravies?',
      replies: [
        'Canned San Marzano tomatoes actually make BETTER gravies than fresh US winter tomatoes because they are picked at peak ripeness.',
        'I use canned all the time. Just make sure to cook the gravy down until the oil separates to remove the "raw" canned taste.',
        'Pureeing canned whole peeled tomatoes gives the best texture and deep red color for butter chicken.'
      ]
    },
    {
      title: 'How to make Ghee without burning it',
      content: 'I keep missing the sweet spot and end up with browned, burnt-tasting ghee. Tips?',
      replies: [
        'Once the butter melts and starts foaming, turn the heat down to the absolute lowest setting and don\'t leave the stove.',
        'Listen to the sound. It will crackle loudly as water boils off. When it goes quiet and foams a second time, it\'s done!',
        'Take it off the heat as soon as the milk solids at the bottom turn light golden brown. It will continue cooking from residual heat.'
      ]
    },
    {
      title: 'Vegetarian substitutes for chicken in curries',
      content: 'Besides paneer and tofu, what else soaks up Indian gravy flavors well?',
      replies: [
        'Soya chunks (Nutrela). Boil them with a little salt, squeeze out the water, and pan-fry them before adding to the curry.',
        'Jackfruit (Kathal) is amazing in spicy gravies. It has a very meaty texture.',
        'Try making koftas out of raw banana or bottle gourd (lauki). They are incredible in rich gravies.'
      ]
    },
    {
      title: 'Must-have Indian spices for beginners',
      content: 'My American friend wants to start cooking Indian food. What 5 spices should I gift her?',
      replies: [
        'Cumin seeds, Coriander powder, Turmeric, Garam Masala, and Kashmiri Red Chili powder (for color without too much heat).',
        'Add some whole spices too: green cardamom and cinnamon sticks make a huge difference in rice dishes.',
        'Get her a basic stainless steel masala dabba and fill it with the essentials. Best gift ever.'
      ]
    },
    {
      title: 'Pressure cooking Dal - time guide',
      content: 'How many whistles for Toor dal vs Chana dal in a traditional pressure cooker?',
      replies: [
        'If soaked for 30 mins: Toor dal takes about 3-4 whistles on medium heat. Chana dal takes 5-6 whistles.',
        'It also depends on your water quality. Hard water makes dal take much longer to cook.',
        'I usually do 1 whistle on high, then simmer on low for 10 minutes. Works perfectly for most dals without them overflowing.'
      ]
    },
    {
      title: 'Secrets to a thick, creamy Dal Makhani',
      content: 'Mine always tastes watery compared to the dhaba style. Should I add more cream?',
      replies: [
        'The secret is slow cooking. Simmer it on low heat for at least 2-3 hours, mashing some of the dal against the side of the pot.',
        'It is not just cream; use plenty of butter. Dhabas use an obscene amount of butter.',
        'Soak the urad dal overnight, and make sure you wash it thoroughly until the water runs clear to remove the sliminess.'
      ]
    },
    {
      title: 'Storing spices to retain flavor',
      content: 'Do you guys keep your extra spices in the fridge or pantry? They seem to lose smell fast.',
      replies: [
        'I keep my bulk spices in airtight glass jars in the freezer. I only keep a month\'s supply in the pantry masala dabba.',
        'Keep them away from heat and light. Don\'t store your spice rack right next to or above the stove.',
        'Buy whole spices and grind them in small batches using a coffee grinder. Ground spices lose flavor much faster.'
      ]
    },
    {
      title: 'Making Jalebi at home - disaster',
      content: 'They turn out flat and soggy. What is the right consistency for the batter?',
      replies: [
        'The batter needs to be thick enough to hold its shape when piped, like pancake batter. Also, it must be fermented well.',
        'The frying oil needs to be moderately hot. If it is too cold, they absorb oil and get soggy. Too hot, and they don\'t cook inside.',
        'Make sure the sugar syrup is just warm, not boiling hot, when you drop the fried jalebis in.'
      ]
    },
    {
      title: 'Quick 15-minute Indian dinners',
      content: 'Both of us work late. Need super quick, healthy Indian dinner ideas.',
      replies: [
        'Poha or Upma are great for quick dinners. Add lots of veggies and peanuts for protein.',
        'Egg bhurji with parathas (store-bought frozen ones) takes 10 minutes and is super filling.',
        'Keep a base onion-tomato masala frozen in ice cube trays. Just pop a few cubes, add veggies/paneer, and you have curry in 10 mins.'
      ]
    }
  ],
  'Real estate in USA': [
    {
      title: 'Buying vs Renting in 2026',
      content: 'With interest rates still hovering around 6.5%, does it make sense to buy a house now or wait?',
      replies: [
        'Marry the house, date the rate. If you find a home you love and can afford the monthly payment, buy it and refinance later.',
        'If you plan to stay in the area for at least 5-7 years, buying almost always wins due to equity buildup and tax deductions.',
        'Rent is the maximum you will pay every month. A mortgage is the minimum (repairs, taxes, etc.). Make sure you have a solid emergency fund.'
      ]
    },
    {
      title: 'Down payment strategies for F1 to H1B',
      content: 'How did you guys save up for your first 20% down payment while dealing with student loans?',
      replies: [
        'You don\'t need 20% down! Many conventional loans allow 5% or 10% down. The PMI is often cheaper than waiting years to save 20%.',
        'We lived like college students for 3 years after getting jobs. No new cars, minimal vacations. It is a sacrifice.',
        'Company ESPP and RSU vests helped immensely. We saved our base salary and used bonuses/stock for the down payment.'
      ]
    },
    {
      title: 'Best States for Real Estate Investment',
      content: 'Looking for high rental yield areas. Is Texas still good, or are property taxes eating the profits?',
      replies: [
        'Texas property taxes are very high (2.5-3%). Look into the Midwest or North Carolina for better cash flow ratios.',
        'It depends on the city. Austin is too expensive for good yields now, but parts of Houston or San Antonio still work.',
        'Always calculate the numbers factoring in a 10% property management fee and 1-month vacancy rate.'
      ]
    },
    {
      title: 'New Construction vs Existing Home',
      content: 'First-time buyer here. Is the premium for a new build worth avoiding the maintenance of an older home?',
      replies: [
        'New builds have warranties, which is great for peace of mind. But you will spend a lot on landscaping, blinds, and appliances.',
        'Older homes usually have larger lots and established trees. New builds are often packed close together.',
        'Even with a new build, get an independent inspection! Builders cut corners all the time.'
      ]
    },
    {
      title: 'H1B Visa constraint on Mortgages',
      content: 'Do lenders give worse rates to H1B holders? Had a bad experience with a local bank.',
      replies: [
        'No, Fannie Mae and Freddie Mac guidelines treat H1B workers exactly the same as citizens. Find a different lender.',
        'Stick to big national lenders (Chase, Wells Fargo) or specialized brokers. They deal with H1B loans every day without issues.',
        'The only requirement is proving you have a valid visa and SSN. Rates should be identical.'
      ]
    },
    {
      title: 'House hacking a Duplex',
      content: 'Anyone successfully bought a multi-family unit and rented out the other half to cover the mortgage?',
      replies: [
        'Yes! I bought a duplex using an FHA loan (3.5% down). The rent from the other side covers 70% of my mortgage.',
        'It is a great strategy, but remember you are now a landlord living next to your tenants. Set strong boundaries.',
        'Make sure the area zoning allows it and run the numbers conservatively.'
      ]
    },
    {
      title: 'Property Taxes in New Jersey',
      content: 'Found a great house but taxes are $15k/year. Does the property value appreciation offset this?',
      replies: [
        'NJ taxes are notorious. You get excellent public schools, which drives up property values, but you must budget for that $1200/mo tax bill.',
        'Appreciation is never guaranteed. Buy the house if you love the area and schools, not just as an investment.',
        'Check the historical tax increases for that town. Some towns reassess frequently.'
      ]
    },
    {
      title: 'HOA fees are out of control',
      content: 'Looking at townhomes and HOAs are $400+. What exactly does this cover and is it negotiable?',
      replies: [
        'HOA fees are never negotiable. They usually cover exterior maintenance (roofs, siding), landscaping, snow removal, and amenities.',
        'Always ask for the HOA\'s "Reserve Study" before buying. High fees often mean they are preparing for major repairs or are poorly managed.',
        'I avoid HOAs entirely. I prefer managing my own repairs rather than paying a board to dictate rules.'
      ]
    },
    {
      title: 'Inspection revealed old roof',
      content: 'The seller won\'t budge on price, but the roof is 20 years old. Dealbreaker?',
      replies: [
        'If you can\'t afford a $10k-$15k roof replacement in the next year, walk away. Insurance might even drop you if it\'s too old.',
        'Get a roofer to give you a formal quote and present it to the seller. If they still refuse, be prepared to walk.',
        'Sometimes sellers won\'t lower the price but will offer closing cost credits instead. Ask your realtor.'
      ]
    },
    {
      title: 'Closing costs caught me off guard',
      content: 'Why are closing costs so high? Can I roll them into the loan or ask the seller to pay?',
      replies: [
        'Closing costs are usually 2-5% of the loan amount (taxes, title fees, origination). You can ask the seller for a credit, but in a competitive market, they will likely say no.',
        'Some lenders allow you to roll them into the loan by taking a slightly higher interest rate (lender credits).',
        'Make sure to shop around for title insurance; you don\'t have to use the company the lender suggests.'
      ]
    },
    {
      title: 'FHA vs Conventional Loan',
      content: 'I only have 5% down. Is the PMI on a conventional loan better than going the FHA route?',
      replies: [
        'If you have a good credit score (740+), Conventional 5% down is almost always better because PMI eventually falls off. FHA mortgage insurance is for the life of the loan.',
        'FHA has stricter appraisal requirements (they check for peeling paint, safety issues, etc.), which can make sellers hesitant to accept your offer.',
        'FHA is great if your credit score is lower or if you have a high debt-to-income ratio.'
      ]
    },
    {
      title: 'Buying a house unseen',
      content: 'Moving cross-country for a job. Is it crazy to buy a house just based on virtual tours and inspections?',
      replies: [
        'I did it! We relied heavily on our realtor to do FaceTime tours and point out smells or neighborhood noise that video doesn\'t catch.',
        'It is risky. I would highly recommend renting an Airbnb for a month first to explore neighborhoods in person.',
        'If you do it, make sure you have a rock-solid inspection contingency so you can back out if the inspector finds major issues.'
      ]
    },
    {
      title: 'Tips for negotiating with builders',
      content: 'Looking at a new Toll Brothers community. Can I negotiate the base price or just upgrades?',
      replies: [
        'Builders almost never negotiate base price because it messes up the comparables for the rest of the neighborhood.',
        'Ask for design center credits or for them to pay your closing costs if you use their preferred lender.',
        'If they have "spec homes" (inventory homes already built), they are much more willing to negotiate to get them off their books.'
      ]
    },
    {
      title: 'Should I pay points to lower rate?',
      content: 'Lender is offering to let me buy down the rate by 0.5% for $4k. Worth it?',
      replies: [
        'Calculate the break-even point. Divide the $4000 by the monthly savings. If it takes 6 years to break even and you plan to move in 5, don\'t do it.',
        'If you think rates will drop and you will refinance in a year or two, paying points is a waste of money.',
        'Ask your lender to show you the math on a "temporary buydown" (like a 2-1 buydown) paid by the seller instead.'
      ]
    },
    {
      title: 'Managing rental property remotely',
      content: 'I live in CA but want to invest in the Midwest. Are property management companies reliable?',
      replies: [
        'A good property manager is worth their weight in gold. Interview at least 3, check their reviews, and understand their fee structure (usually 8-10% + leasing fee).',
        'It eats into your cash flow, but it is necessary for remote investing. Make sure they have an online portal for maintenance requests.',
        'Ask them how they handle evictions and what their average vacancy rate is.'
      ]
    },
    {
      title: 'Appraisal came in lower than offer',
      content: 'Offered $500k, appraisal is $480k. Do I have to make up the $20k difference in cash?',
      replies: [
        'Yes, the bank will only lend based on the $480k value. You either bring $20k cash, renegotiate with the seller to lower the price, or walk away.',
        'Have your realtor contest the appraisal by providing better comparables if they think the appraiser missed something.',
        'In a hot market, sellers won\'t budge. In a cool market, they might meet you halfway at $490k.'
      ]
    },
    {
      title: 'Best timeline to buy a house',
      content: 'Is the spring market really the best time, or should I wait for winter when there\'s less competition?',
      replies: [
        'Spring has the most inventory (choices), but also the highest competition and prices. Winter has fewer homes but desperate sellers.',
        'Don\'t try to time the market. Buy when you are financially ready and plan to stay for a long time.',
        'If you have school-aged kids, you want to buy in spring/summer to move before the school year starts.'
      ]
    },
    {
      title: 'Getting pre-approved - impact on credit',
      content: 'If I shop around with 3 different lenders, will it tank my credit score?',
      replies: [
        'No, credit bureaus group all mortgage inquiries within a 14 to 45-day window as a single hard pull. Shop around!',
        'A hard pull only drops your score by a few points anyway. Finding a lower interest rate saves you tens of thousands of dollars.',
        'Just don\'t apply for a credit card or auto loan during the mortgage process.'
      ]
    },
    {
      title: 'Finished basement vs Unfinished',
      content: 'Does a finished basement actually add significant resale value, or should I just buy unfinished and do it later?',
      replies: [
        'It adds value, but rarely a 1:1 return on investment. Buying an unfinished basement lets you customize it to your needs (home theater, gym, etc.).',
        'Make sure the unfinished basement has proper ceiling height and rough-in plumbing for a future bathroom.',
        'Check local building codes; finishing a basement later requires permits and can be an expensive hassle.'
      ]
    },
    {
      title: 'Vastu Shastra considerations when buying',
      content: 'How strictly do you guys follow Vastu? Finding a North/East facing house is proving difficult.',
      replies: [
        'We compromised. We made sure there were no major flaws (like a South-facing main door), but didn\'t stress about the perfect layout.',
        'In the US, it is almost impossible to find a 100% Vastu compliant house in a good school district within budget. Prioritize the schools and location.',
        'You can use remedies (like mirrors or specific plants) to correct minor Vastu doshas. Don\'t lose a great house over it.'
      ]
    }
  ],
  'New to USA': [
    {
      title: 'Building Credit Score from Scratch',
      content: 'Just moved 2 months ago. What are the best starter credit cards for Desis with no US credit history?',
      replies: [
        'If you had an Amex in India, use their Global Card Transfer program. They will use your Indian credit history to issue a US card!',
        'Discover IT Student or Capital One Platinum are very friendly to newcomers with no SSN or credit history.',
        'Go to the bank where your salary is deposited (Chase, BoA) and ask for a secured credit card. You put down a deposit which becomes your credit limit.'
      ]
    },
    {
      title: 'Driving License in New Jersey',
      content: 'Tips for passing the knowledge test and road test? The parallel parking rules confuse me.',
      replies: [
        'For the road test in NJ, practice parallel parking between cones. They are very strict about you not hitting the cones.',
        'Read the MVC manual cover to cover. Many questions are tricky scenario-based questions about fines and points.',
        'Make sure the car you take to the road test has a handbrake accessible to the examiner in the middle console.'
      ]
    },
    {
      title: 'Winter Clothing Essentials',
      content: 'Moving from Mumbai to Chicago. What brands should I look for? Are Canada Goose jackets actually worth it?',
      replies: [
        'Canada Goose is overkill and a status symbol. Get a good North Face, Columbia, or Eddie Bauer parka for half the price.',
        'Layering is key. Buy good quality thermal innerwear (Uniqlo Heattech is amazing) and wool socks.',
        'Don\'t forget waterproof winter boots. The snow turns into dirty slush very quickly, and wet feet will ruin your day.'
      ]
    },
    {
      title: 'Understanding Health Insurance',
      content: 'Deductibles, Co-pays, Out-of-pocket maximums? Can someone explain this in simple terms?',
      replies: [
        'Deductible: What you pay out of pocket before insurance starts paying. Co-pay: Flat fee you pay for a doctor visit. Out-of-pocket Max: The absolute maximum you will pay in a year; after this, insurance pays 100%.',
        'Also understand In-Network vs Out-of-Network. Always try to go to In-Network doctors, or you will pay a fortune.',
        'If you are young and healthy, a High Deductible Health Plan (HDHP) with an HSA (Health Savings Account) is a great way to save taxes.'
      ]
    },
    {
      title: 'Tipping culture in the US',
      content: 'Is 20% really the minimum now? Who exactly am I supposed to tip? (Plumbers, delivery guys, takeout?)',
      replies: [
        'Sit-down restaurants: 18-20% is standard. Takeout: 0% is fine, maybe $1-$2 if it\'s a big order. Delivery drivers (DoorDash): 15-20%.',
        'You do not need to tip plumbers, electricians, or anyone providing a professional trade service.',
        'Tipping culture has gotten out of hand (tip screens at coffee shops). Don\'t feel pressured to tip for counter service.'
      ]
    },
    {
      title: 'Best phone plan for an individual',
      content: 'AT&T and Verizon seem expensive for 1 line. Are MVNOs like Mint Mobile or Visible reliable?',
      replies: [
        'Mint Mobile is fantastic. It uses T-Mobile\'s network. If you pay for a year upfront, it is extremely cheap.',
        'Visible uses Verizon\'s network and has truly unlimited data. Very reliable in my experience.',
        'If you have family or friends here, try to join their family plan. Postpaid lines get very cheap when you have 4+ people.'
      ]
    },
    {
      title: 'Buying a used car - Dealership vs Private',
      content: 'Is it safer to buy from CarMax/dealerships, or is Facebook Marketplace okay if I get a mechanic to check it?',
      replies: [
        'CarMax is hassle-free but you pay a premium. Facebook Marketplace has better deals but requires diligence. Always get a Pre-Purchase Inspection (PPI) from an independent mechanic.',
        'Never buy a car without a clean title (avoid salvage/rebuilt titles) and always check the Carfax report.',
        'Dealerships will try to sell you expensive extended warranties. You usually don\'t need them for reliable brands like Toyota or Honda.'
      ]
    },
    {
      title: 'How to socialize and make friends',
      content: 'Working remotely and finding it hard to meet people outside of my immediate desi circle. Advice?',
      replies: [
        'Join local Meetup groups based on your hobbies (hiking, board games, tech). It is the easiest way to meet locals.',
        'Sign up for recreational sports leagues (kickball, volleyball). They are usually very casual and focused on socializing.',
        'Volunteer at local animal shelters or food banks. Great way to meet kind, community-minded people.'
      ]
    },
    {
      title: 'Sending money to India',
      content: 'Which app has the best exchange rates and lowest fees right now? Remitly, Xoom, or Wise?',
      replies: [
        'Wise (formerly TransferWise) consistently offers the mid-market exchange rate with transparent, low fees.',
        'Remitly is good for your first transfer because they give a promotional rate, but Wise is better long-term.',
        'Check out Western Union online; sometimes their rates are surprisingly competitive.'
      ]
    },
    {
      title: 'Understanding the 401(k) match',
      content: 'My company matches 50% up to 6%. Does this mean I should put in 6% or 12%?',
      replies: [
        'It means if you put in 6% of your salary, they will put in 3% (half of your 6%). You should absolutely contribute at least 6% to get the free money.',
        'Always contribute up to the match. It is an immediate 50% return on your investment.',
        'If you can afford it, try to max out your 401k completely ($23k limit for 2024), but at the very least, get the match.'
      ]
    },
    {
      title: 'Groceries - Costco vs Local Stores',
      content: 'As a single person, is a Costco membership worth it, or will things just spoil?',
      replies: [
        'For fresh produce, it will likely spoil. But for pantry staples, toilet paper, laundry detergent, and gas, it pays for itself quickly.',
        'If you eat eggs and chicken breasts, buying them in bulk at Costco and freezing them is very cost-effective.',
        'Share a membership with a friend or roommate if you can!'
      ]
    },
    {
      title: 'Navigating small talk at work',
      content: 'I feel awkward when colleagues ask "How was your weekend?". How much detail is appropriate?',
      replies: [
        'Keep it brief and positive. "It was good, relaxing. I checked out a new restaurant. How was yours?" is perfect.',
        'They are just being polite, they don\'t need a full itinerary. Find common ground like sports or movies.',
        'Avoid talking about religion, politics, or deep personal issues at work.'
      ]
    },
    {
      title: 'Apartment hunting red flags',
      content: 'What should I look out for when signing a lease? Are "luxury apartments" actually better?',
      replies: [
        'Read Google reviews carefully. Ignore the 1-star reviews about parking, look for mentions of roaches, rodents, or unhelpful management.',
        '"Luxury" just means it was built in the last 15 years and has stainless steel appliances. Construction quality is often poor (thin walls).',
        'Always tour the exact unit you will be renting, not just the model unit.'
      ]
    },
    {
      title: 'Getting a SSN without a job',
      content: 'I am on an F1 visa. Can I get an SSN just by getting a letter for an on-campus job?',
      replies: [
        'Yes, you need a job offer letter from an on-campus employer and a signature from your DSO to apply for an SSN.',
        'You cannot get an SSN on F1 without an employment offer (on-campus, CPT, or OPT).',
        'Even a 5-hour/week library job will get you the SSN. Apply for everything on campus!'
      ]
    },
    {
      title: 'Public transport vs Buying a car',
      content: 'Moving to Austin, TX. Can I survive with just buses and Uber, or is a car absolutely necessary?',
      replies: [
        'In Texas, a car is practically a requirement. Public transit outside of a few major downtown corridors is very unreliable.',
        'You can survive for a few months with Uber and grocery delivery, but the cost will eventually exceed a car payment.',
        'Buy a reliable used Honda or Toyota. The freedom and convenience are worth it.'
      ]
    },
    {
      title: 'Cultural shocks you faced',
      content: 'What was the biggest cultural shock you experienced in your first year here?',
      replies: [
        'How early everything closes! By 9 PM, the streets are empty and most stores are shut.',
        'The portion sizes at restaurants are massive. I always end up taking half my meal home in a box.',
        'People smile and say "hi" to strangers on the street. It took some getting used to!'
      ]
    },
    {
      title: 'Filing taxes for the first time',
      content: 'Should I use TurboTax, Sprintax, or hire a CPA? I only have a W2 and some savings interest.',
      replies: [
        'If you are on F1 or H1B (first year), you might be a Non-Resident Alien for tax purposes. TurboTax CANNOT handle 1040-NR forms. Use Sprintax or Glacier.',
        'Once you pass the Substantial Presence Test and become a Resident Alien, FreeTaxUSA or TurboTax work perfectly fine.',
        'You don\'t need a CPA for a simple W2 unless you have complicated foreign investments.'
      ]
    },
    {
      title: 'Best banks for checking accounts',
      content: 'Chase, BoA, or an online bank like Ally? Looking for no maintenance fees.',
      replies: [
        'Capital One 360 is great. It has no fees, no minimums, and a decent network of ATMs.',
        'Chase is very convenient for branches, and it\'s easy to waive the fee if you set up direct deposit for your salary.',
        'Charles Schwab checking is amazing if you travel internationally because they refund ALL ATM fees worldwide.'
      ]
    },
    {
      title: 'What to pack from India',
      content: 'Coming for my Masters next month. Aside from a pressure cooker and spices, what is essential?',
      replies: [
        'Pack a universal travel adapter. Also, bring some basic medicines (Crocin, Digene) as buying them here can be confusing initially.',
        'Don\'t pack too many winter clothes; buy your heavy jackets here as they are designed for the local weather.',
        'Bring traditional clothes (kurta/lehenga) for Diwali and university cultural events!'
      ]
    },
    {
      title: 'Dealing with homesickness',
      content: 'It has been 6 months and I still miss home terribly. How long does this feeling last?',
      replies: [
        'It gets better after the first year once you establish a routine and make friends. Hang in there!',
        'Stay busy. Join clubs, explore the city, and cook comfort food. Video calling home too much can actually make it worse.',
        'It is totally normal. Find a local Indian grocery store or restaurant to get a taste of home when you feel down.'
      ]
    }
  ],
  'About Studies': [
    {
      title: 'MS in Data Science vs CS',
      content: 'Which one has better job prospects in the current market? Seeing a lot of layoffs in tech.',
      replies: [
        'CS is more versatile. You can apply for software engineering, data engineering, and backend roles. Data Science is getting saturated with entry-level folks.',
        'If you love math and statistics, do DS. If you want a safer bet for getting a job, stick to CS.',
        'Many DS jobs actually require a PhD or heavy research experience. A generic MS in DS might limit your options.'
      ]
    },
    {
      title: 'Scholarship opportunities for Indian students',
      content: 'Are there any specific foundations or university-specific grants that help with tuition?',
      replies: [
        'Look into JN Tata Endowment and Aga Khan Foundation scholarships before leaving India.',
        'Most public US universities don\'t give need-based aid to international students. Try aiming for merit-based department fellowships.',
        'Getting a TA/RA position is realistically the most common way to get tuition waivers.'
      ]
    },
    {
      title: 'Part-time jobs on campus',
      content: 'How hard is it to find a TA/RA position in the first semester? Do professors prefer 2nd-year students?',
      replies: [
        'It is very hard in the first semester because professors don\'t know you. They prefer students who have taken their class and got an A.',
        'Start applying for dining hall, library, or IT helpdesk jobs as soon as you arrive. They pay less but give you an SSN.',
        'Email professors whose research aligns with your past experience before you even arrive in the US.'
      ]
    },
    {
      title: 'Is a top 50 university worth the debt?',
      content: 'Got an admit from USC (expensive) and UT Dallas (cheaper). Does the university tag matter for SWE jobs?',
      replies: [
        'For Software Engineering, Leetcode and your personal projects matter way more than the university name. Save your money and go to UTD.',
        'USC has an incredible alumni network, especially in California, but the debt will cause immense stress. Think carefully.',
        'After your first job, literally no one cares where you went to school. Take the cheaper option.'
      ]
    },
    {
      title: 'OPT and Unemployment days',
      content: 'How strictly are the 90 days of unemployment tracked? Does volunteering count to stop the clock?',
      replies: [
        'Yes, unpaid volunteering related to your field of study for at least 20 hours a week stops the clock. You MUST report it to your DSO.',
        'They are tracked strictly through the SEVP portal. If you exceed 90 days, your SEVIS record is automatically terminated.',
        'Have a professor you can do unpaid research for as a backup plan to stop the clock if you don\'t find a job immediately.'
      ]
    },
    {
      title: 'CPT rules for summer internships',
      content: 'Can I do a full-time internship on CPT in my first summer if my program requires it?',
      replies: [
        'Generally, you must be enrolled for one full academic year (two semesters) before you are eligible for CPT.',
        'There is an exception if your graduate program requires an internship in the first year to graduate, but check carefully with your DSO.',
        'Remember that if you use 12 months or more of full-time CPT, you lose your OPT eligibility entirely!'
      ]
    },
    {
      title: 'Best student housing options',
      content: 'On-campus dorms vs Off-campus apartments. Which is more cost-effective and better for networking?',
      replies: [
        'Off-campus apartments shared with 2-3 roommates are almost always significantly cheaper than on-campus graduate housing.',
        'On-campus is closer to classes, but you lack privacy and kitchen facilities are often shared.',
        'Use Facebook housing groups for your university to find seniors looking for roommates off-campus.'
      ]
    },
    {
      title: 'Dealing with academic integrity policies',
      content: 'A friend shared code and got flagged by MOSS. How serious is an academic hearing?',
      replies: [
        'Extremely serious. US universities have zero tolerance for plagiarism. They could fail the course or face expulsion.',
        'Tell your friend to be honest during the hearing. Lying makes it 10x worse. A first offense might result in a zero on the assignment.',
        'Never, ever share code. Even looking at someone else\'s logic can lead to structural similarities that MOSS will catch.'
      ]
    },
    {
      title: 'Networking effectively at career fairs',
      content: 'Recruiters just tell me to apply online. How do I actually stand out and get an interview?',
      replies: [
        'Skip the huge queues for FAANG. Go talk to mid-size companies and startups; the people at the booth are often actual engineers who can interview you.',
        'Have an "elevator pitch" ready. Don\'t just hand them a resume. Say "I saw your company uses React, I built X using it.".',
        'Ask for their LinkedIn and follow up the next day referencing a specific point from your conversation.'
      ]
    },
    {
      title: 'MBA vs MS for Product Management',
      content: 'I have 3 years of work ex in India. Should I go for an MBA or an MS in Engineering Management?',
      replies: [
        'An MBA from a top 20 school is the best path for PM. MEM degrees are often treated like a diluted MS CS.',
        'If you want to be a Technical PM at a tech company, an MS CS with a focus on product might be better than both.',
        'MBA is very expensive and finding sponsorship as an international student for non-technical roles is incredibly difficult.'
      ]
    },
    {
      title: 'Day 1 CPT Universities - Risks',
      content: 'My H1B wasn\'t picked and my OPT is expiring. Are Day 1 CPT universities safe, or is it a huge red flag for USCIS?',
      replies: [
        'It is a known grey area. Expect intense scrutiny (RFEs) when you eventually apply for an H1B or Green Card.',
        'If you go this route, you MUST attend all classes, keep every syllabus, homework, and tuition receipt to prove it was a real degree.',
        'It is a lifeline for many, but choose a reputable non-profit university, not a known visa mill.'
      ]
    },
    {
      title: 'Taking out loans from Indian banks vs US',
      content: 'Prodigy Finance vs SBI Education Loan. Which ends up being cheaper in the long run?',
      replies: [
        'SBI is significantly cheaper if you have property to offer as collateral. Prodigy charges very high interest rates (10-12%+).',
        'Prodigy is easier and faster since it requires no collateral or co-signer, but the interest compounds heavily.',
        'You can refinance your Prodigy loan with a US bank (like SoFi or Earnest) once you start working to drop the rate.'
      ]
    },
    {
      title: 'Publishing papers during MS',
      content: 'Does publishing a paper significantly improve chances of getting hired, or is it only good for PhD apps?',
      replies: [
        'For general software engineering, nobody cares about papers. Open source contributions or complex projects matter more.',
        'If you are aiming for Machine Learning or Research Scientist roles at big tech, papers at top conferences (NeurIPS, CVPR) are highly valued.',
        'It helps build a great relationship with a professor, which might lead to an RA position and tuition waiver.'
      ]
    },
    {
      title: 'Managing coursework and Leetcode',
      content: 'How do you balance 3 heavy CS courses while doing 2 hours of Leetcode every day?',
      replies: [
        'Treat job hunting as your 4th course. Block out time on your calendar specifically for Leetcode and stick to it.',
        'Pick easier electives in your first semester so you have time to prep for summer internship interviews.',
        'Do Leetcode first thing in the morning when your brain is fresh. Coursework can fill the rest of the day.'
      ]
    },
    {
      title: 'Is it possible to finish MS in 1.5 years?',
      content: 'Want to save on tuition. Is taking 4 courses a semester manageable or academic suicide?',
      replies: [
        '4 heavy CS courses is academic suicide. Try doing 3-3-4 if you want to finish early, or take courses over the summer.',
        'Many people finish in 1.5 years, but it leaves very little time for networking, projects, or interview prep.',
        'Check if your university allows you to count an internship or a capstone project as credits.'
      ]
    },
    {
      title: 'Changing majors after reaching US',
      content: 'Got admitted for Electrical Eng but want to switch to Computer Science. Is this allowed?',
      replies: [
        'It depends entirely on the university. Some allow it easily if your GPA is high, others make you formally re-apply to the CS department.',
        'Talk to the academic advisor immediately. The CS department is usually very crowded, so it might be difficult.',
        'Make sure the change doesn\'t affect your F1 visa status; your DSO must issue a new I-20 with the updated major.'
      ]
    },
    {
      title: 'The F1 Visa Interview experience',
      content: 'My interview is next week. Do they still reject F1 visas if you show an education loan?',
      replies: [
        'No, an education loan from a reputable bank is actually a strong indicator that you are a serious student.',
        'The main reason for rejection is failing to show strong ties to your home country. Be prepared to explain why you will return after graduation.',
        'Keep your answers concise and confident. Don\'t volunteer extra information unless asked.'
      ]
    },
    {
      title: 'Health insurance for international students',
      content: 'The university plan is $3000/year. Are there cheaper external alternatives that waive the requirement?',
      replies: [
        'Look into ISO or PSI Health Insurance. They have plans specifically designed to meet university waiver requirements for much cheaper.',
        'Be careful! Cheaper plans often have massive deductibles or poor coverage. If you get sick, you could owe thousands.',
        'Check the exact waiver criteria on your university\'s website before buying an external plan to ensure they accept it.'
      ]
    },
    {
      title: 'Getting recommendation letters from US professors',
      content: 'How do you build a relationship with a professor in a class of 200 students?',
      replies: [
        'Go to office hours consistently. Ask intelligent questions about the lectures or related research.',
        'Sit in the front row, participate in class, and do exceptionally well on exams.',
        'Ask to do an independent study or a small side project under their guidance.'
      ]
    },
    {
      title: 'What happens if you fail a course?',
      content: 'Does failing a course affect F1 visa status or OPT eligibility?',
      replies: [
        'As long as your overall GPA stays above the required minimum (usually 3.0), your visa is fine. But you may be put on academic probation.',
        'If you drop below full-time enrollment status because you failed or withdrew from a class without DSO approval, your visa can be terminated.',
        'Retake the course immediately. It costs money, but it will fix your GPA.'
      ]
    }
  ],
  'Kids': [
    {
      title: 'Teaching Marathi/Hindi to kids in US',
      content: 'How do you keep the native language alive at home when they speak English everywhere else?',
      replies: [
        'We strictly enforce a "No English at home" rule. If they want something, they have to ask in our language.',
        'Watch cartoons and movies from back home. Exposure to the media really helps them pick up vocabulary naturally.',
        'The One-Parent-One-Language method works well if you have a mixed household. Consistency is key.'
      ]
    },
    {
      title: 'Best extracurriculars for middle schoolers',
      content: 'Looking for recommendations. Are robotics clubs better for college apps than sports?',
      replies: [
        'Colleges look for passion and leadership, not a specific activity. If they love robotics, great. If they love soccer and become team captain, also great.',
        'Debate club and Model UN are fantastic for building confidence and public speaking skills.',
        'Don\'t overschedule them. Let them try a few things and pick one or two they actually enjoy.'
      ]
    },
    {
      title: 'Managing screen time for toddlers',
      content: 'How much is too much? What educational apps do you actually recommend?',
      replies: [
        'The AAP recommends zero screen time before 18 months, and max 1 hour of high-quality programming for ages 2-5. We stick to PBS Kids.',
        'Khan Academy Kids is completely free and fantastic for learning letters and numbers.',
        'We try to focus on interactive screen time (like video calling grandparents) rather than passive watching.'
      ]
    },
    {
      title: 'Navigating the public school system',
      content: 'Can someone explain the difference between Magnet, Charter, and regular public schools?',
      replies: [
        'Magnet schools have specific focuses (STEM, Arts) and usually require testing to get in. They are public.',
        'Charter schools are publicly funded but run independently. They have more flexibility in curriculum but quality varies wildly.',
        'Regular public schools depend entirely on your zip code. Always check GreatSchools ratings before buying a house.'
      ]
    },
    {
      title: '529 College Savings Plans',
      content: 'When should we start investing in a 529 plan? Is it worth it if my child decides not to go to college?',
      replies: [
        'Start as soon as they are born! The tax-free growth over 18 years is massive.',
        'If they don\'t go to college, you can transfer the beneficiary to another family member, or now (with new rules) roll some of it into a Roth IRA for them!',
        'Check if your state offers a tax deduction for contributing to their specific 529 plan.'
      ]
    },
    {
      title: 'Dealing with bullying in school',
      content: 'My 8-year-old is being teased for his Indian lunches. How should I handle this with the teacher?',
      replies: [
        'Speak to the teacher privately. Ask if they can do a lesson on different cultures and foods to normalize it.',
        'Unfortunately, kids can be mean. We eventually switched to packing sandwiches and saved Indian food for dinner.',
        'Empower your child to respond confidently. Tell them to say, "It smells different because of spices, and it tastes amazing."'
      ]
    },
    {
      title: 'Kumon vs Mathnasium',
      content: 'Which tutoring center is better for a child who is struggling with math fundamentals?',
      replies: [
        'Kumon is heavy on repetitive drills and speed. Good for calculation speed but can be boring.',
        'Mathnasium focuses more on conceptual understanding and explaining *why* math works. Usually better for kids who are struggling.',
        'If you have the time, Khan Academy at home is free and highly effective.'
      ]
    },
    {
      title: 'Planning a trip to India with a baby',
      content: 'Taking my 1-year-old on a 20-hour flight. Drop your best survival tips please!',
      replies: [
        'Request a bassinet seat immediately after booking. It is a lifesaver.',
        'Feed or offer a pacifier during takeoff and landing to help their ears pop.',
        'Bring lots of new, cheap toys wrapped in paper. Unwrapping them kills time and keeps them distracted.'
      ]
    },
    {
      title: 'Finding good pediatricians',
      content: 'What questions should I ask when interviewing a new pediatrician for my newborn?',
      replies: [
        'Ask about their policy on same-day sick visits and whether they have an after-hours triage nurse line.',
        'Make sure their views on vaccinations and antibiotics align with yours.',
        'Check if the waiting room has separate "sick" and "well" sections to avoid catching germs during routine checkups.'
      ]
    },
    {
      title: 'Introducing spicy food to toddlers',
      content: 'At what age did you start adding regular Indian spices to your child\'s meals?',
      replies: [
        'We started adding mild spices (turmeric, cumin, coriander) around 8-9 months. Just avoid salt and chili powder until after age 1.',
        'Offer them a bland version of your meal, but let them try a tiny bit of your spiced food if they show interest.',
        'Mix a tiny bit of mild curry into yogurt or rice to dilute the heat initially.'
      ]
    },
    {
      title: 'Public school vs Private school',
      content: 'Is private school worth the $30k/year tuition if we live in a decent public school district?',
      replies: [
        'If your public school is rated 8/10 or higher, save that $30k/year and put it in a 529 plan or index fund for them.',
        'Private schools offer smaller class sizes and more personalized attention. Worth it if your child has specific learning needs.',
        'A strong family foundation and involved parents matter more than private vs public.'
      ]
    },
    {
      title: 'Celebrating Indian festivals in the US',
      content: 'How do you make Diwali and Holi special for kids when it is a regular working day here?',
      replies: [
        'We take the day off work! Decorate the house, cook a feast, and invite friends over for dinner.',
        'Take treats or small gifts to their classroom (if the school allows) to share the culture with their friends.',
        'Join local Indian associations. They usually organize big weekend celebrations for major festivals.'
      ]
    },
    {
      title: 'Balancing classical arts and American sports',
      content: 'My daughter does Bharatanatyam and soccer, but schedules are clashing. How do you prioritize?',
      replies: [
        'Ask *her* what she prefers. Forcing classical arts often leads to resentment as they get older.',
        'We had to drop sports in middle school because dance required too much commitment. It is a tough choice.',
        'Try to find recreational sports leagues rather than competitive travel teams; they require much less time commitment.'
      ]
    },
    {
      title: 'Allowances and teaching financial literacy',
      content: 'How much allowance do you give a 10-year-old, and do you tie it to chores?',
      replies: [
        'We don\'t tie it to basic chores (like cleaning their room), as that is just part of being in the family. We pay for "extra" chores like washing the car.',
        'We give $1 per year of age per week ($10/week). Half goes to savings, half to spending.',
        'Set up a Greenlight debit card for them. It is a great app to teach them how to manage digital money.'
      ]
    },
    {
      title: 'Coping with empty nest syndrome',
      content: 'My youngest is off to college next month. Any advice for parents struggling with the quiet house?',
      replies: [
        'Reconnect with your spouse! Plan weekend trips and do things you couldn\'t do when the kids were around.',
        'Take up a new hobby or volunteer. Keeping busy is the best way to handle the transition.',
        'It is okay to be sad. Give yourself grace, but don\'t guilt-trip them into coming home every weekend.'
      ]
    },
    {
      title: 'Best age to get a smartphone',
      content: 'All his friends have iPhones at age 10. We want to wait until 13. Are we being too strict?',
      replies: [
        'Stick to your guns. 10 is too young for unrestricted internet access. Give them a smartwatch or basic phone for calling.',
        'Wait until 8th grade. When you do give it, set strict parental controls and screen time limits.',
        'Look into the "Wait Until 8th" pledge. It helps when you can tell them other parents are waiting too.'
      ]
    },
    {
      title: 'Navigating food allergies',
      content: 'My kid has a severe peanut allergy. How do you handle Indian restaurants and potlucks?',
      replies: [
        'It is very tough. Indian food uses cross-contaminated spices heavily. We rarely eat out at Indian places unless we know the owner.',
        'For potlucks, always bring a safe dish your child can eat and politely decline anything you aren\'t 100% sure about.',
        'Carry EpiPens everywhere and teach your child how to read labels and ask questions as early as possible.'
      ]
    },
    {
      title: 'Summer camp recommendations',
      content: 'Sleepaway camps vs Day camps? What is the average cost for a 2-week tech camp?',
      replies: [
        'Day camps run $300-$500/week. Specialized tech camps (like iD Tech) can be $1000+/week. They are pricey.',
        'Check out your local YMCA or Parks & Rec department. They offer fantastic, affordable day camps.',
        'Sleepaway camp is great for independence, but usually best for ages 10+.'
      ]
    },
    {
      title: 'Gift ideas for teachers',
      content: 'What is an appropriate end-of-year gift for elementary school teachers? Gift cards?',
      replies: [
        'Teachers love Amazon or Target gift cards. Do not give mugs or lotions; they have too many already.',
        'A $25 gift card inside a heartfelt, handwritten note from your child is the perfect gift.',
        'Contribute to a class-wide gift pool if the "room parent" organizes one. It lets the teacher buy something big.'
      ]
    },
    {
      title: 'Raising vegetarian kids in the US',
      content: 'How do you ensure they get enough protein when school lunches are mostly meat-based?',
      replies: [
        'We pack their lunches every day. Lentil pasta, edamame, paneer wraps, and Greek yogurt are great protein sources.',
        'School vegetarian options are often just cheese pizza or mac and cheese. It is better to pack a nutritious meal from home.',
        'Sneak protein into breakfast (protein pancakes, smoothies with hemp seeds) to ensure they start the day strong.'
      ]
    }
  ]
};

let phpCode = `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\User;
use App\\Models\\ForumPost;
use App\\Models\\ForumComment;
use Illuminate\\Support\\Facades\\Hash;

class ForumSeeder extends Seeder
{
    public function run(): void
    {
        $userData = [
            ["Aarav Sharma", "aarav123@sharklasers.com"], ["Vivaan Patel", "vivaan123@sharklasers.com"],
            ["Aditya Singh", "aditya123@sharklasers.com"], ["Arjun Gupta", "arjun123@sharklasers.com"],
            ["Sai Reddy", "sai123@sharklasers.com"], ["Krishna Nair", "krishna123@sharklasers.com"],
            ["Rahul Mehta", "rahul123@sharklasers.com"], ["Karthik Iyer", "karthik123@sharklasers.com"],
            ["Rohan Das", "rohan123@sharklasers.com"], ["Mohan Pillai", "mohan123@sharklasers.com"],
            ["Ananya Sharma", "ananya123@sharklasers.com"], ["Diya Patel", "diya123@sharklasers.com"],
            ["Isha Singh", "isha123@sharklasers.com"], ["Kavya Gupta", "kavya123@sharklasers.com"],
            ["Sneha Reddy", "sneha123@sharklasers.com"], ["Meera Nair", "meera123@sharklasers.com"],
            ["Pooja Mehta", "pooja123@sharklasers.com"], ["Aishwarya Iyer", "aishwarya123@sharklasers.com"],
            ["Neha Das", "neha123@sharklasers.com"], ["Lakshmi Pillai", "lakshmi123@sharklasers.com"],
            ["Varun Sharma", "varun123@sharklasers.com"], ["Nikhil Patel", "nikhil123@sharklasers.com"],
            ["Suresh Singh", "suresh123@sharklasers.com"], ["Rajesh Gupta", "rajesh123@sharklasers.com"],
            ["Ajay Reddy", "ajay123@sharklasers.com"], ["Manoj Nair", "manoj123@sharklasers.com"],
            ["Deepak Mehta", "deepak123@sharklasers.com"], ["Sanjay Iyer", "sanjay123@sharklasers.com"],
            ["Vijay Das", "vijay123@sharklasers.com"], ["Prakash Pillai", "prakash123@sharklasers.com"],
            ["Priya Sharma", "priya123@sharklasers.com"], ["Ritu Patel", "ritu123@sharklasers.com"],
            ["Swati Singh", "swati123@sharklasers.com"], ["Nisha Gupta", "nisha123@sharklasers.com"],
            ["Komal Reddy", "komal123@sharklasers.com"], ["Rekha Nair", "rekha123@sharklasers.com"],
            ["Shalini Mehta", "shalini123@sharklasers.com"], ["Divya Iyer", "divya123@sharklasers.com"],
            ["Poonam Das", "poonam123@sharklasers.com"], ["Radha Pillai", "radha123@sharklasers.com"],
            ["Akash Sharma", "akash123@sharklasers.com"], ["Imran Patel", "imran123@sharklasers.com"],
            ["Yusuf Singh", "yusuf123@sharklasers.com"], ["Sameer Gupta", "sameer123@sharklasers.com"],
            ["Farhan Reddy", "farhan123@sharklasers.com"], ["Zaid Nair", "zaid123@sharklasers.com"],
            ["Arif Mehta", "arif123@sharklasers.com"], ["Salman Iyer", "salman123@sharklasers.com"],
            ["Javed Das", "javed123@sharklasers.com"], ["Rizwan Pillai", "rizwan123@sharklasers.com"],
            ["Tanya Sharma", "tanya123@sharklasers.com"], ["Alia Patel", "alia123@sharklasers.com"],
            ["Sara Singh", "sara123@sharklasers.com"], ["Hina Gupta", "hina123@sharklasers.com"],
            ["Sana Reddy", "sana123@sharklasers.com"], ["Fatima Nair", "fatima123@sharklasers.com"],
            ["Zoya Mehta", "zoya123@sharklasers.com"], ["Amina Iyer", "amina123@sharklasers.com"],
            ["Nazia Das", "nazia123@sharklasers.com"], ["Shabana Pillai", "shabana123@sharklasers.com"],
            ["Dev Sharma", "dev123@sharklasers.com"], ["Harsh Patel", "harsh123@sharklasers.com"],
            ["Kunal Singh", "kunal123@sharklasers.com"], ["Tarun Gupta", "tarun123@sharklasers.com"],
            ["Gaurav Reddy", "gaurav123@sharklasers.com"], ["Lokesh Nair", "lokesh123@sharklasers.com"],
            ["Naveen Mehta", "naveen123@sharklasers.com"], ["Sandeep Iyer", "sandeep123@sharklasers.com"],
            ["Amit Das", "amit123@sharklasers.com"], ["Bharat Pillai", "bharat123@sharklasers.com"],
            ["Riya Sharma", "riya123@sharklasers.com"], ["Siya Patel", "siya123@sharklasers.com"],
            ["Anjali Singh", "anjali123@sharklasers.com"], ["Preeti Gupta", "preeti123@sharklasers.com"],
            ["Jyoti Reddy", "jyoti123@sharklasers.com"], ["Usha Nair", "usha123@sharklasers.com"],
            ["Lata Mehta", "lata123@sharklasers.com"], ["Bhavna Iyer", "bhavna123@sharklasers.com"],
            ["Kiran Das", "kiran123@sharklasers.com"], ["Sudha Pillai", "sudha123@sharklasers.com"],
            ["Om Sharma", "om123@sharklasers.com"], ["Tejas Patel", "tejas123@sharklasers.com"],
            ["Dhruv Singh", "dhruv123@sharklasers.com"], ["Yash Gupta", "yash123@sharklasers.com"],
            ["Ritesh Reddy", "ritesh123@sharklasers.com"], ["Vignesh Nair", "vignesh123@sharklasers.com"],
            ["Ashwin Mehta", "ashwin123@sharklasers.com"], ["Surya Iyer", "surya123@sharklasers.com"],
            ["Naveed Das", "naveed123@sharklasers.com"], ["Faizal Pillai", "faizal123@sharklasers.com"],
            ["Aarti Sharma", "aarti123@sharklasers.com"], ["Deepa Patel", "deepa123@sharklasers.com"],
            ["Monika Singh", "monika123@sharklasers.com"], ["Rachna Gupta", "rachna123@sharklasers.com"],
            ["Sushma Reddy", "sushma123@sharklasers.com"], ["Geeta Nair", "geeta123@sharklasers.com"],
            ["Hema Mehta", "hema123@sharklasers.com"], ["Revathi Iyer", "revathi123@sharklasers.com"],
            ["Sunita Das", "sunita123@sharklasers.com"], ["Malathi Pillai", "malathi123@sharklasers.com"]
        ];

        $users = [];
        foreach ($userData as $data) {
            $users[] = User::updateOrCreate(
                ['email' => $data[1]],
                [
                    'name' => $data[0],
                    'password' => Hash::make('password123'),
                ]
            );
        }

        ForumComment::query()->delete();
        ForumPost::query()->delete();

        $startDate = strtotime('2025-10-01');
        $endDate = strtotime('2026-04-30');

`;

for (const [category, posts] of Object.entries(categories)) {
  for (const post of posts) {
    phpCode += `
        $postDate = date('Y-m-d H:i:s', rand($startDate, $endDate));
        $post = ForumPost::create([
            'user_id' => $users[array_rand($users)]->id,
            'title' => '${post.title.replace(/'/g, "\\'")}',
            'content' => '${post.content.replace(/'/g, "\\'")}',
            'category' => '${category}',
            'votes' => rand(10, 500),
            'created_at' => $postDate,
            'updated_at' => $postDate
        ]);
`;
    for (const reply of post.replies) {
      phpCode += `
        $commentDate = date('Y-m-d H:i:s', rand(strtotime($postDate), $endDate));
        ForumComment::create([
            'user_id' => $users[array_rand($users)]->id,
            'post_id' => $post->id,
            'content' => '${reply.replace(/'/g, "\\'")}',
            'votes' => rand(0, 50),
            'created_at' => $commentDate,
            'updated_at' => $commentDate
        ]);
`;
    }
  }
}

phpCode += `
    }
}
`;

fs.writeFileSync('f:/Desipath-code/desipath/BACKEND/database/seeders/ForumSeeder.php', phpCode);
console.log('ForumSeeder.php successfully generated with strictly correlated replies.');
