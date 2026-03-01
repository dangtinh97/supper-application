export const badWords = [
  'damn',
  'hell',
  'shit',
  'fuck',
  'bitch',
  'bastard',
  'asshole',
  'dick',
  'piss',
  'crap',
  'slut',
  'prick',
  'cunt',
  'motherfucker',
  'screw',
  'whore',
  'cock',
  'douche',
  'sex',
  'địt',
  'cặc',
  'lồn',
  'đéo',
  'mẹ mày',
  'chó',
  'đụ',
  'mẹ kiếp',
  'bà nội mày',
  'mả mẹ',
  'đéo hiểu',
  'bố láo',
  'con mẹ nó',
  'khốn nạn',
  'ngu',
  'thằng khốn',
  'mày',
]

export const removeBadWord = (text: string)=>{
  if (!text) {
    return '';
  }
  try {
    badWords.sort((a, b) => b.length - a.length);
    badWords.forEach((item) => {
      const regex = new RegExp(`(^|\\s)${item}($|\\s)`, 'gi');
      text = text.replace(regex, ' ');
    });
    text = text.replace(/ {2}/g, ' ');
    return text.trim();
  } catch (e) {
    return text;
  }
}