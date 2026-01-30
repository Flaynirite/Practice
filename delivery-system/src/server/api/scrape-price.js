// server/api/scrape-price.js
app.post('/api/scrape-price', async (req, res) => {
  const { url } = req.body;
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Парсинг HTML для отримання ціни
    // (кожен сайт має свою структуру)
    const price = extractPriceFromHTML(html, url);
    const title = extractTitleFromHTML(html, url);
    
    res.json({ success: true, price, title });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});