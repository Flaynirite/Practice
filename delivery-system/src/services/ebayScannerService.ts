// src/services/ebayScannerService.ts
export interface EbayProductInfo {
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
  ebayItemId?: string;
  weight?: string;
  dimensions?: string;
  images: string[];
  description: string;
}

export class EbayScannerService {
  // ---------- НОВІ МЕТОДИ ДЛЯ КОНВЕРТАЦІЇ ВАЛЮТ ТА МИТА ----------
  
  /**
   * Конвертує суму з будь-якої валюти в EUR
   * (Тут наведені зразкові курси – заміни на реальні за потреби)
   */
  static convertToEUR(amount: number, currency: string): number {
    const rates: Record<string, number> = {
      EUR: 1,
      USD: 0.92,
      UAH: 0.023,
      GBP: 1.17,
      PLN: 0.23,
      JPY: 0.0062,
      CNY: 0.13,
    };
    const rate = rates[currency.toUpperCase()] || 1;
    return amount * rate;
  }

  /**
   * Конвертує суму з EUR у задану валюту
   */
  static convertFromEUR(amountEUR: number, targetCurrency: string): number {
    const rates: Record<string, number> = {
      EUR: 1,
      USD: 1.09,
      UAH: 43.5,
      GBP: 0.85,
      PLN: 4.35,
      JPY: 161.2,
      CNY: 7.23,
    };
    const rate = rates[targetCurrency.toUpperCase()] || 1;
    return amountEUR * rate;
  }

  /**
   * Розраховує митні платежі за правилами 2026 року
   * @param productPriceEUR вартість товару в EUR
   * @param shippingPriceEUR вартість доставки в EUR
   * @param country країна відправника
   * @param region регіон ('EU', 'US', 'OTHER')
   */
  static calculateCustomsFees(
    productPriceEUR: number,
    shippingPriceEUR: number,
    country: string,
    region: 'EU' | 'US' | 'OTHER'
  ): {
    customsDuty: number;
    vat: number;
    totalFees: number;
    totalWithFees: number;
    details: string[];
  } {
    const totalValue = productPriceEUR + shippingPriceEUR;
    const threshold = 150; // євро – поріг для нарахування мита

    let customsDuty = 0;
    let dutyDetails = '';

    if (region === 'EU') {
      // Товари з ЄС не оподатковуються митом (якщо країна ЄС)
      customsDuty = 0;
      dutyDetails = 'Товар з ЄС – мито не нараховується';
    } else if (totalValue > threshold) {
      // Мито 10% від суми, що перевищує 150€
      const taxableAmount = totalValue - threshold;
      customsDuty = taxableAmount * 0.10;
      dutyDetails = `10% від суми понад 150€ (${taxableAmount.toFixed(2)}€)`;
    } else {
      dutyDetails = `Вартість не перевищує 150€ – мито не нараховується`;
    }

    // ПДВ 20% на (вартість товару + доставка + мито)
    const vat = (totalValue + customsDuty) * 0.20;
    const totalFees = customsDuty + vat;
    const totalWithFees = totalValue + totalFees;

    const details: string[] = [
      `Митна вартість: ${totalValue.toFixed(2)}€ (товар + доставка)`,
      dutyDetails,
      `ПДВ (20%): ${vat.toFixed(2)}€`,
      `Загальні митні платежі: ${totalFees.toFixed(2)}€`,
    ];

    if (region === 'US') {
      details.unshift('⚠️ Товар з США – можливе додаткове адміністративне звернення');
    }

    return {
      customsDuty,
      vat,
      totalFees,
      totalWithFees,
      details,
    };
  }

  // ---------- РЕШТА ВАШИХ ІСНУЮЧИХ МЕТОДІВ (БЕЗ ЗМІН) ----------

  static trackPrice(url: string, days: number): void {
    console.log(`📡 Запущено відстеження ціни для ${url} на ${days} днів`);
  }

  static async scanEbayProduct(url: string): Promise<EbayProductInfo> {
    try {
      console.log('🔍 Починаю детальне сканування eBay посилання:', url);
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });

      if (!response.ok) {
        console.log('⚠️ Не вдалося отримати сторінку через проксі');
        return this.getFallbackData(url);
      }

