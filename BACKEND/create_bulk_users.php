<?php

$usersList = "
Aarav Sharma - aarav123@sharklasers.com
Vivaan Patel - vivaan123@sharklasers.com
Aditya Singh - aditya123@sharklasers.com
Arjun Gupta - arjun123@sharklasers.com
Sai Reddy - sai123@sharklasers.com
Krishna Nair - krishna123@sharklasers.com
Rahul Mehta - rahul123@sharklasers.com
Karthik Iyer - karthik123@sharklasers.com
Rohan Das - rohan123@sharklasers.com
Mohan Pillai - mohan123@sharklasers.com
Ananya Sharma - ananya123@sharklasers.com
Diya Patel - diya123@sharklasers.com
Isha Singh - isha123@sharklasers.com
Kavya Gupta - kavya123@sharklasers.com
Sneha Reddy - sneha123@sharklasers.com
Meera Nair - meera123@sharklasers.com
Pooja Mehta - pooja123@sharklasers.com
Aishwarya Iyer - aishwarya123@sharklasers.com
Neha Das - neha123@sharklasers.com
Lakshmi Pillai - lakshmi123@sharklasers.com
Varun Sharma - varun123@sharklasers.com
Nikhil Patel - nikhil123@sharklasers.com
Suresh Singh - suresh123@sharklasers.com
Rajesh Gupta - rajesh123@sharklasers.com
Ajay Reddy - ajay123@sharklasers.com
Manoj Nair - manoj123@sharklasers.com
Deepak Mehta - deepak123@sharklasers.com
Sanjay Iyer - sanjay123@sharklasers.com
Vijay Das - vijay123@sharklasers.com
Prakash Pillai - prakash123@sharklasers.com
Priya Sharma - priya123@sharklasers.com
Ritu Patel - ritu123@sharklasers.com
Swati Singh - swati123@sharklasers.com
Nisha Gupta - nisha123@sharklasers.com
Komal Reddy - komal123@sharklasers.com
Rekha Nair - rekha123@sharklasers.com
Shalini Mehta - shalini123@sharklasers.com
Divya Iyer - divya123@sharklasers.com
Poonam Das - poonam123@sharklasers.com
Radha Pillai - radha123@sharklasers.com
Akash Sharma - akash123@sharklasers.com
Imran Patel - imran123@sharklasers.com
Yusuf Singh - yusuf123@sharklasers.com
Sameer Gupta - sameer123@sharklasers.com
Farhan Reddy - farhan123@sharklasers.com
Zaid Nair - zaid123@sharklasers.com
Arif Mehta - arif123@sharklasers.com
Salman Iyer - salman123@sharklasers.com
Javed Das - javed123@sharklasers.com
Rizwan Pillai - rizwan123@sharklasers.com
Tanya Sharma - tanya123@sharklasers.com
Alia Patel - alia123@sharklasers.com
Sara Singh - sara123@sharklasers.com
Hina Gupta - hina123@sharklasers.com
Sana Reddy - sana123@sharklasers.com
Fatima Nair - fatima123@sharklasers.com
Zoya Mehta - zoya123@sharklasers.com
Amina Iyer - amina123@sharklasers.com
Nazia Das - nazia123@sharklasers.com
Shabana Pillai - shabana123@sharklasers.com
Dev Sharma - dev123@sharklasers.com
Harsh Patel - harsh123@sharklasers.com
Kunal Singh - kunal123@sharklasers.com
Tarun Gupta - tarun123@sharklasers.com
Gaurav Reddy - gaurav123@sharklasers.com
Lokesh Nair - lokesh123@sharklasers.com
Naveen Mehta - naveen123@sharklasers.com
Sandeep Iyer - sandeep123@sharklasers.com
Amit Das - amit123@sharklasers.com
Bharat Pillai - bharat123@sharklasers.com
Riya Sharma - riya123@sharklasers.com
Siya Patel - siya123@sharklasers.com
Anjali Singh - anjali123@sharklasers.com
Preeti Gupta - preeti123@sharklasers.com
Jyoti Reddy - jyoti123@sharklasers.com
Usha Nair - usha123@sharklasers.com
Lata Mehta - lata123@sharklasers.com
Bhavna Iyer - bhavna123@sharklasers.com
Kiran Das - kiran123@sharklasers.com
Sudha Pillai - sudha123@sharklasers.com
Om Sharma - om123@sharklasers.com
Tejas Patel - tejas123@sharklasers.com
Dhruv Singh - dhruv123@sharklasers.com
Yash Gupta - yash123@sharklasers.com
Ritesh Reddy - ritesh123@sharklasers.com
Vignesh Nair - vignesh123@sharklasers.com
Ashwin Mehta - ashwin123@sharklasers.com
Surya Iyer - surya123@sharklasers.com
Naveed Das - naveed123@sharklasers.com
Faizal Pillai - faizal123@sharklasers.com
Aarti Sharma - aarti123@sharklasers.com
Deepa Patel - deepa123@sharklasers.com
Monika Singh - monika123@sharklasers.com
Rachna Gupta - rachna123@sharklasers.com
Sushma Reddy - sushma123@sharklasers.com
Geeta Nair - geeta123@sharklasers.com
Hema Mehta - hema123@sharklasers.com
Revathi Iyer - revathi123@sharklasers.com
Sunita Das - sunita123@sharklasers.com
Malathi Pillai - malathi123@sharklasers.com
";

$lines = explode(PHP_EOL, trim($usersList));

foreach ($lines as $line) {
    if (empty(trim($line))) continue;
    
    // Replace the specific long dash from the prompt with a standard hyphen for easier splitting
    $line = str_replace('–', '-', $line);
    
    $parts = explode('-', $line);
    
    if (count($parts) >= 2) {
        $name = trim($parts[0]);
        $email = trim($parts[1]);
        
        $user = App\Models\User::where('email', $email)->first();
        if (!$user) {
            App\Models\User::create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt('Test123*'),
                'role' => 'user',
                'status' => 'Active',
                'email_verified_at' => now(),
            ]);
            echo "Created: $email\n";
        } else {
            echo "Exists: $email\n";
        }
    }
}
