import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const SECTION_LINKS = [
  { id: 'packages', label: 'Packages' },
  { id: 'services', label: 'Services' },
  { id: 'why-us', label: 'Why Us' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onResize = () => window.innerWidth > 768 && setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Sections only exist on the home page. If we're elsewhere (e.g.
  // /estimate), navigate home first, then scroll once it has rendered.
  function goToSection(id: string) {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/85 backdrop-blur-md border-b border-border">
      <div className="max-w-container mx-auto px-6 py-3 flex items-center justify-between flex-wrap">
        <Link to="/" className="text-xl font-bold tracking-tight text-text">
          Big<span className="text-accent">Land</span>
          <span className="block text-[0.55rem] font-normal text-text-muted tracking-widest uppercase -mt-0.5">
            Construction
          </span>
        </Link>

        <ul role="menubar" className="hidden md:flex items-center gap-8 list-none">
          {SECTION_LINKS.map((link) => (
            <li key={link.id} role="none">
              <button
                role="menuitem"
                onClick={() => goToSection(link.id)}
                className="text-sm text-text-muted hover:text-text border-b-2 border-transparent hover:border-accent transition-colors pb-1"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li role="none">
            <Link
              role="menuitem"
              to="/estimate"
              className="text-sm text-text-muted hover:text-text border-b-2 border-transparent hover:border-accent transition-colors pb-1"
            >
              Estimate
            </Link>
          </li>
        </ul>

        <button
          className="md:hidden min-h-11 min-w-11 flex items-center justify-center text-text"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <ul className="md:hidden flex flex-col gap-2 px-6 pb-4 list-none">
          {SECTION_LINKS.map((link) => (
            <li key={link.id}>
              <button onClick={() => goToSection(link.id)} className="block py-2 text-sm text-text-muted hover:text-text text-left w-full">
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <Link to="/estimate" onClick={() => setOpen(false)} className="block py-2 text-sm text-text-muted hover:text-text">
              Estimate
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
