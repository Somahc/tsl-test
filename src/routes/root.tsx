import { Link, Outlet } from "react-router-dom";
import "./root.css";

export default function Root() {
  return (
    <>
      <h1>NodeMaterial, TSLのPlayground</h1>
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/myj-cube">Myj Cube</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
