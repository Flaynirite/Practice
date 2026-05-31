// src/components/CustomsCalculator.tsx
import { EbayScannerService } from '../services/ebayScannerService';
import {
  FaCalculator,
  FaTruck,
  FaBox,
  FaFileInvoiceDollar,
  FaGlobeEurope,
  FaGlobeAmericas,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

interface CustomsCalculatorProps {
  productPrice: number;
  shippingPrice: number;
  currency: string;
  country: string;
  region: 'EU' | 'US' | 'OTHER';
}

export default function CustomsCalculator({ 
  productPrice, 
  shippingPrice, 
  currency,
  country,
  region 
}: CustomsCalculatorProps) {
  
  // Конвертуємо все в EUR для розрахунків
  const productPriceEUR = currency === 'EUR' 
    ? productPrice 
    : EbayScannerService.convertToEUR(productPrice, currency);
  
  const shippingPriceEUR = currency === 'EUR'
    ? shippingPrice
    : EbayScannerService.convertToEUR(shippingPrice, currency);

  // Розраховуємо митні платежі
  const customsFees = EbayScannerService.calculateCustomsFees(
    productPriceEUR,
    shippingPriceEUR,
    country,
    region
  );

  // Конвертуємо назад в обрану валюту для відображення
  const convertToDisplayCurrency = (amountEUR: number) => {
    if (currency === 'EUR') return amountEUR;
    return EbayScannerService.convertFromEUR(amountEUR, currency);
  };

  // Отримуємо символ валюти
  const getCurrencySymbol = () => {
    switch(currency) {
      case 'EUR': return '€';
      case 'USD': return '$';
      case 'UAH': return '₴';
      default: return currency;
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '25px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: '1px solid #f1f5f9',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1e293b',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <FaCalculator /> Розрахунок митних платежів
        <span style={{
          fontSize: '0.75rem',
          background: '#f0f9ff',
          color: '#0369a1',
          padding: '4px 12px',
          borderRadius: '20px'
        }}>
          2026
        </span>
      </h3>

      {/* Інформація про країну */}
      <div style={{
        padding: '15px',
        background: region === 'EU' ? '#f0f9ff' : 
                   region === 'US' ? '#fef2f2' : '#f8fafc',
        borderRadius: '12px',
        border: `1px solid ${region === 'EU' ? '#bae6fd' : 
                           region === 'US' ? '#fecaca' : '#e2e8f0'}`,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: region === 'EU' ? '#0ea5e9' : 
                     region === 'US' ? '#ef4444' : '#6b7280',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {region === 'EU' ? <FaGlobeEurope /> : 
           region === 'US' ? <FaGlobeAmericas /> : 
           <FaInfoCircle />}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>
            Країна відправник: {country}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
            {region === 'EU' ? 'Європейський Союз' : 
             region === 'US' ? 'Сполучені Штати' : 
             'Інша країна'}
          </div>
        </div>
      </div>

      {/* Вартість товарів */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '15px',
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: '#10b98115',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <FaBox />
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Вартість товару</div>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b' }}>
            {getCurrencySymbol()}{formatPrice(convertToDisplayCurrency(productPriceEUR))}
          </div>
        </div>

        <div style={{
          padding: '15px',
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: '#f59e0b15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <FaTruck />
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Доставка</div>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b' }}>
            {getCurrencySymbol()}{formatPrice(convertToDisplayCurrency(shippingPriceEUR))}
          </div>
        </div>
      </div>

      {/* Митні платежі */}
      <div style={{
        background: '#fefce8',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #fef08a'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#92400e',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaFileInvoiceDollar /> Митні платежі (за правилами 2026)
        </h4>

        <div style={{
          display: 'grid',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #fef08a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: '#f59e0b',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
              }}>
                M
              </div>
              <span style={{ color: '#92400e' }}>Мито (10% від суми понад 150€)</span>
            </div>
            <div style={{ fontWeight: 600, color: '#92400e' }}>
              {getCurrencySymbol()}{formatPrice(convertToDisplayCurrency(customsFees.customsDuty))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #fef08a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: '#ef4444',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
              }}>
                P
              </div>
              <span style={{ color: '#92400e' }}>ПДВ (20% від вартості з митом)</span>
            </div>
            <div style={{ fontWeight: 600, color: '#92400e' }}>
              {getCurrencySymbol()}{formatPrice(convertToDisplayCurrency(customsFees.vat))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: '#10b981',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
              }}>
                Σ
              </div>
              <span style={{ fontWeight: 600, color: '#92400e' }}>Загальні митні платежі</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>
              {getCurrencySymbol()}{formatPrice(convertToDisplayCurrency(customsFees.totalFees))}
            </div>
          </div>
        </div>
      </div>

      {/* Деталі розрахунку */}
      <div style={{
        background: '#f0f9ff',
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '20px',
        border: '1px solid #bae6fd'
      }}>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#0369a1',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaInfoCircle /> Деталі розрахунку
        </h4>
        <ul style={{
          paddingLeft: '20px',
          margin: 0,
          fontSize: '0.85rem',
          color: '#0369a1',
          lineHeight: 1.6
        }}>
          {customsFees.details.map((detail, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>
              {detail}
            </li>
          ))}
        </ul>
      </div>

      {/* Підсумкова вартість */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '5px' }}>
              Підсумкова вартість з урахуванням митних платежів
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {getCurrencySymbol()}{formatPrice(convertToDisplayCurrency(customsFees.totalWithFees))}
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.8rem'
          }}>
            {currency} • 2026
          </div>
        </div>
      </div>

      {/* Примітка */}
      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: '#fef2f2',
        borderRadius: '8px',
        border: '1px solid #fecaca'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <FaExclamationTriangle color="#dc2626" />
          <div style={{ fontSize: '0.8rem', color: '#dc2626' }}>
            Увага! Цей розрахунок є приблизним. Точну суму митних платежів визначить митниця при оформленні посилки.
          </div>
        </div>
      </div>
    </div>
  );
}