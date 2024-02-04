// Replace index.tsx with the contents of this file when ready.

import { Button, Card, CardBody, CardHeader } from "@nextui-org/react"
import Layout from "./_layout"
import { TrophyIcon } from "~/components/icons/TrophyIcon"
import { UserIcon } from "~/components/icons/UserIcon"
import { GiftIcon } from "~/components/icons/GiftIcon"
import Link from "next/link"

const Landing = () => {
  return (
    <Layout>
      <main className="p-2">
        <Card className="w-full md:w-[752px] mx-auto">
          <CardBody>
            <h1>MegaLAN logo here</h1>
            <p>Tagline here</p>
            <div className="text-center py-1">
              <Button
                as={Link}
                href="/api/auth/signin"
                color="primary"
                startContent={<UserIcon />}
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
                  startContent={<TrophyIcon />}
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
                  startContent={<GiftIcon />}
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