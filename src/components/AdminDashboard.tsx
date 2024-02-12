import { Cog6ToothIcon, MapIcon, QrCodeIcon } from "@heroicons/react/16/solid";
import { Button, Card } from "@nextui-org/react";
import Link from "next/link";
import Layout from "~/pages/_layout";

const AdminDashboard: React.FC = () => {
  return (
    <Layout padding>
      <main className="flex w-full flex-col items-center">
        <h1 className="pt-6 text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex w-full max-w-96 flex-col space-y-4 px-8 pt-16">
          <Button
            as={Link}
            href="/admin/scan-qr-code"
            color="primary"
            startContent={<QrCodeIcon className="h-4 w-4" />}
            className=""
          >
            Scan QR Code
          </Button>
          <Button
            as={Link}
            href="/admin/manage-tasks"
            color="primary"
            startContent={<MapIcon className="h-4 w-4" />}
            className=""
          >
            Manage Tasks
          </Button>
          <Button
            as={Link}
            href="/settings"
            color="primary"
            startContent={<Cog6ToothIcon className="h-4 w-4" />}
            className=""
          >
            Settings
          </Button>
        </div>
      </main>
    </Layout>
  );
};

export default AdminDashboard;
