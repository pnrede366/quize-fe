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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl sm:rounded-2xl">
          {title && (
            <div className="border-b border-zinc-800/50 px-4 py-4 sm:px-8 sm:py-6">
              <h2 className="text-xl font-bold text-zinc-100 sm:text-2xl">{title}</h2>
            </div>
          )}
          <div className="p-4 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

