import URL_TEST from "../jsconfig";
export default function Footer() {
    return (
        <footer className="py-10 mt-10 bg-slate-900 text-slate-400">
            <div className="flex flex-col items-center max-w-7xl px-4 mx-auto text-center">
                
                {/* Brand Name */}
                <div className="text-2xl font-black tracking-tight text-white mb-6">SastaHai</div>

                {/* Professional Legal Links */}
                <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium">
                    <a 
                        href="/privacy.html" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-white hover:underline transition"
                    >
                        Privacy Policy
                    </a>
                    <a 
                        href="/policies.html" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-white hover:underline transition"
                    >
                        Terms & Conditions
                    </a>
                    <a 
                        href="mailto:crajnish425@gmail.com" 
                        className="hover:text-white hover:underline transition"
                    >
                        Contact Us
                    </a>
                </div>

                {/* Copyright Section with Top Border */}
                <p className="text-sm font-medium border-t border-slate-800 pt-6 w-full max-w-lg">
                    &copy; {new Date().getFullYear()} {' '}
                    <a 
                        href="https://rajnishsystems.in" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-white hover:underline transition"
                    >
                        rajnishsystems.in
                    </a>
                    . All rights reserved.
                </p>

            </div>
        </footer>
    );
}