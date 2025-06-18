import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function containsUnicode(str) {
  return /[^\u0000-\u00ff]/.test(str);
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [borderU, setBorderU] = useState('');
  const [borderP, setBorderP] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setBorderU('');
    setBorderP('');
    if (!username || !password) {
      setError('điền đầy đủ username và password');
      if (!username) setBorderU('2px solid red');
      if (!password) setBorderP('2px solid red');
      return;
    }
    if (containsUnicode(username)) {
      setError('username không được dùng kí tự unicode');
      setBorderU('2px solid red');
      return;
    }
    if (containsUnicode(password)) {
      setError('password không được dùng kí tự unicode');
      setBorderP('2px solid red');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { username, password, remember });
      if (remember) {
        localStorage.setItem('token', res.data.token);
      } else {
        sessionStorage.setItem('token', res.data.token);
      }
      navigate('/home');
    } catch (e) {
      setError(e.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <input
        style={{ border: borderU, width: '100%', marginBottom: 8, padding: 8 }}
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      /><br/>
      <input
        style={{ border: borderP, width: '100%', marginBottom: 8, padding: 8 }}
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br/>
      <label>
        <input
          type="checkbox"
          checked={remember}
          onChange={e => setRemember(e.target.checked)}
        /> Nhớ tài khoản
      </label><br/>
      <button style={{ width: '100%', padding: 8, marginTop: 8 }} onClick={handleLogin}>Login</button>
      <div style={{ color: 'red', display: error ? 'block' : 'none', marginTop: 8 }}>{error}</div>
      <div style={{ marginTop: 12 }}>
        <Link to="/auth/register">Đăng ký</Link> | <Link to="/auth/forgotpassword">Quên mật khẩu</Link>
      </div>
    </div>
  );
} 