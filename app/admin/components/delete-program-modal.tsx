"use client";

import { useState, useTransition } from "react";

import { deleteProgram } from "../program/action";

type ProgramDeleteTarget = {
  id: number;
  program_name: string;
};

type DeleteProgramModalProps = {
  program: ProgramDeleteTarget;
  onClose: () => void;
  onDeleted?: () => Promise<void> | void;
};

export default function DeleteProgramModal({
  program,
  onClose,
  onDeleted,
}: DeleteProgramModalProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = () => {
    setErrorMessage(null);

    startTransition(async () => {
      const result = await deleteProgram(program.id);

      if (result.success) {
        if (onDeleted) {
          await onDeleted();
        }
        onClose();
      } else {
        setErrorMessage(result.error || "Failed to delete target record.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 duration-150 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-red-50 p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900">
                Delete Program
              </h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to permanently remove this record? This
                action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="border-y border-slate-100 bg-slate-50 px-6 py-4">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Target Record
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {program.program_name}
          </p>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-medium text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 bg-white px-6 py-4">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50 focus:outline-none"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </span>
            ) : (
              "Delete Record"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
