import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Route, Routes,useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '', gender: '', dob: '', country: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/register', formData);
    alert('Registered Successfully');
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <input name="username" placeholder="Username" onChange={handleChange} className="p-2 border rounded w-full mb-2" />
      <input name="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded w-full mb-2" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded w-full mb-2" />
      <input name="fullName" placeholder="Full Name" onChange={handleChange} className="p-2 border rounded w-full mb-2" />
      <input name="gender" placeholder="Gender" onChange={handleChange} className="p-2 border rounded w-full mb-2" />
      <input name="dob" type="date" onChange={handleChange} className="p-2 border rounded w-full mb-2" />
      <input name="country" placeholder="Country" onChange={handleChange} className="p-2 border rounded w-full mb-2" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Register</button>
    </form>
  );
};

const Home = () => {
  return(<>
  <h1 className="text-4xl text-center">Welcome to the Home Page</h1>
  <div className="flex justify-center">
    <a href="/register" className="bg-blue-500 text-white p-2 rounded w-1/4 text-center m-2">Register</a>
    <a href="/login" className="bg-green-500 text-white p-2 rounded w-1/4 text-center m-2">Login</a>
  </div>
  </>)
}

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post('http://localhost:5000/api/login', credentials);
    localStorage.setItem('token', data.token);
    alert('Logged in Successfully');
    navigate('/search');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <input name="identifier" placeholder="Username or Email" onChange={handleChange} className="p-2 border rounded w-full mb-2" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded w-full mb-2" />
      <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Login</button>
    </form>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/users/username', { headers: { Authorization: `Bearer ${token}` } });
    setUser(data);
  };
  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <button onClick={fetchUser} className="bg-purple-500 text-white p-2 rounded w-full mb-2">Get Profile</button>
      {user && (
        <div>
          <h2 className="text-xl font-bold mb-2">{user.fullName}</h2>
          <p>Email: {user.email}</p>
          <p>Gender: {user.gender}</p>
          <p>DOB: {user.dob}</p>
          <p>Country: {user.country}</p>
        </div>
      )}
    </div>
  );
};
const SearchUser = () => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  const handleSearch = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/users/${query}`);
    setUser(data);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <input type="text" placeholder="Search by Username or Email" onChange={(e) => setQuery(e.target.value)} className="p-2 border rounded w-full mb-2" />
      <button onClick={handleSearch} className="bg-yellow-500 text-white p-2 rounded w-full mb-2">Search User</button>
      {user && (
        <div>
          <h2 className="text-xl font-bold mb-2">{user.fullName}</h2>
          <p>Email: {user.email}</p>
          <p>Gender: {user.gender}</p>
          <p>DOB: {user.dob}</p>
          <p>Country: {user.country}</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {token && <Route path="/search" element={<SearchUser />} />}
      <Route path="/" element={<Home />} />
    </Routes>
  );
};


export default App;
