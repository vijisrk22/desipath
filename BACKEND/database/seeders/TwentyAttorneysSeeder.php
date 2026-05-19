<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attorney;
use App\Models\User;
use App\Models\UsaZipcode;
use Illuminate\Support\Str;

class TwentyAttorneysSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch 20 unique user IDs from the database
        $userIds = User::limit(20)->pluck('id')->toArray();
        $userCount = count($userIds);

        if ($userCount === 0) {
            $this->command->warn('No users found in database. Please run User seeders first.');
            return;
        }

        // 20 realistic attorney profiles
        $attorneysData = [
            [
                'first_name' => 'Rajesh',
                'last_name' => 'Sharma',
                'gender' => 'male',
                'profile_photo_url' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80',
                'short_bio' => 'Senior Immigration Attorney specializing in H-1B, L-1, EB-5 visas, and complex green card filings.',
                'full_biography' => 'Rajesh Sharma has over 15 years of experience in US business immigration law. He has successfully represented thousands of IT consultants, software engineers, and startups in securing visas. Having immigrated to the US himself, Rajesh has personal empathy for the visa process. He specializes in resolving complex RFEs and appeals.',
                'career_summary' => 'Former legal counsel for top Silicon Valley tech firms. Managed over 5,000 corporate visa filings and employer audits.',
                'nri_client_statement' => 'Assists NRI founders and high-net-worth individuals in navigating US corporate setups and EB-5 investments.',
                'personal_note' => 'I believe in providing direct, transparent legal counsel without hiding behind complex legal jargon.',
                'nri_specialisation' => true,
                'india_law_knowledge' => true,
                'email' => 'rajesh.sharma@sharmalaw.com',
                'phone' => '(510) 555-9001',
                'office_address_street' => '39100 State St, Suite A',
                'office_address_city' => 'Fremont',
                'office_address_state' => 'CA',
                'office_address_zip' => '94538',
                'website_url' => 'https://www.sharmalaw.com',
                'blog_url' => 'https://www.sharmalaw.com/blog',
                'blog_platform' => 'WordPress',
                'blog_description' => 'Immigration News & Tech Visa Updates',
                'linkedin_url' => 'https://www.linkedin.com/in/rajeshsharmalaw',
                'twitter_url' => 'https://twitter.com/sharmalaw',
                'facebook_url' => 'https://facebook.com/sharmalaw',
                'instagram_url' => 'https://instagram.com/sharmalaw',
                'law_school' => 'UC Berkeley School of Law',
                'law_degree' => 'JD',
                'graduation_year' => 2008,
                'law_school_honours' => 'Magna Cum Laude',
                'undergraduate_institution' => 'Delhi University',
                'undergraduate_degree' => 'BA in Political Science',
                'undergraduate_year' => 2004,
                'us_supreme_court' => true,
                'eoir_admitted' => true,
                'us_tax_court' => false,
                'india_bci' => true,
                'india_bci_details' => 'Bar Council of Delhi, Enrollment No. D/1042/2004',
                'other_jurisdictions' => 'Admitted to Ninth Circuit Court of Appeals',
                'accepts_legal_plans' => true,
                'legal_plans_note' => 'Accepts MetLife, ARAG, and LegalShield corporate plans.',
                'consultation_fee_amount' => 150.00,
                'consultation_duration' => 30,
                'retainer_details' => 'Standard monthly corporate retainers available starting at $1,500/month.',
                'fee_note' => 'Offers flat fees for standard filings like H-1B, L-1, and family petitions.',
                'practice_areas_json' => ['Immigration & Naturalization', 'Corporate & Business Law', 'Employment Law'],
                'states_licensed_json' => [
                    ['state' => 'CA', 'bar_number' => '258963', 'year_admitted' => 2008, 'status' => 'Active']
                ],
                'federal_courts_json' => [
                    ['court_name' => 'U.S. District Court, Northern District of CA', 'year_admitted' => 2009]
                ],
                'appeals_circuits_json' => ['Ninth Circuit'],
                'legal_plans_json' => [
                    ['plan_name' => 'MetLife Legal Plans', 'provider' => 'MetLife', 'badge_color' => 'gold', 'verified' => true],
                    ['plan_name' => 'ARAG Legal Insurance', 'provider' => 'ARAG', 'badge_color' => 'blue', 'verified' => true],
                    ['plan_name' => 'LegalShield', 'provider' => 'LegalShield', 'badge_color' => 'green', 'verified' => true]
                ],
                'billing_model_json' => ['Flat Fee', 'Hourly Rate'],
                'flat_fees_json' => [
                    ['service' => 'H-1B Petition filing', 'fee' => '$2,500'],
                    ['service' => 'Marriage Green Card', 'fee' => '$3,500']
                ],
                'payment_methods_json' => ['Credit Card', 'Wire Transfer', 'Check', 'Zelle'],
                'languages_json' => [
                    ['language' => 'Hindi', 'proficiency' => 'Native'],
                    ['language' => 'Punjabi', 'proficiency' => 'Fluent'],
                    ['language' => 'English', 'proficiency' => 'Native']
                ],
                'associations_json' => [
                    ['name' => 'South Asian Bar Association (SABA)', 'role' => 'Member'],
                    ['name' => 'American Immigration Lawyers Association (AILA)', 'role' => 'Active Member']
                ],
                'awards_json' => [
                    ['title' => 'Top Immigration Attorney', 'year' => '2023', 'organization' => 'Super Lawyers']
                ],
                'publications_json' => [
                    ['title' => 'The Future of Business Visas in the AI Era', 'publisher' => 'Silicon Valley Law Journal', 'year' => '2022']
                ],
                'youtube_videos_json' => [
                    ['title' => 'Immigration Masterclass: H-1B to Green Card', 'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ']
                ],
                'avg_rating' => 4.95,
                'review_count' => 48,
                'profile_status' => 'active'
            ],
            [
                'first_name' => 'Priya',
                'last_name' => 'Patel',
                'gender' => 'female',
                'profile_photo_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
                'short_bio' => 'Dedicated Family Law & Divorce Attorney resolving prenups, custody disputes, and mediation services.',
                'full_biography' => 'Priya Patel specializes in complex family law, high-net-worth divorce, prenuptial agreements, and child custody. Priya understands the high emotional stakes of family disputes and works towards amicable resolutions through mediation. When litigation is necessary, she is a fierce advocate in court.',
                'career_summary' => 'Practiced family law in New Jersey for over 10 years. Successfully negotiated hundreds of divorce settlements.',
                'nri_client_statement' => 'Familiar with cross-border custody disputes and property division issues affecting NRI families.',
                'personal_note' => 'I strive to minimize emotional stress and financial costs for families during difficult transitions.',
                'nri_specialisation' => true,
                'india_law_knowledge' => false,
                'email' => 'priya.patel@patelfamilylaw.com',
                'phone' => '(732) 555-9002',
                'office_address_street' => '100 Route 1 South, Suite C',
                'office_address_city' => 'Woodbridge',
                'office_address_state' => 'NJ',
                'office_address_zip' => '08830',
                'website_url' => 'https://www.patelfamilylaw.com',
                'blog_url' => 'https://www.patelfamilylaw.com/insights',
                'blog_platform' => 'Medium',
                'blog_description' => 'Navigating Family Transitions',
                'linkedin_url' => 'https://www.linkedin.com/in/priyapatelfamilylaw',
                'twitter_url' => 'https://twitter.com/priyafamilylaw',
                'facebook_url' => '',
                'instagram_url' => '',
                'law_school' => 'Seton Hall University School of Law',
                'law_degree' => 'JD',
                'graduation_year' => 2011,
                'law_school_honours' => 'Cum Laude',
                'undergraduate_institution' => 'Rutgers University',
                'undergraduate_degree' => 'BA in Psychology',
                'undergraduate_year' => 2008,
                'us_supreme_court' => false,
                'eoir_admitted' => false,
                'us_tax_court' => false,
                'india_bci' => false,
                'india_bci_details' => '',
                'other_jurisdictions' => '',
                'accepts_legal_plans' => true,
                'legal_plans_note' => 'Accepts ARAG and MetLife.',
                'consultation_fee_amount' => 200.00,
                'consultation_duration' => 60,
                'retainer_details' => 'Standard family law retainer starts at $3,500.',
                'fee_note' => 'Hourly rates apply to litigation. Flat fees available for prenuptial agreements.',
                'practice_areas_json' => ['Family Law & Divorce', 'Mediation & Collaborative Law'],
                'states_licensed_json' => [
                    ['state' => 'NJ', 'bar_number' => '456123', 'year_admitted' => 2011, 'status' => 'Active']
                ],
                'federal_courts_json' => [],
                'appeals_circuits_json' => [],
                'legal_plans_json' => [
                    ['plan_name' => 'MetLife Legal Plans', 'provider' => 'MetLife', 'badge_color' => 'gold', 'verified' => true],
                    ['plan_name' => 'ARAG Legal Insurance', 'provider' => 'ARAG', 'badge_color' => 'blue', 'verified' => true]
                ],
                'billing_model_json' => ['Hourly Rate', 'Flat Fee'],
                'flat_fees_json' => [
                    ['service' => 'Uncontested Divorce filing', 'fee' => '$2,500'],
                    ['service' => 'Prenuptial Agreement drafting', 'fee' => '$1,800']
                ],
                'payment_methods_json' => ['Credit Card', 'Check', 'Zelle'],
                'languages_json' => [
                    ['language' => 'Gujarati', 'proficiency' => 'Fluent'],
                    ['language' => 'Hindi', 'proficiency' => 'Conversational'],
                    ['language' => 'English', 'proficiency' => 'Native']
                ],
                'associations_json' => [
                    ['name' => 'South Asian Bar Association (SABA)', 'role' => 'Member'],
                    ['name' => 'NJ State Bar Association Family Law Section', 'role' => 'Committee Member']
                ],
                'awards_json' => [
                    ['title' => 'Rising Star - Family Law', 'year' => '2021', 'organization' => 'NJ Law Journal']
                ],
                'publications_json' => [
                    ['title' => 'Understanding Asset Division Across Borders', 'publisher' => 'NJ Bar Magazine', 'year' => '2020']
                ],
                'youtube_videos_json' => [],
                'avg_rating' => 4.88,
                'review_count' => 32,
                'profile_status' => 'active'
            ],
            [
                'first_name' => 'Vikram',
                'last_name' => 'Mehta',
                'gender' => 'male',
                'profile_photo_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
                'short_bio' => 'Estate Planning and Asset Protection Attorney securing NRI properties, trusts, and wealth transfers.',
                'full_biography' => 'Vikram Mehta is a premier estate planning lawyer helping clients secure their family legacy. He drafts comprehensive wills, living trusts, power of attorneys, and healthcare directives. Vikram is nationally recognized for advising South Asian families with dual-citizenship assets and ancestral property transfers in India.',
                'career_summary' => 'Adviser to multi-generational family businesses and technology executives. Drafted over 1,200 personalized estate packages.',
                'nri_client_statement' => 'Specializes in estate planning involving cross-border investments, FBAR compliance, and Indian property inheritance.',
                'personal_note' => 'Estate planning isn\'t just about wealth; it\'s about ensuring peace of mind for the people you leave behind.',
                'nri_specialisation' => true,
                'india_law_knowledge' => true,
                'email' => 'vmehta@mehtalawgroup.com',
                'phone' => '(281) 555-9003',
                'office_address_street' => '2200 Southwest Fwy, Suite C',
                'office_address_city' => 'Sugar Land',
                'office_address_state' => 'TX',
                'office_address_zip' => '77478',
                'website_url' => 'https://www.mehtalawgroup.com',
                'blog_url' => '',
                'blog_platform' => '',
                'blog_description' => '',
                'linkedin_url' => 'https://www.linkedin.com/in/vikrammehtaestatelaw',
                'twitter_url' => '',
                'facebook_url' => '',
                'instagram_url' => '',
                'law_school' => 'University of Houston Law Center',
                'law_degree' => 'JD',
                'graduation_year' => 2006,
                'law_school_honours' => 'Order of the Coif',
                'undergraduate_institution' => 'University of Texas at Austin',
                'undergraduate_degree' => 'BBA in Finance',
                'undergraduate_year' => 2003,
                'us_supreme_court' => false,
                'eoir_admitted' => false,
                'us_tax_court' => true,
                'india_bci' => false,
                'india_bci_details' => '',
                'other_jurisdictions' => '',
                'accepts_legal_plans' => true,
                'legal_plans_note' => 'Accepts MetLife and ARAG for standard trust drafting.',
                'consultation_fee_amount' => 100.00,
                'consultation_duration' => 45,
                'retainer_details' => '',
                'fee_note' => 'Offers all-inclusive flat fee estate packages starting at $2,000.',
                'practice_areas_json' => ['Estate Planning & Wills', 'Tax Law & Asset Protection', 'Real Estate Law'],
                'states_licensed_json' => [
                    ['state' => 'TX', 'bar_number' => '789456', 'year_admitted' => 2006, 'status' => 'Active']
                ],
                'federal_courts_json' => [
                    ['court_name' => 'U.S. Tax Court', 'year_admitted' => 2007]
                ],
                'appeals_circuits_json' => [],
                'legal_plans_json' => [
                    ['plan_name' => 'MetLife Legal Plans', 'provider' => 'MetLife', 'badge_color' => 'gold', 'verified' => true],
                    ['plan_name' => 'ARAG Legal Insurance', 'provider' => 'ARAG', 'badge_color' => 'blue', 'verified' => true]
                ],
                'billing_model_json' => ['Flat Fee', 'Hourly Rate'],
                'flat_fees_json' => [
                    ['service' => 'Individual Living Trust package', 'fee' => '$2,200'],
                    ['service' => 'Basic Will & Powers of Attorney', 'fee' => '$950']
                ],
                'payment_methods_json' => ['Credit Card', 'Check', 'Zelle', 'Venmo'],
                'languages_json' => [
                    ['language' => 'Hindi', 'proficiency' => 'Fluent'],
                    ['language' => 'English', 'proficiency' => 'Native']
                ],
                'associations_json' => [
                    ['name' => 'South Asian Bar Association (SABA)', 'role' => 'Board Member'],
                    ['name' => 'State Bar of Texas Real Estate & Trust Section', 'role' => 'Member']
                ],
                'awards_json' => [
                    ['title' => 'Best Estate Planner in Houston', 'year' => '2022', 'organization' => 'Houston Business Journal']
                ],
                'publications_json' => [
                    ['title' => 'Estate Planning for the South Asian Diaspora', 'publisher' => 'Texas Estate & Trust Journal', 'year' => '2021']
                ],
                'youtube_videos_json' => [],
                'avg_rating' => 4.97,
                'review_count' => 54,
                'profile_status' => 'active'
            ],
            [
                'first_name' => 'Anjali',
                'last_name' => 'Rao',
                'gender' => 'female',
                'profile_photo_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
                'short_bio' => 'Startup & Corporate Counsel assisting with entity formation, IP licensing, and venture finance.',
                'full_biography' => 'Anjali Rao is a corporate transactional lawyer advising early-stage startups and small businesses. She drafts founder agreements, employment contracts, terms of service, and privacy policies. Anjali frequently represents technology founders seeking angel and venture capital funding, ensuring clean capitalization tables.',
                'career_summary' => 'Former corporate associate at a major Silicon Valley law firm. Structured over $100M in venture capital financing.',
                'nri_client_statement' => 'Helps Indian tech founders establish subsidiary structures in Delaware and California.',
                'personal_note' => 'I act as an external general counsel for founders, allowing them to focus on building their product.',
                'nri_specialisation' => true,
                'india_law_knowledge' => false,
                'email' => 'anjali@raostartuplaw.com',
                'phone' => '(510) 555-9004',
                'office_address_street' => '1200 Mowry Ave, Suite B',
                'office_address_city' => 'Fremont',
                'office_address_state' => 'CA',
                'office_address_zip' => '94538',
                'website_url' => 'https://www.raostartuplaw.com',
                'blog_url' => 'https://www.raostartuplaw.com/founder-tips',
                'blog_platform' => 'WordPress',
                'blog_description' => 'Founder Legals and Compliance',
                'linkedin_url' => 'https://www.linkedin.com/in/anjaliraostartuplaw',
                'twitter_url' => 'https://twitter.com/raostartuplaw',
                'facebook_url' => '',
                'instagram_url' => '',
                'law_school' => 'Stanford Law School',
                'law_degree' => 'JD',
                'graduation_year' => 2013,
                'law_school_honours' => 'Order of the Coif',
                'undergraduate_institution' => 'UC Berkeley',
                'undergraduate_degree' => 'BS in Electrical Engineering & Computer Sciences',
                'undergraduate_year' => 2010,
                'us_supreme_court' => false,
                'eoir_admitted' => false,
                'us_tax_court' => false,
                'india_bci' => false,
                'india_bci_details' => '',
                'other_jurisdictions' => '',
                'accepts_legal_plans' => false,
                'legal_plans_note' => '',
                'consultation_fee_amount' => 250.00,
                'consultation_duration' => 45,
                'retainer_details' => 'Retainer models customized to startup development stages.',
                'fee_note' => 'Flat-rate startup packages available for new incorporations.',
                'practice_areas_json' => ['Corporate & Business Law', 'Intellectual Property', 'Mergers & Acquisitions'],
                'states_licensed_json' => [
                    ['state' => 'CA', 'bar_number' => '321654', 'year_admitted' => 2013, 'status' => 'Active']
                ],
                'federal_courts_json' => [],
                'appeals_circuits_json' => [],
                'legal_plans_json' => [],
                'billing_model_json' => ['Hourly Rate', 'Flat Fee'],
                'flat_fees_json' => [
                    ['service' => 'Delaware C-Corp Incorporation package', 'fee' => '$2,500'],
                    ['service' => 'Non-Disclosure Agreement (NDA) drafting', 'fee' => '$400']
                ],
                'payment_methods_json' => ['Credit Card', 'Wire Transfer', 'ACH'],
                'languages_json' => [
                    ['language' => 'Kannada', 'proficiency' => 'Conversational'],
                    ['language' => 'English', 'proficiency' => 'Native']
                ],
                'associations_json' => [
                    ['name' => 'South Asian Bar Association (SABA)', 'role' => 'Member'],
                    ['name' => 'Silicon Valley Association of Startup Attorneys', 'role' => 'Co-Founder']
                ],
                'awards_json' => [
                    ['title' => 'Top 40 Under 40 Business Lawyers', 'year' => '2023', 'organization' => 'National Advocates']
                ],
                'publications_json' => [
                    ['title' => 'Navigating SAFEs vs Convertible Notes for Early Founders', 'publisher' => 'TechCrunch Extra', 'year' => '2021']
                ],
                'youtube_videos_json' => [],
                'avg_rating' => 4.91,
                'review_count' => 26,
                'profile_status' => 'active'
            ],
            [
                'first_name' => 'Harpreet',
                'last_name' => 'Singh',
                'gender' => 'male',
                'profile_photo_url' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
                'short_bio' => 'Criminal Defense & DUI Attorney representing clients with aggressive representation and trial defense.',
                'full_biography' => 'Harpreet Singh has over 12 years of trial experience defending individuals accused of DUIs, drug charges, domestic violence, and white-collar crimes. Harpreet is a passionate advocate for constitutional rights and is known for securing dismissals and reduced charges in state and federal courts.',
                'career_summary' => 'Former Assistant Public Defender in Harris County. Conducted over 60 jury trials to verdict.',
                'nri_client_statement' => 'Advises visa holders (H-1B, F-1) on the severe immigration consequences of criminal arrests.',
                'personal_note' => 'An arrest is not a conviction. I look at the evidence, identify errors, and defend you vigorously.',
                'nri_specialisation' => false,
                'india_law_knowledge' => false,
                'email' => 'hsingh@singhtriallaw.com',
                'phone' => '(281) 555-9005',
                'office_address_street' => '17510 W Grand Pkwy S, Suite B',
                'office_address_city' => 'Sugar Land',
                'office_address_state' => 'TX',
                'office_address_zip' => '77479',
                'website_url' => 'https://www.singhtriallaw.com',
                'blog_url' => '',
                'blog_platform' => '',
                'blog_description' => '',
                'linkedin_url' => 'https://www.linkedin.com/in/harpreetsinghdefenselaw',
                'twitter_url' => '',
                'facebook_url' => '',
                'instagram_url' => '',
                'law_school' => 'Texas Southern University Thurgood Marshall School of Law',
                'law_degree' => 'JD',
                'graduation_year' => 2012,
                'law_school_honours' => 'Magna Cum Laude',
                'undergraduate_institution' => 'University of Houston',
                'undergraduate_degree' => 'BS in Criminology',
                'undergraduate_year' => 2009,
                'us_supreme_court' => false,
                'eoir_admitted' => true,
                'us_tax_court' => false,
                'india_bci' => false,
                'india_bci_details' => '',
                'other_jurisdictions' => '',
                'accepts_legal_plans' => true,
                'legal_plans_note' => 'Accepts ARAG criminal defense coverage.',
                'consultation_fee_amount' => 0.00,
                'consultation_duration' => 30,
                'retainer_details' => 'Felony defense retainers starting at $5,000.',
                'fee_note' => 'DUI / DWI cases handled on a flat fee structure.',
                'practice_areas_json' => ['Criminal Defense & DUI', 'Traffic Violations', 'Immigration & Naturalization'],
                'states_licensed_json' => [
                    ['state' => 'TX', 'bar_number' => '963258', 'year_admitted' => 2012, 'status' => 'Active']
                ],
                'federal_courts_json' => [
                    ['court_name' => 'U.S. District Court, Southern District of TX', 'year_admitted' => 2013]
                ],
                'appeals_circuits_json' => ['Fifth Circuit'],
                'legal_plans_json' => [
                    ['plan_name' => 'ARAG Legal Insurance', 'provider' => 'ARAG', 'badge_color' => 'blue', 'verified' => true]
                ],
                'billing_model_json' => ['Flat Fee', 'Hourly Rate'],
                'flat_fees_json' => [
                    ['service' => 'First-offense DUI Defense (Pre-trial)', 'fee' => '$3,000'],
                    ['service' => 'Misdemeanor Representation', 'fee' => '$2,500']
                ],
                'payment_methods_json' => ['Credit Card', 'Cash', 'Zelle'],
                'languages_json' => [
                    ['language' => 'Punjabi', 'proficiency' => 'Native'],
                    ['language' => 'Hindi', 'proficiency' => 'Fluent'],
                    ['language' => 'English', 'proficiency' => 'Native']
                ],
                'associations_json' => [
                    ['name' => 'South Asian Bar Association (SABA)', 'role' => 'Member'],
                    ['name' => 'Texas Criminal Defense Lawyers Association (TCDLA)', 'role' => 'Member']
                ],
                'awards_json' => [
                    ['title' => 'Top Criminal Attorney in Fort Bend', 'year' => '2023', 'organization' => 'Fort Bend Herald']
                ],
                'publications_json' => [],
                'youtube_videos_json' => [],
                'avg_rating' => 4.94,
                'review_count' => 39,
                'profile_status' => 'active'
            ],
            [
                'first_name' => 'Neha',
                'last_name' => 'Sen',
                'gender' => 'female',
                'profile_photo_url' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
                'short_bio' => 'Real Estate and Landlord-Tenant Lawyer overseeing commercial leases, title disputes, and transactions.',
                'full_biography' => 'Neha Sen represents buyers, sellers, landlords, and commercial tenants in real estate transactions, boundary disputes, and title issues. Neha drafts lease agreements, reviews builder purchase contracts, and resolves zoning compliance problems. She is highly skilled in representing out-of-state and international real estate investors.',
                'career_summary' => 'Over 8 years representing commercial developers and private residential buyers in northern California.',
                'nri_client_statement' => 'Assists NRI clients with real estate transactions, legal clearances, and property management legal disputes in the US.',
                'personal_note' => 'I ensure that my clients understand all clauses in property contracts before signing away their life savings.',
                'nri_specialisation' => true,
                'india_law_knowledge' => false,
                'email' => 'neha@senrealestatelaw.com',
                'phone' => '(510) 555-9006',
                'office_address_street' => '39200 Liberty St, Suite E',
                'office_address_city' => 'Fremont',
                'office_address_state' => 'CA',
                'office_address_zip' => '94538',
                'website_url' => 'https://www.senrealestatelaw.com',
                'blog_url' => '',
                'blog_platform' => '',
                'blog_description' => '',
                'linkedin_url' => 'https://www.linkedin.com/in/nehasenrealestatelaw',
                'twitter_url' => '',
                'facebook_url' => '',
                'instagram_url' => '',
                'law_school' => 'University of San Francisco School of Law',
                'law_degree' => 'JD',
                'graduation_year' => 2015,
                'law_school_honours' => 'Cum Laude',
                'undergraduate_institution' => 'UC Davis',
                'undergraduate_degree' => 'BA in Economics',
                'undergraduate_year' => 2012,
                'us_supreme_court' => false,
                'eoir_admitted' => false,
                'us_tax_court' => false,
                'india_bci' => false,
                'india_bci_details' => '',
                'other_jurisdictions' => '',
                'accepts_legal_plans' => true,
                'legal_plans_note' => 'Accepts MetLife and LegalShield for residential closing reviews.',
                'consultation_fee_amount' => 150.00,
                'consultation_duration' => 45,
                'retainer_details' => '',
                'fee_note' => 'Transactions and contract reviews handled on flat fee schedules.',
                'practice_areas_json' => ['Real Estate Law', 'Landlord-Tenant Law', 'Corporate & Business Law'],
                'states_licensed_json' => [
                    ['state' => 'CA', 'bar_number' => '159357', 'year_admitted' => 2015, 'status' => 'Active']
                ],
                'federal_courts_json' => [],
                'appeals_circuits_json' => [],
                'legal_plans_json' => [
                    ['plan_name' => 'MetLife Legal Plans', 'provider' => 'MetLife', 'badge_color' => 'gold', 'verified' => true],
                    ['plan_name' => 'LegalShield', 'provider' => 'LegalShield', 'badge_color' => 'green', 'verified' => true]
                ],
                'billing_model_json' => ['Flat Fee', 'Hourly Rate'],
                'flat_fees_json' => [
                    ['service' => 'Residential Purchase Contract Review', 'fee' => '$800'],
                    ['service' => 'Commercial Lease Drafting', 'fee' => '$1,500']
                ],
                'payment_methods_json' => ['Credit Card', 'Wire Transfer', 'Check'],
                'languages_json' => [
                    ['language' => 'Hindi', 'proficiency' => 'Conversational'],
                    ['language' => 'Bengali', 'proficiency' => 'Fluent'],
                    ['language' => 'English', 'proficiency' => 'Native']
                ],
                'associations_json' => [
                    ['name' => 'South Asian Bar Association (SABA)', 'role' => 'Member'],
                    ['name' => 'California Association of Realtors Legal Division', 'role' => 'Affiliate Member']
                ],
                'awards_json' => [],
                'publications_json' => [
                    ['title' => 'Commercial Tenant Rights in California Post-Pandemic', 'publisher' => 'Bay Area Property Law Blog', 'year' => '2022']
                ],
                'youtube_videos_json' => [],
                'avg_rating' => 4.83,
                'review_count' => 18,
                'profile_status' => 'active'
            ],
            [
                'first_name' => 'Amit',
                'last_name' => 'Joshi',
                'gender' => 'male',
                'profile_photo_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
                'short_bio' => 'Tax Attorney advising on IRS tax audits, FBAR disclosures, and foreign asset reporting compliance.',
                'full_biography' => 'Amit Joshi is a highly specialized tax lawyer focusing on international tax compliance, IRS tax audits, and voluntary disclosures (OVDP). Amit has guided hundreds of dual-nationals and expatriates on foreign asset reporting compliance (FBAR, FATCA). He is dedicated to helping clients minimize double taxation liabilities under the US-India Tax Treaty.',
                'career_summary' => 'Former Big 4 accounting firm senior tax consultant. Over 9 years representing corporate and individual clients before the IRS.',
                'nri_client_statement' => 'Advises NRIs on capital gains taxation regarding property sales in India and compliance mapping.',
                'personal_note' => 'The IRS does not make tax reporting easy, but I ensure you remain fully compliant and penalty-free.',
                'nri_specialisation' => true,
                'india_law_knowledge' => true,
                'email' => 'ajoshi@joshitaxlaw.com',
                'phone' => '(732) 555-9007',
                'office_address_street' => '2005 Route 27, Suite C',
                'office_address_city' => 'Edison',
                'office_address_state' => 'NJ',
                'office_address_zip' => '08817',
                'website_url' => 'https://www.joshitaxlaw.com',
                'blog_url' => '',
                'blog_platform' => '',
                'blog_description' => '',
                'linkedin_url' => 'https://www.linkedin.com/in/amitjoshitaxlaw',
                'twitter_url' => '',
                'facebook_url' => '',
                'instagram_url' => '',
                'law_school' => 'New York University School of Law',
                'law_degree' => 'LLM in Taxation',
                'graduation_year' => 2014,
                'law_school_honours' => '',
                'undergraduate_institution' => 'Rutgers Law School',
                'undergraduate_degree' => 'JD',
                'undergraduate_year' => 2013,
                'us_supreme_court' => false,
                'eoir_admitted' => false,
                'us_tax_court' => true,
                'india_bci' => false,
                'india_bci_details' => '',
                'other_jurisdictions' => '',
                'accepts_legal_plans' => false,
                'legal_plans_note' => '',
                'consultation_fee_amount' => 175.00,
                'consultation_duration' => 30,
                'retainer_details' => 'IRS audit representation retainers start at $3,500.',
                'fee_note' => 'Fixed fees available for standard FBAR / FATCA streamlined disclosures.',
                'practice_areas_json' => ['Tax Law & Asset Protection', 'Corporate & Business Law'],
                'states_licensed_json' => [
                    ['state' => 'NJ', 'bar_number' => '357951', 'year_admitted' => 2013, 'status' => 'Active']
                ],
                'federal_courts_json' => [
                    ['court_name' => 'U.S. Tax Court', 'year_admitted' => 2014]
                ],
                'appeals_circuits_json' => [],
                'legal_plans_json' => [],
                'billing_model_json' => ['Hourly Rate', 'Flat Fee'],
                'flat_fees_json' => [
                    ['service' => 'FBAR Streamlined Compliance Filing', 'fee' => '$3,500'],
                    ['service' => 'Foreign Asset Consultation', 'fee' => '$500']
                ],
                'payment_methods_json' => ['Credit Card', 'Wire Transfer', 'Check'],
                'languages_json' => [
                    ['language' => 'Hindi', 'proficiency' => 'Fluent'],
                    ['language' => 'Marathi', 'proficiency' => 'Conversational'],
                    ['language' => 'English', 'proficiency' => 'Native']
                ],
                'associations_json' => [
                    ['name' => 'South Asian Bar Association (SABA)', 'role' => 'Member'],
                    ['name' => 'American Bar Association Tax Section', 'role' => 'Committee Member']
                ],
                'awards_json' => [
                    ['title' => 'Top Tax Counsel in Central Jersey', 'year' => '2022', 'organization' => 'Edison Sentinel']
                ],
                'publications_json' => [
                    ['title' => 'Reporting NRO and NRE Account Interest: FBAR Pitfalls', 'publisher' => 'International Tax Digest', 'year' => '2023']
                ],
                'youtube_videos_json' => [],
                'avg_rating' => 4.95,
                'review_count' => 31,
                'profile_status' => 'active'
            ],
            [
                'first_name' => 'Kavita',
                'last_name' => 'Nair',
                'gender' => 'female',
                'profile_photo_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
                'short_bio' => 'Immigration Counsel representing clients in H-1B, marriage green cards, naturalization, and court appeals.',
                'full_biography' => 'Kavita Nair specializes in environmental and corporate immigration, employment certification, family petitions, and representation before the Immigration Courts (EOIR). She is passionate about keeping families united and helping corporate clients import top technology talent.',
                'career_summary' => 'Represented over 80 major healthcare organizations in importing foreign nursing and physician staff.',
                'nri_client_statement' => 'Assists clients with consular processing issues, tourist visa denials, and student visa compliance.',
                'personal_note' => 'I approach every immigration file as if it were a family member\'s petition, ensuring absolute accuracy.',
                'nri_specialisation' => false,
                'india_law_knowledge' => false,
                'email' => 'kavita@nairimmigration.com',
                'phone' => '(732) 555-9008',
                'office_address_street' => '2070 Route 27, Suite D',
                'office_address_city' => 'Edison',
                'office_address_state' => 'NJ',
                'office_address_zip' => '08817',
                'website_url' => 'https://www.nairimmigration.com',
                'blog_url' => '',
                'blog_platform' => '',
                'blog_description' => '',
                'linkedin_url' => 'https://www.linkedin.com/in/kavitanairimmigration',
                'twitter_url' => '',
                'facebook_url' => '',
                'instagram_url' => '',
                'law_school' => 'Rutgers Law School',
                'law_degree' => 'JD',
                'graduation_year' => 2014,
                'law_school_honours' => 'Magna Cum Laude',
                'undergraduate_institution' => 'Rutgers University',
                'undergraduate_degree' => 'BA in Journalism',
                'undergraduate_year' => 2011,
                'us_supreme_court' => false,
                'eoir_admitted' => true,
                'us_tax_court' => false,
                'india_bci' => false,
                'india_bci_details' => '',
                'other_jurisdictions' => '',
                'accepts_legal_plans' => true,
                'legal_plans_note' => 'Accepts LegalShield and ARAG corporate legal services.',
                'consultation_fee_amount' => 125.00,
                'consultation_duration' => 30,
                'retainer_details' => '',
                'fee_note' => 'Highly competitive flat rates with payment plan options.',
                'practice_areas_json' => ['Immigration & Naturalization', 'Family Law & Divorce'],
                'states_licensed_json' => [
                    ['state' => 'NJ', 'bar_number' => '951357', 'year_admitted' => 2014, 'status' => 'Active']
                ],
                'federal_courts_json' => [],
                'appeals_circuits_json' => [],
                'legal_plans_json' => [
                    ['plan_name' => 'ARAG Legal Insurance', 'provider' => 'ARAG', 'badge_color' => 'blue', 'verified' => true],
                    ['plan_name' => 'LegalShield', 'provider' => 'LegalShield', 'badge_color' => 'green', 'verified' => true]
                ],
                'billing_model_json' => ['Flat Fee', 'Hourly Rate'],
                'flat_fees_json' => [
                    ['service' => 'Marriage Green Card Petition', 'fee' => '$3,200'],
                    ['service' => 'Citizenship Application', 'fee' => '$1,200']
                ],
                'payment_methods_json' => ['Credit Card', 'Check', 'Zelle', 'Cash'],
                'languages_json' => [
                    ['language' => 'Malayalam', 'proficiency' => 'Native'],
                    ['language' => 'Hindi', 'proficiency' => 'Conversational'],
                    ['language' => 'English', 'proficiency' => 'Native']
                ],
                'associations_json' => [
                    ['name' => 'South Asian Bar Association (SABA)', 'role' => 'Member'],
                    ['name' => 'American Immigration Lawyers Association (AILA)', 'role' => 'Active Member']
                ],
                'awards_json' => [],
                'publications_json' => [],
                'youtube_videos_json' => [],
                'avg_rating' => 4.87,
                'review_count' => 21,
                'profile_status' => 'active'
            ]
        ];

        // Seed 20 profiles (reuse user ids to populate, generating up to 20 or looping)
        $idx = 0;
        foreach ($attorneysData as $data) {
            $currentUserId = $userIds[$idx % $userCount];

            // Resolve slug
            $fnSlug = Str::slug($data['first_name']);
            $lnSlug = Str::slug($data['last_name']);
            $citySlug = Str::slug($data['office_address_city']);
            $zipSlug = Str::slug($data['office_address_zip']);
            $slug = "{$fnSlug}-{$lnSlug}-{$citySlug}-{$zipSlug}";

            // Geocode using UsaZipcode model if exists
            $lat = null;
            $lng = null;
            $zipData = UsaZipcode::where('zip', $data['office_address_zip'])->first();
            if ($zipData) {
                $lat = $zipData->lat;
                $lng = $zipData->lng;
            }

            $attorneyRecord = array_merge($data, [
                'user_id' => $currentUserId,
                'slug' => $slug,
                'office_address_lat' => $lat,
                'office_address_lng' => $lng,
                'profile_completeness' => 95, // High completeness for seeded
            ]);

            // Save to DB
            Attorney::create($attorneyRecord);

            $idx++;
        }

        // Add 12 more entries to fill up the required 20 profiles
        $moreNames = [
            ['Amit', 'Malhotra', 'male', 'Immigration & Naturalization', '94538', 'Fremont', 'CA', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Srinivas', 'Ramanujan', 'male', 'Tax Law & Asset Protection', '77478', 'Sugar Land', 'TX', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Sunita', 'Choudhury', 'female', 'Family Law & Divorce', '08840', 'Metuchen', 'NJ', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Karan', 'Kapoor', 'male', 'Criminal Defense & DUI', '94538', 'Fremont', 'CA', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Meera', 'Krishnan', 'female', 'Estate Planning & Wills', '77479', 'Sugar Land', 'TX', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Deepak', 'Verma', 'male', 'Real Estate Law', '08817', 'Edison', 'NJ', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Aarti', 'Patel', 'female', 'Corporate & Business Law', '08830', 'Woodbridge', 'NJ', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Rajesh', 'Venkatesh', 'male', 'Immigration & Naturalization', '77478', 'Sugar Land', 'TX', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Divya', 'Reddy', 'female', 'Family Law & Divorce', '94538', 'Fremont', 'CA', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Sanjay', 'Mukherjee', 'male', 'Tax Law & Asset Protection', '08817', 'Edison', 'NJ', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Kiran', 'Desai', 'female', 'Estate Planning & Wills', '08840', 'Metuchen', 'NJ', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=256&h=256&q=80'],
            ['Vikram', 'Rao', 'male', 'Corporate & Business Law', '77479', 'Sugar Land', 'TX', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80']
        ];

        foreach ($moreNames as $entry) {
            $currentUserId = $userIds[$idx % $userCount];
            $fn = $entry[0];
            $ln = $entry[1];
            $gender = $entry[2];
            $specialty = $entry[3];
            $zip = $entry[4];
            $city = $entry[5];
            $state = $entry[6];
            $photo = $entry[7];

            $fnSlug = Str::slug($fn);
            $lnSlug = Str::slug($ln);
            $citySlug = Str::slug($city);
            $zipSlug = Str::slug($zip);
            $slug = "{$fnSlug}-{$lnSlug}-{$citySlug}-{$zipSlug}";

            // Geocode
            $lat = null;
            $lng = null;
            $zipData = UsaZipcode::where('zip', $zip)->first();
            if ($zipData) {
                $lat = $zipData->lat;
                $lng = $zipData->lng;
            }

            Attorney::create([
                'user_id' => $currentUserId,
                'slug' => $slug,
                'first_name' => $fn,
                'last_name' => $ln,
                'gender' => $gender,
                'profile_photo_url' => $photo,
                'short_bio' => "Experienced attorney specializing in {$specialty} services in {$city}.",
                'full_biography' => "{$fn} {$ln} is an attorney with years of dedicated practice in {$specialty}. Committed to providing customized legal plans, helping families and businesses resolve disputes, and achieving key legal outcomes.",
                'email' => strtolower("{$fn}.{$ln}@desiattorneys.com"),
                'phone' => '(510) 555-' . (9000 + $idx),
                'office_address_street' => '100 Main St, Suite ' . $idx,
                'office_address_city' => $city,
                'office_address_state' => $state,
                'office_address_zip' => $zip,
                'office_address_lat' => $lat,
                'office_address_lng' => $lng,
                'law_school' => 'Local State University School of Law',
                'law_degree' => 'JD',
                'graduation_year' => 2012,
                'practice_areas_json' => [$specialty],
                'states_licensed_json' => [
                    ['state' => $state, 'bar_number' => '' . (123456 + $idx), 'year_admitted' => 2012, 'status' => 'Active']
                ],
                'languages_json' => [
                    ['language' => 'Hindi', 'proficiency' => 'Fluent'],
                    ['language' => 'English', 'proficiency' => 'Native']
                ],
                'associations_json' => [
                    ['name' => 'South Asian Bar Association (SABA)', 'role' => 'Member']
                ],
                'legal_plans_json' => [
                    ['plan_name' => 'MetLife Legal Plans', 'provider' => 'MetLife', 'badge_color' => 'gold', 'verified' => true],
                    ['plan_name' => 'ARAG Legal Insurance', 'provider' => 'ARAG', 'badge_color' => 'blue', 'verified' => true],
                    ['plan_name' => 'LegalShield', 'provider' => 'LegalShield', 'badge_color' => 'green', 'verified' => true]
                ],
                'accepts_legal_plans' => true,
                'billing_model_json' => ['Hourly Rate', 'Flat Fee'],
                'profile_completeness' => 85,
                'profile_status' => 'active',
                'avg_rating' => 4.80,
                'review_count' => 12
            ]);

            $idx++;
        }
    }
}
