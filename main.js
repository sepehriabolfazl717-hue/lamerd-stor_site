/**
 * Khaleej Store (خلیج استور) - Global Interactive Logic
 * Vanilla JavaScript (Zero Build, Ready for GitHub Pages)
 */

(function() {
  'use strict';

  // Persian Number Helpers
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  window.toPersianDigits = function(num) {
    if (num === null || num === undefined) return '';
    return num.toString().replace(/\d/g, d => persianDigits[parseInt(d, 10)]);
  };

  window.formatPrice = function(price) {
    if (!price && price !== 0) return '';
    const formatted = price.toLocaleString('en-US');
    return window.toPersianDigits(formatted);
  };

  // Local Storage Cart Manager
  const CART_KEY = 'khaleej_store_cart_v1';
  
  const defaultCart = [
    {
      id: 'DW-PR32-ST',
      title: 'یخچال و فریزر ساید بای ساید دوو سری پرایم ۳۲ فوت مدل D4S-0034SS استیل',
      brand: 'دوو (Daewoo Electronics)',
      color: 'استیل نقره‌ای ضدلک',
      warranty: 'گارانتی ۲۴ ماهه انتخاب سرویس حامی',
      price: 87120000,
      oldPrice: 92500000,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3pKUOcI_UO3RoSSAWAhHmH_wh1UbjAAYqjg6FfmE9G167qvX8Sb_wCDxDbukKcTIGulbmZ6_cRzIhornujMrXBmMrOuyaOpiYjWeWZenmJg_4zvn6bZWuEvarFtwpfrhcim09o-u4sfuiC3k0zG2-_RKp8ZzYYYOyIjukBxyVLjgngyeBht3-6vkL9TW08p6fW0uL9Rq4JYc2pa8H5ghFPf6MSoKsNPkQLP-pukmnmPUbd-5vMX9z',
      badge: 'ارسال اختصاصی'
    },
    {
      id: 'PH-FC9174-RD',
      title: 'جاروبرقی فیلیپس کیسه‌ای مدل FC9174 قدرت ۲۲۰۰ وات اصلی لهستان',
      brand: 'فیلیپس (Philips)',
      color: 'زرشکی متالیک',
      warranty: 'گارانتی ۲۴ ماهه شکوفا الکتریک معتبر',
      price: 9500000,
      oldPrice: 10300000,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpHCE6CGJrJRGNvIGvu48HtO2Skvbh9khOfPIEuJI3RGBMM-lqtGidY1tqHPISVd9x4jKRNcjovIAeFIIZ-f_uZhlqZyeXZ6rmtzsvv1pnTjzzC6qRR4C5vtk2GlnaiVmfLE1OeudWexMDFJdgMRyIbf2n1F8fxEYRmie7LmHBUOrdSf8VvzZuU3F_sbr3gPlqpD8zKtv-6dsvYuMXhybb-SVtZki59kCKDr48FPDKHfmr5CK3kiba',
      badge: 'تخفیف ویژه'
    }
  ];

  window.getCart = function() {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch(e) {
      console.warn('Storage not accessible', e);
    }
    return defaultCart;
  };

  window.saveCart = function(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch(e) {
      console.warn('Storage save failed', e);
    }
    window.updateCartBadge();
  };

  window.addToCart = function(product) {
    const cart = window.getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += (product.quantity || 1);
    } else {
      cart.push({
        id: product.id || 'PROD-' + Date.now(),
        title: product.title,
        brand: product.brand || 'خلیج استور',
        color: product.color || 'استاندارد',
        warranty: product.warranty || 'گارانتی رسمی ۲۴ ماهه',
        price: product.price || 0,
        oldPrice: product.oldPrice || product.price,
        quantity: product.quantity || 1,
        image: product.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUaHN-PeDaq8z49pt8ut3cJjuxTIT9VDe1C-SCE0-H0i9SJgFEgSXHYQEjnsII7p8xJ5qSY0liYQE68VXazl9pEEt901OW6zccptmHfI8-Dk9QQiwhHcnIeHm2cSbeIB2GCM53BiKexeSiSZkoXngbz8DTUTDVPGXGt9uAVpDmXMZ9inGSmK2pjQiV-n5bbOeOgsjRRKDNU-P3AUaDwUXOscvGnicR4GtkXm1I4Hitap7cP8AXB0dl',
        badge: product.badge || 'تخفیف ویژه'
      });
    }
    window.saveCart(cart);
    window.showToast(`«${product.title.substring(0, 30)}...» به سبد خرید افزوده شد`, 'success');
  };

  window.removeFromCart = function(productId) {
    let cart = window.getCart();
    cart = cart.filter(item => item.id !== productId);
    window.saveCart(cart);
    window.showToast('کالا با موفقیت از سبد خرید حذف شد', 'info');
    if (typeof window.renderCartPage === 'function') {
      window.renderCartPage();
    }
  };

  window.updateItemQuantity = function(productId, delta) {
    const cart = window.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      window.saveCart(cart);
      if (typeof window.renderCartPage === 'function') {
        window.renderCartPage();
      }
    }
  };

  window.clearCart = function() {
    window.saveCart([]);
    window.showToast('سبد خرید خالی شد', 'info');
    if (typeof window.renderCartPage === 'function') {
      window.renderCartPage();
    }
  };

  window.updateCartBadge = function() {
    const cart = window.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('[data-cart-count]');
    badges.forEach(b => {
      b.textContent = window.toPersianDigits(totalItems) + (b.getAttribute('data-with-label') ? ' کالا' : '');
    });
  };

  // Toast Notification System
  window.showToast = function(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconName = type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'info';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[20px] text-${type === 'success' ? 'emerald-600' : 'sky-600'}">${iconName}</span>
      <span class="flex-1 text-sm font-medium text-slate-800">${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // City Picker Modal Handler
  window.openCityModal = function() {
    const modal = document.getElementById('cityModal');
    if (modal) modal.classList.add('open');
  };

  window.closeCityModal = function() {
    const modal = document.getElementById('cityModal');
    if (modal) modal.classList.remove('open');
  };

  window.selectCity = function(cityName) {
    const cityButtons = document.querySelectorAll('[data-current-city]');
    cityButtons.forEach(btn => {
      btn.textContent = cityName;
    });
    window.closeCityModal();
    window.showToast(`شهر ارسال به «${cityName}» تغییر یافت`, 'info');
  };

  // Login Modal Handler
  window.openLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('open');
  };

  window.closeLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('open');
  };

  // Telegram Quick Order Link Builder
  window.openTelegramOrder = function(productTitle, productPrice, orderCode) {
    const text = encodeURIComponent(
      `سلام و درود، قصد خرید از خلیج استور را دارم.\n` +
      (orderCode ? `کد پیگیری: ${orderCode}\n` : '') +
      (productTitle ? `کالای درخواستی: ${productTitle}\n` : '') +
      (productPrice ? `قیمت: ${productPrice} تومان\n` : '') +
      `لطفاً پیش‌فاکتور رسمی و نحوه ارسال را بفرمایید.`
    );
    window.open(`https://t.me/ggjfjfujiuyfuuybot?start=${orderCode || 'order'}`, '_blank');
  };

  // Initialize Global Handlers on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    window.updateCartBadge();

    // Universal Countdown Timer if present
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    if (hoursEl && minutesEl && secondsEl) {
      let totalSeconds = 4 * 3600 + 18 * 60 + 25;
      setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          hoursEl.textContent = window.toPersianDigits(h.toString().padStart(2, '0'));
          minutesEl.textContent = window.toPersianDigits(m.toString().padStart(2, '0'));
          secondsEl.textContent = window.toPersianDigits(s.toString().padStart(2, '0'));
        }
      }, 1000);
    }

    // City Button listeners
    document.querySelectorAll('[data-action="open-city-modal"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openCityModal();
      });
    });

    // Login modal listeners
    document.querySelectorAll('[data-path="login"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openLoginModal();
      });
    });

    // Mobile Search Bar Toggle
    const searchInputs = document.querySelectorAll('input[placeholder*="جستجو"]');
    searchInputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = input.value.trim();
          if (query) {
            window.location.href = `products.html?q=${encodeURIComponent(query)}`;
          }
        }
      });
    });
  });
})();
