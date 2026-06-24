import Application from "./pages";
import { getApplications  } from "./action";

export default async function ApplicationPage() {
  const applications = await getApplications();

  return (
    <>
    <Application data={applications}/>
    </>
  );
}
