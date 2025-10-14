import React, { useEffect, useState } from 'react';
const API = 'http://localhost:4000/api';

export default function AdminDashboard({ token, onLogout }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: 0, image: '', promotion: false, discountPercent: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', price: 0, image: '', promotion: false, discountPercent: 0 });

  useEffect(() => {
    fetch(API + '/products')
      .then(r => r.json())
      .then(setProducts);
  }, []);

  async function createProduct(e) {
    e.preventDefault();
    const res = await fetch(API + '/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const p = await res.json();
      setProducts(prev => [p, ...prev]);
      setForm({ title: '', description: '', price: 0, image: '', promotion: false, discountPercent: 0 });
    } else {
      alert('Помилка при створенні товару');
    }
  }

  async function remove(id) {
    if (!confirm('Видалити товар?')) return;
    const res = await fetch(API + '/products/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p._id !== id));
    }
  }

  function startEdit(p) {
    setEditingId(p._id);
    setEditForm({
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.image,
      promotion: p.promotion,
      discountPercent: p.discountPercent || 0
    });
  }

  async function updateProduct(e, id) {
    e.preventDefault();
    const res = await fetch(API + '/products/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(editForm)
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts(prev => prev.map(p => (p._id === id ? updated : p)));
      setEditingId(null);
    } else {
      alert('Помилка при оновленні товару');
    }
  }

  return (
    <div className="admin-page">
      <header className="hero admin-hero">
        <h1>Адмін панель</h1>
      </header>
      <main className="container">
        <section className="admin-controls">
          <form onSubmit={createProduct} className="admin-form">
            <h3>Додати товар</h3>
            <input placeholder="Заголовок" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <input placeholder="Опис" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Ціна" type="number" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
            <input placeholder="URL картинки" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            <label>
              <input type="checkbox" checked={form.promotion} onChange={e => setForm({ ...form, promotion: e.target.checked })} /> Акція
            </label>
            {form.promotion && <input placeholder="Знижка %" type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })} />}
            <button type="submit">Зберегти</button>
          </form>

          <div className="product-list">
            <div className="product-header">Товари</div>
            {products.map(p => (
              <div className="product-row" key={p._id}>
                <div className="meta">
                  <img src={p.image || 'https://via.placeholder.com/80'} alt="" />
                  <div>
                    <strong>{p.title}</strong>
                    <div>{p.description}</div>
                    <div>{p.price} грн {p.promotion ? '(акція)' : ''}</div>
                  </div>
                </div>

                <div className="actions">
                  <button onClick={() => startEdit(p)}>Редагувати</button>
                  <button onClick={() => remove(p._id)}>Видалити</button>
                </div>

                {editingId === p._id && (
                  <form onSubmit={(e) => updateProduct(e, p._id)} className="edit-form">
                    <input placeholder="Заголовок" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                    <input placeholder="Опис" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                    <input placeholder="Ціна" type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })} />
                    <input placeholder="URL картинки" value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })} />
                    <label>
                      <input type="checkbox" checked={editForm.promotion} onChange={e => setEditForm({ ...editForm, promotion: e.target.checked })} /> Акція
                    </label>
                    {editForm.promotion && <input placeholder="Знижка %" type="number" value={editForm.discountPercent} onChange={e => setEditForm({ ...editForm, discountPercent: parseInt(e.target.value) || 0 })} />}
                    <button type="submit">Оновити</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="logout-row">
          <button onClick={onLogout}>Вийти</button>
        </div>
      </main>
    </div>
  );
}