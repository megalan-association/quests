import { $Enums } from "@prisma/client";
import { useSession } from "next-auth/react";
import UnAuthorized from "~/components/unauthorized";
import Layout from "./_layout";
import CreateTask from "~/components/createTask";

export default function ManageTasks() {
  const { data: session, update: update } = useSession({ required: true });

  if (!session) {
    return <>Loading...</>;
  } else if (session.user.type !== $Enums.UserType.ADMIN) {
    return <UnAuthorized />
  }

  const handleChange = async () => {
    // give it half a second for the db to update when the user updates anything
    setTimeout(() => {
      update();
    }, 500);
  };

  return (
    <Layout>
      <main className="flex flex-col items-center">
        <CreateTask handleChange={handleChange}/>
      </main>
    </Layout>
  ) 
}