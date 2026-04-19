const IGNORE_URL_PREFIXES = [
  "chrome://"
];

const buildPayload = (message) => {
  return {
    url: message.url,
    title: message.title,
    lang: message.lang,
    text: message.text,
    content: message.content,
    timestamp: new Date().toISOString()
  };
};

chrome.runtime.onMessage.addListener(async (message) => {
  console.log("собранные данные:", message);

  if (!message || message.type !== "view") {
    return;
  }
  if (!message.url || IGNORE_URL_PREFIXES.some((prefix) => message.url.startsWith(prefix))) {
    return;
  }

  const payload = buildPayload(message);
  console.log("Sending payload", payload);

  try {
    const response = await fetch("http://127.0.0.1:8000/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", response.status);
  } catch (error) {
    console.error("Failed to send payload:", error);
  }
});