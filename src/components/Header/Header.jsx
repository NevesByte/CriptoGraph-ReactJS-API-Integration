import { useState } from "react";
import "./css/header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <h1>CriptoGraph</h1>
      </header>
    </>
  );
}

export default Header;
