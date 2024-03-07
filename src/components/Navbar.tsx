const NavBar: React.FC = () => {
  return (
    <nav>
      {/* Navigation links or branding can go here */}
      <img
        src="/dromos-high-resolution-logo-transparent.png"
        alt="Dromos Logo"
      />{" "}
      {/* Referencing logo */}
      <a href="/">Home</a>
      <i className="fa-solid fa-house"></i>
      <i className="fa-solid fa-user-plus"></i>
      <i className="fa-regular fa-circle-nodes"></i>
      <a href="/about">About</a>
    </nav>
  );
};

export default NavBar;
