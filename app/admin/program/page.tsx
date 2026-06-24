import { getPrograms } from "./action";
import Programs from "./pages";

export default async function ProgramPage() {

  const programs = await getPrograms();
  
  return (
    <>
    <Programs />
    </>
  );
}
