import json, re

# Define lines and their official sequence of stations with coordinates
red_stations = [
    ("rithala", "Rithala", "रिठाला", 28.7208, 77.1072, False, []),
    ("rohini-west", "Rohini West", "रोहिणी पश्चिम", 28.7153, 77.1147, False, []),
    ("rohini-east", "Rohini East", "रोहिणी पूर्व", 28.7107, 77.1264, False, []),
    ("pitampura", "Pitampura", "पीतमपुरा", 28.7032, 77.1352, False, []),
    ("kohat-enclave", "Kohat Enclave", "कोहाट एन्क्लेव", 28.6978, 77.1423, False, []),
    ("netaji-subhash-place", "Netaji Subhash Place", "नेताजी सुभाष प्लेस", 28.6946, 77.1517, True, ["red", "pink"]),
    ("keshav-puram", "Keshav Puram", "केशव पुरम", 28.6904, 77.1612, False, []),
    ("kanhaiya-nagar", "Kanhaiya Nagar", "कन्हैया नगर", 28.6831, 77.1654, False, []),
    ("inderlok", "Inderlok", "इंदरलोक", 28.6734, 77.1697, True, ["red", "green"]),
    ("shastri-nagar", "Shastri Nagar", "शास्त्री नगर", 28.6698, 77.1812, False, []),
    ("pratap-nagar", "Pratap Nagar", "प्रताप नगर", 28.6668, 77.1956, False, []),
    ("pul-bangash", "Pul Bangash", "पुल बंगश", 28.6664, 77.2064, False, []),
    ("tis-hazari", "Tis Hazari", "तीस हजारी", 28.6672, 77.2173, False, []),
    ("kashmere-gate", "Kashmere Gate", "कश्मीरी गेट", 28.6675, 77.2285, True, ["red", "yellow", "violet"]),
    ("shastri-park", "Shastri Park", "शास्त्री पार्क", 28.6705, 77.2505, False, []),
    ("seelampur", "Seelampur", "सीलमपुर", 28.6698, 77.2654, False, []),
    ("welcome", "Welcome", "वेलकम", 28.6719, 77.2778, True, ["red", "pink"]),
    ("shahdara", "Shahdara", "शाहदरा", 28.6734, 77.2894, False, []),
    ("mansarovar-park", "Mansarovar Park", "मानसरोवर पार्क", 28.6765, 77.3005, False, []),
    ("jhilmil", "Jhilmil", "झिलमिल", 28.6784, 77.3123, False, []),
    ("dilshad-garden", "Dilshad Garden", "दिलशाद गार्डन", 28.6808, 77.3198, False, []),
    ("shahid-nagar", "Shahid Nagar", "शाहिद नगर", 28.6841, 77.3302, False, []),
    ("raj-bagh", "Raj Bagh", "राज बाग", 28.6865, 77.3412, False, []),
    ("major-mohit-sharma", "Major Mohit Sharma Rajendra Nagar", "मेजर मोहित शर्मा राजेंद्र नगर", 28.6892, 77.3524, False, []),
    ("shyam-park", "Shyam Park", "श्याम पार्क", 28.6923, 77.3621, False, []),
    ("mohan-nagar", "Mohan Nagar", "मोहन नगर", 28.6954, 77.3732, False, []),
    ("arthala", "Arthala", "अर्थला", 28.6985, 77.3845, False, []),
    ("hindon-river", "Hindon River", "हिंडन रिवर", 28.7012, 77.3956, False, []),
    ("shaheed-sthal", "Shaheed Sthal (New Bus Adda)", "शहीद स्थल (नया बस अड्डा)", 28.7042, 77.4068, False, [])
]

yellow_stations = [
    ("samaypur-badli", "Samaypur Badli", "समयपुर बादली", 28.7456, 77.1354, False, []),
    ("rohini-sec-18-19", "Rohini Sector 18-19", "रोहिणी सेक्टर 18-19", 28.7382, 77.1423, False, []),
    ("haiderpur-badli-mor", "Haiderpur Badli Mor", "हैदरपुर बादली मोड़", 28.7302, 77.1512, False, []),
    ("jahangirpuri", "Jahangirpuri", "जहाँगीरपुरी", 28.7245, 77.1601, False, []),
    ("adarsh-nagar", "Adarsh Nagar", "आदर्श नगर", 28.7154, 77.1702, False, []),
    ("azadpur", "Azadpur", "आजादपुर", 28.7065, 77.1802, True, ["yellow", "pink"]),
    ("model-town", "Model Town", "मॉडल टाउन", 28.6982, 77.1912, False, []),
    ("gtb-nagar", "Guru Tegh Bahadur Nagar", "गुरु तेग बहादुर नगर", 28.6923, 77.2054, False, []),
    ("vishwavidyalaya", "Vishwavidyalaya", "विश्वविद्यालय", 28.6872, 77.2142, False, []),
    ("vidhan-sabha", "Vidhan Sabha", "विधान सभा", 28.6792, 77.2215, False, []),
    ("civil-lines", "Civil Lines", "सिविल लाइन्स", 28.6741, 77.2254, False, []),
    ("kashmere-gate", "Kashmere Gate", "कश्मीरी गेट", 28.6675, 77.2285, True, ["yellow", "red", "violet"]),
    ("chandni-chowk", "Chandni Chowk", "चाँदनी चौक", 28.6582, 77.2301, False, []),
    ("chawri-bazar", "Chawri Bazar", "चावड़ी बाजार", 28.6502, 77.2272, False, []),
    ("new-delhi", "New Delhi Railway Station", "नई दिल्ली", 28.6431, 77.2223, True, ["yellow", "airport"]),
    ("rajiv-chowk", "Rajiv Chowk (Connaught Place)", "राजीव चौक", 28.6328, 77.2197, True, ["yellow", "blue"]),
    ("patel-chowk", "Patel Chowk", "पटेल चौक", 28.6231, 77.2142, False, []),
    ("central-secretariat", "Central Secretariat", "केंद्रीय सचिवालय", 28.6144, 77.2119, True, ["yellow", "violet"]),
    ("udyog-bhawan", "Udyog Bhawan", "उद्योग भवन", 28.6105, 77.2125, False, []),
    ("lok-kalyan-marg", "Lok Kalyan Marg", "लोक कल्याण मार्ग", 28.6012, 77.2085, False, []),
    ("jor-bagh", "Jor Bagh", "जोर बाग", 28.5892, 77.2125, False, []),
    ("dilli-haat-ina", "Dilli Haat - INA", "दिल्ली हाट - आईएनए", 28.5744, 77.2100, True, ["yellow", "pink"]),
    ("aiims", "AIIMS", "एम्स", 28.5684, 77.2085, False, []),
    ("green-park", "Green Park", "ग्रीन पार्क", 28.5582, 77.2054, False, []),
    ("hauz-khas", "Hauz Khas", "हौज खास", 28.5432, 77.2065, True, ["yellow", "magenta"]),
    ("malviya-nagar", "Malviya Nagar", "मालवीय नगर", 28.5321, 77.2062, False, []),
    ("saket", "Saket", "साकेत", 28.5205, 77.2024, False, []),
    ("qutab-minar", "Qutab Minar", "कुतुब मीनार", 28.5132, 77.1856, False, []),
    ("chhatarpur", "Chhatarpur", "छतरपुर", 28.5054, 77.1742, False, []),
    ("sultanpur", "Sultanpur", "सुल्तानपुर", 28.4982, 77.1623, False, []),
    ("ghitorni", "Ghitorni", "घिटोरनी", 28.4921, 77.1485, False, []),
    ("arjan-garh", "Arjan Garh", "अर्जन गढ़", 28.4812, 77.1264, False, []),
    ("guru-dronacharya", "Guru Dronacharya", "गुरु द्रोणाचार्य", 28.4824, 77.1023, False, []),
    ("sikanderpur", "Sikanderpur", "सिकंदरपुर", 28.4815, 77.0924, True, ["yellow", "rapid_metro"]),
    ("mg-road", "MG Road Gurgaon", "एम जी रोड", 28.4795, 77.0805, False, []),
    ("iffco-chowk", "IFFCO Chowk", "इफको चौक", 28.4723, 77.0712, False, []),
    ("millennium-city-centre", "Millennium City Centre Gurugram", "मिलेनियम सिटी सेंटर गुरुग्राम", 28.4592, 77.0725, False, [])
]

