export type CategoryKey = 'studios' | 'videographers' | 'editors' | 'equipment';

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
    fields: [["Full Name", "Email ID"], ["Contact Number", "Base Price (Hourly)"], ["Full Address", "Google Map Pin Link"], ["Government ID (Aadhar/PAN)", "Studio Name / Business Name"]],
    textarea: "Provide details about the place (e.g., Podcast space, Kitchen area, lighting equipment, etc.)",
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
    fields: [["Owner Name", "Email ID"], ["Contact Number", "Government ID"], ["Equipment to Offer", "Price Per Day"], ["Address Pick up point", "Google Map Pin Link"], ["Security Deposit", "Availability"]],
    textarea: "Describe the equipment condition, ideal use cases, brand / model details, and rental rules.",
  },
};
