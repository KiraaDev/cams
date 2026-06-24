export default function EditButton({ beneficiary, onEdit }: any) {
  return (
    <button onClick={() => onEdit(beneficiary)}>
      Edit
    </button>
  );
}