blue_main_stations = [
    ("dwarka-sec-21", "Dwarka Sector 21", "द्वारका सेक्टर 21", 28.5523, 77.0584, True, ["blue", "airport"]),
    ("dwarka-sec-8", "Dwarka Sector 8", "द्वारका सेक्टर 8", 28.5654, 77.0672, False, []),
    ("dwarka-sec-9", "Dwarka Sector 9", "द्वारका सेक्टर 9", 28.5742, 77.0645, False, []),
    ("dwarka-sec-10", "Dwarka Sector 10", "द्वारका सेक्टर 10", 28.5812, 77.0582, False, []),
    ("dwarka-sec-11", "Dwarka Sector 11", "द्वारका सेक्टर 11", 28.5884, 77.0505, False, []),
    ("dwarka-sec-12", "Dwarka Sector 12", "द्वारका सेक्टर 12", 28.5925, 77.0402, False, []),
    ("dwarka-sec-13", "Dwarka Sector 13", "द्वारका सेक्टर 13", 28.6012, 77.0345, False, []),
    ("dwarka-sec-14", "Dwarka Sector 14", "द्वारका सेक्टर 14", 28.6085, 77.0282, False, []),
    ("dwarka", "Dwarka", "द्वारका", 28.6145, 77.0225, True, ["blue", "grey"]),
    ("dwarka-mor", "Dwarka Mor", "द्वारका मोड़", 28.6192, 77.0325, False, []),
    ("nawada", "Nawada", "नवादा", 28.6205, 77.0442, False, []),
    ("uttam-nagar-west", "Uttam Nagar West", "उत्तम नगर पश्चिम", 28.6212, 77.0563, False, []),
    ("uttam-nagar-east", "Uttam Nagar East", "उत्तम नगर पूर्व", 28.6225, 77.0664, False, []),
    ("janakpuri-west", "Janakpuri West", "जनकपुरी पश्चिम", 28.6293, 77.0778, True, ["blue", "magenta"]),
    ("janakpuri-east", "Janakpuri East", "जनकपुरी पूर्व", 28.6321, 77.0874, False, []),
    ("tilak-nagar", "Tilak Nagar", "तिलक नगर", 28.6364, 77.0965, False, []),
    ("subhash-nagar", "Subhash Nagar", "सुभाष नगर", 28.6402, 77.1054, False, []),
    ("tagore-garden", "Tagore Garden", "टैगोर गार्डन", 28.6442, 77.1142, False, []),
    ("rajouri-garden", "Rajouri Garden", "राजौरी गार्डन", 28.6492, 77.1235, True, ["blue", "pink"]),
    ("ramesh-nagar", "Ramesh Nagar", "रमेश नगर", 28.6534, 77.1324, False, []),
    ("moti-nagar", "Moti Nagar", "मोती नगर", 28.6582, 77.1425, False, []),
    ("kirti-nagar", "Kirti Nagar", "कीर्ति नगर", 28.6554, 77.1524, True, ["blue", "green"]),
    ("shadipur", "Shadipur", "शादीपुर", 28.6512, 77.1605, False, []),
    ("patel-nagar", "Patel Nagar", "पटेल नगर", 28.6482, 77.1702, False, []),
    ("rajendra-place", "Rajendra Place", "राजेंद्र प्लेस", 28.6445, 77.1805, False, []),
    ("karol-bagh", "Karol Bagh", "करोल बाग", 28.6432, 77.1912, False, []),
    ("jhandewalan", "Jhandewalan", "झंडेवालान", 28.6441, 77.2012, False, []),
    ("rk-ashram-marg", "RK Ashram Marg", "आरके आश्रम मार्ग", 28.6392, 77.2098, False, []),
    ("rajiv-chowk", "Rajiv Chowk (Connaught Place)", "राजीव चौक", 28.6328, 77.2197, True, ["blue", "yellow"]),
    ("barakhamba-road", "Barakhamba Road", "बाराखंभा रोड", 28.6312, 77.2272, False, []),
    ("mandi-house", "Mandi House", "मंडी हाउस", 28.6258, 77.2344, True, ["blue", "violet"]),
    ("supreme-court", "Supreme Court (Pragati Maidan)", "सुप्रीम कोर्ट", 28.6212, 77.2435, False, []),
    ("indraprastha", "Indraprastha", "इंद्रप्रस्थ", 28.6205, 77.2512, False, []),
    ("yamuna-bank", "Yamuna Bank", "यमुना बैंक", 28.6225, 77.2654, True, ["blue"]),
    ("akshardham", "Akshardham", "अक्षरधाम", 28.6184, 77.2795, False, []),
    ("mayur-vihar-1", "Mayur Vihar-I", "मयूर विहार-1", 28.6052, 77.2912, True, ["blue", "pink"]),
    ("mayur-vihar-pocket-1", "Mayur Vihar Pocket-1", "मयूर विहार पॉकेट-1", 28.5995, 77.2985, False, []),
    ("mayur-vihar-phase-1-ext", "Mayur Vihar Phase-1 Ext", "मयूर विहार फेज-1 एक्सटेंशन", 28.5952, 77.3065, False, []),
    ("new-ashok-nagar", "New Ashok Nagar", "न्यू अशोक नगर", 28.5892, 77.3125, False, []),
    ("noida-sec-15", "Noida Sector 15", "नोएडा सेक्टर 15", 28.5842, 77.3185, False, []),
    ("noida-sec-16", "Noida Sector 16", "नोएडा सेक्टर 16", 28.5785, 77.3235, False, []),
    ("noida-sec-18", "Noida Sector 18", "नोएडा सेक्टर 18", 28.5712, 77.3275, False, []),
    ("botanical-garden", "Botanical Garden Noida", "बॉटनिकल गार्डन", 28.5641, 77.3341, True, ["blue", "magenta"]),
    ("golf-course", "Golf Course Noida", "गोल्फ कोर्स", 28.5672, 77.3452, False, []),
    ("noida-city-centre", "Noida City Centre", "नोएडा सिटी सेंटर", 28.5742, 77.3565, False, []),
    ("noida-sec-34", "Noida Sector 34", "नोएडा सेक्टर 34", 28.5805, 77.3685, False, []),
    ("noida-sec-52", "Noida Sector 52", "नोएडा सेक्टर 52", 28.5892, 77.3795, False, []),
    ("noida-sec-61", "Noida Sector 61", "नोएडा सेक्टर 61", 28.5985, 77.3885, False, []),
    ("noida-sec-59", "Noida Sector 59", "नोएडा सेक्टर 59", 28.6075, 77.3985, False, []),
    ("noida-sec-62", "Noida Sector 62", "नोएडा सेक्टर 62", 28.6185, 77.4085, False, []),
    ("noida-electronic-city", "Noida Electronic City", "नोएडा इलेक्ट्रॉनिक सिटी", 28.6275, 77.4185, False, [])
]

