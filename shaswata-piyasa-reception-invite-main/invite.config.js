/* ------------------------------------------------------------------
   EVERY NAME, DATE AND DETAIL OF THE INVITATION LIVES IN THIS FILE.
   Each text has a Bengali (bn) and an English (en) version.
   Everything below is SAMPLE text until you replace it.
------------------------------------------------------------------- */
window.INVITE = {
  defaultLang: "bn",                 // "bn" or "en": the language guests see first
  music: "music/song.mp3",           // put your song here; without it a soft built-in tune plays

  couple: {
    first:    { bn: "শাশ্বত", en: "Shaswata" },
    second:   { bn: "পিয়াসা", en: "Piyasa" },
    joiner:   { bn: "ও",      en: "&" },
    monogram: { first: { bn: "মেঘ", en: "S" }, second: { bn: "বাবুন", en: "P" } },
    hashtag:  { bn: "#শাশ্বতওপিয়াসা", en: "#ShaswataAndPiyasa" }
  },

  // The moment the countdown runs to (India time). Set to the start of the day until the time is known.
  weddingMoment: "2027-02-11T00:00:00+05:30",

  cover: {
    blessing:  { bn: "॥ শ্রীশ্রী প্রজাপতয়ে নমঃ ॥", en: "॥ Shri Shri Prajapataye Namah ॥" },
    title:     { bn: "শুভ বিবাহ", en: "THE WEDDING OF" },
    welcome:   { bn: "সাদর আমন্ত্রণ", en: "You're Invited" },
    hint:      { bn: "পানপাতা সরিয়ে দেখুন", en: "PART THE BETEL LEAVES" },
    invite:    { bn: "বধূবরণ ও প্রীতিভোজের অনুষ্ঠানে আপনাদের সাদর আমন্ত্রণ", en: "REQUEST THE PLEASURE OF YOUR COMPANY AT THEIR RECEPTION" },
    weekday:   { bn: "শনিবার", en: "Saturday" },
    day:       13,
    monthYear: { bn: "ফেব্রুয়ারি ২০২৭", en: "February 2027" },
    lunarDate: { bn: "", en: "" },       // Bengali calendar date, once confirmed
    place:     { bn: "কাশীপুর স্পোর্টিংস ক্লাব · হাওড়া", en: "Kashipur Sportings Club · Howrah" },
    scroll:    { bn: "নিচে দেখুন", en: "Scroll Down" }
  },

  letter: {
    greeting: { bn: "সবিনয় নিবেদন,", en: "With love and respect," },
    body: {
      bn: "দুই পরিবারের আশীর্বাদ মাথায় নিয়ে আমরা একসঙ্গে পথ চলা শুরু করছি। আমাদের এই আনন্দের দিনে আপনি পাশে থাকলে দিনটি আরও সুন্দর হয়ে উঠবে।",
      en: "With the blessings of both our families, we are beginning our life together. This happy day will be all the more beautiful with you beside us."
    },
    signOff: { bn: "বিনীত", en: "Yours sincerely" },
    familyOne: {
      names: { bn: "শ্রী দেবাশীষ মুখার্জী ও শ্রীমতী সোমা মুখার্জী", en: "Mr. Debasish Mukherjee & Mrs. Soma Mukherjee" },
      role:  { bn: "বরের বাবা-মা", en: "Parents of the groom" }
    },
    familyTwo: {
      names: { bn: "শ্রী তপন বেরা ও শ্রীমতী শিখা বেরা", en: "Mr. Tapan Bera & Mrs. Sikha Bera" },
      role:  { bn: "কনের বাবা-মা", en: "Parents of the bride" }
    },
    note: { bn: "পত্র দ্বারা নিমন্ত্রণের ত্রুটি মার্জনীয়।", en: "Please forgive this invitation by letter." }
  },

  /* Story pictures: put story-1.jpg … story-4.jpg in the photos folder. */
  storyHead: {
    eyebrow: { bn: "পথচলার কথা", en: "How it Happened" },
    title:   { bn: "আমাদের গল্প", en: "Our Story" }
  },
  story: [
    { year: 2018, photo: "photos/story-1",
      title: { bn: "প্রথম দেখা", en: "The First Glance" },
      text:  { bn: "এক বন্ধুর মাধ্যমে প্রথম আলাপ এবং ২৫ শে ডিসেম্বর প্রথম সাক্ষাৎ। সেই দিনই দুজনেরই মনে হয়েছিল, এই মানুষটির উপর ভরসা করা যায়।", en: "A mutual friend brought them together, and they met for the first time on 25th December. From that very day, they felt they could trust each other." } },
    { year: 2022, photo: "photos/story-2",
      title: { bn: "বন্ধুত্ব ও পাশে থাকা", en: "Friendship and Being There for Each Other" },
      text:  { bn: "লম্বা ফোনালাপ, স্বপ্ন পূরণের পরিকল্পনা আর ভবিষ্যতের কথা বলতে বলতে কখন যে দুজন দুজনের অভ্যাস হয়ে উঠেছিল, তা বুঝতেই পারেনি!", en: "Long phone calls, shared dreams, and plans for the future slowly made them an inseparable part of each other's lives." } },
    { year: 2024, photo: "photos/story-3",
      title: { bn: "স্বপ্নপূরণের আনন্দ", en: "Dreams Coming True" },
      text:  { bn: "শেষমেশ মেঘের পছন্দের চাকরিটা পাওয়া এবং দুজনের লড়াইটা একে অপরের পাশে থেকে জয়ী হওয়ার আনন্দ।", en: "Finally, Megh got the job she wanted the most. Both felt the actual happiness of winning while standing by each other." } },
    { year: 2026, photo: "photos/story-4",
      title: { bn: "আইনী বিবাহ", en: "Two Families, One Table" },
      text:  { bn: "দীর্ঘ আট বছরের বন্ধুত্বের পথ পেরিয়ে এক দুপুরে দুই পরিবারের পরিচয়, মিষ্টিমুখ, অনেক হাসি আর আনন্দের মধ্য দিয়ে তারা আনুষ্ঠানিকভাবে একসঙ্গে পথচলার অঙ্গীকার করল।", en: "After eight years of friendship, one beautiful afternoon brought both families together. Amid sweets, laughter, and celebrations, they officially began their journey as one." } },
    { year: 2027,
      title: { bn: "শুভ পরিণয়", en: "The wedding" },
      text:  { bn: "আর এবার, আপনাদের সকলকে পাশে নিয়ে শুরু হতে চলেছে জীবনের নতুন অধ্যায়।", en: "And now, with all of you beside them, a beautiful new chapter begins." } }
  ],

  /* Album pictures: put album-1.jpg … in the photos folder. Your photo then
     replaces the demo by itself (.jpg, .jpeg, .png and .webp all work). */
  albumHead: {
    eyebrow: { bn: "কিছু মুহূর্ত", en: "A few moments" },
    title:   { bn: "ছবির খাতা", en: "Photo Album" }
  },
  album: [
    { photo: "photos/album-1", caption: { bn: "আমরা দু’জন", en: "The two of us" } },
    { photo: "photos/album-2", caption: { bn: "প্রথম ছবি", en: "Our first picture" } },
    { photo: "photos/album-3", caption: { bn: "এক সঙ্গে", en: "Together" } },
    { photo: "photos/album-4", caption: { bn: "ঘুরতে গিয়ে", en: "On our travels" } },
    { photo: "photos/album-5", caption: { bn: "পরিবারের সঙ্গে", en: "With family" } },
    { photo: "photos/album-6", caption: { bn: "আশীর্বাদ", en: "Ashirbad" } }
  ],

  countdown: {
    before: { bn: "শুভক্ষণের আর", en: "The big day is in" },
    days:   { bn: "দিন বাকি", en: "days" },
    hours:  { bn: "ঘণ্টা", en: "hours" },
    mins:   { bn: "মিনিট", en: "mins" },
    secs:   { bn: "সেকেন্ড", en: "secs" },
    today:  { bn: "আজই শুভদিন", en: "The day is here" },
    date:   { bn: "শনিবার, ১৩ ফেব্রুয়ারি, ২০২৭", en: "Saturday, 13 February 2027" }
  },

  eventsHead: {
    eyebrow: { bn: "অনুষ্ঠানসূচি", en: "The programme" },
    title:   { bn: "বিবাহ ও বৌভাত", en: "Wedding & Reception" }
  },
  // icon: fish, sun, crown or leaf. venue: 0 is the first venue below.
  // Add the time to start as "2027-02-11T19:30:00+05:30" and fill in time; dress is optional.
  // Events on one date are listed together.
  // infoOnly: shown in the programme with no place and no calendar button.
  events: [
    { icon: "crown", start: "2027-02-11", infoOnly: true,
      weekday: { bn: "বৃহস্পতিবার", en: "Thursday" }, day: 11, month: { bn: "ফেব্রুয়ারি", en: "February" },
      title: { bn: "শুভ বিবাহ", en: "The Wedding" }, time: { bn: "", en: "" }, dress: { bn: "", en: "" } },
    { icon: "leaf", start: "2027-02-13", hours: 4, venue: 0,
      weekday: { bn: "শনিবার", en: "Saturday" }, day: 13, month: { bn: "ফেব্রুয়ারি", en: "February" },
      title: { bn: "বৌভাত", en: "Reception" }, time: { bn: "", en: "" }, dress: { bn: "", en: "" } }
  ],
  dressLabel:  { bn: "সাজপোশাক", en: "Dress" },
  calendarBtn: { bn: "ক্যালেন্ডারে রাখুন", en: "Add to calendar" },

  venueHead: {
    eyebrow: { bn: "যেখানে বসবে আসর", en: "Where we gather" },
    title:   { bn: "অনুষ্ঠানস্থল", en: "The Venue" }
  },
  venues: [
    { label: { bn: "বৌভাত", en: "Reception" },
      when:  { bn: "শনিবার, ১৩ ফেব্রুয়ারি ২০২৭", en: "Saturday, 13 February 2027" },
      name:  { bn: "কাশীপুর স্পোর্টিংস ক্লাব", en: "Kashipur Sportings Club" },
      address: { bn: "৬৬/৯৪, পি রোড, কুঞ্জপাড়া, দাসনগর, হাওড়া, পশ্চিমবঙ্গ ৭১১১০৫", en: "66/94, P Road, Kunjapara, Dasnagar, Howrah, West Bengal 711105" },
      map: "https://maps.app.goo.gl/1Um7Jg2qjazRZmjV6?g_st=ac" }
  ],
  // How to get there: shown under the venues when filled in. Example:
  // { icon: "train", from: { bn: "হাওড়া স্টেশন", en: "Howrah Station" }, how: { bn: "ট্রেনে", en: "By train" }, time: { bn: "এক ঘণ্টা", en: "1 hour" } }
  routes: [],
  venueNote: { bn: "", en: "" },
  venueButtons: {
    map:   { bn: "মানচিত্রে দেখুন", en: "Open map" },
    copy:  { bn: "ঠিকানা কপি করুন", en: "Copy address" },
    copied:{ bn: "ঠিকানা কপি হয়েছে", en: "Address copied" }
  },

  contactsIntro: { bn: "কিছু জানার আছে? এক বার্তাতেই পাবেন আমাদের।", en: "Any questions? Just send us a message." },
  // Phone numbers with country code, digits only.
  contacts: [
    { name: { bn: "বরপক্ষের নাম", en: "Groom's side contact" }, side: { bn: "শাশ্বত", en: "Shaswata" }, phone: "8621052778" },
    { name: { bn: "কনেপক্ষের নাম", en: "Bride's side contact" }, side: { bn: "পিয়াসা", en: "Piyasa" }, phone: "7583944691" }
  ],

  rsvp: {
    whatsapp: "918621052778",   // replies arrive at this WhatsApp number
    eyebrow:  { bn: "৩১ জানুয়ারির মধ্যে জানান", en: "Please reply by 31 January" },
    title:    { bn: "আসছেন তো?", en: "Will you come?" },
    stepWord: { bn: "ধাপ", en: "Step" },
    q1: { bn: "প্রথমে আপনার নামটি", en: "First, your name" },
    q2: { bn: "আপনি কি আসছেন?", en: "Will you be there?" },
    yes: { bn: "অবশ্যই আসছি", en: "Yes, gladly" },
    no:  { bn: "আসতে পারছি না", en: "Sorry, I can't" },
    q3: { bn: "ক’জন আসছেন?", en: "How many of you?" },
    q4: { bn: "খাবারে কী পছন্দ করবেন?", en: "What would you like to eat?" },
    veg:    { bn: "নিরামিষ", en: "Veg" },
    nonveg: { bn: "আমিষ", en: "Non-veg" },
    foodLeft: { bn: "আরও {n} জনের পছন্দ বাছুন", en: "Choose for {n} more" },
    q5: { bn: "কিছু বলার থাকলে লিখুন", en: "Any message for us?" },
    next: { bn: "এরপর", en: "Next" },
    back: { bn: "আগের ধাপ", en: "Back" },
    send: { bn: "হোয়াটসঅ্যাপে পাঠান", en: "Send on WhatsApp" },
    thanks: { bn: "ধন্যবাদ! আপনার উত্তরের অপেক্ষায় রইলাম।", en: "Thank you! We look forward to your reply." },
    msgName: { bn: "নাম", en: "Name" },
    msgComing: { bn: "আসছি", en: "Coming" },
    msgNotComing: { bn: "আসতে পারছি না", en: "Not coming" },
    msgGuests: { bn: "অতিথি", en: "Guests" },
    msgFood: { bn: "খাবার", en: "Food" },
    msgNote: { bn: "বার্তা", en: "Message" }
  },

  footer: {
    date:   "13 · 02 · 27",
    thanks: { bn: "শুভেচ্ছা ও ভালোবাসাসহ", en: "With love and good wishes" },
    share:  { bn: "নিমন্ত্রণপত্রটি পাঠান", en: "Share this invitation" },
    copied: { bn: "লিঙ্ক কপি হয়েছে", en: "Link copied" },
    made:   { bn: "ভালবাসা দিয়ে তৈরি", en: "Made with love" }
  },

  nav: {
    story:  { bn: "গল্প", en: "Story" },
    album:  { bn: "ছবি", en: "Photos" },
    events: { bn: "অনুষ্ঠান", en: "Events" },
    venue:  { bn: "ঠিকানা", en: "Venue" },
    rsvp:   { bn: "উত্তর", en: "RSVP" }
  },
  pageTitle: { bn: "শাশ্বত ও পিয়াসা · বধূবরণ নিমন্ত্রণ", en: "Shaswata & Piyasa · Reception Invitation" }
};
