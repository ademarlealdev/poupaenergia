
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0F19] relative overflow-hidden border-t border-white/5 pt-12 pb-8 px-6 md:px-12 mt-auto">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto mb-6">
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo.svg" alt="EnergiaCerta Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-white tracking-tight">Energia<span className="text-primary">Certa</span></span>
          </div>
          <p className="text-gray-400 text-sm font-medium flex items-center gap-2 pl-1">
            Made in Portugal <span className="text-[10px] bg-[#2A1A35] text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20 uppercase tracking-wider font-bold">PT</span>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto h-px bg-white/5 mb-8"></div>

      {/* Bottom Section */}
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
        {/* Copyright */}
        <div className="order-3 md:order-1">
          © {new Date().getFullYear()} EnergiaCerta. Todos os direitos reservados.
        </div>

        {/* Legal Links */}
        <div className="flex gap-6 order-2 md:order-2">
          <Link to="#" className="hover:text-white transition-colors">Termos</Link>
          <Link to="#" className="hover:text-white transition-colors">Privacidade</Link>
          <Link to="#" className="hover:text-white transition-colors">Cookies</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 order-1 md:order-3">
          <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <span className="sr-only">LinkedIn</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
          </a>
          <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <span className="sr-only">Instagram</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 4.635c.636-.247 1.363-.416 2.427-.465C8.901 4.135 9.256 4.124 12.315 4.124h.63zm3.225 1.734c-2.42 0-2.715.01-3.768.058-1.048.048-1.62.213-2.003.362a2.98 2.98 0 00-1.085.706 2.98 2.98 0 00-.706 1.085c-.15.383-.314.955-.362 2.003-.048 1.053-.06 1.353-.06 3.77v.64c0 2.417.012 2.716.06 3.77.048 1.047.213 1.62.362 2.002.195.5.456.92.83 1.295.375.374.795.635 1.295.83.383.149.955.314 2.003.362 1.053.048 1.353.06 3.768.06h.633c2.416 0 2.715-.01 3.768-.058 1.047-.048 1.62-.213 2.002-.362.5-.195.92-.455 1.295-.83.375-.374.635-.794.83-1.295.149-.383.314-.955.362-2.003.048-1.053.06-1.352.06-3.768v-.633c0-2.416-.01-2.715-.058-3.768-.048-1.047-.213-1.62-.362-2.002a2.98 2.98 0 00-.83-1.295 2.98 2.98 0 00-1.295-.83c-.383-.149-.955-.314-2.002-.362-1.053-.048-1.352-.06-3.768-.06h-.633zM12 8.358a3.642 3.642 0 110 7.284 3.642 3.642 0 010-7.284zm0 1.944a1.697 1.697 0 100 3.395 1.697 1.697 0 000-3.395zM17.438 5.48a1.096 1.096 0 110 2.192 1.096 1.096 0 010-2.192z" /></svg>
          </a>
          <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <span className="sr-only">Twitter</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
