const normalizeText = (text) => {
  return text
    .normalize("NFKC")
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();
};

const getVisibleText = (el) => {
  if (!el) return "";
  
  const style = window.getComputedStyle(el);
  if (
    style.display === "none" || style.visibility === "hidden" || el.offsetHeight === 0
  ) {
    return "";
  }
  return el.innerText.trim();
};

const extractHeadings = () => {
  const headings = {
    h1: [],
    h2: [],
    h3: [],
    h4: []
  };
  
  for (let i = 1; i <= 4; i++) {
    const level = `h${i}`;
    document.querySelectorAll(level).forEach(el => {
      const text = getVisibleText(el);
      if (text) {
        headings[level].push(text);
      }
    });
  }
  
  return headings;
};

const extractMainText = () => {
  const paragraphs = document.querySelectorAll('p');
  let text = '';
  
  paragraphs.forEach(p => {
    const paragraphText = getVisibleText(p);
    if (paragraphText) {
      text += paragraphText + '\n\n';
    }
  });
  
  return normalizeText(text);
};

const extractFooter = () => {
  const footer = document.querySelector('footer');
  if (!footer) return '';
  
  return getVisibleText(footer);
};

const parseStructuredContent = () => {
  return {
    headings: extractHeadings(),
    text: extractMainText(),
    footer: extractFooter()
  };
};

window.addEventListener("load", () => {
  setTimeout(() => {
    const content = parseStructuredContent();
    
    const payload = {
      type: "view",
      url: location.href,
      title: normalizeText(document.title || ""),
      lang: document.documentElement.lang || "unknown",  
      text: normalizeText(extractMainText()),            
      content: content                                    
    };

    chrome.runtime.sendMessage(payload);
  }, 500);
});