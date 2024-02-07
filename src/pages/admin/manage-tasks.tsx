import { $Enums } from "@prisma/client";
import { useSession } from "next-auth/react";
import UnAuthorized from "~/components/unauthorized";
import Layout from "../_layout";
import CreateTask from "~/components/createTask";
import { getServerAuthSession } from "~/server/auth";
import { GetServerSideProps } from "next";

import {
  getAdminSocietyList,
  getAllSocieties,
} from "~/server/api/routers/admin";

export type Societies = {
  id: number;
  name: string;
  image: string | null;
};

export default function ManageTasks({
  joinedSocieties,
  allSocieties,
}: {
  joinedSocieties: Societies[];
  allSocieties: Societies[];
}) {
  const { data: session, update: update } = useSession({ required: true });

  if (!session) {
    return <>Loading...</>;
  } else if (session.user.type !== $Enums.UserType.ADMIN) {
    return <UnAuthorized />;
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
        <CreateTask
          handleChange={handleChange}
          joinedSocieties={joinedSocieties}
          allSocieties={allSocieties}
        />
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const joinedSocieties = await getAdminSocietyList(session.user.id);
  const allSocieties = await getAllSocieties();

  if (!joinedSocieties) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      joinedSocieties: joinedSocieties.societies,
      allSocieties: allSocieties,
    },
  };
};
