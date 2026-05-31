// src/services/amazonScannerService.ts

export interface AmazonProductInfo {
  title: string;
  price: number;
  currency: string;
  condition: string;
  seller: string;
  sellerLocation: string;
  shipping: number;
  totalPrice: number;
  available: boolean;
  location: string;
  originCountry: string;
  weight?: string;
  dimensions?: string;
  asin?: string;
  brand?: string;
  category?: string;
}

export class AmazonScannerService {
  private static readonly PROXY_URLS = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://thingproxy.freeboard.io/fetch/'
  ];

  /**
   * Сканує сторінку Amazon за посиланням та отримує інформацію про товар
   */
  static async scanAmazonProduct(url: string): Promise<AmazonProductInfo> {
    try {
      console.log('🔍 Починаю сканування Amazon посилання:', url);

      // Використовуємо один з проксі
      const html = await this.fetchWithProxies(url);
      
      if (!html) {
        console.log('⚠️ Не вдалося отримати сторінку через проксі');
        return this.getFallbackData(url);
      }

      return this.parseAmazonHtml(html, url);
      
    } catch (error) {
      console.error('❌ Помилка при скануванні Amazon:', error);
      return this.getFallbackData(url);
    }
  }

  /**
   * Спроба отримати HTML через різні проксі
   */
  private static async fetchWithProxies(url: string): Promise<string | null> {
    for (const proxyBase of this.PROXY_URLS) {
      try {
        const proxyUrl = proxyBase + encodeURIComponent(url);
        console.log(`🔄 Спроба через проксі: ${proxyBase}`);
        
        const response = await fetch(proxyUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
          timeout: 10000
        } as any);

        if (response.ok) {
          const html = await response.text();
          if (html && html.length > 1000) {
            if (html.includes('Robot Check') || html.includes('captcha')) {
              console.log(`⚠️ Проксі ${proxyBase} зловив капчу Amazon, міняю проксі...`);
              continue;
            }
            console.log(`✅ Проксі ${proxyBase} працює`);
            return html;
          }
        }
      } catch (e) {
        console.log(`❌ Проксі не працює: ${proxyBase}`);
        continue;
      }
    }
    return null;
  }

  /**
   * Парсинг HTML сторінки Amazon
   */
  private static parseAmazonHtml(html: string, url: string): AmazonProductInfo {
    // Видобуваємо ASIN
    const asinMatch = url.match(/\/(dp|gp\/product|exec\/obidos\/ASIN)\/([A-Z0-9]{10})/i);
    const asin = asinMatch ? asinMatch[2] : this.extractAsinFromHtml(html);

    // Основна інформація
    const title = this.extractTitleFromHtml(html);
    const priceInfo = this.extractPriceFromHtml(html);
    const originDetails = this.extractOriginCountryFromHtml(html, url);
    const shipping = this.extractShippingFromHtml(html);
    const sellerInfo = this.extractSellerInfoFromHtml(html);
    const weightAndDimensions = this.extractWeightAndDimensions(html);
    const brand = this.extractBrandFromHtml(html);
    const category = this.extractCategoryFromHtml(html);

    const totalPrice = priceInfo.price > 0 ? (priceInfo.price + shipping) : 0;

    const productInfo: AmazonProductInfo = {
      title: title || 'Товар з Amazon',
      price: priceInfo.price,
      currency: priceInfo.currency,
      condition: 'Новий',
      seller: sellerInfo.name || 'Amazon',
      sellerLocation: sellerInfo.location || originDetails.country,
      shipping: shipping,
      totalPrice: totalPrice,
      available: priceInfo.available,
      location: originDetails.location,
      originCountry: originDetails.country,
      weight: weightAndDimensions.weight,
      dimensions: weightAndDimensions.dimensions,
      asin,
      brand,
      category
    };

    console.log('✅ Дані про товар Amazon:', {
      title: productInfo.title.substring(0, 50) + '...',
      price: `${productInfo.price} ${productInfo.currency}`,
      country: productInfo.originCountry,
      asin: productInfo.asin,
      available: productInfo.available
    });

    return productInfo;
  }

  /**
   * Видобуваємо ASIN з HTML
   */
  private static extractAsinFromHtml(html: string): string {
    const asinPatterns = [
      /"asin":"([A-Z0-9]{10})"/,
      /"parentAsin":"([A-Z0-9]{10})"/,
      /data-asin="([A-Z0-9]{10})"/,
      /\/dp\/([A-Z0-9]{10})/,
    ];

    for (const pattern of asinPatterns) {
      const match = html.match(pattern);
      if (match) return match[1];
    }
    return '';
  }

  /**
   * Визначення країни походження
   */
  private static extractOriginCountryFromHtml(html: string, url: string): { 
    country: string; 
    location: string;
  } {
    const countryMap: Record<string, string> = {
      'germany': 'Німеччина',
      'usa': 'США',
      'united states': 'США',
      'china': 'Китай',
      'japan': 'Японія',
      'united kingdom': 'Великобританія',
      'uk': 'Великобританія',
      'france': 'Франція',
      'italy': 'Італія',
      'spain': 'Іспанія',
      'canada': 'Канада',
      'australia': 'Австралія',
      'india': 'Індія',
      'poland': 'Польща',
    };

    const htmlLower = html.toLowerCase();
    for (const [key, country] of Object.entries(countryMap)) {
      if (htmlLower.includes(key)) {
        const regex = new RegExp(`(made in|manufactured in|product of|country of origin).{0,50}${key}`, 'i');
        if (regex.test(html)) {
          return { country, location: country };
        }
      }
    }

    const domainCountry = this.detectCountryByDomain(url);
    return { country: domainCountry, location: domainCountry };
  }

  private static detectCountryByDomain(url: string): string {
    const domainMap: Record<string, string> = {
      'amazon.com': 'США',
      'amazon.de': 'Німеччина',
      'amazon.co.uk': 'Великобританія',
      'amazon.fr': 'Франція',
      'amazon.it': 'Італія',
      'amazon.es': 'Іспанія',
      'amazon.ca': 'Канада',
      'amazon.com.au': 'Австралія',
      'amazon.co.jp': 'Японія',
    };

    for (const [domain, country] of Object.entries(domainMap)) {
      if (url.includes(domain)) return country;
    }

    return 'США';
  }

  /**
   * Інформація про продавця
   */
  private static extractSellerInfoFromHtml(html: string): { name: string; location: string } {
    const patterns = [
      /sold by.*?<a[^>]*>([^<]+)<\/a>/i,
      /seller.*?<a[^>]*>([^<]+)<\/a>/i,
      /<span[^>]*id="sellerProfile"[^>]*>([^<]+)<\/span>/i,
    ];

    let seller = 'Amazon';
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        seller = match[1].replace(/<[^>]*>/g, '').trim();
        break;
      }
    }

    return { name: seller, location: 'Невідомо' };
  }

  /**
   * Бренд
   */
  private static extractBrandFromHtml(html: string): string {
    const patterns = [
      /"brand":"([^"]+)"/,
      /<a[^>]*id="bylineInfo"[^>]*>([^<]+)<\/a>/i,
      /<span[^>]*class="a-size-base"[^>]*>Brand.*?<span[^>]*>([^<]+)<\/span>/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1].replace(/<[^>]*>/g, '').trim();
      }
    }
    return '';
  }

  /**
   * Категорія
   */
  private static extractCategoryFromHtml(html: string): string {
    const match = html.match(/<a[^>]*class="a-link-normal a-color-tertiary"[^>]*>([^<]+)<\/a>/g);
    if (match && match.length > 0) {
      const lastCat = match[match.length - 1].replace(/<[^>]*>/g, '').trim();
      return lastCat;
    }
    return '';
  }

  /**
   * Вага та габарити
   */
  private static extractWeightAndDimensions(html: string): { weight: string; dimensions: string } {
    const weightPatterns = [
      /item weight.*?<span[^>]*>([^<]+)<\/span>/i,
      /product weight.*?<span[^>]*>([^<]+)<\/span>/i,
      /<tr.*?item weight.*?<td[^>]*>([^<]+)<\/td>/i,
    ];

    const dimPatterns = [
      /product dimensions.*?<span[^>]*>([^<]+)<\/span>/i,
      /item dimensions.*?<span[^>]*>([^<]+)<\/span>/i,
      /<tr.*?product dimensions.*?<td[^>]*>([^<]+)<\/td>/i,
    ];

    let weight = '';
    let dimensions = '';

    for (const pattern of weightPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        weight = match[1].trim();
        break;
      }
    }

    for (const pattern of dimPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        dimensions = match[1].trim();
        break;
      }
    }

    return { weight, dimensions };
  }

  /**
   * ЦІНА — ПОВНІСТЮ ПЕРЕПИСАНИЙ ТА НАДІЙНИЙ МЕТОД
   */
  private static extractPriceFromHtml(html: string): { 
    price: number; 
    currency: string; 
    available: boolean 
  } {
    const detectedCurrency = this.detectCurrency(html);

    // 1. Спроба через структуровані дані JSON-LD (Найбільш точний бекграунд метод)
    try {
      const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
      if (jsonLdMatches) {
        for (const scriptHtml of jsonLdMatches) {
          const jsonStr = scriptHtml.replace(/<script[^>]*>|<\/script>/gi, '').trim();
          const jsonData = JSON.parse(jsonStr);
          const rootObj = Array.isArray(jsonData) ? jsonData[0] : jsonData;
          const offers = rootObj.offers;

          if (offers) {
            const priceValue = Array.isArray(offers) ? offers[0].price : offers.price;
            const currencyValue = Array.isArray(offers) ? offers[0].priceCurrency : offers.priceCurrency;
            
            if (priceValue && !isNaN(parseFloat(priceValue))) {
              return {
                price: Math.abs(parseFloat(priceValue)),
                currency: currencyValue || detectedCurrency,
                available: true
              };
            }
          }
        }
      }
    } catch (e) {
      // Ігноруємо помилки парсингу JSON і йдемо до DOM регулярних виразів
    }

    // 2. Спроба через стабільніший блок .a-offscreen (який Amazon підсовує для Screen-Readers)
    // Зазвичай виглядає як: <span class="a-offscreen">$1,299.99</span>
    const offscreenPattern = /<span[^>]*class="[^"]*a-offscreen[^"]*"[^>]*>\s*([^\s<]+)\s*<\/span>/i;
    const offscreenMatch = html.match(offscreenPattern);
    if (offscreenMatch) {
      // Залишаємо виключно цифри і крапку. Кому міняємо на крапку, щоб розпарсити "1,299.99" або "1299,99"
      const rawText = offscreenMatch[1];
      const cleanPriceStr = rawText.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
      
      // Якщо крапок більше ніж одна (наприклад 1.299.99 через криву заміну)
      const parts = cleanPriceStr.split('.');
      let finalStr = cleanPriceStr;
      if (parts.length > 2) {
        finalStr = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
      }

      const price = parseFloat(finalStr);
      if (!isNaN(price) && price > 0) {
        return { price, currency: detectedCurrency, available: true };
      }
    }

    // 3. Спроба витягнути ціну за допомогою класичних класів цілих/дробових частин
    // Шукаємо структуру <span class="a-price-whole">589<span class="a-price-decimal">.</span></span><span class="a-price-fraction">99</span>
    const wholePattern = /<span[^>]*class="a-price-whole"[^>]*>([\d.,]+)/i;
    const fractionPattern = /<span[^>]*class="a-price-fraction"[^>]*>(\d+)/i;
    
    const wholeMatch = html.match(wholePattern);
    const fractionMatch = html.match(fractionPattern);

    if (wholeMatch) {
      const wholeText = wholeMatch[1].replace(/[^0-9]/g, '');
      const fractionText = fractionMatch ? fractionMatch[1] : '00';
      const price = parseFloat(`${wholeText}.${fractionText}`);
      if (!isNaN(price) && price > 0) {
        return { price, currency: detectedCurrency, available: true };
      }
    }

    // 4. Додаткові резервні регулярні вирази
    const fallbackPricePatterns = [
      /"price":\s*([0-9.]+)/,
      /"displayPrice":"([^"]+)"/,
      /data-a-price="([^"]+)"/i
    ];

    for (const pattern of fallbackPricePatterns) {
      const match = html.match(pattern);
      if (match) {
        const cleanStr = match[1].replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        const price = parseFloat(cleanStr);
        if (!isNaN(price) && price > 0) {
          return { price, currency: detectedCurrency, available: true };
        }
      }
    }

    // Перевіряємо статус доступності товару, якщо ціна по нулях
    const isUnavailable = html.toLowerCase().includes('currently unavailable') || html.toLowerCase().includes('недоступно');

    return {
      price: 0,
      currency: detectedCurrency,
      available: !isUnavailable
    };
  }

  private static detectCurrency(html: string): string {
    if (html.includes('$')) return 'USD';
    if (html.includes('€')) return 'EUR';
    if (html.includes('£')) return 'GBP';
    if (html.includes('¥')) return 'JPY';
    return 'USD';
  }

  /**
   * Заголовок
   */
  private static extractTitleFromHtml(html: string): string {
    const patterns = [
      /<meta[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*>/i,
      /<span[^>]*id="productTitle"[^>]*>([\s\S]*?)<\/span>/i,
      /<title[^>]*>([^<]+)<\/title>/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1]
          .replace(/ - Amazon[^<]*/, '')
          .replace(/ \| Amazon[^<]*/, '')
          .trim();
      }
    }
    return 'Товар з Amazon';
  }

  /**
   * Вартість доставки
   */
  private static extractShippingFromHtml(html: string): number {
    const patterns = [
      /shipping[^<]*\$(\d+\.?\d*)/i,
      /delivery[^<]*\$(\d+\.?\d*)/i,
      /"shippingPrice":"(\d+\.?\d*)"/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    }
    return 0; // За замовчуванням 0, щоб не накручувати ціну
  }

  /**
   * Резервні дані (Fallback)
   */
  private static getFallbackData(url: string): AmazonProductInfo {
    const domainCountry = this.detectCountryByDomain(url);
    const asinMatch = url.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/i);
    const asin = asinMatch ? asinMatch[2] : `B0${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;

    return {
      title: 'Товар (Дані недоступні через захист)',
      price: 0,
      currency: 'USD',
      condition: 'Новий',
      seller: 'Amazon',
      sellerLocation: domainCountry,
      shipping: 0,
      totalPrice: 0,
      available: false,
      location: domainCountry,
      originCountry: domainCountry,
      asin: asin
    };
  }

  /**
   * Швидке отримання ціни
   */
  static async getQuickPrice(url: string): Promise<number> {
    try {
      const product = await this.scanAmazonProduct(url);
      return product.totalPrice;
    } catch (error) {
      return 0;
    }
  }
}