blue_vaishali_stations = [
    ("yamuna-bank", "Yamuna Bank", "यमुना बैंक", 28.6225, 77.2654, True, ["blue"]),
    ("laxmi-nagar", "Laxmi Nagar", "लक्ष्मी नगर", 28.6305, 77.2775, False, []),
    ("nirman-vihar", "Nirman Vihar", "निर्माण विहार", 28.6365, 77.2865, False, []),
    ("preet-vihar", "Preet Vihar", "प्रीत विहार", 28.6415, 77.2965, False, []),
    ("karkarduma", "Karkarduma", "कड़कड़डूमा", 28.6485, 77.3065, True, ["blue", "pink"]),
    ("anand-vihar", "Anand Vihar ISBT", "आनंद विहार", 28.6468, 77.3161, True, ["blue", "pink"]),
    ("kaushambi", "Kaushambi", "कौशाम्बी", 28.6455, 77.3245, False, []),
    ("vaishali", "Vaishali", "वैशाली", 28.6445, 77.3395, False, [])
]

violet_stations = [
    ("kashmere-gate", "Kashmere Gate", "कश्मीरी गेट", 28.6675, 77.2285, True, ["violet", "red", "yellow"]),
    ("lal-quila", "Lal Quila", "लाल किला", 28.6575, 77.2372, False, []),
    ("jama-masjid", "Jama Masjid", "जामा मस्जिद", 28.6505, 77.2375, False, []),
    ("delhi-gate", "Delhi Gate", "दिल्ली गेट", 28.6412, 77.2405, False, []),
    ("ito", "ITO", "आईटीओ", 28.6305, 77.2405, False, []),
    ("mandi-house", "Mandi House", "मंडी हाउस", 28.6258, 77.2344, True, ["violet", "blue"]),
    ("janpath", "Janpath", "जनपथ", 28.6245, 77.2185, False, []),
    ("central-secretariat", "Central Secretariat", "केंद्रीय सचिवालय", 28.6144, 77.2119, True, ["violet", "yellow"]),
    ("khan-market", "Khan Market", "खान मार्केट", 28.6015, 77.2275, False, []),
    ("jln-stadium", "Jawaharlal Nehru Stadium", "जवाहरलाल नेहरू स्टेडियम", 28.5895, 77.2355, False, []),
    ("jangpura", "Jangpura", "जंगपुरा", 28.5815, 77.2415, False, []),
    ("lajpat-nagar", "Lajpat Nagar", "लाजपत नगर", 28.5707, 77.2374, True, ["violet", "pink"]),
    ("moolchand", "Moolchand", "मूलचंद", 28.5645, 77.2355, False, []),
    ("kailash-colony", "Kailash Colony", "कैलाश कॉलोनी", 28.5555, 77.2415, False, []),
    ("nehru-place", "Nehru Place", "नेहरू प्लेस", 28.5495, 77.2515, False, []),
    ("kalkaji-mandir", "Kalkaji Mandir", "कालकाजी मंदिर", 28.5499, 77.2588, True, ["violet", "magenta"]),
    ("govind-puri", "Govind Puri", "गोविंद पुरी", 28.5395, 77.2645, False, []),
    ("harkesh-nagar-okhla", "Harkesh Nagar Okhla", "हरकेश नगर ओखला", 28.5315, 77.2725, False, []),
    ("jasola-apollo", "Jasola Apollo", "जसोला अपोलो", 28.5285, 77.2845, False, []),
    ("sarita-vihar", "Sarita Vihar", "सरिता विहार", 28.5185, 77.2925, False, []),
    ("mohan-estate", "Mohan Estate", "मोहन एस्टेट", 28.5085, 77.3015, False, []),
    ("tughlakabad", "Tughlakabad Station", "तुगलकाबाद स्टेशन", 28.5005, 77.3085, False, []),
    ("badarpur-border", "Badarpur Border", "बदरपुर बॉर्डर", 28.4915, 77.3095, False, []),
    ("sarai", "Sarai", "सराय", 28.4795, 77.3115, False, []),
    ("nhpc-chowk", "NHPC Chowk", "एनएचपीसी चौक", 28.4685, 77.3135, False, []),
    ("mewala-maharajpur", "Mewala Maharajpur", "मेवला महाराजपुर", 28.4555, 77.3155, False, []),
    ("sector-28-faridabad", "Sector 28 Faridabad", "सेक्टर 28", 28.4415, 77.3165, False, []),
    ("badkal-mor", "Badkal Mor", "बड़कल मोड़", 28.4285, 77.3175, False, []),
    ("old-faridabad", "Old Faridabad", "ओल्ड फरीदाबाद", 28.4135, 77.3175, False, []),
    ("neelam-chowk-ajronda", "Neelam Chowk Ajronda", "नीलम चौक अजरौंदा", 28.3985, 77.3165, False, []),
    ("bata-chowk", "Bata Chowk", "बाटा चौक", 28.3845, 77.3155, False, []),
    ("escorts-mujesar", "Escorts Mujesar", "एस्कॉर्ट्स मुजेसर", 28.3715, 77.3145, False, []),
    ("sant-surdas-sihi", "Sant Surdas (Sihi)", "संत सूरदास (सीही)", 28.3585, 77.3205, False, []),
    ("raja-nahar-singh", "Raja Nahar Singh (Ballabhgarh)", "राजा नाहर सिंह", 28.3425, 77.3255, False, [])
]

