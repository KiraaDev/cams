"use client";

import { useState } from "react";
import BeneficiaryRecords from "../components/beneficiary-records";
import BeneficiaryModal from "../components/beneficiary-modal";
import EditBeneficiaryModal from "./edit-beneficiary-modal";
import DeleteBeneficiaryModal from "./delete-beneficiary-modal";
import { deleteBeneficiary } from "../beneficiary/actions"; // Assuming this exists

export default function BeneficiaryClient({
  beneficiaries,
  assistanceCategories,
}: any) {
  const [selected, setSelected] = useState<any | null>(null);
  
  // Track which variant modal type is open
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);

  const handleEdit = (b: any) => {
    setSelected(b);
    setModalType("edit");
  };

  const handleDeleteTrigger = (b: any) => {
    setSelected(b);
    setModalType("delete");
  };

  const closeModal = () => {
    setSelected(null);
    setModalType(null);
  };

  return (
    <>
      <div className="flex justify-end">
        <BeneficiaryModal assistanceCategories={assistanceCategories} />
      </div>

      {/* Make sure to pass onDeleteTrigger down if your list handles it */}
      <BeneficiaryRecords 
        data={beneficiaries} 
        onEdit={handleEdit} 
        onDelete={handleDeleteTrigger} 
      />

      {/* EDIT MODAL */}
      {modalType === "edit" && selected && (
        <EditBeneficiaryModal
          beneficiary={selected}
          assistanceCategories={assistanceCategories}
          onClose={closeModal}
        />
      )}

      {/* DELETE MODAL */}
      {modalType === "delete" && selected && (
        <DeleteBeneficiaryModal
          beneficiary={selected}
          onClose={closeModal}
        />
      )}
    </>
  );
}