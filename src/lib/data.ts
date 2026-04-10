export const marketplaceData = {
  studios: [
    { id: 1, title: "Noir Podcast Studio", city: "Mumbai", price: 1800, rating: 4.9, type: "Podcast Studio", duration: "Per hour", features: ["2 mics", "Acoustic setup", "Lighting", "Producer support"], description: "A clean black-and-wood podcast studio for interviews, solo shows, and branded conversations." },
    { id: 2, title: "Daylight Creator Loft", city: "Delhi", price: 3200, rating: 4.8, type: "Photo + Video Studio", duration: "Per hour", features: ["Natural light", "Backdrop wall", "Makeup area", "Changing room"], description: "Ideal for fashion shoots, content days, product reels, and lifestyle campaigns." },
    { id: 3, title: "Reel Factory Set", city: "Bengaluru", price: 2500, rating: 4.7, type: "Short-form Studio", duration: "Per hour", features: ["RGB lights", "Props", "Tripods", "Monitor"], description: "Made for reels, ad shoots, and performance content with flexible sets and quick turnarounds." },
  ],
  videographers: [
    { id: 4, title: "Aarav Mehta Films", city: "Mumbai", price: 12000, rating: 4.9, type: "Videographer", duration: "Per shoot", features: ["Brand shoots", "Cinematic reels", "Product videos", "1 assistant"], description: "For premium founder content, studio shoots, and polished short-form edits with shoot planning support." },
    { id: 5, title: "Framehouse Creative", city: "Delhi", price: 8500, rating: 4.7, type: "Videographer", duration: "Per shoot", features: ["Event capture", "Reels", "Interviews", "Same-day raw files"], description: "Best suited for creator days, campaign shoots, and event-driven production requirements." },
    { id: 6, title: "South Cut Motion", city: "Bengaluru", price: 15000, rating: 4.8, type: "Videographer", duration: "Per shoot", features: ["Multi-cam", "Lighting kit", "Audio capture", "Direction support"], description: "A strong fit for premium content shoots, YouTube episodes, and polished commercial executions." },
  ],
  editors: [
    { id: 7, title: "CutLab Edit House", city: "Remote", price: 2500, rating: 4.8, type: "Video Editor", duration: "Per video", features: ["Reels", "Captions", "Motion text", "Fast delivery"], description: "Short-form editing for creators and brands who want speed, clean pacing, and modern style." },
    { id: 8, title: "Podcast Polish Co.", city: "Remote", price: 4000, rating: 4.9, type: "Podcast Editor", duration: "Per episode", features: ["Audio cleanup", "Multi-cam sync", "Highlights", "Thumbnails"], description: "For podcasts and interview formats that need a premium edit and repurposed social cuts." },
    { id: 9, title: "Scrollstop Studio", city: "Jaipur", price: 3000, rating: 4.7, type: "Reel Editor", duration: "Per video", features: ["Hooks", "Subtitles", "Sound design", "Brand styling"], description: "Designed for social-first brands, influencers, and founder-led content that needs sharper retention." },
  ],
  equipment: [
    { id: 10, title: "Sony FX3 Creator Kit", city: "Mumbai", price: 4500, rating: 4.9, type: "Camera Kit", duration: "Per day", features: ["Sony FX3", "24-70 lens", "Gimbal", "Batteries"], description: "A high-demand video kit for creator shoots, interviews, and premium short-form production." },
    { id: 11, title: "Podcast Pro Audio Pack", city: "Delhi", price: 2200, rating: 4.8, type: "Audio Kit", duration: "Per day", features: ["2 microphones", "Recorder", "Stands", "Headphones"], description: "Reliable plug-and-play podcast gear for interview setups, conversation shows, and branded content." },
    { id: 12, title: "Lighting + Backdrop Bundle", city: "Bengaluru", price: 1800, rating: 4.6, type: "Lighting", duration: "Per day", features: ["2 softboxes", "RGB tube", "Backdrop stand", "Reflector"], description: "A compact lighting set for product shoots, talking-head videos, and home-studio creator setups." },
  ],
};

export type CategoryKey = keyof typeof marketplaceData;

export const titleMap: Record<CategoryKey, string> = {
  studios: "Studio Marketplace",
  videographers: "Videographer Marketplace",
  editors: "Editor Marketplace",
  equipment: "Equipment Marketplace",
};

export const subMap: Record<CategoryKey, string> = {
  studios: "Browse available studio spaces, compare setups, and request a booking.",
  videographers: "Explore creator-friendly videographers by city, style, and budget.",
  editors: "Find editors for reels, podcasts, and YouTube with clear pricing.",
  equipment: "Rent cameras, lighting, and audio gear with easy comparison.",
};

export const registrationConfig: Record<string, {
  heading: string;
  description: string;
  fields: [string, string][];
  textarea: string;
}> = {
  "list-studio": {
    heading: "List Your Studio",
    description: "Add your studio details so creators can discover, shortlist, and book your space.",
    fields: [["Studio Name", "Business / Owner Name"], ["City", "Area / Address"], ["Price Per Hour", "Capacity"], ["Equipment Included", "Available Days"]],
    textarea: "Describe your studio, setup, aesthetics, and the types of shoots it is ideal for.",
  },
  "register-videographer": {
    heading: "Register as Videographer",
    description: "Create your profile to get discovered for creator shoots, podcasts, events, and brand projects.",
    fields: [["Full Name", "Brand / Agency Name"], ["City", "Phone Number"], ["Starting Price", "Years of Experience"], ["Specialization", "Instagram / Portfolio Link"]],
    textarea: "Describe your shooting style, gear, past work, and the kind of projects you want to take up.",
  },
  "register-editor": {
    heading: "Register as Editor",
    description: "Showcase your editing skillset so creators can hire you for reels, YouTube, podcasts, and ads.",
    fields: [["Full Name", "City / Remote"], ["Phone Number", "Instagram / Portfolio Link"], ["Starting Price", "Turnaround Time"], ["Editing Type", "Software Used"]],
    textarea: "Describe your editing style, formats you work on, delivery process, and ideal type of clients.",
  },
  "list-equipment": {
    heading: "List Equipment",
    description: "Add your camera, lighting, or audio gear for rental and let creators book what they need.",
    fields: [["Equipment Name", "Owner Name"], ["City", "Pickup / Delivery Option"], ["Price Per Day", "Security Deposit"], ["Included Accessories", "Availability"]],
    textarea: "Describe the equipment condition, ideal use cases, brand / model details, and rental rules.",
  },
};
