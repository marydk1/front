import React, { useEffect, useState } from 'react';
const API = 'http://localhost:4000/api';

export default function UserHome({ token, onLogout }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState(null);

  useEffect(() => {
    fetch(API + '/products')
      .then(r => r.json())
      .then(setProducts);
  }, []);

  function addToCart(p) {
    setCart(prev => {
      const existing = prev.find(item => item._id === p._id);
      if (existing) {
        return prev.map(item =>
          item._id === p._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const price = p.promotion && p.discountPercent
          ? (p.price * (100 - p.discountPercent) / 100).toFixed(2)
          : p.price.toFixed(2);
        return [...prev, { ...p, _finalPrice: price, quantity: 1 }];
      }
    });
    alert('Додано до кошика: ' + p.title);
  }

  function replaceItem(index, newProduct) {
    setCart(prev => {
      const updated = [...prev];
      const price = newProduct.promotion && newProduct.discountPercent
        ? (newProduct.price * (100 - newProduct.discountPercent) / 100).toFixed(2)
        : newProduct.price.toFixed(2);
      updated[index] = { ...newProduct, _finalPrice: price, quantity: 1 };
      return updated;
    });
    setReplaceIndex(null);
    alert('Товар замінено!');
  }

  function goToCatalog() {
    const section = document.getElementById('catalog');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item._finalPrice),
    0
  );

  return (
    <div>
      <header className="hero user-hero">
        <div className="logo-container">
          <img src="/images/log.jpg" alt="Логотип" className="site-logo" />
        </div>

        <div className="top-bar">
          <button className="logout-button" onClick={onLogout}>Вийти</button>
          <img
            src="/images/PINKK.JPG"
            alt="Кошик"
            className="cart-icon"
            onClick={() => setShowCart(!showCart)}
          />
        </div>

        <h1 className="hero-title">Смачні торти на замовлення</h1>

        <div className="hero-center">
          <h2 className="hero-subtitle">Ніжні десерти</h2>
          <p className="hero-description">
            Ми створюємо смачні торти, тістечка та десерти з натуральних інгредієнтів, без штучних добавок і консервантів. Кожен торт виготовляється індивідуально за вашим замовленням — для дня народження, весілля чи просто для душі.
          </p>
          <button className="catalog-button" onClick={goToCatalog}>До каталогу</button>
        </div>

        <div className="left-container">
          <img src="/images/pinktort.jpg" alt="Фото" className="small-photop" />
        </div>

        <div className="right-container">
          <img src="/images/malina.jpg" alt="Фото" className="small-photo" />
        </div>
      </header>

      <main className="container" id="catalog">
        <h2>Наші солодощі</h2>
        <div className="grid">
          {products.map(p => (
            <div key={p._id} className="card product-card">
              <div className="img" style={{ backgroundImage: `url(${p.image || 'https://via.placeholder.com/300'})` }} />
              <h3>{p.title}</h3>
              <p className="desc">{p.description}</p>
              <div className="row">
                <div className="price">
                  {p.promotion ? (
                    <>
                      <span className="old">{p.price.toFixed(2)} грн</span>
                      <strong>{(p.price * (100 - p.discountPercent) / 100).toFixed(2)} грн</strong>
                    </>
                  ) : (
                    <strong>{p.price.toFixed(2)} грн</strong>
                  )}
                </div>
                {replaceIndex !== null ? (
                  <button className="buy-button" onClick={() => replaceItem(replaceIndex, p)}>Замінити цим</button>
                ) : (
                  <button className="buy-button" onClick={() => addToCart(p)}>Купити</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCart && (
        <div className="cart-popup">
          <h3>Кошик</h3>
          {cart.length === 0 ? (
            <p>Ваш кошик порожній</p>
          ) : (
            <ul>
              {cart.map((item, i) => (
                <li key={i} onClick={() => window.location.href = `/product/${item._id}`} className="cart-item">
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div>
                    <strong>{item.title}</strong><br />
                    {item._finalPrice} грн × {item.quantity} = {(item.quantity * parseFloat(item._finalPrice)).toFixed(2)} грн
                  </div>
                  <div className="cart-buttons">
                    <button onClick={(e) => { e.stopPropagation(); setCart(prev => prev.filter((_, idx) => idx !== i)); }}>Видалити</button>
                    <button onClick={(e) => { e.stopPropagation(); setReplaceIndex(i); }}>Замінити</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="total">Разом: {total.toFixed(2)} грн</p>
        </div>
      )}
    </div>
  );
}