magenta_stations = [
    ("janakpuri-west", "Janakpuri West", "जनकपुरी पश्चिम", 28.6293, 77.0778, True, ["magenta", "blue"]),
    ("dabri-mor", "Dabri Mor - South Delhi", "डाबरी मोड़", 28.6185, 77.0855, False, []),
    ("dashrath-puri", "Dashrath Puri", "दशरथ पुरी", 28.6085, 77.0895, False, []),
    ("palam", "Palam", "पालम", 28.5915, 77.0845, False, []),
    ("sadar-bazar-cantt", "Sadar Bazar Cantonment", "सदर बाजार कैंट", 28.5815, 77.1085, False, []),
    ("igi-t1", "Terminal 1 IGI Airport", "टर्मिनल 1 आईजीआई एयरपोर्ट", 28.5635, 77.1195, False, []),
    ("shankar-vihar", "Shankar Vihar", "शंकर विहार", 28.5585, 77.1355, False, []),
    ("vasant-vihar", "Vasant Vihar", "वसंत विहार", 28.5615, 77.1575, False, []),
    ("munirka", "Munirka", "मुनीरका", 28.5585, 77.1735, False, []),
    ("rk-puram", "RK Puram", "आरके पुरम", 28.5545, 77.1855, False, []),
    ("iit-delhi", "IIT Delhi", "आईआईटी दिल्ली", 28.5475, 77.1955, False, []),
    ("hauz-khas", "Hauz Khas", "हौज खास", 28.5432, 77.2065, True, ["magenta", "yellow"]),
    ("panchsheel-park", "Panchsheel Park", "पंचशील पार्क", 28.5425, 77.2185, False, []),
    ("chirag-delhi", "Chirag Delhi", "चिराग दिल्ली", 28.5415, 77.2285, False, []),
    ("greater-kailash", "Greater Kailash", "ग्रेटर कैलाश", 28.5425, 77.2395, False, []),
    ("nehru-enclave", "Nehru Enclave", "नेहरू एन्क्लेव", 28.5465, 77.2485, False, []),
    ("kalkaji-mandir", "Kalkaji Mandir", "कालकाजी मंदिर", 28.5499, 77.2588, True, ["magenta", "violet"]),
    ("okhla-nsic", "Okhla NSIC", "ओखला एनएसआईसी", 28.5515, 77.2685, False, []),
    ("sukhdev-vihar", "Sukhdev Vihar", "सुखदेव विहार", 28.5575, 77.2795, False, []),
    ("jamia-millia-islamia", "Jamia Millia Islamia", "जामिया मिल्लिया इस्लामिया", 28.5615, 77.2885, False, []),
    ("okhla-vihar", "Okhla Vihar", "ओखला विहार", 28.5585, 77.2975, False, []),
    ("jasola-vihar", "Jasola Vihar Shaheen Bagh", "जसोला विहार शाहीन बाग", 28.5515, 77.3055, False, []),
    ("kalindi-kunj", "Kalindi Kunj", "कालिंदी कुंज", 28.5475, 77.3145, False, []),
    ("okhla-bird-sanctuary", "Okhla Bird Sanctuary", "ओखला बर्ड सेंचुरी", 28.5515, 77.3245, False, []),
    ("botanical-garden", "Botanical Garden Noida", "बॉटनिकल गार्डन", 28.5641, 77.3341, True, ["magenta", "blue"])
]

pink_stations = [
    ("majlis-park", "Majlis Park", "मजलिस पार्क", 28.7185, 77.1775, False, []),
    ("azadpur", "Azadpur", "आजादपुर", 28.7065, 77.1802, True, ["pink", "yellow"]),
    ("shalimar-bagh", "Shalimar Bagh", "शालीमार बाग", 28.7015, 77.1685, False, []),
    ("netaji-subhash-place", "Netaji Subhash Place", "नेताजी सुभाष प्लेस", 28.6946, 77.1517, True, ["pink", "red"]),
    ("shakurpur", "Shakurpur", "शकूरपुर", 28.6875, 77.1425, False, []),
    ("punjabi-bagh-west", "Punjabi Bagh West", "पंजाबी बाग पश्चिम", 28.6715, 77.1355, True, ["pink", "green"]),
    ("esi-basaidarapur", "ESI-Basaidarapur", "ईएसआई बसईदारापुर", 28.6605, 77.1275, False, []),
    ("rajouri-garden", "Rajouri Garden", "राजौरी गार्डन", 28.6492, 77.1235, True, ["pink", "blue"]),
    ("maya-puri", "Maya Puri", "माया पुरी", 28.6365, 77.1275, False, []),
    ("naraina-vihar", "Naraina Vihar", "नारायणा विहार", 28.6255, 77.1365, False, []),
    ("delhi-cantt", "Delhi Cantt", "दिल्ली कैंट", 28.6015, 77.1495, False, []),
    ("durgabai-deshmukh", "Durgabai Deshmukh South Campus", "दुर्गाबाई देशमुख साउथ कैंपस", 28.5915, 77.1615, True, ["pink", "airport"]),
    ("sir-m-vishweshwaraiah", "Sir M. Vishweshwaraiah Moti Bagh", "मोती बाग", 28.5845, 77.1715, False, []),
    ("bhikaji-cama-place", "Bhikaji Cama Place", "भीकाजी कामा प्लेस", 28.5715, 77.1855, False, []),
    ("sarojini-nagar", "Sarojini Nagar", "सरोजिनी नगर", 28.5745, 77.1985, False, []),
    ("dilli-haat-ina", "Dilli Haat - INA", "दिल्ली हाट - आईएनए", 28.5744, 77.2100, True, ["pink", "yellow"]),
    ("south-extension", "South Extension", "साउथ एक्सटेंशन", 28.5695, 77.2215, False, []),
    ("lajpat-nagar", "Lajpat Nagar", "लाजपत नगर", 28.5707, 77.2374, True, ["pink", "violet"]),
    ("vinobapuri", "Vinobapuri", "विनोबापुरी", 28.5715, 77.2485, False, []),
    ("ashram", "Ashram", "आश्रम", 28.5715, 77.2595, False, []),
    ("sarai-kale-khan", "Sarai Kale Khan - Nizamuddin", "सराय काले खां", 28.5888, 77.2541, False, []),
    ("mayur-vihar-1", "Mayur Vihar-I", "मयूर विहार-1", 28.6052, 77.2912, True, ["pink", "blue"]),
    ("mayur-vihar-pocket-1", "Mayur Vihar Pocket-1", "मयूर विहार पॉकेट-1", 28.5995, 77.2985, False, []),
    ("trilokpuri-sanjay-lake", "Trilokpuri-Sanjay Lake", "त्रिलोकपुरी-संजय झील", 28.6115, 77.3055, False, []),
    ("east-vinod-nagar", "East Vinod Nagar-Mayur Vihar-II", "ईस्ट विनोद नगर", 28.6215, 77.3085, False, []),
    ("mandawali", "Mandawali-West Vinod Nagar", "मंडावली", 28.6295, 77.3095, False, []),
    ("ip-extension", "IP Extension", "आईपी एक्सटेंशन", 28.6385, 77.3115, False, []),
    ("anand-vihar", "Anand Vihar ISBT", "आनंद विहार", 28.6468, 77.3161, True, ["pink", "blue"]),
    ("karkarduma", "Karkarduma", "कड़कड़डूमा", 28.6485, 77.3065, True, ["pink", "blue"]),
    ("karkarduma-court", "Karkarduma Court", "कड़कड़डूमा कोर्ट", 28.6545, 77.2995, False, []),
    ("krishna-nagar", "Krishna Nagar", "कृष्णा नगर", 28.6595, 77.2915, False, []),
    ("east-azad-nagar", "East Azad Nagar", "ईस्ट आजाद नगर", 28.6655, 77.2845, False, []),
    ("welcome", "Welcome", "वेलकम", 28.6719, 77.2778, True, ["pink", "red"]),
    ("jafrabad", "Jafrabad", "जाफराबाद", 28.6815, 77.2735, False, []),
    ("maujpur-babarpur", "Maujpur-Babarpur", "मौजपुर-बाबरपुर", 28.6895, 77.2705, False, []),
    ("gokulpuri", "Gokulpuri", "गोकलपुरी", 28.6985, 77.2685, False, []),
    ("johri-enclave", "Johri Enclave", "जौहरी एन्क्लेव", 28.7085, 77.2665, False, []),
    ("shiv-vihar", "Shiv Vihar", "शिव विहार", 28.7185, 77.2655, False, [])
]

