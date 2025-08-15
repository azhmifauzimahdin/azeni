interface navLinks {
  href: string;
  icon: React.ReactNode;
  label: string;
}
interface BottomNavbarProps {
  navLinks: navLinks[];
}
const BottomNavbar: React.FC<BottomNavbarProps> = ({ navLinks }) => {
  return (
    <>
      <div className="fixed bottom-5 right-1/2 sm:right-0 transform translate-x-1/2 sm:translate-x-0 z-40 w-auto sm:w-[390px] flex justify-center">
        <div className="flex justify-center gap-3 px-3 py-2 w-auto bg-slate-100 rounded-lg shadow-xl">
          {navLinks.map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              aria-label={label}
              className="bg-green-primary hover:bg-green-secondary text-white p-2 rounded-lg"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
