import React from 'react'

type AddBtnProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
function ApplicationAddButton({ isOpen, setIsOpen }: AddBtnProps) {
  return (
    <div className="flex justify-end w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        Add Application
      </button>
    </div>
  )
}

export default ApplicationAddButton