import fs from "fs";
import process from "process";

// Read the CSV content
const raw = fs.readFileSync(process.argv[2], "utf-8");

// Split into lines, skip header and empty lines
const lines = raw
  .split("\n")
  .map((l) => l.replace(/\r$/, ""))
  .filter((l) => l.trim() && !l.startsWith("Source:") && !l.startsWith("---") && !l.startsWith("Sl No."));

function extractUsername(url) {
  try {
    let u = url.replace(/https?:\/\/(www\.)?instagram\.com\//, "");
    u = u.split("?")[0].split("#")[0];
    u = u.replace(/\/reels\/?$/, "").replace(/\/$/, "");
    return u || null;
  } catch {
    return null;
  }
}

function parseFollowers(str) {
  // Remove quotes and commas: "6,528,177" -> 6528177
  return parseInt(str.replace(/[",\s]/g, ""), 10) || 0;
}

function parseEngagement(str) {
  return parseFloat(str.replace("%", "")) || 0;
}

// Parse CSV properly (handles quoted fields with commas)
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

const influencers = [];

for (const line of lines) {
  const parts = parseCSVLine(line);
  if (parts.length < 7) continue;

  const [slNo, name, instagramLink, followers, engagement, category, deliverables] = parts;
  
  const id = parseInt(slNo);
  if (isNaN(id)) continue;

  const username = extractUsername(instagramLink);
  if (!username) continue;

  influencers.push({
    id,
    name: name.trim(),
    username,
    instagramLink: `https://www.instagram.com/${username}/`,
    followers: parseFollowers(followers),
    engagement: parseEngagement(engagement),
    category: category.trim(), // Mega, Macro, Micro
    deliverables: deliverables.trim(),
  });
}

console.log(`Parsed ${influencers.length} influencers`);

// Generate TypeScript file
let ts = `// Auto-generated from client spreadsheet — ${influencers.length} influencers
// Last updated: ${new Date().toISOString().split("T")[0]}

export interface Influencer {
  id: number;
  name: string;
  username: string;
  instagramLink: string;
  followers: number;
  engagement: number;
  category: "Mega" | "Macro" | "Micro";
  deliverables: string;
}

export const INFLUENCERS: Influencer[] = [\n`;

for (const inf of influencers) {
  const safeName = inf.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
  const safeDel = inf.deliverables.replace(/'/g, "\\'").replace(/"/g, '\\"');
  ts += `  { id: ${inf.id}, name: "${safeName}", username: "${inf.username}", instagramLink: "${inf.instagramLink}", followers: ${inf.followers}, engagement: ${inf.engagement}, category: "${inf.category}", deliverables: "${safeDel}" },\n`;
}

ts += `];\n`;

fs.writeFileSync(
  "src/data/influencer-data.ts",
  ts,
  "utf-8"
);

console.log("Written to src/data/influencer-data.ts");
