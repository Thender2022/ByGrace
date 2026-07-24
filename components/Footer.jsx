import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Benefits */}
          <div>
            <h4 className="text-xs font-light tracking-[0.2em] text-gray-900 uppercase mb-3">
              Plus
            </h4>
            <div className="space-y-2">
              <p className="text-gray-500 font-light text-sm">
                ✦ 100% secure checkout
              </p>
              <p className="text-gray-500 font-light text-sm">
                ✦ Premium quality products
              </p>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xs font-light tracking-[0.2em] text-gray-900 uppercase mb-3">
              Follow Us
            </h4>
            <div className="space-y-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gold-500 transition-colors font-light text-sm flex items-center gap-2"
              >
                <span>✦</span> Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gold-500 transition-colors font-light text-sm flex items-center gap-2"
              >
                <span>✦</span> YouTube
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-light tracking-[0.2em] text-gray-900 uppercase mb-3">
              Contact
            </h4>
            <p className="text-gray-500 font-light text-sm">
              support@skateshop.com
            </p>
          </div>
        </div>

        {/* Bottom Bar - Black line */}
        <div className="border-t border-black mt-8 pt-6 text-center">
          <p className="text-gray-400 font-light text-xs tracking-wider">
            © {new Date().getFullYear()} Skate Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}