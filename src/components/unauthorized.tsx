import { Link } from "@nextui-org/react";
import Layout from "~/pages/_layout";

type Props = {
  permissionsType: "ADMIN" | "PARTICIPANT";
};
export default function UnAuthorized({ permissionsType }: Props) {
  return (
    <Layout>
      <main className="flex flex-col items-center gap-4 px-4 text-center text-xl">
        <h1 className="pt-6 text-3xl font-bold">Unauthorised</h1>
        <div>
          You are do not have the {permissionsType} permissions to view this
          page.
        </div>
        {permissionsType === "ADMIN" && (
          <div>
            If you are an <span className="font-bold">Exec</span>, please join a
            society through the{" "}
            <Link href="/settings" className="text-xl font-bold">
              Settings page
            </Link>
            .
          </div>
        )}
        {permissionsType === "PARTICIPANT" && (
          <div>
            If you are a <span className="font-bold">Participant</span>, and
            want to play quests please leave all societies through the{" "}
            <Link href="/settings" className="text-xl font-bold">
              Settings page
            </Link>
            .
          </div>
        )}
      </main>
    </Layout>
  );
}
