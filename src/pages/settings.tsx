import JoinSociety from "~/components/joinSociety";
import LeaveSociety from "~/components/leaveSociety";
import { useSession } from "next-auth/react";
import ChangeName from "~/components/changeName";
import Layout from "~/pages/_layout";
import ProfileCard from "~/components/ProfileCard";

const Settings = () => {
  const { data: session, update: update } = useSession({ required: true });

  if (!session) {
    return <>Loading...</>;
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
          />
        </div>
      </main>
    </Layout>
  );
};

export default Settings;

/**
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

  return {
    props: { session },
  };
};
*/
