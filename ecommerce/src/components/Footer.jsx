export default function Footer() {
    return (
        <footer className="py-10 mt-10 bg-slate-900 text-slate-400">
            <div className="flex flex-col items-center max-w-7xl px-4 mx-auto text-center gap-4">
                <div className="text-2xl font-black tracking-tight text-white">SastaHai</div>

                <p className="mt-4 text-sm font-medium">
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