import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Fixed Toast Container */}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
                {toasts.map((toast) => {
                    const bgColor =
                        toast.type === 'success' ? 'bg-slate-900 border-emerald-500 text-white' :
                        toast.type === 'error' ? 'bg-slate-900 border-rose-500 text-white' :
                        toast.type === 'warning' ? 'bg-slate-900 border-amber-500 text-white' :
                        'bg-slate-900 border-indigo-500 text-white';

                    const accentColor =
                        toast.type === 'success' ? 'text-emerald-400' :
                        toast.type === 'error' ? 'text-rose-400' :
                        toast.type === 'warning' ? 'text-amber-400' :
                        'text-indigo-400';

                    return (
                        <div
                            key={toast.id}
                            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-slide-up ${bgColor}`}
                        >
                            <span className={`text-base font-bold ${accentColor}`}>
                                {toast.type === 'success' && '✓'}
                                {toast.type === 'error' && '✕'}
                                {toast.type === 'warning' && '!'}
                                {toast.type === 'info' && 'ℹ'}
                            </span>
                            <div className="flex-1 text-sm font-medium leading-snug">
                                {toast.message}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-slate-400 hover:text-white transition text-xs font-bold ml-2"
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};