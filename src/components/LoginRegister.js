import React, {useState} from 'react';

const API = 'http://localhost:4000/api';

export default function LoginRegister({ onLogin }){
  const [isRegister,setIsRegister] = useState(true);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');

  async function submit(e){
    e.preventDefault();
    setMessage('');
    try{
      if(isRegister){
        const res = await fetch(API + '/auth/register', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ username, password, role: username==='admin'? 'admin' : 'user' })
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message || 'Error');
        setMessage(data.message || 'Registered');
      } else {
        const res = await fetch(API + '/auth/login', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message || 'Error');
        onLogin(data.token, data.role);
      }
    }catch(e){
      setMessage(e.message);
    }
  }

  return (
    <div className="page auth-page">
      
      <div className="card auth-card">
        <img 
    src="/images/ikon.webp"  // заміни на свій URL картинки
    alt="Іконка реєстрації" 
    className="auth-icon"
  />
        <h2>Зареєструйтесь</h2>
        <p className="muted">вам стануть доступні функції сайту</p>
        <form onSubmit={submit}>
          <label>Логін</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} required />
          <label>Пароль</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit">{isRegister ? 'Зберегти/Увійти' : 'Увійти'}</button>
        </form>
        <div className="small-row">
          <button className="link" onClick={()=>{ setIsRegister(!isRegister); setMessage(''); }}>
            {isRegister ? 'Вже є акаунт? Увійти' : 'Нема акаунта? Зареєструватись'}
          </button>
        </div>
        {message && <p className="message">{message}</p>}
        <p className="hint">Підказка: створіть адміністратора, зареєструвавши ім'я користувача "admin"</p>
      </div>
    </div>
  );
}
