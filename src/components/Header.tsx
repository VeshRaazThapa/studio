import Logo from '@/components/Logo';

const Header = () => {
  return (
    <header className="py-4 px-6 shadow-md bg-card">
      <div className="container mx-auto">
        <Logo />
      </div>
    </header>
  );
};

export default Header;
