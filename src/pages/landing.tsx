// Replace index.tsx with the contents of this file when ready.

import { Button, Card, CardBody } from "@nextui-org/react";
import Layout from "./_layout";
import { GiftIcon, TrophyIcon, UserIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import Image from "next/image";

const Landing = () => {
  return (
    <Layout>
      <main className="p-2">
        <Card className="mx-auto w-full py-2 md:w-[752px]">
          <CardBody>
            <Image
              src="/MegaLAN_Logo_Horizontal_Black.png"
              alt="MegaLAN: UNSW's Gaming Convention"
              width={640}
              height={72}
              className="mx-auto w-full sm:w-[640px]"
            />
            <div className="py-1 text-center">
              <Button
                as={Link}
                href="/api/auth/signin"
                color="primary"
                startContent={<UserIcon className="h-4 w-4" />}
                className="font-bold"
              >
                Log In or Register
              </Button>
            </div>
            <div className="py-1 text-center">
              <Button
                as={Link}
                href="/leaderboard"
                color="primary"
                startContent={<TrophyIcon className="h-4 w-4" />}
                className="mr-2 font-bold"
              >
                Leaderboard
              </Button>
              <Button
                /*
                    Uncomment below attributes and fill in href when page exists
                    as={Link}
                    href=""
                  */
                color="primary"
                startContent={<GiftIcon className="h-4 w-4" />}
                className="mr-1 font-bold"
              >
                Prizes
              </Button>
            </div>
          </CardBody>
        </Card>
      </main>
    </Layout>
  );
};

export default Landing;
