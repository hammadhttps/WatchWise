import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/AuthContext';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Discover');
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const navLinks = ['Discover', 'TV Shows', 'Movies', 'Anime Hub', 'Arcade', 'Trending', 'My Watchlist', 'Coming Soon'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchToggle = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 310);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center px-[4%] bg-[#134686] border-b border-white/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
        <div className="flex items-center w-full">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-8 cursor-pointer">
            <span className="text-[20px]">🎬</span>
            <span className="text-white font-bold text-[29px] tracking-[0.5px] leading-none letter-spacing-[0.5px]">WatchWise</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1 list-none flex-1">
            {navLinks.map(link => (
              <li
                key={link}
                onClick={() => setActiveLink(link)}
                className={`text-[13.5px] font-medium cursor-pointer whitespace-nowrap px-[10px] py-[6px] rounded-md transition-all duration-150 ${
                  activeLink === link
                    ? 'text-white font-semibold'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {link}
              </li>
            ))}
          </ul>

          {/* Right Controls */}
          <div className="flex items-center gap-3.5 flex-shrink-0 ml-auto">

            {/* Search */}
            <div className="relative hidden sm:flex items-center">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search titles, genres..."
                onBlur={(e) => { if (!e.target.value) setIsSearchOpen(false); }}
                className={`absolute right-9 top-1/2 -translate-y-1/2 bg-[#0d1b3e]/95 border text-white text-[13px] h-[34px] rounded-[4px] outline-none transition-all duration-300 placeholder-white/40 ${
                  isSearchOpen ? 'w-[210px] border-white/35 px-2.5' : 'w-0 border-transparent p-0 overflow-hidden'
                }`}
              />
              <button
                onClick={handleSearchToggle}
                className="flex items-center justify-center p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>

            {/* AI Movie Match */}
            <button className="hidden sm:flex items-center gap-1.5 bg-[#213C51] border border-white/25 text-white text-[14.5px] font-bold px-3.5 py-1.5 rounded-md cursor-pointer whitespace-nowrap hover:bg-white/20 hover:border-white/40 transition-all">
              <span className="text-[13px]">✨</span>
              <span>AI Movie Match</span>
            </button>

            {/* User Menu / Sign In */}
            {!loading && (
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="hidden sm:flex items-center gap-2 bg-[#213C51] border border-white/25 text-white text-[14.5px] font-bold px-3.5 py-1.5 rounded-md cursor-pointer whitespace-nowrap hover:bg-white/20 hover:border-white/40 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#6ea8fe] flex items-center justify-center">
                      <span className="text-[12px] font-bold text-[#134686]">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="max-w-[100px] truncate">{user.firstName}</span>
                    <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link 
                    to="/sign"
                    className="hidden sm:flex items-center gap-1.5 bg-[#213C51] border border-white/25 text-white text-[14.5px] font-bold px-3.5 py-1.5 rounded-md whitespace-nowrap hover:bg-white/20 hover:border-white/40 transition-all"
                  >
                    Sign In
                  </Link>
                )}

                {/* Dropdown Menu */}
                {isUserMenuOpen && user && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#112055] border border-white/[0.08] rounded-xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.08]">
                      <p className="text-[14px] font-semibold text-white truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[12px] text-white/50 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-white/80 hover:bg-white/10 transition-colors">
                        <User size={16} />
                        <span>My Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-white/80 hover:bg-white/10 transition-colors">
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>
                    </div>
                    <div className="border-t border-white/[0.08] py-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-1.5 rounded-md text-white hover:bg-white/10 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[68px] left-0 right-0 z-40 bg-[#134686] border-t border-white/10 lg:hidden">
          <ul className="list-none py-1.5">
            {navLinks.map(link => (
              <li
                key={link}
                onClick={() => { setActiveLink(link); setIsMobileMenuOpen(false); }}
                className={`px-5 py-[11px] text-[14px] font-medium cursor-pointer transition-all ${
                  activeLink === link ? 'text-white font-semibold bg-white/[0.08]' : 'text-white/80 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {link}
              </li>
            ))}
          </ul>
          
          {/* Mobile User Section */}
          {user ? (
            <div className="px-5 pt-2.5 pb-4 border-t border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#6ea8fe] flex items-center justify-center">
                  <span className="text-[16px] font-bold text-[#134686]">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[12px] text-white/50">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 text-[13.5px] font-semibold py-2.5 rounded-md hover:bg-red-500/30 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-5 pt-2.5 pb-4">
              <Link 
                to="/sign"
                className="block w-full text-center bg-white/10 border border-white/25 text-white text-[13.5px] font-semibold py-2.5 rounded-md hover:bg-white/20 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}

          <div className="px-5 pt-2.5 pb-4">
            <button className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-white text-[13.5px] font-semibold py-2.5 rounded-md hover:bg-white/20 transition-all cursor-pointer">
              ✨ AI Movie Match
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
