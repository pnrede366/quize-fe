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
      <div className="space-y-6">
        {topic && (
          <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 p-4">
            <p className="text-sm text-zinc-400">Quiz Topic:</p>
            <p className="text-lg font-semibold text-zinc-100">{topic}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option.range}
              onClick={() => handleSelect(option)}
              className={`group relative overflow-hidden rounded-xl border-2 bg-gradient-to-br p-6 text-left transition-all duration-300 ${
                option.color
              } ${option.border} ${option.hover} ${
                selected?.range === option.range
                  ? "scale-105 shadow-xl ring-2 ring-offset-2 ring-offset-zinc-900"
                  : "hover:scale-105"
              }`}
            >
              <div className="relative z-10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-4xl">{option.icon}</span>
                  {selected?.range === option.range && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
                <h3 className={`mb-1 text-2xl font-bold ${option.text}`}>
                  {option.label}
                </h3>
                <p className="mb-2 text-xs text-zinc-400">{option.range}</p>
                <p className="text-sm text-zinc-300">{option.description}</p>
              </div>
              
              {/* Animated background effect */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className={`absolute inset-0 bg-gradient-to-tr ${option.color}`} />
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={!selected}
          >
            Generate Quiz
          </Button>
        </div>
      </div>
    </Modal>
  );
}

