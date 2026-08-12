"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";

export type Language = "en" | "si";

type TranslationDictionary =
  Record<string, string>;

const en: TranslationDictionary = {
  /* =====================================================
     NAVIGATION
  ===================================================== */

  "nav.home": "Home",
  "nav.about": "About",
  "nav.services": "Services",
  "nav.experience": "Experience",
  "nav.faq": "FAQ",
  "nav.contact": "Contact",

  "nav.search": "Search",
  "nav.searchPlaceholder":
    "Search medicine...",

  "nav.login": "Login",
  "nav.signup": "Join MediFlux",
  "nav.logout": "Logout",
  "nav.dashboard": "Dashboard",
  "nav.admin": "Admin",

  /* =====================================================
     SERVICES
  ===================================================== */

  "services.title":
    "MediFlux Platform",

  "services.heading":
    "Everything you need to find and reserve medicine.",

  "services.description":
    "Search medicine, compare pharmacy stock, create reservations and follow availability.",

  "services.search":
    "Medicine Finder",

  "services.searchDescription":
    "Compare medicine availability and prices",

  "services.reservations":
    "Reservations",

  "services.reservationsDescription":
    "Reserve available medicine before travelling",

  "services.watchlist":
    "Smart Watchlist",

  "services.watchlistDescription":
    "Follow medicines you need",

  "services.notifications":
    "Live Updates",

  "services.notificationsDescription":
    "Reservation and availability alerts",

  /* =====================================================
     CONTACT
  ===================================================== */

  "contact.kicker":
    "Customer Support",

  "contact.title":
    "Need help using MediFlux?",

  "contact.description":
    "Questions about medicine search, reservations, watchlists or your account? Send us a message and our support team will help.",

  "contact.name": "Name",

  "contact.namePlaceholder":
    "Your name",

  "contact.email": "Email",

  "contact.emailPlaceholder":
    "you@example.com",

  "contact.topic":
    "How can we help?",

  "contact.selectTopic":
    "Select a topic",

  "contact.topicSearch":
    "Medicine search",

  "contact.topicReservation":
    "Reservation support",

  "contact.topicAccount":
    "Account support",

  "contact.topicPharmacy":
    "Pharmacy information",

  "contact.message":
    "Message",

  "contact.messagePlaceholder":
    "Tell us how we can help...",

  "contact.send":
    "Send Message",

  "contact.supportEmail":
    "Support Email",

  "contact.location":
    "Service Area",

  "contact.locationValue":
    "Colombo, Sri Lanka",

  "contact.hours":
    "Support Hours",

  "contact.hoursValue":
    "Mon – Sat, 8:00 AM – 6:00 PM",

  /* =====================================================
     HOME
  ===================================================== */

  "home.hero.badge":
    "Medicine availability, reimagined",

  "home.hero.find":
    "Find medicine.",

  "home.hero.reserve":
    "Reserve with",

  "home.hero.confidence":
    "confidence.",

  "home.hero.description":
    "MediFlux connects searchable medicine data, pharmacy-reported stock and time-limited reservations in one polished platform.",

  "home.hero.exploreMedicines":
    "Explore Medicines",

  "home.hero.exploreExperience":
    "Explore Experience",

  "home.action.search":
    "Search",

  "home.action.reserve":
    "Reserve",

  "home.action.collect":
    "Collect",

  "home.action.scroll":
    "Scroll to explore",

  "home.action.explore":
    "Explore",

  "home.liveAvailability":
    "Live availability",

  "home.units":
    "units",

  "home.verifiedPharmacy":
    "Verified pharmacy",

  "home.bestPrice":
    "Best demo price",

  "home.systemConnected":
    "System connected",

  "home.capabilities.label":
    "Platform Capabilities",

  "home.capabilities.title":
    "Everything you need to find and reserve medicine.",

  "home.capabilities.description":
    "MediFlux connects customers, pharmacy staff and administrators through focused workflows.",

  "home.capability.search.title":
    "Intelligent Medicine Search",

  "home.capability.search.description":
    "Search by generic name, brand or active ingredient and compare fictional pharmacy inventory instantly.",

  "home.capability.reservation.title":
    "Time-Limited Reservations",

  "home.capability.reservation.description":
    "Secure available stock before travelling and follow the reservation from pending to collection.",

  "home.capability.watchlist.title":
    "Availability Watchlist",

  "home.capability.watchlist.description":
    "Follow medicines that matter to you and quickly see where stock is currently available.",

  "home.capability.status.title":
    "Smart Status Updates",

  "home.capability.status.description":
    "See reservation and medicine notifications in one focused activity center.",

  "home.stats.workflows":
    "Core platform workflows",

  "home.stats.roles":
    "Dedicated user roles",

  "home.stats.reservationWindow":
    "Reservation window",

  "home.stats.demoData":
    "Fictional demo data",

  "home.about.label":
    "About MediFlux",

  "home.about.title":
    "Built around one frustrating real-world question.",

  "home.about.quote":
    "Where can I find this medicine before I travel across the city?",

  "home.about.trySearch":
    "Try medicine search",

  "home.about.discover":
    "Discover",

  "home.about.searchBefore":
    "Search before travelling",

  "home.about.searchBeforeDescription":
    "View pharmacy-reported medicine availability and prices through a simple comparison interface.",

  "home.about.secure":
    "Secure",

  "home.about.holdStock":
    "Hold available stock",

  "home.about.holdStockDescription":
    "Transaction-safe reservations protect inventory while giving customers a short pickup window.",

  "home.about.operate":
    "Operate",

  "home.about.pharmacyData":
    "Keep pharmacy data useful",

  "home.about.pharmacyDataDescription":
    "Pharmacy staff update stock and process reservations, while administrators verify pharmacies and inspect activity.",

  "home.gallery.label":
    "Product journey",

  "home.gallery.title":
    "One connected experience.",

  "home.gallery.searchLabel":
    "Medicine Search",

  "home.gallery.searchText":
    "Discover stock across verified demo pharmacies.",

  "home.gallery.reservationsLabel":
    "Reservations",

  "home.gallery.reservationsText":
    "Follow every reservation state.",

  "home.gallery.updatesLabel":
    "Updates",

  "home.gallery.updatesText":
    "Keep important medicine events visible.",

  "home.testimonials.label":
    "User perspectives",

  "home.testimonials.previous":
    "Previous testimonial",

  "home.testimonials.next":
    "Next testimonial",

  "home.testimonial.1.quote":
    "I can compare availability before travelling instead of checking several pharmacies manually.",

  "home.testimonial.1.name":
    "Customer Demo Persona",

  "home.testimonial.1.role":
    "Medicine search user",

  "home.testimonial.2.quote":
    "The inventory workflow gives pharmacy staff a simple view of stock, reservations and low-stock levels.",

  "home.testimonial.2.name":
    "Pharmacy Staff Persona",

  "home.testimonial.2.role":
    "Inventory manager",

  "home.testimonial.3.quote":
    "Verification and audit views make the administrative side much easier to explain and demonstrate.",

  "home.testimonial.3.name":
    "Admin Demo Persona",

  "home.testimonial.3.role":
    "Platform administrator",

  "home.faq.label":
    "FAQ",

  "home.faq.title":
    "Questions, answered clearly.",

  "home.faq.description":
    "Important information about the MediFlux platform.",

  "home.faq.q1":
    "Is MediFlux connected to real pharmacies?",

  "home.faq.a1":
    "No. The current version uses fictional pharmacy, stock, price and reservation data for demonstration purposes.",

  "home.faq.q2":
    "Can users reserve medicines?",

  "home.faq.a2":
    "Yes. Logged-in customer accounts can create time-limited reservations against available demo stock.",

  "home.faq.q3":
    "Does the platform give medical advice?",

  "home.faq.a3":
    "No. MediFlux does not provide diagnosis, prescriptions or dosage advice.",

  "home.faq.q4":
    "What can pharmacy staff do?",

  "home.faq.a4":
    "Pharmacy staff manage their assigned inventory, stock levels, prices and reservation workflow.",

  "home.cta.label":
    "Ready to explore?",

  "home.cta.title":
    "Find medicine before the journey begins.",

  "home.cta.search":
    "Start Searching",

  "home.cta.join":
    "Join MediFlux",

  "home.contact.success":
    "Message sent successfully.",

  /* =====================================================
     LOGIN
  ===================================================== */

  "login.badge":
    "WELCOME BACK",

  "login.title":
    "Sign in to MediFlux",

  "login.description":
    "Use your MediFlux account to continue to your dashboard.",

  "login.email":
    "Email Address",

  "login.emailPlaceholder":
    "you@example.com",

  "login.password":
    "Password",

  "login.passwordPlaceholder":
    "Enter your password",

  "login.button":
    "Sign In",

  "login.loading":
    "Signing in...",

  "login.newUser":
    "New to MediFlux?",

  "login.join":
    "Join MediFlux",

  "login.failed":
    "Login failed.",

  /* =====================================================
     CUSTOMER REGISTER
  ===================================================== */

  "register.badge":
    "JOIN MEDIFLUX",

  "register.heroTitle":
    "Choose how you want to use MediFlux.",

  "register.heroDescription":
    "Create a customer account to reserve medicine, or join as a pharmacy partner to manage availability and serve customers.",

  "register.step1":
    "Choose account",

  "register.step2":
    "Register",

  "register.step3":
    "Start using MediFlux",

  "register.accountType":
    "ACCOUNT TYPE",

  "register.question":
    "How will you use MediFlux?",

  "register.selectDescription":
    "Select the option that matches you.",

  "register.chooseAccountAria":
    "Choose account type",

  "register.customer":
    "Customer",

  "register.customerDescription":
    "Find medicines, reserve stock and manage your reservations.",

  "register.pharmacy":
    "Pharmacy Partner",

  "register.pharmacyDescription":
    "Register a pharmacy, manage stock and receive reservations.",

  "register.customerTitle":
    "Create customer account",

  "register.customerSubtitle":
    "Reserve medicines and manage your MediFlux activity.",

  "register.fullName":
    "Full Name",

  "register.namePlaceholder":
    "Your name",

  "register.email":
    "Email Address",

  "register.password":
    "Password",

  "register.confirmPassword":
    "Confirm Password",

  "register.passwordPlaceholder":
    "Minimum 8 characters",

  "register.confirmPlaceholder":
    "Enter password again",

  "register.customerButton":
    "Create Customer Account",

  "register.creating":
    "Creating account...",

  "register.pharmacyPartnerLabel":
    "MEDIFLUX PHARMACY PARTNER",

  "register.pharmacyTitle":
    "Register your pharmacy",

  "register.pharmacyText":
    "Pharmacy partners have a separate registration process because we need pharmacy, licence and map location information.",

  "register.inventory":
    "Manage medicine inventory",

  "register.prices":
    "Update prices and stock",

  "register.map":
    "Appear on the customer map",

  "register.reservations":
    "Receive medicine reservations",

  "register.verification":
    "Verification required",

  "register.verificationText":
    "New pharmacies remain PENDING until approved by a MediFlux administrator.",

  "register.pharmacyButton":
    "Continue to Pharmacy Registration",

  "register.already":
    "Already have an account?",

  "register.signin":
    "Sign in",

  "register.error.name":
    "Please enter your name.",

  "register.error.email":
    "Please enter your email address.",

  "register.error.passwordLength":
    "Password must contain at least 8 characters.",

  "register.error.passwordMatch":
    "Passwords do not match.",

  "register.error.generic":
    "Could not create your account.",

  "register.success":
    "Customer account created successfully. Redirecting to login...",

  /* =====================================================
     MEDICINE SEARCH
  ===================================================== */

  "search.badge":
    "Medicine Finder",

  "search.title":
    "Find medicine near you",

  "search.description":
    "Search verified pharmacies, compare medicine availability and prices, then locate the pharmacy directly on the map.",

  "search.medicinePlaceholder":
    "Medicine name, brand or ingredient...",

  "search.cityPlaceholder":
    "City",

  "search.sort.lowest":
    "Lowest price",

  "search.sort.highest":
    "Highest price",

  "search.sort.pharmacy":
    "Pharmacy name",

  "search.sort.latest":
    "Latest updated",

  "search.sortLabel":
    "Sort search results",

  "search.button":
    "Search",

  "search.searching":
    "Searching...",

  "search.searchingPharmacies":
    "Searching pharmacies...",

  "search.loadingMap":
    "Loading pharmacy map...",

  "search.results":
    "Search Results",

  "search.pharmacyFound":
    "pharmacy found",

  "search.pharmaciesFound":
    "pharmacies found",

  "search.verified":
    "Verified Pharmacy",

  "search.available":
    "available",

  "search.availableLabel":
    "Available",

  "search.medicine":
    "Medicine",

  "search.price":
    "Price",

  "search.showMap":
    "Show on Map",

  "search.directions":
    "Directions",

  "search.getDirections":
    "Get Directions",

  "search.map":
    "Pharmacy Map",

  "search.nearby":
    "Colombo & Nearby Areas",

  "search.interactive":
    "Interactive",

  "search.demoData":
    "Demo Pharmacy Data",

  "search.noResults":
    "No pharmacies found",

  "search.noResultsDescription":
    "Try another medicine name or city.",

  "search.error.enterMedicine":
    "Enter a medicine name.",

  "search.error.load":
    "Could not load medicines.",

  "search.error.search":
    "Search failed.",

  /* =====================================================
     PHARMACY REGISTRATION
  ===================================================== */

  "pharmacyRegister.badge":
    "Pharmacy Partner",

  "pharmacyRegister.title":
    "Register your pharmacy",

  "pharmacyRegister.description":
    "Join MediFlux and manage medicine availability for customers searching nearby pharmacies.",

  "pharmacyRegister.step1":
    "Register",

  "pharmacyRegister.step2":
    "Get verified",

  "pharmacyRegister.step3":
    "Add medicines",

  "pharmacyRegister.step4":
    "Appear in search",

  "pharmacyRegister.ownerDetails":
    "Owner details",

  "pharmacyRegister.ownerName":
    "Owner name",

  "pharmacyRegister.email":
    "Email",

  "pharmacyRegister.password":
    "Password",

  "pharmacyRegister.confirmPassword":
    "Confirm password",

  "pharmacyRegister.pharmacyDetails":
    "Pharmacy details",

  "pharmacyRegister.pharmacyName":
    "Pharmacy name",

  "pharmacyRegister.licenceNumber":
    "Licence number",

  "pharmacyRegister.phone":
    "Phone",

  "pharmacyRegister.city":
    "City",

  "pharmacyRegister.address":
    "Address",

  "pharmacyRegister.addressLine2":
    "Address line 2 (optional)",

  "pharmacyRegister.district":
    "District",

  "pharmacyRegister.postalCode":
    "Postal code",

  "pharmacyRegister.mapLocation":
    "Pharmacy map location",

  "pharmacyRegister.mapDescription":
    "This location is used to place your pharmacy on the MediFlux search map.",

  "pharmacyRegister.useCurrentLocation":
    "Use Current Location",

  "pharmacyRegister.locating":
    "Getting location...",

  "pharmacyRegister.latitude":
    "Latitude",

  "pharmacyRegister.longitude":
    "Longitude",

  "pharmacyRegister.submit":
    "Submit Pharmacy Registration",

  "pharmacyRegister.submitting":
    "Submitting registration...",

  "pharmacyRegister.success":
    "Pharmacy registration submitted successfully. Your pharmacy is pending administrator verification. Redirecting to login...",

  "pharmacyRegister.alreadyRegistered":
    "Already registered?",

  "pharmacyRegister.signIn":
    "Sign in",

  "pharmacyRegister.error.required":
    "Please complete all required fields.",

  "pharmacyRegister.error.passwordLength":
    "Password must contain at least 8 characters.",

  "pharmacyRegister.error.passwordMatch":
    "Passwords do not match.",

  "pharmacyRegister.error.locationRequired":
    "Please use your current location or enter latitude and longitude.",

  "pharmacyRegister.error.locationInvalid":
    "Please enter a valid latitude and longitude.",

  "pharmacyRegister.error.locationUnsupported":
    "Your browser does not support location access. Please enter coordinates manually.",

  "pharmacyRegister.error.locationFailed":
    "We could not get your current location. Please allow location access or enter coordinates manually.",

  "pharmacyRegister.error.generic":
    "Could not register the pharmacy.",
};