green_stations = [
    ("brigadier-hoshiar-singh", "Brigadier Hoshiar Singh (Bahadurgarh)", "ब्रिगेडियर होशियार सिंह", 28.6915, 76.9215, False, []),
    ("bahadurgarh-city", "Bahadurgarh City", "बहादुरगढ़ सिटी", 28.6885, 76.9385, False, []),
    ("pandit-shree-ram", "Pandit Shree Ram Sharma", "पंडित श्री राम शर्मा", 28.6845, 76.9555, False, []),
    ("tikri-border", "Tikri Border", "टीकरी बॉर्डर", 28.6815, 76.9745, False, []),
    ("tikri-kalan", "Tikri Kalan", "टीकरी कलां", 28.6795, 76.9895, False, []),
    ("ghevra", "Ghevra Metro Station", "घेवरा", 28.6785, 77.0095, False, []),
    ("mundka-industrial-area", "Mundka Industrial Area", "मुंडका इंडस्ट्रियल एरिया", 28.6785, 77.0255, False, []),
    ("mundka", "Mundka", "मुंडका", 28.6785, 77.0395, False, []),
    ("rajdhani-park", "Rajdhani Park", "राजधानी पार्क", 28.6785, 77.0545, False, []),
    ("nangloi-rly-station", "Nangloi Railway Station", "नांगलोई रेलवे स्टेशन", 28.6785, 77.0655, False, []),
    ("nangloi", "Nangloi", "नांगलोई", 28.6785, 77.0755, False, []),
    ("surajmal-stadium", "Surajmal Stadium", "सूरजमल स्टेडियम", 28.6785, 77.0855, False, []),
    ("udyog-nagar", "Udyog Nagar", "उद्योग नगर", 28.6785, 77.0955, False, []),
    ("peera-garhi", "Peera Garhi", "पीरा गढ़ी", 28.6785, 77.1085, False, []),
    ("paschim-vihar-west", "Paschim Vihar West", "पश्चिम विहार पश्चिम", 28.6775, 77.1185, False, []),
    ("paschim-vihar-east", "Paschim Vihar East", "पश्चिम विहार पूर्व", 28.6765, 77.1275, False, []),
    ("madipur", "Madipur", "मादीपुर", 28.6745, 77.1355, False, []),
    ("shivaji-park", "Shivaji Park", "शिवाजी पार्क", 28.6725, 77.1425, False, []),
    ("punjabi-bagh", "Punjabi Bagh", "पंजाबी बाग", 28.6715, 77.1515, False, []),
    ("ashok-park-main", "Ashok Park Main", "अशोक पार्क मेन", 28.6725, 77.1615, False, []),
    ("inderlok", "Inderlok", "इंदरलोक", 28.6734, 77.1697, True, ["green", "red"])
]

airport_stations = [
    ("new-delhi", "New Delhi Railway Station", "नई दिल्ली", 28.6431, 77.2223, True, ["airport", "yellow"]),
    ("shivaji-stadium", "Shivaji Stadium (CP)", "शिवाजी स्टेडियम", 28.6295, 77.2115, False, []),
    ("dhaula-kuan", "Dhaula Kuan", "धौला कुआँ", 28.5929, 77.1628, True, ["airport", "pink"]),
    ("delhi-aerocity", "Delhi Aerocity", "दिल्ली एरोसिटी", 28.5555, 77.1215, False, []),
    ("igi-t3", "IGI Airport Terminal 3", "आईजीआई एयरपोर्ट टर्मिनल 3", 28.5565, 77.0855, False, []),
    ("dwarka-sec-21", "Dwarka Sector 21", "द्वारका सेक्टर 21", 28.5523, 77.0584, True, ["airport", "blue"]),
    ("yashobhoomi-sec-25", "Yashobhoomi Dwarka Sector 25", "यशोभूमि द्वारका सेक्टर 25", 28.5445, 77.0425, False, [])
]

grey_stations = [
    ("dwarka", "Dwarka", "द्वारका", 28.6145, 77.0225, True, ["grey", "blue"]),
    ("nangli", "Nangli", "नांगली", 28.6165, 77.0055, False, []),
    ("najafgarh", "Najafgarh", "नजफगढ़", 28.6125, 76.9855, False, []),
    ("dhansa-bus-stand", "Dhansa Bus Stand", "ढांसा बस स्टैंड", 28.6045, 76.9695, False, [])
]

