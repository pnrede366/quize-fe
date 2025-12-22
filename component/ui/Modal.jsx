"use client";

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in duration-300">
        <div className="rounded-2xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl shadow-2xl">
          {title && (
            <div className="border-b border-zinc-800/50 px-8 py-6">
              <h2 className="text-2xl font-bold text-zinc-100">{title}</h2>
            </div>
          )}
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

