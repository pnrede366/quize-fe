"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { DIFFICULTY_OPTIONS } from "./difficultyConstants";

export default function DifficultySelector({ isOpen, onClose, onSelect, topic }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleConfirm = () => {
    if (selected && onSelect) {
      onSelect(selected);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Difficulty Level">
      <div className="space-y-4 sm:space-y-6">
        {topic && (
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 sm:p-4">
            <p className="text-xs text-zinc-400 sm:text-sm">Quiz Topic:</p>
            <p className="text-base font-semibold text-zinc-100 sm:text-lg">{topic}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option.range}
              onClick={() => handleSelect(option)}
              className={`group relative overflow-hidden rounded-lg border-2 bg-gradient-to-br p-4 text-left transition-all duration-300 sm:rounded-xl sm:p-6 ${
                option.color
              } ${option.border} ${option.hover} ${
                selected?.range === option.range
                  ? "scale-[1.02] shadow-xl ring-2 ring-offset-1 ring-offset-zinc-900 sm:scale-105 sm:ring-offset-2"
                  : "hover:scale-[1.02] sm:hover:scale-105"
              }`}
            >
              <div className="relative z-10">
                <div className="mb-2 flex items-center justify-between sm:mb-3">
                  <span className="text-3xl sm:text-4xl">{option.icon}</span>
                  {selected?.range === option.range && (
                    <span className="text-xl sm:text-2xl">✓</span>
                  )}
                </div>
                <h3 className={`mb-1 text-xl font-bold sm:text-2xl ${option.text}`}>
                  {option.label}
                </h3>
                <p className="text-xs text-zinc-300 sm:text-sm">{option.description}</p>
              </div>
              
              {/* Animated background effect */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className={`absolute inset-0 bg-gradient-to-tr ${option.color}`} />
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
            className="w-full sm:flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="lg"
            className="w-full sm:flex-1"
            disabled={!selected}
          >
            Generate Quiz
          </Button>
        </div>
      </div>
    </Modal>
  );
}