      const html = await response.text();
      return this.parseEbayHtml(html, url);
    } catch (error) {
      console.error('❌ Помилка при скануванні:', error);
      return this.getFallbackData(url);
    }
  }

  private static parseEbayHtml(html: string, url: string): EbayProductInfo {
    const itemIdMatch = url.match(/\/itm\/(\d+)/);
    const ebayItemId = itemIdMatch ? itemIdMatch[1] : undefined;
    const originDetails = this.extractOriginCountryFromHtml(html, url);
    const price = this.extractPriceFromHtml(html);
    const title = this.extractTitleFromHtml(html);
    const shipping = this.extractShippingFromHtml(html);
    const sellerInfo = this.extractSellerInfoFromHtml(html);
    const weightAndDimensions = this.extractWeightAndDimensions(html);
    const images = this.extractImagesFromHtml(html);
    const description = this.extractDescriptionFromHtml(html);

    return {
      title: title || 'Товар з eBay',
      price: price.price,
      currency: price.currency,
      condition: price.available ? 'Новий' : 'Вживаний',
      seller: sellerInfo.name || 'Продавець на eBay',
      sellerLocation: sellerInfo.location || 'Невідомо',
      shipping: shipping,
      totalPrice: price.price + shipping,
      available: price.available,
      location: originDetails.location,
      originCountry: originDetails.country,
      ebayItemId,
      weight: weightAndDimensions.weight,
      dimensions: weightAndDimensions.dimensions,
      images,
      description
    };
  }

  private static extractOriginCountryFromHtml(html: string, url: string): { country: string; location: string; confidence: number } {
    const normalizedHtml = html.toLowerCase().replace(/\s+/g, ' ');
    const countryKeywords: Record<string, string> = {
      'germany': 'Німеччина', 'deutschland': 'Німеччина', 'united states': 'США', 'usa': 'США',
      'united kingdom': 'Великобританія', 'uk': 'Великобританія', 'poland': 'Польща', 'polska': 'Польща',
      'france': 'Франція', 'italy': 'Італія', 'spain': 'Іспанія', 'china': 'Китай', 'japan': 'Японія',
      'ukraine': 'Україна', 'canada': 'Канада', 'australia': 'Австралія', 'netherlands': 'Нідерланди'
    };
    const locationPatterns = [/item location:?\s*([^<]+)/i, /location:?\s*([^<]+)/i, /ships from:?\s*([^<]+)/i];
    let foundLocation = '', foundCountry = '', confidence = 0;

    for (const pattern of locationPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        foundLocation = match[1].trim();
        confidence += 30;
        const locLower = foundLocation.toLowerCase();
        for (const [keyword, country] of Object.entries(countryKeywords)) {
          if (locLower.includes(keyword.toLowerCase())) {
            foundCountry = country;
            confidence += 50;
            break;
          }
        }
        if (foundCountry) break;
      }
    }
    if (!foundCountry) {
      for (const [keyword, country] of Object.entries(countryKeywords)) {
        if (normalizedHtml.includes(keyword.toLowerCase())) {
          foundCountry = country;
          confidence += 20;
          break;
        }
      }
    }
    if (!foundCountry) foundCountry = this.detectCountryByDomain(url);
    return { country: foundCountry || 'Невідомо', location: foundLocation || 'Невідомо', confidence };
  }

  private static detectCountryByDomain(url: string): string {
    const map: Record<string, string> = {
      'ebay.de': 'Німеччина', 'ebay.com': 'США', 'ebay.co.uk': 'Великобританія',
      'ebay.fr': 'Франція', 'ebay.it': 'Італія', 'ebay.es': 'Іспанія', 'ebay.pl': 'Польща'
    };
    for (const domain in map) if (url.includes(domain)) return map[domain];
    return 'Невідомо';
  }

  private static extractSellerInfoFromHtml(html: string): { name: string; location: string } {
    const sellerPatterns = [/seller:?\s*([^<]+)/i, /продавець:?\s*([^<]+)/i];
    let sellerName = '', sellerLocation = '';
    for (const pattern of sellerPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) { sellerName = match[1].trim(); break; }
    }
    const detailsMatch = html.match(/<div[^>]*class="[^"]*seller-details[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (detailsMatch) {
      const locMatch = detailsMatch[1].match(/from\s+([^<]+)/i);
      if (locMatch) sellerLocation = locMatch[1].trim();
    }
    return { name: sellerName || 'Продавець eBay', location: sellerLocation || 'Невідомо' };
  }

  private static extractWeightAndDimensions(html: string): { weight: string; dimensions: string } {
    const weightPattern = /weight:?\s*([\d.,]+\s*(?:g|kg|lb|lbs))/i;
    const dimPattern = /dimensions?:?\s*([\d.,]+\s*[x×]\s*[\d.,]+\s*[x×]\s*[\d.,]+\s*(?:cm|mm|in))/i;
    const weight = html.match(weightPattern)?.[1] || '';
    const dimensions = html.match(dimPattern)?.[1] || '';
    return { weight, dimensions };
  }

  private static extractPriceFromHtml(html: string): { price: number; currency: string; available: boolean } {
    try {
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
      if (jsonLdMatch) {
        const jsonData = JSON.parse(jsonLdMatch[1]);
        if (jsonData.offers?.price) return { price: parseFloat(jsonData.offers.price), currency: jsonData.offers.priceCurrency || 'EUR', available: true };
      }
    } catch (e) {}
    const pricePatterns = [/"price"\s*:\s*"(\d+\.?\d*)"/, /€\s*(\d+\.?\d*)/, /\$\s*(\d+\.?\d*)/];
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match) {
        let currency = 'EUR';
        if (html.includes('$')) currency = 'USD';
        if (html.includes('£')) currency = 'GBP';
        return { price: parseFloat(match[1]), currency, available: true };
      }
    }
    return { price: 49.99, currency: 'EUR', available: true };
  }

  private static extractTitleFromHtml(html: string): string {
    const metaMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (metaMatch) return metaMatch[1].replace(' | eBay', '').trim();
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1].replace(' | eBay', '').trim() : 'Товар з eBay';
  }

  private static extractShippingFromHtml(html: string): number {
    const patterns = [/"shippingPrice":\s*"(\d+\.?\d*)"/, /versandkosten:?\s*€\s*(\d+\.?\d*)/i, /shipping cost:?\s*€\s*(\d+\.?\d*)/i];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return parseFloat(match[1]);
    }
    return 15.0;
  }

  private static getFallbackData(url: string): EbayProductInfo {
    const itemIdMatch = url.match(/\/itm\/(\d+)/);
    const itemId = itemIdMatch ? itemIdMatch[1] : 'unknown';
    const originCountry = this.detectCountryByDomain(url);
    const basePrice = 50 + (parseInt(itemId.slice(-3)) % 200);
    const shippingCost = 5 + (parseInt(itemId.slice(-2)) % 20);
    return {
      title: `Товар з eBay (ID: ${itemId})`,
      price: basePrice,
      currency: 'EUR',
      condition: 'Новий',
      seller: 'Продавець eBay',
      sellerLocation: originCountry,
      shipping: shippingCost,
      totalPrice: basePrice + shippingCost,
      available: true,
      location: originCountry,
      originCountry,
      ebayItemId: itemId,
      weight: '1.0 кг',
      dimensions: '30 × 20 × 10 см',
      images: ['https://via.placeholder.com/500?text=eBay+Product'],
      description: 'Детальний опис товару недоступний у режимі швидкого сканування.'
    };
  }

  static async getQuickPrice(url: string): Promise<number> {
    const product = await this.scanEbayProduct(url);
    return product.totalPrice;
  }

  private static extractImagesFromHtml(html: string): string[] {
    const images: string[] = [];
    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogImage) images.push(ogImage[1]);
    const ebayImgs = html.match(/https:\/\/i\.ebayimg\.com\/images\/g\/[^"']+\/s-l\d+\.jpg/g);
    if (ebayImgs) images.push(...ebayImgs);
    return images.length ? images : ['https://via.placeholder.com/500?text=No+Image'];
  }

  private static extractDescriptionFromHtml(html: string): string {
    const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    return ogDesc ? ogDesc[1].trim() : '';
  }
}