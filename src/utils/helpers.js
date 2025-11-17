// hekpers.test.js

export default function returnNothing() {
  return ""
}

// returns "fname lname" if both exist, otherwise just first name
export function displayName({ fname = "", lname = "" }) {
  let output = ""
  if (lname) {
    output = `${fname} ${lname}`
  } else {
    output = `${fname}`
  }
  return (toProperCase(output))
}

// converts any string to proper case
export function toProperCase(str) {
  // console.log(`str: ${str}, typeOf: ${typeof str}`)
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

// formats numbers into USD currency with no cents
export function convertToCurrency(amount) {
  const usdFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);

  return usdFormatted;
}

// converts comma-separated genres into capitalized, readable text
export function formatGenres(genreString) {
  if (!genreString) return "";
  return genreString
    .split(",")
    .map((g) => g.trim())
    .map((g) => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase())
    .join(", ");
}

// converts dates into "Jan 1, 2000" format
export function formatDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// converts dates and ISO into "Jan 1, 2000" format
export function formatISODate(dateStr) {
  if (!dateStr) return "";

  let date;

  // If it's plain YYYY-MM-DD, parse as local date to avoid timezone weirdness
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    date = new Date(Number(y), Number(m) - 1, Number(d)); // local
  } else {
    date = new Date(dateStr); // fallback
  }

  if (isNaN(date)) return dateStr;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// converts "HH:MM:SS" into "1h 41m" style
export function formatTime(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return "0m";

  const parts = timeStr.split(":").map(Number);

  if (parts.some((n) => Number.isNaN(n))) { return "0m" }

  let hours = 0,
    minutes = 0,
    seconds = 0;

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
  } else if (parts.length === 1) {
    seconds = parts[0];
  }

  minutes += Math.floor(seconds / 60);
  seconds = seconds % 60;
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
