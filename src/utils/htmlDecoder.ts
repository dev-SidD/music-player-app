// Function to decode HTML entities
export const decodeHtmlEntities = (text: string): string => {
  if (!text || typeof text !== 'string') return text || '';
  
  // Handle numeric entities like &#39; or &#x27;
  let decoded = text.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });
  
  decoded = decoded.replace(/&#x([a-f\d]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  // Handle named entities
  const entityMap: { [key: string]: string } = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&apos;': "'",
    '&nbsp;': ' ',
  };

  decoded = decoded.replace(/&[#\w]+;/g, (entity) => {
    return entityMap[entity] || entity;
  });

  return decoded;
};

