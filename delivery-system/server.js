// delivery-server/server.js
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API для отримання інформації про товар
app.post('/api/get-product-info', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log('Fetching product info from:', url);
    
    const productInfo = await scrapeProductInfo(url);
    
    res.json({
      success: true,
      title: productInfo.title,
      price: productInfo.price,
      currency: productInfo.currency,
      platform: productInfo.platform
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Функція для скрейпінгу
async function scrapeProductInfo(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Залежно від платформи - різні селектори
    const platform = detectPlatform(url);
    let title = '';
    let price = '';
    let currency = '';
    
    switch(platform) {
      case 'ebay':
        title = await page.evaluate(() => {
          const elem = document.querySelector('.x-item-title__mainTitle span') || 
                       document.querySelector('.it-ttl') ||
                       document.querySelector('h1.it-ttl');
          return elem ? elem.textContent.trim() : '';
        });
        
        price = await page.evaluate(() => {
          const elem = document.querySelector('.x-price-primary span') ||
                       document.querySelector('.display-price') ||
                       document.querySelector('#prcIsum');
          return elem ? elem.textContent.trim() : '';
        });
        break;
        
      case 'amazon':
        title = await page.evaluate(() => {
          const elem = document.querySelector('#productTitle');
          return elem ? elem.textContent.trim() : '';
        });
        
        price = await page.evaluate(() => {
          const elem = document.querySelector('.a-price-whole') ||
                       document.querySelector('.priceToPay span');
          return elem ? elem.textContent.trim() : '';
        });
        break;
        
      case 'aliexpress':
        title = await page.evaluate(() => {
          const elem = document.querySelector('.product-title-text');
          return elem ? elem.textContent.trim() : '';
        });
        
        price = await page.evaluate(() => {
          const elem = document.querySelector('.product-price-value') ||
                       document.querySelector('.uniform-banner-box-price');
          return elem ? elem.textContent.trim() : '';
        });
        break;
        
      case 'rozetka':
        title = await page.evaluate(() => {
          const elem = document.querySelector('.product__title');
          return elem ? elem.textContent.trim() : '';
        });
        
        price = await page.evaluate(() => {
          const elem = document.querySelector('.product-price__big');
          return elem ? elem.textContent.trim() : '';
        });
        break;
        
      default:
        title = await page.evaluate(() => {
          return document.title || '';
        });
        
        price = await page.evaluate(() => {
          // Шукаємо будь-які цифри, які можуть бути ціною
          const metaPrice = document.querySelector('meta[property="og:price:amount"]') ||
                           document.querySelector('meta[property="product:price:amount"]');
          return metaPrice ? metaPrice.getAttribute('content') : '';
        });
    }
    
    // Очищення ціни
    price = price.replace(/[^\d.,]/g, '').trim();
    
    return {
      title: title.substring(0, 100) || 'Товар',
      price: price || '0.00',
      currency: 'USD',
      platform
    };
    
  } finally {
    await browser.close();
  }
}

function detectPlatform(url) {
  const urlStr = url.toLowerCase();
  if (urlStr.includes('ebay.com') || urlStr.includes('ebay.')) return 'ebay';
  if (urlStr.includes('amazon.com') || urlStr.includes('amazon.')) return 'amazon';
  if (urlStr.includes('aliexpress.com') || urlStr.includes('aliexpress.')) return 'aliexpress';
  if (urlStr.includes('rozetka.com') || urlStr.includes('rozetka.')) return 'rozetka';
  if (urlStr.includes('prom.ua') || urlStr.includes('prom.')) return 'prom';
  return 'other';
}

app.listen(PORT, () => {
  console.log(`Product Scraper API running on http://localhost:${PORT}`);
});