// Centralized theme colors for events
export const themes = [
  { 
    name: 'blue', 
    bg: 'from-[#00AEEF] to-[#0088CC]', 
    text: 'text-[#00AEEF]', 
    lightBg: 'bg-[#00AEEF]/15', 
    border: 'border-[#00AEEF]/15',
    hoverBorder: 'hover:border-[#00AEEF]/40'
  },
  { 
    name: 'pink', 
    bg: 'from-[#E91E63] to-[#C2185B]', 
    text: 'text-[#E91E63]', 
    lightBg: 'bg-[#E91E63]/15', 
    border: 'border-[#E91E63]/15',
    hoverBorder: 'hover:border-[#E91E63]/40'
  },
  { 
    name: 'green', 
    bg: 'from-[#4CAF50] to-[#388E3C]', 
    text: 'text-[#4CAF50]', 
    lightBg: 'bg-[#4CAF50]/15', 
    border: 'border-[#4CAF50]/15',
    hoverBorder: 'hover:border-[#4CAF50]/40'
  },
  { 
    name: 'orange', 
    bg: 'from-[#FF9800] to-[#F57C00]', 
    text: 'text-[#FF9800]', 
    lightBg: 'bg-[#FF9800]/15', 
    border: 'border-[#FF9800]/15',
    hoverBorder: 'hover:border-[#FF9800]/40'
  },
];

export const getEventTheme = (id) => {
  if (!id) return themes[0];
  const num = parseInt(id.toString().slice(-6), 16);
  if (!isNaN(num)) {
    return themes[num % themes.length];
  }
  const charSum = id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return themes[charSum % themes.length];
};

// Smart location link extraction
export const extractLocationLink = (locationStr) => {
  if (!locationStr) return null;
  // Regex to find http/https or goo.gl/maps links
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|maps\.[^\s]+|goog?\.gl\/maps\/[^\s]+|goo\.gl\/[^\s]+)/gi;
  const match = locationStr.match(urlRegex);
  if (match) {
    let url = match[0];
    if (url.toLowerCase().startsWith('www.')) url = `https://${url}`;
    return url;
  }
  return null;
};

export const getLocationTitle = (locationStr) => {
  if (!locationStr) return null;
  const link = extractLocationLink(locationStr);
  if (!link) return locationStr;
  
  // Remove the link from the string to get the title
  const title = locationStr.replace(link, '').trim();
  // If the title is empty (it was just a link), return null so component can translate
  return title || null;
};
