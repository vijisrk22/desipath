<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\DoctorAffiliation;
use App\Models\DoctorAward;
use App\Models\User;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        if (!$user) return;

        // Doctor 1: Dr. Priya Krishnamurthy in Edison, NJ
        $d1 = Doctor::create([
            'user_id' => $user->id,
            'slug' => 'priya-krishnamurthy-edison-nj-08817',
            'first_name' => 'Priya',
            'last_name' => 'Krishnamurthy',
            'credential' => 'MD',
            'gender' => 'female',
            'npi_number' => '1007043673',
            'npi_verified' => true,
            'npi_verified_at' => now(),
            'headline' => 'Board Certified Family Physician & South Asian Diabetes Specialist',
            'bio' => 'Dr. Priya Krishnamurthy is a compassionate family physician with over 15 years of experience. She specializes in preventive care for South Asian families, focusing on insulin resistance, heart health, and vegetarian nutritional balancing. She welcomes visiting parents on tourist visas and provides comprehensive consults.',
            'primary_specialty' => 'Family Practice',
            'subspecialties_json' => ['Diabetic Care', 'Preventive Medicine', 'Geriatrics'],
            'board_certifications_json' => [
                ['board' => 'American Board of Family Medicine', 'specialty' => 'Family Medicine', 'year_certified' => 2008, 'year_recertified' => 2018]
            ],
            'conditions_treated_json' => ['Type 2 Diabetes', 'Hypertension', 'Hypercholesterolemia', 'Thyroid Disorders'],
            'procedures_json' => ['Joint Injections', 'Skin Biopsy', 'Annual Physicals', 'EKG Testing'],
            'indian_health_specialisations_json' => [
                'South Asian Diabetes Management',
                'Vegetarian Nutrition Planning',
                'Festival Fasting & Medication Timing',
                'Ayurvedic Integration'
            ],
            'practice_name' => 'Edison Primary Care & Wellness',
            'practice_type' => 'group',
            'primary_address_street' => '2050 Route 27, Suite 104',
            'primary_address_city' => 'Edison',
            'primary_address_state' => 'NJ',
            'primary_address_zip' => '08817',
            'primary_address_lat' => 40.5218,
            'primary_address_lng' => -74.3725,
            'phone' => '(732) 555-0199',
            'fax' => '(732) 555-0200',
            'email' => 'dr.priya@edisonprimary.com',
            'website_url' => 'https://www.edisonprimarycare.com',
            'appointment_booking_url' => 'https://zocdoc.com/doctor/priya-krishnamurthy',
            'telehealth_available' => true,
            'telehealth_states_json' => ['NJ', 'NY', 'PA'],
            'accepting_new_patients' => true,
            'same_day_available' => true,
            'insurance_plans_json' => ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Medicare'],
            'self_pay_accepted' => true,
            'self_pay_fee_min' => 120,
            'self_pay_fee_max' => 200,
            'medicaid_accepted' => false,
            'languages_json' => [
                ['language' => 'Tamil', 'proficiency' => 'Native'],
                ['language' => 'Hindi', 'proficiency' => 'Fluent'],
                ['language' => 'English', 'proficiency' => 'Native']
            ],
            'office_languages_json' => ['Tamil', 'Hindi', 'Gujarati', 'English'],
            'cultural_background' => 'South Indian (Chennai, Tamil Nadu)',
            'india_medical_training' => 'mbbs_india_us_residency',
            'india_medical_college' => 'MBBS - Madras Medical College (2002) | Residency - Robert Wood Johnson Medical School (2007)',
            'visiting_parents_care' => true,
            'medical_proxy_assistance' => true,
            'is_desi_doctor' => true,
            'nri_specialist' => true,
            'avg_rating' => 4.85,
            'review_count' => 18,
            'profile_status' => 'active',
        ]);

        $d1->affiliations()->create([
            'facility_name' => 'JFK University Medical Center',
            'facility_type' => 'hospital',
            'affiliation_type' => 'admitting',
            'address_street' => '65 James St',
            'address_city' => 'Edison',
            'address_state' => 'NJ',
            'address_zip' => '08820',
            'phone' => '(732) 321-7000',
            'cms_star_rating' => 4.0,
            'awards_json' => ['America\'s Best Hospitals']
        ]);

        $d1->awards()->create([
            'award_name' => 'Castle Connolly Top Doctor',
            'award_type' => 'castle_connolly',
            'awarding_org' => 'Castle Connolly Medical Ltd.',
            'years_json' => [2021, 2022, 2023, 2024],
            'badge_logo_url' => 'https://www.castleconnolly.com/images/topdoctor.png'
        ]);

        $d1->awards()->create([
            'award_name' => 'AAPI Distinguished Community Service Award',
            'award_type' => 'aapi',
            'awarding_org' => 'American Association of Physicians of Indian Origin',
            'years_json' => [2022]
        ]);

        // Doctor 2: Dr. Rajesh Patel in Fremont, CA
        $d2 = Doctor::create([
            'user_id' => $user->id,
            'slug' => 'rajesh-patel-fremont-ca-94536',
            'first_name' => 'Rajesh',
            'last_name' => 'Patel',
            'credential' => 'MD',
            'gender' => 'male',
            'npi_number' => '1027159821',
            'npi_verified' => true,
            'npi_verified_at' => now(),
            'headline' => 'Board Certified Cardiologist & Heart Health Advocate',
            'bio' => 'Dr. Rajesh Patel is a leading non-invasive cardiologist in Fremont, CA, specialized in hereditary cardiovascular risks in South Asian populations. He is dedicated to preventive screening and incorporates Indian diet analysis and yoga modifications to preserve heart health.',
            'primary_specialty' => 'Cardiology',
            'subspecialties_json' => ['Non-Invasive Cardiology', 'Echocardiography', 'Preventive Cardiology'],
            'board_certifications_json' => [
                ['board' => 'American Board of Internal Medicine', 'specialty' => 'Cardiovascular Disease', 'year_certified' => 2010, 'year_recertified' => 2020]
            ],
            'conditions_treated_json' => ['Coronary Artery Disease', 'Heart Failure', 'Arrhythmia', 'Hyperlipidemia'],
            'procedures_json' => ['Stress Echocardiogram', 'Holter Monitor', 'Cardiac Stress Test'],
            'indian_health_specialisations_json' => [
                'South Asian Diabetes Management',
                'Hereditary Conditions (South Asian)',
                'NRI Preventive Screening'
            ],
            'practice_name' => 'Silicon Valley Desi Cardiovascular Group',
            'practice_type' => 'group',
            'primary_address_street' => '39200 Liberty St, Suite B',
            'primary_address_city' => 'Fremont',
            'primary_address_state' => 'CA',
            'primary_address_zip' => '94536',
            'primary_address_lat' => 37.5684,
            'primary_address_lng' => -121.9934,
            'phone' => '(510) 555-0321',
            'fax' => '(510) 555-0322',
            'email' => 'dr.patel@svdesicardio.com',
            'website_url' => 'https://www.svdesicardio.com',
            'telehealth_available' => true,
            'telehealth_states_json' => ['CA'],
            'accepting_new_patients' => true,
            'same_day_available' => false,
            'insurance_plans_json' => ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'Kaiser Permanente', 'Medicare'],
            'self_pay_accepted' => true,
            'self_pay_fee_min' => 150,
            'self_pay_fee_max' => 250,
            'medicaid_accepted' => true,
            'languages_json' => [
                ['language' => 'Gujarati', 'proficiency' => 'Native'],
                ['language' => 'Hindi', 'proficiency' => 'Fluent'],
                ['language' => 'English', 'proficiency' => 'Native']
            ],
            'office_languages_json' => ['Gujarati', 'Hindi', 'English'],
            'cultural_background' => 'Gujarati (Ahmedabad, Gujarat)',
            'india_medical_training' => 'mbbs_india_us_residency',
            'india_medical_college' => 'MBBS - B.J. Medical College Ahmedabad (2005) | Residency - Mount Sinai Hospital NY (2009)',
            'visiting_parents_care' => true,
            'medical_proxy_assistance' => false,
            'is_desi_doctor' => true,
            'nri_specialist' => true,
            'avg_rating' => 4.90,
            'review_count' => 22,
            'profile_status' => 'active',
        ]);

        $d2->affiliations()->create([
            'facility_name' => 'Washington Hospital Healthcare System',
            'facility_type' => 'hospital',
            'affiliation_type' => 'admitting',
            'address_street' => '2000 Mowry Ave',
            'address_city' => 'Fremont',
            'address_state' => 'CA',
            'address_zip' => '94538',
            'phone' => '(510) 797-1111',
            'cms_star_rating' => 4.5
        ]);

        $d2->awards()->create([
            'award_name' => 'Bay Area Super Doctor',
            'award_type' => 'super_doctors',
            'awarding_org' => 'Super Doctors',
            'years_json' => [2022, 2023, 2024]
        ]);

        // Doctor 3: Dr. Suresh Kumar Reddy in Sugar Land, TX
        $d3 = Doctor::create([
            'user_id' => $user->id,
            'slug' => 'suresh-kumar-reddy-sugar-land-tx-77479',
            'first_name' => 'Suresh Kumar',
            'last_name' => 'Reddy',
            'credential' => 'MD',
            'gender' => 'male',
            'npi_number' => '1048239021',
            'npi_verified' => true,
            'npi_verified_at' => now(),
            'headline' => 'General Internist & Elderly Visiting Parents Care Advocate',
            'bio' => 'Dr. Suresh Kumar Reddy is an internal medicine physician in Sugar Land, TX. He specializes in managing complex chronic conditions in adults and has developed a custom clinic track specifically for elderly visiting parents on non-insurance consult basis.',
            'primary_specialty' => 'Internal Medicine',
            'subspecialties_json' => ['Geriatric Medicine', 'Chronic Disease Management'],
            'board_certifications_json' => [
                ['board' => 'American Board of Internal Medicine', 'specialty' => 'Internal Medicine', 'year_certified' => 2004, 'year_recertified' => 2014]
            ],
            'conditions_treated_json' => ['Arthritis', 'Osteoporosis', 'Diabetes', 'Chronic Kidney Disease'],
            'procedures_json' => ['Vaccinations', 'Annual Physicals', 'Lab Screenings'],
            'indian_health_specialisations_json' => [
                'South Asian Diabetes Management',
                'Vegetarian Nutrition Planning',
                'Visiting Parents Care',
                'India Medical Document Translation'
            ],
            'practice_name' => 'Reddy Medical & Geriatric Associates',
            'practice_type' => 'solo',
            'primary_address_street' => '16655 Southwest Fwy, Suite 320',
            'primary_address_city' => 'Sugar Land',
            'primary_address_state' => 'TX',
            'primary_address_zip' => '77479',
            'primary_address_lat' => 29.5898,
            'primary_address_lng' => -95.6316,
            'phone' => '(281) 555-0987',
            'fax' => '(281) 555-0988',
            'email' => 'dr.reddy@reddymedical.com',
            'website_url' => 'https://www.reddymedical.com',
            'telehealth_available' => true,
            'telehealth_states_json' => ['TX', 'FL'],
            'accepting_new_patients' => true,
            'same_day_available' => true,
            'insurance_plans_json' => ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'Medicare', 'Humana'],
            'self_pay_accepted' => true,
            'self_pay_fee_min' => 100,
            'self_pay_fee_max' => 150,
            'medicaid_accepted' => false,
            'languages_json' => [
                ['language' => 'Telugu', 'proficiency' => 'Native'],
                ['language' => 'Hindi', 'proficiency' => 'Fluent'],
                ['language' => 'English', 'proficiency' => 'Native']
            ],
            'office_languages_json' => ['Telugu', 'Hindi', 'English'],
            'cultural_background' => 'Telugu (Hyderabad, Telangana)',
            'india_medical_training' => 'mbbs_india_us_residency',
            'india_medical_college' => 'MBBS - Osmania Medical College (1998) | Residency - UTHealth Houston (2003)',
            'visiting_parents_care' => true,
            'medical_proxy_assistance' => true,
            'is_desi_doctor' => true,
            'nri_specialist' => true,
            'avg_rating' => 4.75,
            'review_count' => 14,
            'profile_status' => 'active',
        ]);

        $d3->affiliations()->create([
            'facility_name' => 'Houston Methodist Sugar Land Hospital',
            'facility_type' => 'hospital',
            'affiliation_type' => 'admitting',
            'address_street' => '16655 Southwest Fwy',
            'address_city' => 'Sugar Land',
            'address_state' => 'TX',
            'address_zip' => '77479',
            'phone' => '(281) 274-7000',
            'cms_star_rating' => 5.0
        ]);

        $d3->awards()->create([
            'award_name' => 'Texas Monthly Super Doctor',
            'award_type' => 'super_doctors',
            'awarding_org' => 'Texas Monthly',
            'years_json' => [2023, 2024]
        ]);
    }
}
