import { Cog6ToothIcon, MapIcon, QrCodeIcon } from "@heroicons/react/16/solid"
import { Button, Card } from "@nextui-org/react"
import Link from "next/link"

const AdminDashboard: React.FC = () => {
  return (
    <main>
      <Card className="w-full md:w-[768px] mx-auto p-2 text-center">
        <h1 className="font-bold text-4xl">Admin Dashboard</h1>
        <div className="py-2">
          <Button
            as={Link}
            href="/admin/scan-qr-code"
            color="primary"
            startContent={<QrCodeIcon className="w-4 h-4" />}
            className="w-64 font-bold"
          >
            Scan QR Code
          </Button>
        </div>
        <div className="py-2">
          <Button
            /*
              Uncomment below attributes and fill in href when page exists
              as={Link}
              href=""
            */
            color="primary"
            startContent={<MapIcon className="w-4 h-4" />}
            className="w-64 font-bold"
          >
            Manage Tasks
          </Button>
        </div>
        <div className="py-2">
          <Button
            as={Link}
            href="/settings"
            color="primary"
            startContent={<Cog6ToothIcon className="w-4 h-4" />}
            className="w-64 font-bold"
          >
            Settings
          </Button>
        </div>
      </Card>
    </main>
  )
}

export default AdminDashboard