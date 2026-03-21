import { Heart } from 'lucide-react';

const Footer = () => {
  const discoverLinks = ['Trending Now', 'New Releases', 'Top Rated', 'Anime Hub', 'Arcade Games', 'Coming Soon'];
  const accountLinks  = ['My Watchlist', 'Watch History', 'AI Movie Match', 'Preferences', 'Notifications', 'Sign In'];
  const companyLinks  = ['About Us', 'Blog', 'Careers', 'Press Kit', 'Advertise', 'Contact'];

  return (
    <footer className="bg-[#0a1530] border-t border-white/[0.07]">
      <div className="px-[4%] pt-14">

        {/* Newsletter Banner */}
        <div className="flex items-center justify-between gap-6 flex-wrap bg-[#134686]/18 border border-[#6ea8fe]/15 rounded-xl px-8 py-7 mb-12">
          <div>
            <p className="text-[16px] font-bold text-white mb-1">Stay in the loop</p>
            <p className="text-[13px] text-white/42">Get notified when new movies drop — no spam, ever.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-white/[0.06] border border-white/12 text-white text-[13px] placeholder-white/30 px-4 py-2.5 rounded-[7px] outline-none focus:border-[#6ea8fe]/45 w-60 transition-colors"
            />
            <button className="bg-[#134686] hover:bg-[#1a5aaa] text-white text-[13px] font-semibold px-5 py-2.5 rounded-[7px] cursor-pointer transition-colors whitespace-nowrap border-none">
              Subscribe
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>

          {/* Brand Column */}
          <div className="col-span-full md:col-span-1" style={{ gridColumn: 'span 2' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[20px]">🎬</span>
              <span className="text-[22px] font-bold text-white tracking-[0.5px]">WatchWise</span>
            </div>
            <p className="text-[13px] text-white/42 leading-[1.75] max-w-[280px] mb-6">
              Your AI-powered guide to movies, shows, and anime. Discover what to watch next — personalized just for you.
            </p>
            {/* Socials */}
            <div className="flex gap-2.5">
              {[
                { label: 'X', icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>, filled: true },
                { label: 'Instagram', icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>, filled: false },
                { label: 'YouTube', icon: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></>, filled: false },
              ].map(({ label, icon, filled }) => (
                <button
                  key={label}
                  title={label}
                  className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#6ea8fe]/15 hover:border-[#6ea8fe]/35 hover:text-[#6ea8fe] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {icon}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {[
            { title: 'Discover', links: discoverLinks },
            { title: 'Account',  links: accountLinks  },
            
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-[11px] font-bold tracking-[1.8px] uppercase text-[#6ea8fe] mb-[18px]">{title}</p>
              <div className="flex flex-col gap-[11px]">
                {links.map(link => (
                  <a
                    key={link}
                    className="text-[13px] text-white/45 cursor-pointer hover:text-white hover:pl-1 transition-all no-underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.07] mt-12" />

        {/* Bottom Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 py-5">
          <div className="flex flex-col gap-2">
            <p className="text-[12.5px] text-white/30">
              © 2025 <span className="text-white/50">WatchWise</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-5 flex-wrap">
              {['Privacy Policy', 'Terms of Service', 'Cookie Preferences', 'Accessibility'].map((item, i, arr) => (
                <span key={item} className="flex items-center gap-5">
                  <a className="text-[12px] text-white/30 hover:text-white/65 cursor-pointer transition-colors no-underline">{item}</a>
                  {i < arr.length - 1 && <span className="w-[3px] h-[3px] bg-white/15 rounded-full" />}
                </span>
              ))}
            </div>
          </div>

          {/* Dev Credit */}
          <div className="flex items-center gap-2 text-[12.5px] text-white/30">
            <span>Crafted with</span>
            <Heart size={13} fill="#e55" stroke="none" />
            <span>by</span>
            <div className="flex items-center gap-1.5 bg-[#6ea8fe]/[0.08] border border-[#6ea8fe]/20 px-3 py-1 rounded-full text-white/55 text-[12px] font-medium hover:bg-[#6ea8fe]/14 hover:border-[#6ea8fe]/35 transition-all cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6ea8fe] flex-shrink-0" />
              Developed by <span className="font-bold text-[#6ea8fe] ml-1">Hammad</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;