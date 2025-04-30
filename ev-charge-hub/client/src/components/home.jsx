// src/components/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>If you are an admin, click the link below to log in:</p>
      <Link to="/admin/login">Go to Admin Login</Link>  {/* Link to the login page */}

      <p>If you are a user, click the link below to log in:</p>
      <Link to="/user/login">Go to user Login</Link>  {/* Link to the login page */}
    </div>
  );
};

export default Home;
