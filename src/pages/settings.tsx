import JoinSociety from "~/components/joinSociety";
import LeaveSociety from "~/components/leaveSociety";
import { useSession } from "next-auth/react";
import ChangeName from "~/components/changeName";
import Layout from "~/pages/_layout";
import ProfileCard from "~/components/ProfileCard";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { Society, getAdminSocietyList } from "~/server/api/routers/admin";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";

const Settings = ({ joinedSocieties }: { joinedSocieties: Society[] }) => {
  const { data: session, update: update } = useSession({ required: true });
  const [joined, setJoined] = useState(joinedSocieties);
  const utils = api.useUtils();

  if (!session) {
    return <>Loading...</>;
  }

  const handleChange = () => {
    // give it half a second for the db to update when the user updates anything
    setTimeout(async () => {
      update();
      const newJoined = await utils.admin.getAdminSocietyList
        .fetch()
        .catch((error) => {
          /**nothing*/
        });
      if (!newJoined) {
        return;
      }
      setJoined(newJoined.societies);
    }, 500);
  };

  return (
    <Layout padding>
      <main className="flex flex-col items-center">
        <h1 className="pt-6 text-3xl font-bold">Settings</h1>
        <div className="flex w-full flex-col items-center space-y-8 pt-14">
          <ProfileCard
            name={session.user.name ?? undefined}
            image={session.user.image ?? undefined}
          />
          <ChangeName
            currentName={session?.user.name ?? ""}
            handleChange={handleChange}
          />
          <JoinSociety handleChange={handleChange} />
          <LeaveSociety
            isAuthorized={session?.user.type === "ADMIN"}
            handleChange={handleChange}
            joinedSocieties={joined}
          />
        </div>
      </main>
    </Layout>
  );
};

export default Settings;

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
    },
  };
};
