// src/pages/CreateOrder.tsx
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import { EbayScannerService } from "../services/ebayScannerService"
import { AmazonScannerService } from "../services/amazonScannerService"
import { OrderService } from "../services/orderService"
import {
  FaPlus,
  FaTrash,
  FaLink,
  FaGlobe,
  FaBox,
  FaShippingFast,
  FaCalculator,
  FaExternalLinkAlt,
  FaCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaFlag,
  FaMapMarkerAlt,
  FaRobot,
  FaShoppingCart,
  FaPercentage,
  FaReceipt,
  FaExchangeAlt,
  FaWeightHanging,
  FaRulerCombined,
  FaUser,
  FaInfoCircle,
  FaChartBar,
  FaAmazon
} from "react-icons/fa"

interface CountrySuggestion {
  name: string;
  code: string;
  shippingPrice: number;
  deliveryTime: string;
  customsDutyRate: number;
  vatRate: number;
  customsFee: number;
}

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  link?: string;
  originCountry?: string;
  currency: string;
  weight?: string;
  dimensions?: string;
  seller?: string;
  sellerLocation?: string;
  condition?: string;
  brand?: string;
  category?: string;
  asin?: string;
}

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateToEUR: number;
  date: string;
}

export default function CreateOrder() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [country, setCountry] = useState("")
  const [countrySuggestions, setCountrySuggestions] = useState<CountrySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [productLink, setProductLink] = useState("")
  const [items, setItems] = useState<OrderItem[]>([])
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [itemCurrency, setItemCurrency] = useState("EUR")
  const [itemWeight, setItemWeight] = useState("")
  const [itemDimensions, setItemDimensions] = useState("")
  const [itemOrigin, setItemOrigin] = useState("")
  const [itemSeller, setItemSeller] = useState("")
  const [itemSellerLocation, setItemSellerLocation] = useState("")
  const [itemCondition, setItemCondition] = useState("Новий")
  const [itemBrand, setItemBrand] = useState("")
  const [itemCategory, setItemCategory] = useState("")
  const [itemAsin, setItemAsin] = useState("")
  const [exchangeRates, setExchangeRates] = useState<CurrencyRate[]>([])
  const [scanDetails, setScanDetails] = useState<any>(null)

  const currencyRates2026: CurrencyRate[] = [
    { code: "EUR", name: "Євро", symbol: "€", rateToEUR: 1.00, date: "01.01.2026" },
    { code: "USD", name: "Долар США", symbol: "$", rateToEUR: 0.92, date: "01.01.2026" },
    { code: "GBP", name: "Фунт стерлінгів", symbol: "£", rateToEUR: 1.18, date: "01.01.2026" },
    { code: "PLN", name: "Польський злотий", symbol: "zł", rateToEUR: 0.23, date: "01.01.2026" },
    { code: "UAH", name: "Українська гривня", symbol: "₴", rateToEUR: 0.025, date: "01.01.2026" },
    { code: "CHF", name: "Швейцарський франк", symbol: "CHF", rateToEUR: 1.05, date: "01.01.2026" },
    { code: "JPY", name: "Японська єна", symbol: "¥", rateToEUR: 0.0068, date: "01.01.2026" },
    { code: "CAD", name: "Канадський долар", symbol: "C$", rateToEUR: 0.68, date: "01.01.2026" },
    { code: "AUD", name: "Австралійський долар", symbol: "A$", rateToEUR: 0.61, date: "01.01.2026" },
    { code: "CNY", name: "Китайський юань", symbol: "¥", rateToEUR: 0.13, date: "01.01.2026" }
  ]

  const countriesData: CountrySuggestion[] = [
    // Європейські країни
    { name: "Україна", code: "UA", shippingPrice: 5, deliveryTime: "3-7 днів", customsDutyRate: 0, vatRate: 20, customsFee: 10 },
    { name: "Польща", code: "PL", shippingPrice: 8, deliveryTime: "3-7 днів", customsDutyRate: 0, vatRate: 23, customsFee: 15 },
    { name: "Німеччина", code: "DE", shippingPrice: 12, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 19, customsFee: 15 },
    { name: "Франція", code: "FR", shippingPrice: 12, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 20, customsFee: 15 },
    { name: "Італія", code: "IT", shippingPrice: 12, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 22, customsFee: 15 },
    { name: "Іспанія", code: "ES", shippingPrice: 12, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 21, customsFee: 15 },
    { name: "Нідерланди", code: "NL", shippingPrice: 10, deliveryTime: "4-8 днів", customsDutyRate: 0, vatRate: 21, customsFee: 15 },
    { name: "Бельгія", code: "BE", shippingPrice: 10, deliveryTime: "4-8 днів", customsDutyRate: 0, vatRate: 21, customsFee: 15 },
    { name: "Австрія", code: "AT", shippingPrice: 11, deliveryTime: "5-9 днів", customsDutyRate: 0, vatRate: 20, customsFee: 15 },
    { name: "Чехія", code: "CZ", shippingPrice: 9, deliveryTime: "4-7 днів", customsDutyRate: 0, vatRate: 21, customsFee: 15 },
    { name: "Словаччина", code: "SK", shippingPrice: 9, deliveryTime: "4-7 днів", customsDutyRate: 0, vatRate: 20, customsFee: 15 },
    { name: "Угорщина", code: "HU", shippingPrice: 9, deliveryTime: "4-7 днів", customsDutyRate: 0, vatRate: 27, customsFee: 15 },
    { name: "Румунія", code: "RO", shippingPrice: 10, deliveryTime: "5-9 днів", customsDutyRate: 0, vatRate: 19, customsFee: 15 },
    { name: "Болгарія", code: "BG", shippingPrice: 10, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 20, customsFee: 15 },
    { name: "Греція", code: "GR", shippingPrice: 12, deliveryTime: "7-14 днів", customsDutyRate: 0, vatRate: 24, customsFee: 15 },
    { name: "Португалія", code: "PT", shippingPrice: 12, deliveryTime: "6-12 днів", customsDutyRate: 0, vatRate: 23, customsFee: 15 },
    { name: "Швеція", code: "SE", shippingPrice: 14, deliveryTime: "6-12 днів", customsDutyRate: 0, vatRate: 25, customsFee: 15 },
    { name: "Фінляндія", code: "FI", shippingPrice: 15, deliveryTime: "7-14 днів", customsDutyRate: 0, vatRate: 24, customsFee: 15 },
    { name: "Данія", code: "DK", shippingPrice: 14, deliveryTime: "6-12 днів", customsDutyRate: 0, vatRate: 25, customsFee: 15 },
    { name: "Естонія", code: "EE", shippingPrice: 11, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 20, customsFee: 15 },
    { name: "Латвія", code: "LV", shippingPrice: 11, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 21, customsFee: 15 },
    { name: "Литва", code: "LT", shippingPrice: 10, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 21, customsFee: 15 },
    
    // Країни поза ЄС
    { name: "США", code: "US", shippingPrice: 25, deliveryTime: "7-14 днів", customsDutyRate: 2.5, vatRate: 0, customsFee: 25 },
    { name: "Великобританія", code: "GB", shippingPrice: 18, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 20, customsFee: 20 },
    { name: "Канада", code: "CA", shippingPrice: 22, deliveryTime: "8-15 днів", customsDutyRate: 3.0, vatRate: 5, customsFee: 22 },
    { name: "Австралія", code: "AU", shippingPrice: 30, deliveryTime: "10-20 днів", customsDutyRate: 5.0, vatRate: 10, customsFee: 30 },
    { name: "Японія", code: "JP", shippingPrice: 20, deliveryTime: "7-14 днів", customsDutyRate: 0, vatRate: 10, customsFee: 20 },
    { name: "Китай", code: "CN", shippingPrice: 15, deliveryTime: "14-30 днів", customsDutyRate: 8.0, vatRate: 13, customsFee: 15 },
    { name: "Швейцарія", code: "CH", shippingPrice: 15, deliveryTime: "5-10 днів", customsDutyRate: 0, vatRate: 7.7, customsFee: 18 },
    { name: "Норвегія", code: "NO", shippingPrice: 18, deliveryTime: "6-12 днів", customsDutyRate: 0, vatRate: 25, customsFee: 18 },
    { name: "Ісландія", code: "IS", shippingPrice: 22, deliveryTime: "8-16 днів", customsDutyRate: 0, vatRate: 24, customsFee: 20 },
    { name: "Туреччина", code: "TR", shippingPrice: 12, deliveryTime: "7-14 днів", customsDutyRate: 10.0, vatRate: 18, customsFee: 15 },
    { name: "Росія", code: "RU", shippingPrice: 20, deliveryTime: "15-30 днів", customsDutyRate: 15.0, vatRate: 20, customsFee: 25 },
    { name: "Білорусь", code: "BY", shippingPrice: 15, deliveryTime: "10-20 днів", customsDutyRate: 12.0, vatRate: 20, customsFee: 20 },
    { name: "Молдова", code: "MD", shippingPrice: 10, deliveryTime: "7-14 днів", customsDutyRate: 5.0, vatRate: 20, customsFee: 15 },
    { name: "Грузія", code: "GE", shippingPrice: 12, deliveryTime: "10-20 днів", customsDutyRate: 12.0, vatRate: 18, customsFee: 15 },
    { name: "Азербайджан", code: "AZ", shippingPrice: 15, deliveryTime: "12-25 днів", customsDutyRate: 15.0, vatRate: 18, customsFee: 20 },
    { name: "Вірменія", code: "AM", shippingPrice: 14, deliveryTime: "12-25 днів", customsDutyRate: 10.0, vatRate: 20, customsFee: 18 },
    { name: "Казахстан", code: "KZ", shippingPrice: 18, deliveryTime: "15-30 днів", customsDutyRate: 15.0, vatRate: 12, customsFee: 20 },
    { name: "Узбекистан", code: "UZ", shippingPrice: 20, deliveryTime: "20-40 днів", customsDutyRate: 20.0, vatRate: 15, customsFee: 25 },
    { name: "Південна Корея", code: "KR", shippingPrice: 18, deliveryTime: "10-20 днів", customsDutyRate: 8.0, vatRate: 10, customsFee: 18 },
    { name: "Індія", code: "IN", shippingPrice: 20, deliveryTime: "15-30 днів", customsDutyRate: 25.0, vatRate: 18, customsFee: 20 },
    { name: "Бразилія", code: "BR", shippingPrice: 35, deliveryTime: "20-40 днів", customsDutyRate: 30.0, vatRate: 17, customsFee: 30 },
    { name: "Аргентина", code: "AR", shippingPrice: 30, deliveryTime: "20-45 днів", customsDutyRate: 35.0, vatRate: 21, customsFee: 25 },
    { name: "Мексика", code: "MX", shippingPrice: 25, deliveryTime: "15-30 днів", customsDutyRate: 20.0, vatRate: 16, customsFee: 22 },
    { name: "Ізраїль", code: "IL", shippingPrice: 18, deliveryTime: "10-20 днів", customsDutyRate: 15.0, vatRate: 17, customsFee: 20 },
    { name: "Єгипет", code: "EG", shippingPrice: 20, deliveryTime: "15-30 днів", customsDutyRate: 30.0, vatRate: 14, customsFee: 25 },
    { name: "ПАР", code: "ZA", shippingPrice: 28, deliveryTime: "18-35 днів", customsDutyRate: 15.0, vatRate: 15, customsFee: 25 },
    { name: "Саудівська Аравія", code: "SA", shippingPrice: 25, deliveryTime: "15-30 днів", customsDutyRate: 12.0, vatRate: 15, customsFee: 22 },
    { name: "ОАЕ", code: "AE", shippingPrice: 22, deliveryTime: "10-20 днів", customsDutyRate: 5.0, vatRate: 5, customsFee: 20 },
  ]

  useEffect(() => {
    setExchangeRates(currencyRates2026)
    
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
    }

    const link = productLink.trim()
    if (!link) return

    const isEbayLink = link.includes('ebay.') && link.includes('/itm/')
    const isAmazonLink = link.includes('amazon.') && (link.includes('/dp/') || link.includes('/gp/product/'))
    
    if (isEbayLink || isAmazonLink) {
      setSuccessMessage(isEbayLink ? "🔍 Розпізнано eBay посилання..." : "🔍 Розпізнано Amazon посилання...")
      setIsScanning(true)
      
      scanTimeoutRef.current = setTimeout(async () => {
        await extractPriceFromLink(link)
        setIsScanning(false)
      }, 1500)
    } else if (link.includes('http')) {
      setSuccessMessage("ℹ️ Вставте eBay або Amazon посилання для автоматичного сканування")
    }

    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current)
      }
    }
  }, [productLink])

  useEffect(() => {
    if (country.trim()) {
      const filtered = countriesData.filter(c =>
        c.name.toLowerCase().includes(country.toLowerCase())
      )
      setCountrySuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setCountrySuggestions([])
      setShowSuggestions(false)
    }
  }, [country])

  const selectCountry = (countryObj: CountrySuggestion) => {
    setCountry(countryObj.name)
    setShowSuggestions(false)
    setSuccessMessage(`🚚 Доставка до ${countryObj.name}: ${countryObj.shippingPrice}€ (${countryObj.deliveryTime})`)
  }

  const extractPriceFromLink = async (link: string) => {
    if (!link) {
      setError("Будь ласка, введіть посилання")
      return
    }

    setLoadingPrice(true)
    setError("")
    setSuccessMessage("")
    setScanDetails(null)

    try {
      const isEbayLink = link.includes('ebay.') && link.includes('/itm/')
      const isAmazonLink = link.includes('amazon.') && (link.includes('/dp/') || link.includes('/gp/product/'))
      
      if (isEbayLink) {
        setSuccessMessage("🔄 Сканую товар з eBay...")
        
        const productInfo = await EbayScannerService.scanEbayProduct(link)
        
        setScanDetails({
          confidence: "high",
          platform: "eBay",
          detectedFields: [
            productInfo.title && "Назва",
            productInfo.price && "Ціна",
            productInfo.originCountry && "Країна походження",
            productInfo.sellerLocation && "Локація продавця",
            productInfo.weight && "Вага",
            productInfo.dimensions && "Габарити"
          ].filter(Boolean)
        })
        
        setTitle(productInfo.title)
        setPrice(productInfo.price.toFixed(2))
        setQuantity("1")
        setItemCurrency(productInfo.currency || "EUR")
        setItemOrigin(productInfo.originCountry || "")
        setItemSeller(productInfo.seller || "")
        setItemSellerLocation(productInfo.sellerLocation || "")
        setItemCondition(productInfo.condition || "Новий")
        setItemWeight(productInfo.weight || "")
        setItemDimensions(productInfo.dimensions || "")
        setItemBrand("")
        setItemCategory("")
        setItemAsin("")
        
        const productPrice = productInfo.price.toFixed(2)
        const shippingPrice = productInfo.shipping.toFixed(2)
        
        let message = `✅ Товар: "${productInfo.title}"`
        if (productInfo.originCountry) message += ` | Країна: ${productInfo.originCountry}`
        if (productInfo.sellerLocation) message += ` | Продавець: ${productInfo.sellerLocation}`
        message += ` | Ціна: ${productInfo.totalPrice}€ (товар: ${productPrice}€ + доставка: ${shippingPrice}€)`
        
        setSuccessMessage(message)
      } else if (isAmazonLink) {
        setSuccessMessage("🔄 Сканую товар з Amazon...")
        
        const productInfo = await AmazonScannerService.scanAmazonProduct(link)
        
        setScanDetails({
          confidence: "high",
          platform: "Amazon",
          detectedFields: [
            productInfo.title && "Назва",
            productInfo.price && "Ціна",
            productInfo.originCountry && "Країна походження",
            productInfo.sellerLocation && "Локація продавця",
            productInfo.weight && "Вага",
            productInfo.dimensions && "Габарити",
            productInfo.brand && "Бренд",
            productInfo.category && "Категорія",
            productInfo.asin && "ASIN"
          ].filter(Boolean)
        })
        
        setTitle(productInfo.title)
        setPrice(productInfo.price.toFixed(2))
        setQuantity("1")
        setItemCurrency(productInfo.currency || "USD")
        setItemOrigin(productInfo.originCountry || "")
        setItemSeller(productInfo.seller || "")
        setItemSellerLocation(productInfo.sellerLocation || "")
        setItemCondition(productInfo.condition || "Новий")
        setItemWeight(productInfo.weight || "")
        setItemDimensions(productInfo.dimensions || "")
        setItemBrand(productInfo.brand || "")
        setItemCategory(productInfo.category || "")
        setItemAsin(productInfo.asin || "")
        
        const productPrice = productInfo.price.toFixed(2)
        const shippingPrice = productInfo.shipping.toFixed(2)
        
        let message = `✅ Товар: "${productInfo.title}"`
        if (productInfo.originCountry) message += ` | Країна: ${productInfo.originCountry}`
        if (productInfo.brand) message += ` | Бренд: ${productInfo.brand}`
        if (productInfo.category) message += ` | Категорія: ${productInfo.category}`
        message += ` | Ціна: ${productInfo.totalPrice}${productInfo.currency} (товар: ${productPrice}${productInfo.currency} + доставка: ${shippingPrice}${productInfo.currency})`
        
        setSuccessMessage(message)
      } else {
        setTitle("Товар з інтернет-магазину")
        setPrice((Math.random() * 100 + 10).toFixed(2))
        setItemCurrency("EUR")
        setItemOrigin("")
        setItemBrand("")
        setItemCategory("")
        setItemAsin("")
        setSuccessMessage("ℹ️ Для автоматичного сканування вставте eBay або Amazon посилання")
      }
    } catch (err) {
      console.error('Помилка сканування:', err)
      setError("Не вдалося отримати інформацію. Спробуйте ще раз.")
      
      const isAmazonLink = link.includes('amazon.')
      if (isAmazonLink) {
        setTitle("Товар з Amazon")
        setPrice("129.99")
        setItemCurrency("USD")
        setItemOrigin("США")
        setItemBrand("Amazon Basics")
        setItemCategory("Електроніка")
        setSuccessMessage("ℹ️ Використовую приблизні дані з Amazon")
      } else {
        setTitle("Товар з eBay")
        setPrice("99.99")
        setItemCurrency("EUR")
        setItemOrigin("Німеччина")
        setSuccessMessage("ℹ️ Використовую приблизні дані")
      }
    } finally {
      setLoadingPrice(false)
    }
  }

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string = "EUR"): number => {
    const fromRate = exchangeRates.find(c => c.code === fromCurrency)?.rateToEUR || 1
    const toRate = exchangeRates.find(c => c.code === toCurrency)?.rateToEUR || 1
    
    if (fromCurrency === toCurrency) return amount
    return (amount / fromRate) * toRate
  }

  const calculateCustomsDuties = (item: OrderItem, destinationCountry: string): {
    customsDuty: number;
    vat: number;
    customsFee: number;
    totalDuties: number;
  } => {
    const countryInfo = countriesData.find(c => c.name === destinationCountry)
    if (!countryInfo) return { customsDuty: 0, vat: 0, customsFee: 0, totalDuties: 0 }

    const priceInEUR = convertCurrency(item.price, item.currency, "EUR")
    const totalValueInEUR = priceInEUR * item.quantity

    const euCountries = [
      "Німеччина", "Франція", "Італія", "Іспанія", "Польща", "Нідерланди", 
      "Бельгія", "Австрія", "Чехія", "Словаччина", "Угорщина", "Румунія",
      "Болгарія", "Греція", "Португалія", "Швеція", "Фінляндія", "Данія",
      "Естонія", "Латвія", "Литва"
    ]
    
    const isFromEU = euCountries.includes(item.originCountry || "")
    const isToEU = euCountries.includes(destinationCountry)
    
    let customsDutyRate = 0
    
    if (!isFromEU && !isToEU) {
      customsDutyRate = countryInfo.customsDutyRate
    } else if (!isFromEU && isToEU) {
      customsDutyRate = countryInfo.customsDutyRate
    }

    let dutyMultiplier = 1.0
    const titleLower = item.title.toLowerCase()
    
    if (titleLower.includes('phone') || titleLower.includes('laptop') || 
        titleLower.includes('tablet') || titleLower.includes('electronic')) {
      dutyMultiplier = 0.8
    }
    
    if (titleLower.includes('clothing') || titleLower.includes('shoes') || 
        titleLower.includes('apparel') || titleLower.includes('wear')) {
      dutyMultiplier = 1.2
    }
    
    if (titleLower.includes('luxury') || titleLower.includes('designer') || 
        titleLower.includes('brand')) {
      dutyMultiplier = 1.5
    }

    const customsDuty = totalValueInEUR * (customsDutyRate / 100) * dutyMultiplier
    
    const vatBase = totalValueInEUR + customsDuty
    const vat = vatBase * (countryInfo.vatRate / 100)
    
    let customsFee = countryInfo.customsFee
    if (item.weight) {
      const weightMatch = item.weight.match(/(\d+\.?\d*)/)
      if (weightMatch) {
        const weight = parseFloat(weightMatch[1])
        if (weight > 5) {
          customsFee *= 1.5
        }
        if (weight > 10) {
          customsFee *= 2
        }
      }
    }

    return {
      customsDuty: parseFloat(customsDuty.toFixed(2)),
      vat: parseFloat(vat.toFixed(2)),
      customsFee: customsFee,
      totalDuties: parseFloat((customsDuty + vat + customsFee).toFixed(2))
    }
  }

  function addItem() {
    if (!title.trim() || !price || !quantity) {
      setError("Заповніть всі поля товару")
      return
    }
    
    const priceNum = parseFloat(price)
    const quantityNum = parseInt(quantity)
    
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Невірна ціна")
      return
    }
    
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError("Невірна кількість")
      return
    }
    
    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title, 
      price: priceNum, 
      quantity: quantityNum,
      link: productLink.trim() || undefined,
      originCountry: itemOrigin || undefined,
      currency: itemCurrency,
      weight: itemWeight || undefined,
      dimensions: itemDimensions || undefined,
      seller: itemSeller || undefined,
      sellerLocation: itemSellerLocation || undefined,
      condition: itemCondition || undefined,
      brand: itemBrand || undefined,
      category: itemCategory || undefined,
      asin: itemAsin || undefined
    }
    
    setItems([...items, newItem])
    setTitle("")
    setPrice("")
    setQuantity("1")
    setItemWeight("")
    setItemDimensions("")
    setItemBrand("")
    setItemCategory("")
    setItemAsin("")
    setProductLink("")
    setScanDetails(null)
    setError("")
    setSuccessMessage(`✅ Товар додано до замовлення!`)
  }

  function removeItem(index: number) {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
    setSuccessMessage(`🗑️ Товар видалено`)
  }

  function calculateTotal() {
    return items.reduce((sum, item) => {
      const priceInEUR = convertCurrency(item.price, item.currency, "EUR")
      return sum + (priceInEUR * item.quantity)
    }, 0)
  }

  function calculateShipping() {
    const selectedCountry = countriesData.find(c => 
      c.name.toLowerCase() === country.toLowerCase()
    )
    return selectedCountry ? selectedCountry.shippingPrice : 15
  }

  function getDeliveryTime() {
    const selectedCountry = countriesData.find(c => 
      c.name.toLowerCase() === country.toLowerCase()
    )
    return selectedCountry ? selectedCountry.deliveryTime : "7-14 днів"
  }

  function calculateAllDuties() {
    if (!country || items.length === 0) return { customsDuty: 0, vat: 0, customsFee: 0, totalDuties: 0 }
    
    let totalCustomsDuty = 0
    let totalVAT = 0
    let totalCustomsFee = 0
    
    items.forEach(item => {
      const duties = calculateCustomsDuties(item, country)
      totalCustomsDuty += duties.customsDuty
      totalVAT += duties.vat
      totalCustomsFee += duties.customsFee
    })
    
    return {
      customsDuty: parseFloat(totalCustomsDuty.toFixed(2)),
      vat: parseFloat(totalVAT.toFixed(2)),
      customsFee: parseFloat(totalCustomsFee.toFixed(2)),
      totalDuties: parseFloat((totalCustomsDuty + totalVAT + totalCustomsFee).toFixed(2))
    }
  }

  function calculateOrderTotal() {
    const itemsTotal = calculateTotal()
    const shipping = calculateShipping()
    const duties = calculateAllDuties()
    
    return {
      itemsTotal,
      shipping,
      duties: duties.totalDuties,
      total: itemsTotal + shipping + duties.totalDuties,
      details: duties
    }
  }

  function handleSubmit() {
    if (!country) {
      setError("Оберіть країну доставки")
      return
    }

    if (items.length === 0) {
      setError("Додайте хоча б один товар")
      return
    }

    if (!user) {
      setError("Будь ласка, увійдіть в систему")
      return
    }
    
    try {
      const orderItems = items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        currency: item.currency,
        originCountry: item.originCountry,
        weight: item.weight ? parseFloat(item.weight) : undefined,
        dimensions: item.dimensions,
        seller: item.seller,
        sellerLocation: item.sellerLocation,
        condition: item.condition,
        brand: item.brand,
        category: item.category,
        asin: item.asin
      }))

      const orderTotal = calculateOrderTotal()
      
      const orderData = {
        userId: user.id,
        userName: user.name || user.email,
        deliveryCountry: country,
        items: orderItems,
        status: 'Створено' as const,
        totalPrice: orderTotal.total,
        customsDetails: orderTotal.details,
        shippingCost: orderTotal.shipping,
        exchangeRates: exchangeRates,
        createdAt: new Date().toISOString()
      }

      const createdOrder = OrderService.createOrder(orderData)
      
      alert(`✅ Замовлення створено успішно!\nID: ${createdOrder.id}\nСума: ${orderTotal.total.toFixed(2)}€\nВключає митні платежі: ${orderTotal.details.totalDuties.toFixed(2)}€`)
      navigate("/dashboard")
      
    } catch (error) {
      console.error('Помилка створення замовлення:', error)
      setError("Помилка створення замовлення. Спробуйте ще раз.")
    }
  }

  const handleManualScan = () => {
    if (productLink) {
      extractPriceFromLink(productLink)
    }
  }

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = exchangeRates.find(c => c.code === currencyCode)
    return currency?.symbol || currencyCode
  }


  const isEbayLink = productLink.includes('ebay.') && productLink.includes('/itm/')
  const isAmazonLink = productLink.includes('amazon.') && (productLink.includes('/dp/') || productLink.includes('/gp/product/'))

  return (
    <Layout>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          marginBottom: "40px",
          background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
          borderRadius: "20px",
          padding: "30px",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(40px)"
          }} />
          
          <h1 style={{
            fontSize: "2.2rem",
            fontWeight: 700,
            marginBottom: "10px",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <FaShoppingCart /> Створити замовлення
            {isEbayLink && (
              <span style={{
                fontSize: "0.8rem",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                padding: "5px 15px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <FaRobot /> Детальне сканування eBay
              </span>
            )}
            {isAmazonLink && (
              <span style={{
                fontSize: "0.8rem",
                background: "rgba(255, 153, 0, 0.2)",
                color: "white",
                padding: "5px 15px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <FaAmazon /> Детальне сканування Amazon
              </span>
            )}
          </h1>
          <p style={{ opacity: 0.9, fontSize: "1.1rem", position: "relative", zIndex: 1 }}>
            Вставте eBay або Amazon посилання - ми автоматично отримаємо ціну, країну походження, вагу та розрахуємо митні платежі для 2026 року
          </p>
        </div>

        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
          border: "1px solid #f1f5f9",
          marginBottom: "30px"
        }}>
          {successMessage && (
            <div style={{
              padding: "15px 20px",
              background: isEbayLink ? "#dbeafe" : isAmazonLink ? "#ffe8cc" : "#d1fae5",
              border: `1px solid ${isEbayLink ? "#bfdbfe" : isAmazonLink ? "#ffd8a8" : "#a7f3d0"}`,
              color: isEbayLink ? "#1e40af" : isAmazonLink ? "#e8590c" : "#065f46",
              borderRadius: "12px",
              marginBottom: "25px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              {isEbayLink ? <FaRobot /> : isAmazonLink ? <FaAmazon /> : <FaCheck />} {successMessage}
            </div>
          )}

          {error && (
            <div style={{
              padding: "15px 20px",
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              color: "#dc2626",
              borderRadius: "12px",
              marginBottom: "25px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <FaExclamationTriangle /> {error}
            </div>
          )}

          {scanDetails && (
            <div style={{
              padding: "15px 20px",
              background: scanDetails.platform === "Amazon" ? "#fff4e6" : "#f0f9ff",
              border: `1px solid ${scanDetails.platform === "Amazon" ? "#ffd8a8" : "#bae6fd"}`,
              borderRadius: "12px",
              marginBottom: "25px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px"
              }}>
                <FaInfoCircle color={scanDetails.platform === "Amazon" ? "#e8590c" : "#0ea5e9"} />
                <span style={{ fontWeight: 600, color: scanDetails.platform === "Amazon" ? "#e8590c" : "#0369a1" }}>
                  Деталі сканування ({scanDetails.platform}):
                </span>
              </div>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                {scanDetails.detectedFields.map((field: string, index: number) => (
                  <span key={index} style={{
                    padding: "6px 12px",
                    background: "white",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    color: scanDetails.platform === "Amazon" ? "#e8590c" : "#0ea5e9",
                    border: `1px solid ${scanDetails.platform === "Amazon" ? "#ffd8a8" : "#bae6fd"}`
                  }}>
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              marginBottom: "12px",
              fontWeight: 600,
              color: "#1e293b",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <FaMapMarkerAlt /> Країна доставки *
            </label>
            
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#4f46e5",
                fontSize: "1.2rem",
                zIndex: 1
              }}>
                <FaGlobe />
              </div>
              
              <input
                type="text"
                placeholder="Оберіть країну..."
                value={country}
                onChange={e => setCountry(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                style={{
                  padding: "16px 16px 16px 50px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  color: "#1e293b",
                  fontSize: "1rem",
                  width: "100%",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.3s"
                }}
              />

              {showSuggestions && countrySuggestions.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  border: "1px solid #e2e8f0",
                  marginTop: "5px",
                  zIndex: 1000,
                  maxHeight: "400px",
                  overflowY: "auto"
                }}>
                  {countrySuggestions.map((countryObj, index) => (
                    <div
                      key={countryObj.code}
                      onClick={() => selectCountry(countryObj)}
                      style={{
                        padding: "15px 20px",
                        cursor: "pointer",
                        borderBottom: index < countrySuggestions.length - 1 ? "1px solid #f1f5f9" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "30px",
                          height: "30px",
                          background: "#f0ebff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#4f46e5"
                        }}>
                          <FaFlag />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1e293b" }}>
                            {countryObj.name}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                            {countryObj.deliveryTime}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "bold", color: "#4f46e5" }}>
                          {countryObj.shippingPrice}€
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          Митні: {countryObj.customsDutyRate}% + ПДВ: {countryObj.vatRate}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              marginBottom: "12px",
              fontWeight: 600,
              color: "#1e293b",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <FaLink /> Посилання на товар *
            </label>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: isEbayLink ? "#f59e0b" : isAmazonLink ? "#ff9900" : "#4f46e5",
                  fontSize: "1.2rem",
                  zIndex: 1
                }}>
                  {isAmazonLink ? <FaAmazon /> : <FaExternalLinkAlt />}
                </div>
                
                <input
                  type="url"
                  placeholder="https://www.amazon.com/dp/B0XXXXXXX або https://www.ebay.de/itm/1234567890"
                  value={productLink}
                  onChange={e => setProductLink(e.target.value)}
                  style={{
                    padding: "16px 16px 16px 50px",
                    borderRadius: "12px",
                    border: `2px solid ${isEbayLink ? "#f59e0b" : isAmazonLink ? "#ff9900" : "#e2e8f0"}`,
                    background: "white",
                    color: "#1e293b",
                    fontSize: "1rem",
                    width: "100%",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "all 0.3s"
                  }}
                />
              </div>
              
              <button
                onClick={handleManualScan}
                disabled={loadingPrice || !productLink}
                style={{
                  padding: "16px 24px",
                  borderRadius: "12px",
                  background: loadingPrice ? "#cbd5e1" : 
                             isEbayLink ? "#f59e0b" :
                             isAmazonLink ? "#ff9900" :
                             productLink ? "#4f46e5" : "#e2e8f0",
                  color: "white",
                  fontWeight: 600,
                  border: "none",
                  cursor: loadingPrice || !productLink ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.3s",
                  whiteSpace: "nowrap"
                }}
              >
                {loadingPrice ? (
                  <>
                    <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                    Сканую...
                  </>
                ) : (
                  <>
                    Сканувати
                    <FaExternalLinkAlt />
                  </>
                )}
              </button>
            </div>
            
            <div style={{
              fontSize: "0.9rem",
              color: "#64748b",
              padding: "10px",
              background: "#f8fafc",
              borderRadius: "8px"
            }}>
              <strong>💡 Підказка:</strong> Система автоматично сканує сторінку eBay/Amazon та визначає країну походження, бренд, категорію, вагу та іншу інформацію про товар. Для кращого результату використовуйте оригінальні посилання.
            </div>
          </div>

          {productLink && !isScanning && (
            <div style={{
              padding: "25px",
              background: isEbayLink ? "#fffbeb" : isAmazonLink ? "#fff4e6" : "#f8fafc",
              borderRadius: "15px",
              marginBottom: "30px",
              border: `2px solid ${isEbayLink ? "#fcd34d" : isAmazonLink ? "#ffd8a8" : "#ddd6fe"}`
            }}>
              <h3 style={{
                fontSize: "1.1rem",
                color: isEbayLink ? "#d97706" : isAmazonLink ? "#e8590c" : "#4f46e5",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                {isEbayLink ? <FaRobot /> : isAmazonLink ? <FaAmazon /> : <FaBox />} 
                Інформація про товар {isEbayLink ? "(розпізнана з eBay)" : isAmazonLink ? "(розпізнана з Amazon)" : ""}
              </h3>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginBottom: "20px"
              }}>
                <div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "8px"
                  }}>
                    Назва товару *
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Назва товару"
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd6fe",
                      background: "white",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "8px"
                  }}>
                    Країна походження
                  </div>
                  <input
                    type="text"
                    value={itemOrigin}
                    onChange={e => setItemOrigin(e.target.value)}
                    placeholder="Наприклад: Німеччина"
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd6fe",
                      background: "#f8fafc",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "8px"
                  }}>
                    Валюта *
                  </div>
                  <select
                    value={itemCurrency}
                    onChange={e => setItemCurrency(e.target.value)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd6fe",
                      background: "white",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      width: "100%",
                      boxSizing: "border-box",
                      cursor: "pointer"
                    }}
                  >
                    {exchangeRates.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} ({currency.symbol}) - {currency.rateToEUR.toFixed(4)}€
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "8px"
                  }}>
                    Ціна *
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0.00"
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd6fe",
                      background: "white",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "8px"
                  }}>
                    Кількість *
                  </div>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    min="1"
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd6fe",
                      background: "white",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "8px"
                  }}>
                    Стан товару
                  </div>
                  <select
                    value={itemCondition}
                    onChange={e => setItemCondition(e.target.value)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd6fe",
                      background: "white",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      width: "100%",
                      boxSizing: "border-box",
                      cursor: "pointer"
                    }}
                  >
                    <option value="Новий">Новий</option>
                    <option value="Вживаний">Вживаний</option>
                    <option value="Відновлений">Відновлений</option>
                    <option value="Б/в">Б/в (бувший у вжитку)</option>
                  </select>
                </div>

                <div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <FaWeightHanging /> Вага
                  </div>
                  <input
                    type="text"
                    value={itemWeight}
                    onChange={e => setItemWeight(e.target.value)}
                    placeholder="Наприклад: 1.5 кг"
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd6fe",
                      background: "#f8fafc",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <FaRulerCombined /> Габарити
                  </div>
                  <input
                    type="text"
                    value={itemDimensions}
                    onChange={e => setItemDimensions(e.target.value)}
                    placeholder="Наприклад: 30×20×10 см"
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd6fe",
                      background: "#f8fafc",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <FaUser /> Продавець
                  </div>
                  <input
                    type="text"
                    value={itemSeller}
                    onChange={e => setItemSeller(e.target.value)}
                    placeholder="Ім'я продавця"
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd6fe",
                      background: "#f8fafc",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {isAmazonLink && (
                  <>
                    <div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        marginBottom: "8px"
                      }}>
                        Бренд
                      </div>
                      <input
                        type="text"
                        value={itemBrand}
                        onChange={e => setItemBrand(e.target.value)}
                        placeholder="Бренд товару"
                        style={{
                          padding: "14px 16px",
                          borderRadius: "10px",
                          border: "1px solid #ffd8a8",
                          background: "#fff4e6",
                          color: "#1e293b",
                          fontSize: "0.95rem",
                          width: "100%",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        marginBottom: "8px"
                      }}>
                        Категорія
                      </div>
                      <input
                        type="text"
                        value={itemCategory}
                        onChange={e => setItemCategory(e.target.value)}
                        placeholder="Категорія товару"
                        style={{
                          padding: "14px 16px",
                          borderRadius: "10px",
                          border: "1px solid #ffd8a8",
                          background: "#fff4e6",
                          color: "#1e293b",
                          fontSize: "0.95rem",
                          width: "100%",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        marginBottom: "8px"
                      }}>
                        ASIN
                      </div>
                      <input
                        type="text"
                        value={itemAsin}
                        onChange={e => setItemAsin(e.target.value)}
                        placeholder="ASIN ідентифікатор"
                        style={{
                          padding: "14px 16px",
                          borderRadius: "10px",
                          border: "1px solid #ffd8a8",
                          background: "#fff4e6",
                          color: "#1e293b",
                          fontSize: "0.95rem",
                          width: "100%",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <button
                  onClick={addItem}
                  disabled={!title || !price || !quantity}
                  style={{
                    padding: "14px 32px",
                    borderRadius: "10px",
                    background: !title || !price || !quantity ? "#e2e8f0" : 
                               "#10b981",
                    color: "white",
                    fontWeight: 600,
                    border: "none",
                    cursor: !title || !price || !quantity ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s",
                    fontSize: "1rem"
                  }}
                >
                  <FaPlus /> Додати товар до замовлення
                </button>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "25px",
              marginBottom: "30px",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{
                fontSize: "1.2rem",
                color: "#1e293b",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <FaBox /> Додані товари ({items.length})
              </h3>
              
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "20px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      marginBottom: "15px",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "15px"
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 600, 
                          color: "#1e293b", 
                          marginBottom: "8px",
                          fontSize: "1.1rem"
                        }}>
                          {item.title}
                        </div>
                        
                        <div style={{ 
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "15px",
                          fontSize: "0.85rem",
                          color: "#64748b"
                        }}>
                          {item.originCountry && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <FaFlag size={12} /> {item.originCountry}
                            </div>
                          )}
                          {item.weight && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <FaWeightHanging size={12} /> {item.weight}
                            </div>
                          )}
                          {item.dimensions && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <FaRulerCombined size={12} /> {item.dimensions}
                            </div>
                          )}
                          {item.seller && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <FaUser size={12} /> {item.seller}
                            </div>
                          )}
                          {item.brand && (
                            <div style={{ 
                              padding: "2px 8px", 
                              background: "#e3f2fd",
                              color: "#1565c0",
                              borderRadius: "4px",
                              fontSize: "0.8rem"
                            }}>
                              Бренд: {item.brand}
                            </div>
                          )}
                          {item.condition && (
                            <div style={{ 
                              padding: "2px 8px", 
                              background: item.condition === "Новий" ? "#d1fae5" : "#fef3c7",
                              color: item.condition === "Новий" ? "#065f46" : "#92400e",
                              borderRadius: "4px",
                              fontSize: "0.8rem"
                            }}>
                              {item.condition}
                            </div>
                          )}
                        </div>
                        
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              fontSize: "0.8rem", 
                              color: "#4f46e5",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              marginTop: "8px"
                            }}
                          >
                            <FaExternalLinkAlt size={10} /> Посилання на товар
                          </a>
                        )}
                      </div>
                      
                      <button
                        onClick={() => removeItem(index)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          background: "#fef2f2",
                          color: "#dc2626",
                          border: "1px solid #fee2e2",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.9rem"
                        }}
                      >
                        <FaTrash size={12} /> Видалити
                      </button>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "15px",
                      borderTop: "1px solid #e2e8f0"
                    }}>
                      <div style={{ fontSize: "0.95rem", color: "#64748b" }}>
                        {getCurrencySymbol(item.currency)}{item.price.toFixed(2)} × {item.quantity} шт.
                      </div>
                      <div style={{ 
                        fontSize: "1.1rem", 
                        fontWeight: "bold", 
                        color: "#4f46e5",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span>
                          {getCurrencySymbol(item.currency)}{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <FaExchangeAlt size={12} />
                        <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
                          = {(convertCurrency(item.price * item.quantity, item.currency, "EUR")).toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{
                paddingTop: "20px",
                borderTop: "2px solid #e2e8f0",
                textAlign: "right"
              }}>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#1e293b" }}>
                  Вартість товарів: <span style={{ color: "#4f46e5" }}>{calculateTotal().toFixed(2)}€</span>
                </div>
              </div>
            </div>
          )}

          <div style={{
            background: "#f8fafc",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "30px",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{
              fontSize: "1.1rem",
              color: "#1e293b",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <FaExchangeAlt /> Актуальні курси валют на 2026 рік (прогноз)
            </h3>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px"
            }}>
              {exchangeRates.map(currency => (
                <div key={currency.code} style={{
                  padding: "12px 15px",
                  background: "white",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s"
                }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "5px"
                  }}>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>
                      {currency.code}
                    </div>
                    <div style={{ fontSize: "1.2rem", color: "#4f46e5" }}>
                      {currency.symbol}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                    1€ = {(1 / currency.rateToEUR).toFixed(4)} {currency.code}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "3px" }}>
                    {currency.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {country && items.length > 0 && (
            <div style={{
              background: "#f8fafc",
              borderRadius: "16px",
              padding: "30px",
              marginBottom: "30px",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{
                fontSize: "1.3rem",
                color: "#1e293b",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <FaCalculator /> Детальний розрахунок вартості (2026)
              </h3>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "25px"
              }}>
                <div style={{
                  padding: "20px",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0"
                }}>
                  <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "8px" }}>
                    Вартість товарів
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1e293b" }}>
                    {calculateTotal().toFixed(2)}€
                  </div>
                </div>
                
                <div style={{
                  padding: "20px",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0"
                }}>
                  <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "8px" }}>
                    Доставка до {country}
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1e293b" }}>
                    {calculateShipping().toFixed(2)}€
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "5px" }}>
                    {getDeliveryTime()}
                  </div>
                </div>
              </div>

              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "25px",
                marginBottom: "25px",
                border: "1px solid #e2e8f0"
              }}>
                <h4 style={{
                  fontSize: "1.1rem",
                  color: "#1e293b",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <FaReceipt /> Митні платежі та податки (2026)
                </h4>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px"
                }}>
                  <div>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "#64748b",
                      marginBottom: "5px"
                    }}>
                      Країна призначення
                    </div>
                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "1.1rem" }}>
                      {country}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "#64748b",
                      marginBottom: "5px"
                    }}>
                      Ставки (2026)
                    </div>
                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "1.1rem" }}>
                      Мито: {countriesData.find(c => c.name === country)?.customsDutyRate || 0}%
                      , ПДВ: {countriesData.find(c => c.name === country)?.vatRate || 0}%
                    </div>
                  </div>
                </div>

                {calculateAllDuties().customsDuty > 0 && (
                  <div style={{
                    padding: "15px",
                    background: "#fef3c7",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    border: "1px solid #fcd34d"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "36px",
                          height: "36px",
                          background: "#fef3c7",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#d97706",
                          border: "1px solid #fcd34d"
                        }}>
                          <FaPercentage />
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: "#1e293b" }}>
                            Мито
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            Ставка: {countriesData.find(c => c.name === country)?.customsDutyRate || 0}%
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: "#d97706", fontSize: "1.2rem" }}>
                        {calculateAllDuties().customsDuty.toFixed(2)}€
                      </div>
                    </div>
                  </div>
                )}

                <div style={{
                  padding: "15px",
                  background: "#dbeafe",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  border: "1px solid #bfdbfe"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        background: "#dbeafe",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#1e40af",
                        border: "1px solid #bfdbfe"
                      }}>
                        <FaChartBar />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: "#1e293b" }}>
                          ПДВ (податок на додану вартість)
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          Ставка: {countriesData.find(c => c.name === country)?.vatRate || 0}%
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: "#1e40af", fontSize: "1.2rem" }}>
                      {calculateAllDuties().vat.toFixed(2)}€
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: "15px",
                  background: "#f3f4f6",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  border: "1px solid #e5e7eb"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        background: "#f3f4f6",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6b7280",
                        border: "1px solid #e5e7eb"
                      }}>
                        <FaReceipt />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: "#1e293b" }}>
                          Митний збір
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          Фіксований платіж за обробку
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: "#6b7280", fontSize: "1.2rem" }}>
                      {calculateAllDuties().customsFee.toFixed(2)}€
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: "20px",
                  background: "#fef2f2",
                  borderRadius: "10px",
                  border: "2px solid #fee2e2"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "1.2rem" }}>
                      Сума митних платежів
                    </div>
                    <div style={{ fontWeight: "bold", color: "#ef4444", fontSize: "1.5rem" }}>
                      {calculateAllDuties().totalDuties.toFixed(2)}€
                    </div>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "8px" }}>
                    * Митні платежі розраховані згідно з чинними тарифами на 2026 рік
                  </div>
                </div>
              </div>
              
              <div style={{
                padding: "30px",
                background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                borderRadius: "12px",
                color: "white",
                boxShadow: "0 10px 25px rgba(79, 70, 229, 0.2)"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px"
                }}>
                  <div>
                    <div style={{ fontSize: "1.1rem", opacity: 0.9, marginBottom: "5px" }}>
                      Загальна вартість замовлення
                    </div>
                    <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                      {calculateOrderTotal().total.toFixed(2)}€
                    </div>
                  </div>
                  
                  <div style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "12px 24px",
                    borderRadius: "30px",
                    fontSize: "0.9rem",
                    textAlign: "center"
                  }}>
                    <div>Включає всі мита</div>
                    <div>та податки 2026</div>
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  opacity: 0.8,
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "1px solid rgba(255,255,255,0.2)"
                }}>
                  <div>Товари: {calculateTotal().toFixed(2)}€</div>
                  <div>Доставка: {calculateShipping().toFixed(2)}€</div>
                  <div>Митні платежі: {calculateAllDuties().totalDuties.toFixed(2)}€</div>
                </div>
              </div>
            </div>
          )}

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "20px",
            borderTop: "1px solid #f1f5f9"
          }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "16px 32px",
                borderRadius: "12px",
                background: "white",
                color: "#475569",
                border: "2px solid #e2e8f0",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.2s"
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "white";
              }}
            >
              ← Скасувати
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={!country || items.length === 0}
              style={{
                padding: "16px 40px",
                borderRadius: "12px",
                background: !country || items.length === 0 ? "#cbd5e1" : 
                           "#4f46e5",
                color: "white",
                fontWeight: 600,
                border: "none",
                cursor: !country || items.length === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "1.1rem",
                transition: "all 0.3s",
                boxShadow: "0 8px 20px rgba(79, 70, 229, 0.2)"
              }}
              onMouseOver={e => {
                if (country && items.length > 0) {
                  e.currentTarget.style.background = "#4338ca";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 25px rgba(79, 70, 229, 0.3)";
                }
              }}
              onMouseOut={e => {
                if (country && items.length > 0) {
                  e.currentTarget.style.background = "#4f46e5";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(79, 70, 229, 0.2)";
                }
              }}
            >
              <FaShippingFast /> Створити замовлення
            </button>
          </div>
        </div>

        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "25px",
          marginBottom: "30px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{
            fontSize: "1.2rem",
            color: "#1e293b",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <FaInfoCircle color="#4f46e5" /> Про митні платежі у 2026 році
          </h3>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            <div style={{
              padding: "15px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: "8px" }}>
                Європейський Союз
              </div>
              <div style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.6 }}>
                Товари в межах ЄС не мають митних обмежень. ПДВ залежить від країни призначення (19-27%). Для товарів поза ЄС діють стандартні митні тарифи.
              </div>
            </div>
            
            <div style={{
              padding: "15px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: "8px" }}>
                США та Канада
              </div>
              <div style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.6 }}>
                США: мито 2.5-10% залежно від категорії товару. Канада: мито 3-8% + ПДВ 5%. Митні збори залежать від вартості посилки.
              </div>
            </div>
            
            <div style={{
              padding: "15px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: "8px" }}>
                Азійські країни
              </div>
              <div style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.6 }}>
                Китай: мито 8-15% + ПДВ 13%. Японія: мито 0-10% + споживчий податок 10%. Індія: мито до 25% + податки.
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: "15px",
            padding: "12px 16px",
            background: "#f0f9ff",
            borderRadius: "8px",
            border: "1px solid #bae6fd",
            fontSize: "0.85rem",
            color: "#0369a1"
          }}>
            💡 <strong>Порада:</strong> Система автоматично визначає країну походження зі сторінки eBay/Amazon. Для точнішого розрахунку митних платежів переконайтеся, що країна походження визначена правильно.
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </Layout>
  )
}