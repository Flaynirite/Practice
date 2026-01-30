// src/components/EbayScanner.tsx
import { useState } from 'react';
import { EbayScannerService, type EbayProductInfo } from '../services/ebayScannerService';
import {
  FaSearch,
  FaEuroSign,
  FaTruck,
  FaUser,
  FaMapMarkerAlt,
  FaImage,
  FaTag,
  FaInfoCircle,
  FaCopy,
  FaHistory,
  FaBell,
  FaSpinner
} from 'react-icons/fa';

interface EbayScannerProps {
  onProductScanned?: (productInfo: EbayProductInfo) => void;
}

export default function EbayScanner({ onProductScanned }: EbayScannerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState<EbayProductInfo | null>(null);
  const [error, setError] = useState('');
  const [scanHistory, setScanHistory] = useState<EbayProductInfo[]>([]);

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Будь ласка, введіть eBay посилання');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await EbayScannerService.scanEbayProduct(url);
      
      if (result) {
        setProductInfo(result);
        setScanHistory(prev => [result, ...prev.slice(0, 9)]); // Зберігаємо останні 10 сканувань
        
        if (onProductScanned) {
          onProductScanned(result);
        }
        
        // Зберігаємо в localStorage
        const history = JSON.parse(localStorage.getItem('ebay_scan_history') || '[]');
        history.unshift({
          ...result,
          scannedAt: new Date().toISOString(),
          url
        });
        localStorage.setItem('ebay_scan_history', JSON.stringify(history.slice(0, 50)));
      } else {
        setError('Не вдалося отримати інформацію про товар');
      }
    } catch (err) {
      setError(`Помилка сканування: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleStartTracking = () => {
    if (productInfo) {
      EbayScannerService.trackPrice(url, 30);
      alert(`Відстеження ціни запущено для: ${productInfo.title}`);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : 'USD'
    }).format(price);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: '1px solid #f1f5f9'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#1e293b',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <FaSearch /> Сканер цін eBay
      </h2>

      {/* Поле введення */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Вставте посилання на eBay (наприклад: https://www.ebay.de/itm/365039544547)"
              style={{
                width: '100%',
                padding: '15px 20px',
                borderRadius: '12px',
                border: `1px solid ${error ? '#ef4444' : '#e2e8f0'}`,
                fontSize: '16px',
                transition: 'all 0.3s'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {error && (
              <div style={{
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaInfoCircle /> {error}
              </div>
            )}
          </div>
          
          <button
            onClick={handleScan}
            disabled={loading}
            style={{
              padding: '15px 30px',
              borderRadius: '12px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s'
            }}
            onMouseOver={e => {
              if (!loading) {
                e.currentTarget.style.background = '#4338ca';
              }
            }}
            onMouseOut={e => {
              if (!loading) {
                e.currentTarget.style.background = '#4f46e5';
              }
            }}
          >
            {loading ? (
              <>
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                Сканування...
              </>
            ) : (
              <>
                <FaSearch /> Сканувати
              </>
            )}
          </button>
        </div>

        <div style={{
          fontSize: '13px',
          color: '#64748b',
          padding: '10px 15px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <FaInfoCircle style={{ marginRight: '8px' }} />
          Підтримуються посилання з eBay: .com, .de, .co.uk, .fr, .it, .es, .com.au
        </div>
      </div>

      {/* Результати сканування */}
      {productInfo && (
        <div style={{
          background: '#f0f9ff',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px',
          border: '1px solid #bae6fd'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#0369a1',
              flex: 1
            }}>
              {productInfo.title}
            </h3>
            <button
              onClick={() => handleCopyToClipboard(productInfo.title)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#f1f5f9',
                border: 'none',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <FaCopy /> Копіювати
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '25px'
          }}>
            {/* Основна інформація */}
            <div>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#475569',
                marginBottom: '15px',
                textTransform: 'uppercase'
              }}>
                Основна інформація
              </h4>
              
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
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
                    <FaEuroSign />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Ціна
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#1e293b'
                    }}>
                      {formatPrice(productInfo.price, productInfo.currency)}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
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
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Доставка
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1e293b'
                    }}>
                      {formatPrice(productInfo.shipping, productInfo.currency)}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#8b5cf615',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8b5cf6'
                  }}>
                    <FaTag />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Загальна вартість
                    </div>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#1e293b'
                    }}>
                      {formatPrice(productInfo.totalPrice, productInfo.currency)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Додаткова інформація */}
            <div>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#475569',
                marginBottom: '15px',
                textTransform: 'uppercase'
              }}>
                Деталі
              </h4>
              
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#3b82f615',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3b82f6'
                  }}>
                    <FaUser />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Продавець
                    </div>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>
                      {productInfo.seller}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#ef444415',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444'
                  }}>
                    <FaTag />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Стан
                    </div>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>
                      {productInfo.condition}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
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
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Локація
                    </div>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>
                      {productInfo.location}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
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
                    <FaImage />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Зображення
                    </div>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>
                      {productInfo.images.length} знайдено
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Опис */}
          {productInfo.description && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#475569',
                marginBottom: '10px'
              }}>
                Опис
              </h4>
              <div style={{
                padding: '15px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#475569',
                fontSize: '14px',
                lineHeight: 1.6
              }}>
                {productInfo.description}
              </div>
            </div>
          )}

          {/* Кнопки дій */}
          <div style={{
            display: 'flex',
            gap: '15px',
            marginTop: '20px'
          }}>
            <button
              onClick={handleStartTracking}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 500,
                transition: 'all 0.3s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#7c3aed';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#8b5cf6';
              }}
            >
              <FaBell /> Відстежувати ціну
            </button>
            
            <button
              onClick={() => window.open(url, '_blank')}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                background: '#0ea5e9',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 500,
                transition: 'all 0.3s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#0284c7';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#0ea5e9';
              }}
            >
              Відкрити на eBay
            </button>
          </div>
        </div>
      )}

      {/* Історія сканувань */}
      {scanHistory.length > 0 && (
        <div>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaHistory /> Останні сканування
          </h4>
          
          <div style={{
            display: 'grid',
            gap: '15px'
          }}>
            {scanHistory.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '15px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => {
                  setProductInfo(item);
                  if (onProductScanned) {
                    onProductScanned(item);
                  }
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontWeight: 500,
                    color: '#1e293b',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '70%'
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontWeight: 600,
                    color: '#10b981'
                  }}>
                    {formatPrice(item.price, item.currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}