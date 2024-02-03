import { Link } from "@nextui-org/react";
import Layout from "~/pages/_layout";

export default function UnAuthorized() {
  return (
    <Layout>
      <main className="flex flex-col text-center items-center gap-4 px-4 text-3xl">
        <div>You are do not have the Admin permissions to view this page.</div>
        <div>
          If you are an <span className="font-bold">Exec</span>, please join a
          society through the{" "}
          <Link href="/settings" className="text-3xl font-bold">
            Settings page
          </Link>
          .
        </div>
      </main>
    </Layout>
  );
}
