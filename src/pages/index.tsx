import { Button, Card, CardBody } from "@nextui-org/react";
import Layout from "./_layout";
import { GiftIcon, TrophyIcon, UserIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { useSession } from "next-auth/react";
import { DashboardIcon } from "@radix-ui/react-icons";

const Index = () => {
  const { data: session } = useSession();
  return (
    <Layout>
      <main className="flex flex-col items-center px-4">
        <Image
          src="/MegaLAN_Logo_Horizontal_Black.png"
          alt="MegaLAN: UNSW's Gaming Convention"
          width={640}
          height={72}
          className="w-full max-w-96 px-6 pt-6"
          priority
        />
        <p className="w-full max-w-96 px-8 pt-16 text-center text-foreground/60">
          Win Prizes by Completing Quests at MegaLAN
        </p>
        <div className="flex w-full max-w-96 flex-col space-y-4 px-8 pt-8">
          {session ? (
            <Button
              as={Link}
              href="/api/auth/signin"
              color="primary"
              startContent={<DashboardIcon className="h-4 w-4" />}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              as={Link}
              href="/api/auth/signin"
              color="primary"
              startContent={<UserIcon className="h-4 w-4" />}
            >
              Log In or Register
            </Button>
          )}
          <Button
            as={Link}
            href="/leaderboard"
            color="primary"
            startContent={<TrophyIcon className="h-4 w-4" />}
          >
            Leaderboard
          </Button>
          <Button
            as={Link}
            href="/prizes"
            color="primary"
            startContent={<GiftIcon className="h-4 w-4" />}
          >
            Prizes
          </Button>
        </div>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  return {
    props: {
      session,
    },
  };
};

export default Index;
