<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdditionalUsersSeeder extends Seeder
{
    public function run()
    {
        $csvData = "Aarav,Sharma,aarav183@sharklasers.com
Vivaan,Patel,vivaan742@sharklasers.com
Aditya,Gupta,aditya391@sharklasers.com
Vihaan,Singh,vihaan528@sharklasers.com
Arjun,Kumar,arjun614@sharklasers.com
Sai,Reddy,sai257@sharklasers.com
Krishna,Iyer,krishna836@sharklasers.com
Rohan,Nair,rohan471@sharklasers.com
Rahul,Joshi,rahul905@sharklasers.com
Karan,Malhotra,karan362@sharklasers.com
Ankit,Agarwal,ankit714@sharklasers.com
Varun,Saxena,varun248@sharklasers.com
Nikhil,Mishra,nikhil683@sharklasers.com
Siddharth,Jain,siddharth529@sharklasers.com
Harsh,Mehta,harsh176@sharklasers.com
Manav,Bansal,manav804@sharklasers.com
Akash,Verma,akash297@sharklasers.com
Deepak,Tiwari,deepak631@sharklasers.com
Ritesh,Yadav,ritesh452@sharklasers.com
Vikas,Chauhan,vikas918@sharklasers.com
Priya,Sharma,priya384@sharklasers.com
Ananya,Patel,ananya617@sharklasers.com
Aditi,Gupta,aditi251@sharklasers.com
Sneha,Singh,sneha743@sharklasers.com
Pooja,Kumar,pooja168@sharklasers.com
Kavya,Reddy,kavya592@sharklasers.com
Divya,Iyer,divya826@sharklasers.com
Neha,Nair,neha437@sharklasers.com
Meera,Joshi,meera781@sharklasers.com
Ishita,Jain,ishita354@sharklasers.com
Riya,Mehta,riya648@sharklasers.com
Nisha,Agarwal,nisha203@sharklasers.com
Swati,Verma,swati915@sharklasers.com
Shreya,Mishra,shreya472@sharklasers.com
Tanya,Yadav,tanya689@sharklasers.com
Komal,Chauhan,komal127@sharklasers.com
Pallavi,Saxena,pallavi573@sharklasers.com
Nandini,Bansal,nandini842@sharklasers.com
Bhavna,Tiwari,bhavna316@sharklasers.com
Sakshi,Malhotra,sakshi758@sharklasers.com
Abhishek,Sharma,abhishek264@sharklasers.com
Mohit,Patel,mohit891@sharklasers.com
Yash,Gupta,yash345@sharklasers.com
Pranav,Singh,pranav672@sharklasers.com
Aman,Kumar,aman518@sharklasers.com
Saurabh,Reddy,saurabh239@sharklasers.com
Nitin,Iyer,nitin764@sharklasers.com
Gaurav,Nair,gaurav482@sharklasers.com
Ajay,Joshi,ajay157@sharklasers.com
Vivek,Jain,vivek938@sharklasers.com
Hemant,Mehta,hemant624@sharklasers.com
Lokesh,Agarwal,lokesh371@sharklasers.com
Tarun,Verma,tarun805@sharklasers.com
Mukesh,Mishra,mukesh246@sharklasers.com
Dinesh,Yadav,dinesh719@sharklasers.com
Rajesh,Chauhan,rajesh583@sharklasers.com
Sunil,Saxena,sunil194@sharklasers.com
Mahesh,Bansal,mahesh862@sharklasers.com
Ashok,Tiwari,ashok435@sharklasers.com
Sanjay,Malhotra,sanjay708@sharklasers.com
Lakshmi,Sharma,lakshmi214@sharklasers.com
Sangeetha,Patel,sangeetha637@sharklasers.com
Revathi,Gupta,revathi589@sharklasers.com
Deepa,Singh,deepa742@sharklasers.com
Anu,Kumar,anu351@sharklasers.com
Geetha,Reddy,geetha864@sharklasers.com
Uma,Iyer,uma297@sharklasers.com
Radha,Nair,radha516@sharklasers.com
Vidhya,Joshi,vidhya723@sharklasers.com
Latha,Jain,latha184@sharklasers.com
Kirthika,Mehta,kirthika648@sharklasers.com
Harini,Agarwal,harini372@sharklasers.com
Janani,Verma,janani951@sharklasers.com
Keerthana,Mishra,keerthana426@sharklasers.com
Madhavi,Yadav,madhavi708@sharklasers.com
Vaishnavi,Chauhan,vaishnavi319@sharklasers.com
Shruti,Saxena,shruti865@sharklasers.com
Gayathri,Bansal,gayathri547@sharklasers.com
Anjali,Tiwari,anjali281@sharklasers.com
Bhavya,Malhotra,bhavya693@sharklasers.com
Raghav,Sharma,raghav417@sharklasers.com
Dhruv,Patel,dhruv852@sharklasers.com
Keshav,Gupta,keshav326@sharklasers.com
Atharv,Singh,atharv701@sharklasers.com
Parth,Kumar,parth248@sharklasers.com
Aryan,Reddy,aryan937@sharklasers.com
Ishan,Iyer,ishan564@sharklasers.com
Tejas,Nair,tejas192@sharklasers.com
Naveen,Joshi,naveen873@sharklasers.com
Pavan,Jain,pavan425@sharklasers.com
Rakesh,Mehta,rakesh781@sharklasers.com
Chetan,Agarwal,chetan316@sharklasers.com
Ravindra,Verma,ravindra654@sharklasers.com
Uday,Mishra,uday207@sharklasers.com
Vinay,Yadav,vinay842@sharklasers.com
Manoj,Chauhan,manoj579@sharklasers.com
Prakash,Saxena,prakash138@sharklasers.com
Kishore,Bansal,kishore926@sharklasers.com
Balaji,Tiwari,balaji453@sharklasers.com
Murali,Malhotra,murali687@sharklasers.com
Aishwarya,Sharma,aishwarya274@sharklasers.com
Nikita,Patel,nikita618@sharklasers.com
Trisha,Gupta,trisha943@sharklasers.com
Pavithra,Singh,pavithra352@sharklasers.com
Radhika,Kumar,radhika786@sharklasers.com
Sowmya,Reddy,sowmya219@sharklasers.com
Preethi,Iyer,preethi865@sharklasers.com
Monika,Nair,monika437@sharklasers.com
Rupali,Joshi,rupali571@sharklasers.com
Sheetal,Jain,sheetal824@sharklasers.com
Namrata,Mehta,namrata265@sharklasers.com
Kajal,Agarwal,kajal738@sharklasers.com
Mansi,Verma,mansi481@sharklasers.com
Payal,Mishra,payal193@sharklasers.com
Simran,Yadav,simran852@sharklasers.com
Rekha,Chauhan,rekha624@sharklasers.com
Usha,Saxena,usha347@sharklasers.com
Sarika,Bansal,sarika978@sharklasers.com
Jyoti,Tiwari,jyoti506@sharklasers.com
Renu,Malhotra,renu241@sharklasers.com
Arvind,Sharma,arvind863@sharklasers.com
Bharath,Patel,bharath529@sharklasers.com
Chirag,Gupta,chirag174@sharklasers.com
Dev,Singh,dev681@sharklasers.com
Eshwar,Kumar,eshwar342@sharklasers.com
Farhan,Reddy,farhan795@sharklasers.com
Ganesh,Iyer,ganesh218@sharklasers.com
Hari,Nair,hari947@sharklasers.com
Jatin,Joshi,jatin563@sharklasers.com
Kunal,Jain,kunal389@sharklasers.com
Lalit,Mehta,lalit820@sharklasers.com
Mayank,Agarwal,mayank471@sharklasers.com
Naresh,Verma,naresh205@sharklasers.com
Omkar,Mishra,omkar754@sharklasers.com
Praveen,Yadav,praveen638@sharklasers.com
Rohit,Chauhan,rohit192@sharklasers.com
Sameer,Saxena,sameer867@sharklasers.com
Tushar,Bansal,tushar426@sharklasers.com
Vignesh,Tiwari,vignesh573@sharklasers.com
Yogesh,Malhotra,yogesh814@sharklasers.com
Alka,Sharma,alka357@sharklasers.com
Bindu,Patel,bindu692@sharklasers.com
Chitra,Gupta,chitra184@sharklasers.com
Daksha,Singh,daksha925@sharklasers.com
Esha,Kumar,esha461@sharklasers.com
Falguni,Reddy,falguni703@sharklasers.com
Gauri,Iyer,gauri258@sharklasers.com
Heena,Nair,heena876@sharklasers.com
Indu,Joshi,indu314@sharklasers.com
Jyotsna,Jain,jyotsna648@sharklasers.com
Kalpana,Mehta,kalpana572@sharklasers.com
Leena,Agarwal,leena903@sharklasers.com
Mamta,Verma,mamta427@sharklasers.com
Nupur,Mishra,nupur681@sharklasers.com
Oviya,Yadav,oviya239@sharklasers.com
Padmini,Chauhan,padmini854@sharklasers.com
Rashmi,Saxena,rashmi361@sharklasers.com
Shalini,Bansal,shalini718@sharklasers.com
Tanvi,Tiwari,tanvi245@sharklasers.com
Urmila,Malhotra,urmila896@sharklasers.com
Adarsh,Sharma,adarsh517@sharklasers.com
Bhaskar,Patel,bhaskar842@sharklasers.com
Charan,Gupta,charan296@sharklasers.com
Darshan,Singh,darshan731@sharklasers.com
Eknath,Kumar,eknath483@sharklasers.com
Gokul,Reddy,gokul915@sharklasers.com
Hemanth,Iyer,hemanth274@sharklasers.com
Jagadeesh,Nair,jagadeesh658@sharklasers.com
Karthik,Joshi,karthik342@sharklasers.com
Madhan,Jain,madhan789@sharklasers.com
Naren,Mehta,naren123@sharklasers.com
Prithvi,Agarwal,prithvi574@sharklasers.com
Ramesh,Verma,ramesh861@sharklasers.com
Selvam,Mishra,selvam307@sharklasers.com
Tharun,Yadav,tharun694@sharklasers.com
Vasanth,Chauhan,vasanth248@sharklasers.com
Arathi,Saxena,arathi835@sharklasers.com
Brinda,Bansal,brinda476@sharklasers.com
Charulatha,Tiwari,charulatha582@sharklasers.com
Devi,Malhotra,devi913@sharklasers.com
Elakiya,Sharma,elakiya268@sharklasers.com
Haritha,Patel,haritha741@sharklasers.com
Ishwari,Gupta,ishwari395@sharklasers.com
Kalyani,Singh,kalyani864@sharklasers.com
Lavanya,Kumar,lavanya127@sharklasers.com
Mahalakshmi,Reddy,mahalakshmi578@sharklasers.com
Nivetha,Iyer,nivetha803@sharklasers.com
Poornima,Nair,poornima416@sharklasers.com
Rajalakshmi,Joshi,rajalakshmi692@sharklasers.com
Shobana,Jain,shobana254@sharklasers.com
Thenmozhi,Mehta,thenmozhi781@sharklasers.com
Yamini,Agarwal,yamini365@sharklasers.com";

        $lines = explode(PHP_EOL, trim($csvData));
        $password = Hash::make('Test123*');

        foreach ($lines as $line) {
            $parts = explode(',', trim($line));
            if (count($parts) === 3) {
                $firstName = $parts[0];
                $lastName = $parts[1];
                $email = $parts[2];
                $name = $firstName . ' ' . $lastName;
                
                $username = User::generateUniqueUsername($firstName, $lastName);

                User::updateOrCreate(
                    ['email' => $email],
                    [
                        'name' => $name,
                        'username' => $username,
                        'password' => $password,
                        'role' => 'user',
                        'status' => 'active'
                    ]
                );
            }
        }
    }
}
