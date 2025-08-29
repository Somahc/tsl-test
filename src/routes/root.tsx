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
          <li>
            <Link to="/rasen-sphere">Rasen Sphere</Link>
          </li>
          <li>
            <Link to="/react-flow">React Flow</Link>
          </li>
          <li>
            <Link to="/flow-tutorial">Flow Tutorial</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