rapid_metro_stations = [
    ("sector-55-56", "Sector 55-56 Gurgaon", "सेक्टर 55-56", 28.4235, 77.1085, False, []),
    ("sector-54-chowk", "Sector 54 Chowk", "सेक्टर 54 चौक", 28.4355, 77.1055, False, []),
    ("sector-53-54", "Sector 53-54", "सेक्टर 53-54", 28.4485, 77.1025, False, []),
    ("sector-42-43", "Sector 42-43", "सेक्टर 42-43", 28.4595, 77.0985, False, []),
    ("phase-1", "Phase 1 DLF", "फेज 1", 28.4715, 77.0955, False, []),
    ("sikanderpur", "Sikanderpur", "सिकंदरपुर", 28.4815, 77.0924, True, ["rapid_metro", "yellow"]),
    ("phase-2", "Phase 2 DLF", "फेज 2", 28.4905, 77.0915, False, []),
    ("belvedere-towers", "Belvedere Towers", "बेलवेडियर टावर्स", 28.4985, 77.0925, False, []),
    ("cyber-city", "Cyber City", "साइबर सिटी", 28.5025, 77.0895, False, []),
    ("moulsari-avenue", "Moulsari Avenue", "मौलसारी एवेन्यू", 28.5035, 77.0825, False, []),
    ("phase-3", "Phase 3 DLF", "फेज 3", 28.4975, 77.0855, False, [])
]

# Consolidate all stations into a single map
station_dict = {}

def add_station(st_tuple, line_id):
    sid, name, name_hi, lat, lng, is_xfer, xfer_lines = st_tuple
    if sid not in station_dict:
        station_dict[sid] = {
            "id": sid,
            "name": name,
            "nameHindi": name_hi,
            "lineIds": [line_id],
            "lines": [],
            "isInterchange": is_xfer,
            "interchangeLines": list(xfer_lines),
            "lat": lat,
            "lng": lng,
            "firstTrain": "05:30 AM",
            "lastTrain": "11:30 PM",
            "facilities": ["Elevator", "Escalator", "Smart Card Gates", "CCTV", "Toilets"]
        }
    else:
        if line_id not in station_dict[sid]["lineIds"]:
            station_dict[sid]["lineIds"].append(line_id)
        if is_xfer:
            station_dict[sid]["isInterchange"] = True
            for xl in xfer_lines:
                if xl not in station_dict[sid]["interchangeLines"]:
                    station_dict[sid]["interchangeLines"].append(xl)

for st in red_stations: add_station(st, "red")
for st in yellow_stations: add_station(st, "yellow")
for st in blue_main_stations: add_station(st, "blue")
for st in blue_vaishali_stations: add_station(st, "blue")
for st in green_stations: add_station(st, "green")
for st in violet_stations: add_station(st, "violet")
for st in pink_stations: add_station(st, "pink")
for st in magenta_stations: add_station(st, "magenta")
for st in airport_stations: add_station(st, "airport")
for st in grey_stations: add_station(st, "grey")
for st in rapid_metro_stations: add_station(st, "rapid_metro")

# Line names map
line_name_map = {
    "red": "Red Line",
    "yellow": "Yellow Line",
    "blue": "Blue Line",
    "green": "Green Line",
    "violet": "Violet Line",
    "pink": "Pink Line",
    "magenta": "Magenta Line",
    "airport": "Airport Express",
    "grey": "Grey Line",
    "rapid_metro": "Rapid Metro"
}

for sid, st in station_dict.items():
    st["lines"] = [line_name_map[lid] for lid in st["lineIds"] if lid in line_name_map]
    if len(st["lineIds"]) > 1:
        st["isInterchange"] = True
        st["interchangeLines"] = [line_name_map[lid] for lid in st["lineIds"] if lid in line_name_map]

print(f"Total unique Delhi Metro stations compiled: {len(station_dict)}")

# Line sequences map
line_sequences = {
    "red": [s[0] for s in red_stations],
    "yellow": [s[0] for s in yellow_stations],
    "blue": [s[0] for s in blue_main_stations],
    "blue_vaishali": [s[0] for s in blue_vaishali_stations],
    "green": [s[0] for s in green_stations],
    "violet": [s[0] for s in violet_stations],
    "pink": [s[0] for s in pink_stations],
    "magenta": [s[0] for s in magenta_stations],
    "airport": [s[0] for s in airport_stations],
    "grey": [s[0] for s in grey_stations],
    "rapid_metro": [s[0] for s in rapid_metro_stations]
}

lines_meta = [
    {
        "id": "red",
        "name": "Red Line (Line 1)",
        "nameHindi": "रेड लाइन (लाइन 1)",
        "color": "#DC2626",
        "textColor": "#FFFFFF",
        "bgColor": "bg-red-600",
        "terminals": "Rithala ⇄ Shaheed Sthal (New Bus Adda)",
        "lengthKm": 34.7,
        "totalStations": len(red_stations)
    },
    {
        "id": "yellow",
        "name": "Yellow Line (Line 2)",
        "nameHindi": "येलो लाइन (लाइन 2)",
        "color": "#EAB308",
        "textColor": "#000000",
        "bgColor": "bg-yellow-500",
        "terminals": "Samaypur Badli ⇄ Millennium City Centre Gurugram",
        "lengthKm": 49.3,
        "totalStations": len(yellow_stations)
    },
    {
        "id": "blue",
        "name": "Blue Line (Line 3 & 4)",
        "nameHindi": "ब्लू लाइन (लाइन 3 और 4)",
        "color": "#2563EB",
        "textColor": "#FFFFFF",
        "bgColor": "bg-blue-600",
        "terminals": "Dwarka Sector 21 ⇄ Noida Electronic City / Vaishali",
        "lengthKm": 65.4,
        "totalStations": len(blue_main_stations) + len(blue_vaishali_stations)
    },
    {
        "id": "green",
        "name": "Green Line (Line 5)",
        "nameHindi": "ग्रीन लाइन (लाइन 5)",
        "color": "#16A34A",
        "textColor": "#FFFFFF",
        "bgColor": "bg-green-600",
        "terminals": "Inderlok / Kirti Nagar ⇄ Brigadier Hoshiar Singh",
        "lengthKm": 29.6,
        "totalStations": len(green_stations)
    },
    {
        "id": "violet",
        "name": "Violet Line (Line 6)",
        "nameHindi": "वायलेट लाइन (लाइन 6)",
        "color": "#7C3AED",
        "textColor": "#FFFFFF",
        "bgColor": "bg-purple-600",
        "terminals": "Kashmere Gate ⇄ Raja Nahar Singh (Ballabhgarh)",
        "lengthKm": 46.6,
        "totalStations": len(violet_stations)
    },
    {
        "id": "pink",
        "name": "Pink Line (Line 7)",
        "nameHindi": "पिंक लाइन (लाइन 7)",
        "color": "#EC4899",
        "textColor": "#FFFFFF",
        "bgColor": "bg-pink-500",
        "terminals": "Majlis Park ⇄ Shiv Vihar (Ring Road Orbital)",
        "lengthKm": 59.0,
        "totalStations": len(pink_stations)
    },
    {
        "id": "magenta",
        "name": "Magenta Line (Line 8)",
        "nameHindi": "मजेंटा लाइन (लाइन 8)",
        "color": "#D946EF",
        "textColor": "#FFFFFF",
        "bgColor": "bg-fuchsia-600",
        "terminals": "Janakpuri West ⇄ Botanical Garden (Via IGI T1)",
        "lengthKm": 37.5,
        "totalStations": len(magenta_stations)
    },
    {
        "id": "airport",
        "name": "Airport Express (Orange Line)",
        "nameHindi": "एयरपोर्ट एक्सप्रेस (ऑरेंज लाइन)",
        "color": "#EA580C",
        "textColor": "#FFFFFF",
        "bgColor": "bg-orange-600",
        "terminals": "New Delhi Railway Station ⇄ Yashobhoomi Dwarka Sector 25",
        "lengthKm": 22.7,
        "totalStations": len(airport_stations)
    },
    {
        "id": "grey",
        "name": "Grey Line (Line 9)",
        "nameHindi": "ग्रे लाइन (लाइन 9)",
        "color": "#64748B",
        "textColor": "#FFFFFF",
        "bgColor": "bg-slate-500",
        "terminals": "Dwarka ⇄ Dhansa Bus Stand",
        "lengthKm": 5.2,
        "totalStations": len(grey_stations)
    },
    {
        "id": "rapid_metro",
        "name": "Rapid Metro Gurgaon",
        "nameHindi": "रैपिड मेट्रो गुड़गांव",
        "color": "#06B6D4",
        "textColor": "#FFFFFF",
        "bgColor": "bg-cyan-600",
        "terminals": "Sector 55-56 ⇄ Phase 3 (Cyber City)",
        "lengthKm": 12.1,
        "totalStations": len(rapid_metro_stations)
    }
]

