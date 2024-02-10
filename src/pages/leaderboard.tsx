import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Avatar,
} from "@nextui-org/react";
import StatusProgressBar from "~/components/statusProgressBar";

import DefaultIcon from "../../public/default.png";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import {
  type LeaderboardEntry,
  getLeaderboard,
  getStatus,
  StatusInfo,
} from "~/server/api/routers/progress";

type User = {
  id: number;
  name: string | null;
  image: string | null;
  points: number;
};

type Props = {
  leaderboard: LeaderboardEntry[];
  status: StatusInfo;
};

export default function Leaderboard({ leaderboard, status }: Props) {
  const renderCell = React.useCallback(
    (index: number, user: User, columnKey: React.Key) => {
      switch (columnKey) {
        case "index":
          return <p className="text-center">{index}</p>;
        case "name":
          return (
            <div className="flex flex-row items-center space-x-4">
              <div className="">
                <Avatar
                  size="sm"
                  src={user.image ? user.image : DefaultIcon.src}
                />
              </div>
              <p>{user.name}</p>
            </div>
          );
        case "points":
          return <p className="text-center">{Number(user.points)}</p>;
        default:
          return user[columnKey as keyof typeof user];
      }
    },
    [],
  );

  return (
    <main className="flex h-screen flex-col justify-start overflow-y-clip p-6">
      <div className="justify-top container flex h-full w-full flex-col items-center gap-4 space-y-2">
        <h1>Leaderboards</h1>
        <StatusProgressBar status={status} />
        <div className="flex h-full w-full overflow-y-scroll">
          <Table
            aria-label="Example table with custom cells"
            isHeaderSticky={true}
            isStriped={true}
            classNames={{ wrapper: "p-4 pt-0 shadow-none" }}
          >
            <TableHeader
              columns={[
                { key: "index", label: "Rank" },
                { key: "name", label: "User" },
                { key: "points", label: "Points" },
              ]}
            >
              {(column) =>
                column.key === "index" ? (
                  <TableColumn key={column.key}>
                    <p className="text-center">{column.label}</p>
                  </TableColumn>
                ) : (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )
              }
            </TableHeader>
            <TableBody>
              {leaderboard.map((item, index) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(index + 1, item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

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

  const leaderboard = await getLeaderboard();
  const status = await getStatus(session.user.id);

  return {
    props: {
      leaderboard: JSON.parse(
        JSON.stringify(
          leaderboard,
          (_key, value) =>
            typeof value === "bigint" ? value.toString() : value, // return everything else unchanged
        ),
      ),
      status,
    },
  };
};
