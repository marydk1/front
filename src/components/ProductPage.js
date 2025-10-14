import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API = 'http://localhost:4000/api/products';

export default function ProductPage() {
  const { id } = useParams(); // отримуємо id з URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Товар не знайдено');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-page">
      <button onClick={() => navigate(-1)}>⬅ Назад</button>
      <h2>{product.title}</h2>
      <img
        src={product.image || 'https://via.placeholder.com/300'}
        alt={product.title}
        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
      />
      <p>{product.description}</p>
      {product.promotion ? (
        <p>
          <span style={{ textDecoration: 'line-through' }}>{product.price} грн</span>{' '}
          <strong>{(product.price * (100 - product.discountPercent) / 100).toFixed(2)} грн</strong>
        </p>
      ) : (
        <p><strong>{product.price} грн</strong></p>
      )}
    </div>
  );
}