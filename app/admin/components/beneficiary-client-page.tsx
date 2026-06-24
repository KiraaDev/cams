"use client";

import { useState } from "react";
import BeneficiaryRecords from "../components/beneficiary-records";
import BeneficiaryModal from "../components/beneficiary-modal";
import EditBeneficiaryModal from "./edit-beneficiary-modal";

export default function BeneficiaryClient({
  beneficiaries,
  assistanceCategories,
}: any) {
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const handleEdit = (b: any) => {
    setSelected(b);
    
    setOpen(true);
  };

  return (
    <>
      <div className="flex justify-end">
        <BeneficiaryModal assistanceCategories={assistanceCategories} />
      </div>

      <BeneficiaryRecords data={beneficiaries} onEdit={handleEdit} />

      {open && selected && (
        <EditBeneficiaryModal
          beneficiary={selected}
          assistanceCategories={assistanceCategories}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
        />
      )}
    </>
  );
}