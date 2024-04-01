import { Link } from "react-router-dom";
import myApi from "../api.config";

export default function NavBar() {
  const user = localStorage.getItem('user');
  return (
    <nav>
      <h1>TodoMatic</h1>
      <div className="nav-profile">
        <span className="user">{user}</span>
        <span> | </span>
        <Link to="/auth/login" onClick={handleLogout}>Logout</Link>
      </div>
    </nav>
  )

  async function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    try {
      const response = await myApi.post("/users/logout")
      console.log(response.data);
    } catch (error) {
      console.error(error.response);
    }
  }
}