# Generate TypeScript code
ts_code = """// Official Delhi Metro Network Data and Route Planner
export interface MetroLine {
  id: string;
  name: string;
  nameHindi: string;
  color: string;
  textColor: string;
  bgColor: string;
  terminals: string;
  lengthKm: number;
  totalStations: number;
}

export interface MetroStation {
  id: string;
  name: string;
  nameHindi: string;
  lineIds: string[];
  lines: string[];
  isInterchange: boolean;
  interchangeLines?: string[];
  lat: number;
  lng: number;
  firstTrain: string;
  lastTrain: string;
  facilities: string[];
}

export interface MetroRouteLeg {
  lineId: string;
  lineName: string;
  lineColor: string;
  boardingStation: MetroStation;
  destinationStation: MetroStation;
  direction: string;
  stations: MetroStation[];
  stationsCount: number;
  changeover?: {
    atStation: MetroStation;
    fromLine: string;
    toLine: string;
    walkingTimeMin: number;
    platformNotice: string;
  };
}

export interface MetroRoutePlan {
  id: string;
  fromStation: MetroStation;
  toStation: MetroStation;
  totalStations: number;
  interchangesCount: number;
  durationMin: number;
  fareRupees: number;
  distanceKm: number;
  legs: MetroRouteLeg[];
  allStations: MetroStation[];
  coordinates: [number, number][];
}

export const DELHI_METRO_LINES: MetroLine[] = """ + json.dumps(lines_meta, indent=2) + """;

export const DELHI_METRO_STATIONS: MetroStation[] = """ + json.dumps(list(station_dict.values()), indent=2) + """;

export const METRO_STATION_MAP: Record<string, MetroStation> = {};
DELHI_METRO_STATIONS.forEach((s) => {
  METRO_STATION_MAP[s.id] = s;
});

export const LINE_SEQUENCES: Record<string, string[]> = """ + json.dumps(line_sequences, indent=2) + """;

// Helper: Calculate metro fare according to official DMRC fare slabs
export function calculateMetroFare(stationsCount: number, distanceKm: number): number {
  if (distanceKm <= 2 || stationsCount <= 2) return 10;
  if (distanceKm <= 5 || stationsCount <= 5) return 20;
  if (distanceKm <= 12 || stationsCount <= 10) return 30;
  if (distanceKm <= 21 || stationsCount <= 18) return 40;
  if (distanceKm <= 32 || stationsCount <= 26) return 50;
  return 60;
}

// Graph search to calculate shortest metro path (minimizing line transfers first, then station hops)
export function calculateMetroRoute(fromIdOrName: string, toIdOrName: string): MetroRoutePlan | null {
  if (!fromIdOrName || !toIdOrName) return null;
  const qFrom = fromIdOrName.trim().toLowerCase();
  const qTo = toIdOrName.trim().toLowerCase();

  // Find origin station
  const fromStation = DELHI_METRO_STATIONS.find(
    (s) => s.id === qFrom || s.name.toLowerCase() === qFrom || s.name.toLowerCase().includes(qFrom)
  );

  // Find destination station
  const toStation = DELHI_METRO_STATIONS.find(
    (s) => s.id === qTo || s.name.toLowerCase() === qTo || s.name.toLowerCase().includes(qTo)
  );

  if (!fromStation || !toStation) return null;
  if (fromStation.id === toStation.id) {
    return {
      id: `metro-${fromStation.id}-${toStation.id}`,
      fromStation,
      toStation,
      totalStations: 1,
      interchangesCount: 0,
      durationMin: 0,
      fareRupees: 0,
      distanceKm: 0,
      legs: [],
      allStations: [fromStation],
      coordinates: [[fromStation.lat, fromStation.lng]]
    };
  }

  // 1. Direct Line Check: If both stations are on the same line, prioritize pure direct journey
  const commonLines = fromStation.lineIds.filter((lid) => toStation.lineIds.includes(lid));
  let bestDirectSeq: string[] | null = null;
  let bestDirectLine = '';

  for (const lid of commonLines) {
    for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {
      const idxFrom = seq.indexOf(fromStation.id);
      const idxTo = seq.indexOf(toStation.id);
      if (idxFrom !== -1 && idxTo !== -1) {
        const sliced = idxFrom < idxTo
          ? seq.slice(idxFrom, idxTo + 1)
          : seq.slice(idxTo, idxFrom + 1).reverse();
        if (!bestDirectSeq || sliced.length < bestDirectSeq.length) {
          bestDirectSeq = sliced;
          bestDirectLine = lid;
        }
      }
    }
  }

  if (bestDirectSeq && bestDirectSeq.length > 1) {
    const lineObj = DELHI_METRO_LINES.find((l) => l.id === bestDirectLine) || DELHI_METRO_LINES[0];
    const stations = bestDirectSeq.map((id) => METRO_STATION_MAP[id]).filter(Boolean);
    const stationsCount = stations.length;
    const distanceKm = parseFloat((stationsCount * 1.25).toFixed(1));
    const durationMin = Math.round(stationsCount * 2.1);
    const fareRupees = calculateMetroFare(stationsCount, distanceKm);
    const coords: [number, number][] = stations.map((s) => [s.lat, s.lng]);

    const leg: MetroRouteLeg = {
      lineId: lineObj.id,
      lineName: lineObj.name,
      lineColor: lineObj.color,
      boardingStation: fromStation,
      destinationStation: toStation,
      direction: `Towards ${toStation.name}`,
      stations,
      stationsCount
    };

    return {
      id: `metro-${fromStation.id}-${toStation.id}`,
      fromStation,
      toStation,
      totalStations: stationsCount,
      interchangesCount: 0,
      durationMin,
      fareRupees,
      distanceKm,
      legs: [leg],
      allStations: stations,
      coordinates: coords
    };
  }

  // 2. BFS Multigraph Search for 1 or 2 interchanges
  interface QueueItem {
    stationId: string;
    lineId: string;
    path: { stationId: string; lineId: string }[];
    transfers: number;
  }

  const queue: QueueItem[] = [];
  const visited = new Map<string, number>(); // key: stationId_lineId -> min_transfers

  // Initialize start with all lines serving origin
  for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {
    if (seq.includes(fromStation.id)) {
      const lineId = seqKey.split('_')[0];
      queue.push({
        stationId: fromStation.id,
        lineId,
        path: [{ stationId: fromStation.id, lineId }],
        transfers: 0
      });
      visited.set(`${fromStation.id}_${lineId}`, 0);
    }
  }

  let bestPath: { stationId: string; lineId: string }[] | null = null;
  let minTransfersFound = 99;
  let minStopsFound = 999;

  while (queue.length > 0) {
    const { stationId, lineId, path, transfers } = queue.shift()!;

    if (transfers > minTransfersFound) continue;

    if (stationId === toStation.id) {
      if (transfers < minTransfersFound || (transfers === minTransfersFound && path.length < minStopsFound)) {
        minTransfersFound = transfers;
        minStopsFound = path.length;
        bestPath = path;
      }
      continue;
    }

    // Step A: Traverse along current line
    for (const [seqKey, seq] of Object.entries(LINE_SEQUENCES)) {
      if (seqKey.startsWith(lineId)) {
        const idx = seq.indexOf(stationId);
        if (idx !== -1) {
          for (const nIdx of [idx - 1, idx + 1]) {
            if (nIdx >= 0 && nIdx < seq.length) {
              const nxtId = seq[nIdx];
              const stateKey = `${nxtId}_${lineId}`;
              const prevTransfers = visited.get(stateKey);
              if (prevTransfers === undefined || transfers < prevTransfers) {
                visited.set(stateKey, transfers);
                queue.push({
                  stationId: nxtId,
                  lineId,
                  path: [...path, { stationId: nxtId, lineId }],
                  transfers
                });
              }
            }
          }
        }
      }
    }

    // Step B: Transfer to other lines at current station if interchange
    const stObj = METRO_STATION_MAP[stationId];
    if (stObj && stObj.lineIds.length > 1) {
      for (const otherLineId of stObj.lineIds) {
        if (otherLineId !== lineId) {
          const nextTransfers = transfers + 1;
          const stateKey = `${stationId}_${otherLineId}`;
          const prevTransfers = visited.get(stateKey);
          if (prevTransfers === undefined || nextTransfers < prevTransfers) {
            visited.set(stateKey, nextTransfers);
            queue.push({
              stationId,
              lineId: otherLineId,
              path: [...path, { stationId, lineId: otherLineId }],
              transfers: nextTransfers
            });
          }
        }
      }
    }
  }

  if (!bestPath) return null;

  // Group continuous stations by line into Legs
  const legs: MetroRouteLeg[] = [];
  let currentLegStations: MetroStation[] = [];
  let currentLegLine = bestPath[0].lineId;

  for (let i = 0; i < bestPath.length; i++) {
    const item = bestPath[i];
    const station = METRO_STATION_MAP[item.stationId];
    if (!station) continue;

    if (item.lineId !== currentLegLine && currentLegStations.length > 0) {
      // Completed previous leg
      const lineObj = DELHI_METRO_LINES.find((l) => l.id === currentLegLine) || DELHI_METRO_LINES[0];
      const nextLineObj = DELHI_METRO_LINES.find((l) => l.id === item.lineId) || DELHI_METRO_LINES[0];
      const transferStation = currentLegStations[currentLegStations.length - 1];

      legs.push({
        lineId: lineObj.id,
        lineName: lineObj.name,
        lineColor: lineObj.color,
        boardingStation: currentLegStations[0],
        destinationStation: transferStation,
        direction: `Towards ${transferStation.name}`,
        stations: [...currentLegStations],
        stationsCount: currentLegStations.length,
        changeover: {
          atStation: transferStation,
          fromLine: lineObj.name,
          toLine: nextLineObj.name,
          walkingTimeMin: 4,
          platformNotice: `Change from ${lineObj.name} to ${nextLineObj.name} at ${transferStation.name}`
        }
      });

      // Start next leg from this transfer station
      currentLegStations = [transferStation];
      currentLegLine = item.lineId;
    }

    if (currentLegStations.length === 0 || currentLegStations[currentLegStations.length - 1].id !== station.id) {
      currentLegStations.push(station);
    }
  }

  if (currentLegStations.length > 0) {
    const lineObj = DELHI_METRO_LINES.find((l) => l.id === currentLegLine) || DELHI_METRO_LINES[0];
    legs.push({
      lineId: lineObj.id,
      lineName: lineObj.name,
      lineColor: lineObj.color,
      boardingStation: currentLegStations[0],
      destinationStation: currentLegStations[currentLegStations.length - 1],
      direction: `Towards ${currentLegStations[currentLegStations.length - 1].name}`,
      stations: [...currentLegStations],
      stationsCount: currentLegStations.length
    });
  }

  // Deduplicate all stations sequence for full timeline
  const allStations: MetroStation[] = [];
  legs.forEach((leg, lIdx) => {
    leg.stations.forEach((st, sIdx) => {
      if (lIdx > 0 && sIdx === 0) return; // avoid duplicate at transfer point
      allStations.push(st);
    });
  });

  const totalStations = allStations.length;
  const distanceKm = parseFloat((totalStations * 1.25).toFixed(1));
  const durationMin = Math.round(totalStations * 2.1 + (legs.length - 1) * 4);
  const fareRupees = calculateMetroFare(totalStations, distanceKm);
  const coords: [number, number][] = allStations.map((s) => [s.lat, s.lng]);

  return {
    id: `metro-${fromStation.id}-${toStation.id}`,
    fromStation,
    toStation,
    totalStations,
    interchangesCount: Math.max(0, legs.length - 1),
    durationMin,
    fareRupees,
    distanceKm,
    legs,
    allStations,
    coordinates: coords
  };
}
"""

with open("src/data/delhiMetroData.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print("Successfully written src/data/delhiMetroData.ts")
