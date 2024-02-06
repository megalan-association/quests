// Replace index.tsx with the contents of this file when ready.

import { Button, Card, CardBody, CardHeader } from "@nextui-org/react"
import Layout from "./_layout"
import { GiftIcon, TrophyIcon, UserIcon } from "@heroicons/react/16/solid"
import Link from "next/link"
import Image from "next/image"

const Landing = () => {
  return (
    <Layout>
      <main className="p-2">
        <Card className="w-full md:w-[752px] mx-auto py-2">
          <CardBody>
            <Image 
              src="/MegaLAN_Logo_Horizontal_Black.png"
              alt="MegaLAN: UNSW's Gaming Convention"
              width={640}
              height={72}
              className="w-full sm:w-[640px] mx-auto"
            />
            <div className="text-center py-1">
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
            <div className="text-center py-1">
              <Button
                  as={Link}
                  href="/leaderboard"
                  color="primary"
                  startContent={<TrophyIcon className="h-4 w-4" />}
                  className="font-bold mr-2"
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
                  className="font-bold mr-1"
                >
                  Prizes
              </Button>
            </div>
          </CardBody>
        </Card>
      </main>
    </Layout>
  )
}

export default Landing