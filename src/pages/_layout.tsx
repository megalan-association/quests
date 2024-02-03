import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import Header from "../layout/Header";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const { data: session } = useSession();

  return (
    <main className="flex h-full min-h-screen w-full flex-col justify-between">
      <div className="">
        <Header session={session} />
        <div className="py-8">{children}</div>
      </div>
      {/* <Footer /> */}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  return {
    props: { session },
  };
};

export default Layout;