const si: TranslationDictionary = {
  /* =====================================================
     NAVIGATION
  ===================================================== */

  "nav.home":
    "මුල් පිටුව",

  "nav.about":
    "අප ගැන",

  "nav.services":
    "සේවාවන්",

  "nav.experience":
    "අත්දැකීම",

  "nav.faq":
    "නිතර අසන ප්‍රශ්න",

  "nav.contact":
    "සම්බන්ධ වන්න",

  "nav.search":
    "සොයන්න",

  "nav.searchPlaceholder":
    "ඖෂධයක් සොයන්න...",

  "nav.login":
    "පිවිසෙන්න",

  "nav.signup":
    "MediFlux සමඟ එක්වන්න",

  "nav.logout":
    "පිටවන්න",

  "nav.dashboard":
    "පාලක පුවරුව",

  "nav.admin":
    "පරිපාලක",

  /* =====================================================
     SERVICES
  ===================================================== */

  "services.title":
    "MediFlux පද්ධතිය",

  "services.heading":
    "ඖෂධ සොයාගැනීමට සහ වෙන්කරගැනීමට අවශ්‍ය සියල්ල.",

  "services.description":
    "ඖෂධ සොයන්න, ෆාමසි තොග සසඳන්න, වෙන්කරගැනීම් සිදු කරන්න සහ ලබාගත හැකි තත්ත්වය නිරීක්ෂණය කරන්න.",

  "services.search":
    "ඖෂධ සෙවුම",

  "services.searchDescription":
    "ඖෂධ තොග සහ මිල සසඳන්න",

  "services.reservations":
    "වෙන්කරගැනීම්",

  "services.reservationsDescription":
    "ගමන් කිරීමට පෙර ඖෂධ වෙන්කරගන්න",

  "services.watchlist":
    "නිරීක්ෂණ ලැයිස්තුව",

  "services.watchlistDescription":
    "ඔබට අවශ්‍ය ඖෂධ නිරීක්ෂණය කරන්න",

  "services.notifications":
    "දැනුම්දීම්",

  "services.notificationsDescription":
    "වෙන්කරගැනීම් සහ තොග යාවත්කාලීන",

  /* =====================================================
     CONTACT
  ===================================================== */

  "contact.kicker":
    "පාරිභෝගික සහාය",

  "contact.title":
    "MediFlux භාවිතා කිරීමට උදව් අවශ්‍යද?",

  "contact.description":
    "ඖෂධ සෙවීම, වෙන්කරගැනීම්, නිරීක්ෂණ ලැයිස්තුව හෝ ඔබගේ ගිණුම පිළිබඳ ප්‍රශ්නයක් තිබේ නම් අපට පණිවිඩයක් එවන්න.",

  "contact.name":
    "නම",

  "contact.namePlaceholder":
    "ඔබගේ නම",

  "contact.email":
    "ඊමේල්",

  "contact.emailPlaceholder":
    "you@example.com",

  "contact.topic":
    "ඔබට අවශ්‍ය සහාය කුමක්ද?",

  "contact.selectTopic":
    "මාතෘකාවක් තෝරන්න",

  "contact.topicSearch":
    "ඖෂධ සෙවීම",

  "contact.topicReservation":
    "වෙන්කරගැනීමේ සහාය",

  "contact.topicAccount":
    "ගිණුම් සහාය",

  "contact.topicPharmacy":
    "ෆාමසි තොරතුරු",

  "contact.message":
    "පණිවිඩය",

  "contact.messagePlaceholder":
    "ඔබට අවශ්‍ය සහාය සඳහන් කරන්න...",

  "contact.send":
    "පණිවිඩය යවන්න",

  "contact.supportEmail":
    "සහාය ඊමේල්",

  "contact.location":
    "සේවා ප්‍රදේශය",

  "contact.locationValue":
    "කොළඹ, ශ්‍රී ලංකාව",

  "contact.hours":
    "සහාය වේලාවන්",

  "contact.hoursValue":
    "සඳුදා – සෙනසුරාදා, පෙ.ව. 8:00 – ප.ව. 6:00",

  /* =====================================================
     HOME
  ===================================================== */

  "home.hero.badge":
    "ඖෂධ ලබාගත හැකි බවට නව අත්දැකීමක්",

  "home.hero.find":
    "ඖෂධ සොයන්න.",

  "home.hero.reserve":
    "විශ්වාසයෙන්",

  "home.hero.confidence":
    "වෙන්කර ගන්න.",

  "home.hero.description":
    "MediFlux මඟින් ඖෂධ සෙවීම, ෆාමසිවලින් වාර්තා කරන තොග තොරතුරු සහ කාලසීමා සහිත වෙන්කර ගැනීම් එකම වේදිකාවක සම්බන්ධ කරයි.",

  "home.hero.exploreMedicines":
    "ඖෂධ සොයන්න",

  "home.hero.exploreExperience":
    "අත්දැකීම බලන්න",

  "home.action.search":
    "සොයන්න",

  "home.action.reserve":
    "වෙන්කරන්න",

  "home.action.collect":
    "ලබාගන්න",

  "home.action.scroll":
    "තවත් බලන්න පහළට යන්න",

  "home.action.explore":
    "බලන්න",

  "home.liveAvailability":
    "දැනට ඇති තොගය",

  "home.units":
    "ඒකක",

  "home.verifiedPharmacy":
    "තහවුරු කළ ෆාමසිය",

  "home.bestPrice":
    "හොඳම ආදර්ශ මිල",

  "home.systemConnected":
    "පද්ධතිය සම්බන්ධයි",

  "home.capabilities.label":
    "පද්ධති හැකියාවන්",

  "home.capabilities.title":
    "ඖෂධ සොයාගෙන වෙන්කර ගැනීමට ඔබට අවශ්‍ය සියල්ල.",

  "home.capabilities.description":
    "MediFlux ගනුදෙනුකරුවන්, ෆාමසි කාර්ය මණ්ඩලය සහ පරිපාලකයින් එකම ක්‍රියාදාමයක් තුළ සම්බන්ධ කරයි.",

  "home.capability.search.title":
    "බුද්ධිමත් ඖෂධ සෙවීම",

  "home.capability.search.description":
    "සාමාන්‍ය නම, වෙළඳ නාමය හෝ ක්‍රියාකාරී සංඝටකය අනුව සොයා ෆාමසි තොග සසඳන්න.",

  "home.capability.reservation.title":
    "කාලසීමා සහිත වෙන්කර ගැනීම්",

  "home.capability.reservation.description":
    "ගමන් කිරීමට පෙර ඇති තොගය වෙන්කරගෙන, වෙන්කිරීම ලබාගැනීම දක්වා අනුගමනය කරන්න.",

  "home.capability.watchlist.title":
    "ලබාගත හැකි බව නිරීක්ෂණය",

  "home.capability.watchlist.description":
    "ඔබට වැදගත් ඖෂධ නිරීක්ෂණය කර ඒවා දැනට ඇති ෆාමසි ඉක්මනින් හඳුනාගන්න.",

  "home.capability.status.title":
    "ස්මාර්ට් තත්ත්ව යාවත්කාලීන",

  "home.capability.status.description":
    "වෙන්කිරීම් සහ ඖෂධ දැනුම්දීම් එකම ස්ථානයක බලන්න.",

  "home.stats.workflows":
    "ප්‍රධාන පද්ධති ක්‍රියාදාම",

  "home.stats.roles":
    "වෙන් වූ පරිශීලක භූමිකා",

  "home.stats.reservationWindow":
    "වෙන්කිරීමේ කාල සීමාව",

  "home.stats.demoData":
    "ආදර්ශ දත්ත",

  "home.about.label":
    "MediFlux ගැන",

  "home.about.title":
    "දිනපතා ඇතිවන සැබෑ ගැටලුවක් වටා නිර්මාණය කළ පද්ධතියක්.",

  "home.about.quote":
    "නගරය පුරා යාමට පෙර මේ ඖෂධය කොහෙන්ද සොයාගන්නේ?",

  "home.about.trySearch":
    "ඖෂධ සෙවීම උත්සාහ කරන්න",

  "home.about.discover":
    "සොයන්න",

  "home.about.searchBefore":
    "ගමන් කිරීමට පෙර සොයන්න",

  "home.about.searchBeforeDescription":
    "ෆාමසිවලින් වාර්තා කරන ඖෂධ තොග සහ මිල පහසුවෙන් සසඳන්න.",

  "home.about.secure":
    "වෙන්කරන්න",

  "home.about.holdStock":
    "ලබාගත හැකි තොගය වෙන්කර තබන්න",

  "home.about.holdStockDescription":
    "ආරක්ෂිත වෙන්කිරීම් මඟින් තොගය ආරක්ෂා කරමින් පාරිභෝගිකයාට ලබාගැනීමට කෙටි කාලයක් ලබාදෙයි.",

  "home.about.operate":
    "කළමනාකරණය",

  "home.about.pharmacyData":
    "ෆාමසි දත්ත යාවත්කාලීනව තබන්න",

  "home.about.pharmacyDataDescription":
    "ෆාමසි කාර්ය මණ්ඩලය තොග සහ වෙන්කිරීම් කළමනාකරණය කරන අතර පරිපාලකයින් ෆාමසි තහවුරු කර ක්‍රියාකාරකම් පරීක්ෂා කරයි.",

  "home.gallery.label":
    "සේවා ගමන",

  "home.gallery.title":
    "එකිනෙකට සම්බන්ධ අත්දැකීමක්.",

  "home.gallery.searchLabel":
    "ඖෂධ සෙවීම",

  "home.gallery.searchText":
    "තහවුරු කළ ආදර්ශ ෆාමසි අතර තොග සොයා බලන්න.",

  "home.gallery.reservationsLabel":
    "වෙන්කරගැනීම්",

  "home.gallery.reservationsText":
    "වෙන්කිරීමේ සෑම තත්ත්වයක්ම අනුගමනය කරන්න.",

  "home.gallery.updatesLabel":
    "යාවත්කාලීන",

  "home.gallery.updatesText":
    "වැදගත් ඖෂධ සිදුවීම් පැහැදිලිව බලන්න.",

  "home.testimonials.label":
    "පරිශීලක අදහස්",

  "home.testimonials.previous":
    "පෙර අදහස",

  "home.testimonials.next":
    "ඊළඟ අදහස",

  "home.testimonial.1.quote":
    "ගමන් කිරීමට පෙර ෆාමසි කිහිපයකට වෙන වෙනම යාම වෙනුවට මට ලබාගත හැකි තොග සසඳා බලන්න පුළුවන්.",

  "home.testimonial.1.name":
    "පාරිභෝගික ආදර්ශ පරිශීලකයා",

  "home.testimonial.1.role":
    "ඖෂධ සෙවුම් පරිශීලකයා",

  "home.testimonial.2.quote":
    "තොග, වෙන්කිරීම් සහ අඩු තොග මට්ටම් එකම ස්ථානයක කළමනාකරණය කිරීමට ෆාමසි කාර්ය මණ්ඩලයට පහසු ක්‍රියාදාමයක් ලැබේ.",

  "home.testimonial.2.name":
    "ෆාමසි කාර්ය මණ්ඩල ආදර්ශ පරිශීලකයා",

  "home.testimonial.2.role":
    "තොග කළමනාකරු",

  "home.testimonial.3.quote":
    "තහවුරු කිරීම් සහ විගණන දසුන් නිසා පරිපාලන කොටස පැහැදිලිව පෙන්වීමට සහ කළමනාකරණය කිරීමට පහසු වේ.",

  "home.testimonial.3.name":
    "පරිපාලක ආදර්ශ පරිශීලකයා",

  "home.testimonial.3.role":
    "පද්ධති පරිපාලක",

  "home.faq.label":
    "නිතර අසන ප්‍රශ්න",

  "home.faq.title":
    "ඔබේ ප්‍රශ්නවලට පැහැදිලි පිළිතුරු.",

  "home.faq.description":
    "MediFlux වේදිකාව පිළිබඳ වැදගත් තොරතුරු.",

  "home.faq.q1":
    "MediFlux සැබෑ ෆාමසි සමඟ සම්බන්ධද?",

  "home.faq.a1":
    "නැහැ. වර්තමාන අනුවාදය ප්‍රදර්ශන අරමුණු සඳහා ආදර්ශ ෆාමසි, තොග, මිල සහ වෙන්කිරීම් දත්ත භාවිතා කරයි.",

  "home.faq.q2":
    "පරිශීලකයින්ට ඖෂධ වෙන්කර ගත හැකිද?",

  "home.faq.a2":
    "ඔව්. පිවිසී ඇති පාරිභෝගික ගිණුම්වලට ලබාගත හැකි ආදර්ශ තොගයෙන් කාලසීමා සහිත වෙන්කිරීම් කළ හැක.",

  "home.faq.q3":
    "මෙම පද්ධතිය වෛද්‍ය උපදෙස් ලබාදෙනවාද?",

  "home.faq.a3":
    "නැහැ. MediFlux රෝග විනිශ්චය, වෛද්‍ය වට්ටෝරු හෝ ඖෂධ මාත්‍රා උපදෙස් ලබා නොදේ.",

  "home.faq.q4":
    "ෆාමසි කාර්ය මණ්ඩලයට කළ හැක්කේ මොනවාද?",

  "home.faq.a4":
    "ෆාමසි කාර්ය මණ්ඩලයට තම ෆාමසියේ තොග, ප්‍රමාණ, මිල සහ වෙන්කිරීම් ක්‍රියාදාමය කළමනාකරණය කළ හැක.",

  "home.cta.label":
    "ආරම්භ කිරීමට සූදානම්ද?",

  "home.cta.title":
    "ගමන ආරම්භ කිරීමට පෙර ඖෂධය සොයාගන්න.",

  "home.cta.search":
    "සෙවීම ආරම්භ කරන්න",

  "home.cta.join":
    "MediFlux සමඟ එක්වන්න",

  "home.contact.success":
    "පණිවිඩය සාර්ථකව යවන ලදී.",

  /* =====================================================
     LOGIN
  ===================================================== */

  "login.badge":
    "නැවත සාදරයෙන් පිළිගනිමු",

  "login.title":
    "MediFlux වෙත පිවිසෙන්න",

  "login.description":
    "ඔබගේ MediFlux ගිණුම භාවිතා කර ඔබගේ පාලක පුවරුව වෙත පිවිසෙන්න.",

  "login.email":
    "ඊමේල් ලිපිනය",

  "login.emailPlaceholder":
    "you@example.com",

  "login.password":
    "මුරපදය",

  "login.passwordPlaceholder":
    "ඔබගේ මුරපදය ඇතුළත් කරන්න",

  "login.button":
    "පිවිසෙන්න",

  "login.loading":
    "පිවිසෙමින්...",

  "login.newUser":
    "MediFlux වෙත අලුත්ද?",

  "login.join":
    "MediFlux සමඟ එක්වන්න",

  "login.failed":
    "පිවිසීම අසාර්ථක විය.",

  /* =====================================================
     CUSTOMER REGISTER
  ===================================================== */

  "register.badge":
    "MEDIFLUX සමඟ එක්වන්න",

  "register.heroTitle":
    "ඔබට MediFlux භාවිතා කිරීමට අවශ්‍ය ආකාරය තෝරන්න.",

  "register.heroDescription":
    "ඖෂධ වෙන්කර ගැනීමට පාරිභෝගික ගිණුමක් සාදන්න, නැතහොත් තොග කළමනාකරණය කර පාරිභෝගිකයින්ට සේවය කිරීමට ෆාමසි හවුල්කරුවෙකු ලෙස එක්වන්න.",

  "register.step1":
    "ගිණුම තෝරන්න",

  "register.step2":
    "ලියාපදිංචි වන්න",

  "register.step3":
    "MediFlux භාවිතා කරන්න",

  "register.accountType":
    "ගිණුම් වර්ගය",

  "register.question":
    "ඔබ MediFlux භාවිතා කරන්නේ කෙසේද?",

  "register.selectDescription":
    "ඔබට ගැලපෙන විකල්පය තෝරන්න.",

  "register.chooseAccountAria":
    "ගිණුම් වර්ගය තෝරන්න",

  "register.customer":
    "පාරිභෝගිකයා",

  "register.customerDescription":
    "ඖෂධ සොයන්න, තොග වෙන්කරන්න සහ ඔබගේ වෙන්කිරීම් කළමනාකරණය කරන්න.",

  "register.pharmacy":
    "ෆාමසි හවුල්කරු",

  "register.pharmacyDescription":
    "ෆාමසියක් ලියාපදිංචි කර තොග කළමනාකරණය කර වෙන්කිරීම් ලබාගන්න.",

  "register.customerTitle":
    "පාරිභෝගික ගිණුමක් සාදන්න",

  "register.customerSubtitle":
    "ඖෂධ වෙන්කරගෙන ඔබගේ MediFlux ක්‍රියාකාරකම් කළමනාකරණය කරන්න.",

  "register.fullName":
    "සම්පූර්ණ නම",

  "register.namePlaceholder":
    "ඔබගේ නම",

  "register.email":
    "ඊමේල් ලිපිනය",

  "register.password":
    "මුරපදය",

  "register.confirmPassword":
    "මුරපදය තහවුරු කරන්න",

  "register.passwordPlaceholder":
    "අවම වශයෙන් අක්ෂර 8ක්",

  "register.confirmPlaceholder":
    "මුරපදය නැවත ඇතුළත් කරන්න",

  "register.customerButton":
    "පාරිභෝගික ගිණුම සාදන්න",

  "register.creating":
    "ගිණුම සාදමින්...",

  "register.pharmacyPartnerLabel":
    "MEDIFLUX ෆාමසි හවුල්කරු",

  "register.pharmacyTitle":
    "ඔබගේ ෆාමසිය ලියාපදිංචි කරන්න",

  "register.pharmacyText":
    "ෆාමසි හවුල්කරුවන් සඳහා ෆාමසි, බලපත්‍ර සහ සිතියම් ස්ථාන තොරතුරු අවශ්‍ය බැවින් වෙනම ලියාපදිංචි ක්‍රියාදාමයක් ඇත.",

  "register.inventory":
    "ඖෂධ තොග කළමනාකරණය",

  "register.prices":
    "මිල සහ තොග යාවත්කාලීන කිරීම",

  "register.map":
    "පාරිභෝගික සිතියමේ පෙන්වීම",

  "register.reservations":
    "ඖෂධ වෙන්කිරීම් ලබාගැනීම",

  "register.verification":
    "තහවුරු කිරීම අවශ්‍යයි",

  "register.verificationText":
    "නව ෆාමසි MediFlux පරිපාලකයෙකු විසින් අනුමත කරන තෙක් PENDING තත්ත්වයේ පවතී.",

  "register.pharmacyButton":
    "ෆාමසි ලියාපදිංචිය වෙත යන්න",

  "register.already":
    "දැනටමත් ගිණුමක් තිබේද?",

  "register.signin":
    "පිවිසෙන්න",

  "register.error.name":
    "කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.",

  "register.error.email":
    "කරුණාකර ඔබගේ ඊමේල් ලිපිනය ඇතුළත් කරන්න.",

  "register.error.passwordLength":
    "මුරපදය අවම වශයෙන් අක්ෂර 8කින් සමන්විත විය යුතුය.",

  "register.error.passwordMatch":
    "මුරපද දෙක සමාන නොවේ.",

  "register.error.generic":
    "ඔබගේ ගිණුම සෑදීමට නොහැකි විය.",

  "register.success":
    "පාරිභෝගික ගිණුම සාර්ථකව සාදන ලදී. පිවිසුම් පිටුව වෙත යොමු කරමින්...",

  /* =====================================================
     SEARCH
  ===================================================== */

  "search.badge":
    "ඖෂධ සෙවුම",

  "search.title":
    "ඔබ අසල ඖෂධ සොයන්න",

  "search.description":
    "තහවුරු කළ ෆාමසි සොයන්න, ඖෂධ තොග සහ මිල සසඳන්න, ඉන්පසු සිතියමෙන් ෆාමසිය සොයාගන්න.",

  "search.medicinePlaceholder":
    "ඖෂධ නම, වෙළඳ නාමය හෝ සංඝටකය...",

  "search.cityPlaceholder":
    "නගරය",

  "search.sort.lowest":
    "අඩුම මිල",

  "search.sort.highest":
    "වැඩිම මිල",

  "search.sort.pharmacy":
    "ෆාමසි නම",

  "search.sort.latest":
    "අලුතින් යාවත්කාලීන කළ",

  "search.sortLabel":
    "සෙවුම් ප්‍රතිඵල අනුපිළිවෙළ තෝරන්න",

  "search.button":
    "සොයන්න",

  "search.searching":
    "සොයමින්...",

  "search.searchingPharmacies":
    "ෆාමසි සොයමින්...",

  "search.loadingMap":
    "ෆාමසි සිතියම පූරණය වෙමින්...",

  "search.results":
    "සෙවුම් ප්‍රතිඵල",

  "search.pharmacyFound":
    "ෆාමසියක් හමු විය",

  "search.pharmaciesFound":
    "ෆාමසි හමු විය",

  "search.verified":
    "තහවුරු කළ ෆාමසිය",

  "search.available":
    "ලබාගත හැක",

  "search.availableLabel":
    "ලබාගත හැකි ප්‍රමාණය",

  "search.medicine":
    "ඖෂධය",

  "search.price":
    "මිල",

  "search.showMap":
    "සිතියමේ පෙන්වන්න",

  "search.directions":
    "මාර්ග උපදෙස්",

  "search.getDirections":
    "මාර්ග උපදෙස් ලබාගන්න",

  "search.map":
    "ෆාමසි සිතියම",

  "search.nearby":
    "කොළඹ සහ ආසන්න ප්‍රදේශ",

  "search.interactive":
    "අන්තර්ක්‍රියාකාරී",

  "search.demoData":
    "ආදර්ශ ෆාමසි දත්ත",

  "search.noResults":
    "ෆාමසි කිසිවක් හමු නොවීය",

  "search.noResultsDescription":
    "වෙනත් ඖෂධ නමක් හෝ නගරයක් උත්සාහ කරන්න.",

  "search.error.enterMedicine":
    "කරුණාකර ඖෂධ නමක් ඇතුළත් කරන්න.",

  "search.error.load":
    "ඖෂධ දත්ත පූරණය කළ නොහැකි විය.",

  "search.error.search":
    "සෙවීම අසාර්ථක විය.",

  /* =====================================================
     PHARMACY REGISTER
  ===================================================== */

  "pharmacyRegister.badge":
    "ෆාමසි හවුල්කරු",

  "pharmacyRegister.title":
    "ඔබගේ ෆාමසිය ලියාපදිංචි කරන්න",

  "pharmacyRegister.description":
    "MediFlux සමඟ එක්වී අසල ෆාමසි සොයන පාරිභෝගිකයින් සඳහා ඖෂධ ලබාගත හැකි තොරතුරු කළමනාකරණය කරන්න.",

  "pharmacyRegister.step1":
    "ලියාපදිංචි වන්න",

  "pharmacyRegister.step2":
    "තහවුරු කරගන්න",

  "pharmacyRegister.step3":
    "ඖෂධ එක් කරන්න",

  "pharmacyRegister.step4":
    "සෙවුමේ පෙනී සිටින්න",

  "pharmacyRegister.ownerDetails":
    "හිමිකරුගේ තොරතුරු",

  "pharmacyRegister.ownerName":
    "හිමිකරුගේ නම",

  "pharmacyRegister.email":
    "ඊමේල් ලිපිනය",

  "pharmacyRegister.password":
    "මුරපදය",

  "pharmacyRegister.confirmPassword":
    "මුරපදය තහවුරු කරන්න",

  "pharmacyRegister.pharmacyDetails":
    "ෆාමසි තොරතුරු",

  "pharmacyRegister.pharmacyName":
    "ෆාමසි නම",

  "pharmacyRegister.licenceNumber":
    "බලපත්‍ර අංකය",

  "pharmacyRegister.phone":
    "දුරකථන අංකය",

  "pharmacyRegister.city":
    "නගරය",

  "pharmacyRegister.address":
    "ලිපිනය",

  "pharmacyRegister.addressLine2":
    "අමතර ලිපිනය",

  "pharmacyRegister.district":
    "දිස්ත්‍රික්කය",

  "pharmacyRegister.postalCode":
    "තැපැල් කේතය",

  "pharmacyRegister.mapLocation":
    "ෆාමසියේ සිතියම් ස්ථානය",

  "pharmacyRegister.mapDescription":
    "මෙම ස්ථානය MediFlux සෙවුම් සිතියමේ ඔබගේ ෆාමසිය පෙන්වීමට භාවිතා කරයි.",

  "pharmacyRegister.useCurrentLocation":
    "වත්මන් ස්ථානය භාවිතා කරන්න",

  "pharmacyRegister.locating":
    "ස්ථානය ලබාගනිමින්...",

  "pharmacyRegister.latitude":
    "අක්ෂාංශය",

  "pharmacyRegister.longitude":
    "දේශාංශය",

  "pharmacyRegister.submit":
    "ෆාමසි ලියාපදිංචිය යවන්න",

  "pharmacyRegister.submitting":
    "ලියාපදිංචිය යවමින්...",

  "pharmacyRegister.success":
    "ෆාමසි ලියාපදිංචිය සාර්ථකව යවන ලදී. ඔබගේ ෆාමසිය පරිපාලක තහවුරු කිරීම සඳහා බලාපොරොත්තු තත්ත්වයේ පවතී. පිවිසුම් පිටුවට යොමු කරමින්...",

  "pharmacyRegister.alreadyRegistered":
    "දැනටමත් ලියාපදිංචි වී තිබේද?",

  "pharmacyRegister.signIn":
    "පිවිසෙන්න",

  "pharmacyRegister.error.required":
    "කරුණාකර අවශ්‍ය සියලු තොරතුරු පුරවන්න.",

  "pharmacyRegister.error.passwordLength":
    "මුරපදය අවම වශයෙන් අක්ෂර 8කින් සමන්විත විය යුතුය.",

  "pharmacyRegister.error.passwordMatch":
    "මුරපද දෙක සමාන නොවේ.",

  "pharmacyRegister.error.locationRequired":
    "කරුණාකර වත්මන් ස්ථානය භාවිතා කරන්න හෝ අක්ෂාංශය සහ දේශාංශය ඇතුළත් කරන්න.",

  "pharmacyRegister.error.locationInvalid":
    "කරුණාකර වලංගු අක්ෂාංශයක් සහ දේශාංශයක් ඇතුළත් කරන්න.",

  "pharmacyRegister.error.locationUnsupported":
    "ඔබගේ බ්‍රව්සරය ස්ථාන ප්‍රවේශයට සහය නොදක්වයි. කරුණාකර ස්ථාන අගයන් අතින් ඇතුළත් කරන්න.",

  "pharmacyRegister.error.locationFailed":
    "ඔබගේ වත්මන් ස්ථානය ලබාගත නොහැකි විය. ස්ථාන අවසරය ලබා දෙන්න හෝ අගයන් අතින් ඇතුළත් කරන්න.",

  "pharmacyRegister.error.generic":
    "ෆාමසිය ලියාපදිංචි කළ නොහැකි විය.",
};

const translations:
  Record<
    Language,
    TranslationDictionary
  > = {
  en,
  si,
};

type LanguageContextValue = {
  language:
    Language;

  setLanguage: (
    language:
      Language,
  ) => void;

  t: (
    key:
      string,
  ) => string;
};

const LanguageContext =
  createContext<
    LanguageContextValue
    | undefined
  >(undefined);

type LanguageProviderProps = {
  children:
    ReactNode;

  initialLanguage:
    Language;
};

export function LanguageProvider({
  children,
  initialLanguage,
}: LanguageProviderProps) {
  const [
    language,
    setLanguageState,
  ] =
    useState<Language>(
      initialLanguage,
    );

  function setLanguage(
    nextLanguage:
      Language,
  ) {
    setLanguageState(
      nextLanguage,
    );

    document.documentElement.lang =
      nextLanguage ===
      "si"
        ? "si"
        : "en";

    document.cookie =
      `mediflux-language=${nextLanguage}; path=/; max-age=31536000; SameSite=Lax`;
  }

  function t(
    key:
      string,
  ): string {
    return (
      translations[
        language
      ][key] ??
      translations.en[
        key
      ] ??
      key
    );
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(
      LanguageContext,
    );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider.",
    );
  }

  return context;
}