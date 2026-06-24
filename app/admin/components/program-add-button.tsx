import React from "react";

type AddBtnProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

function ProgramAddButton({ isOpen, setIsOpen }: AddBtnProps) {
  return (
    <div className="flex w-full justify-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:outline-none"
      >
        Add Program
      </button>
    </div>
  );
}

export default ProgramAddButton;
