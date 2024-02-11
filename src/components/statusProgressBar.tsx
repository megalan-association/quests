import { Progress } from "@nextui-org/react";
import type { StatusInfo } from "~/server/api/routers/progress";

type Props = {
  status: StatusInfo;
};

export default function StatusProgressBar({ status }: Props) {
  if (!status || !status.totalTasksPoints) {
    return <>Loading...</>;
  }

  const thresholds = {
    40: status.totalTasksPoints * 0.4,
    65: status.totalTasksPoints * 0.65,
    85: status.totalTasksPoints * 0.85,
    100: status.totalTasksPoints,
  };

  let milestoneEnd: number;

  const completedPoints = status.completedPoints ? status.completedPoints : 0;
  let milestoneStart = 0;

  if (completedPoints === 0) {
    milestoneEnd = thresholds[40];
  } else if (completedPoints > thresholds[85]) {
    milestoneStart = thresholds[85];
    milestoneEnd = thresholds[100];
  } else if (completedPoints > thresholds[65]) {
    milestoneStart = thresholds[65];
    milestoneEnd = thresholds[85];
  } else if (completedPoints > thresholds[40]) {
    milestoneStart = thresholds[40];
    milestoneEnd = thresholds[65];
  } else {
    // (completedPoints > 0) {
    milestoneEnd = thresholds[40];
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-2">
      <div className="flex flex-col text-center">
        <p className="text-2xl font-bold">{completedPoints}</p>
        <p className="">Total points!</p>
      </div>
      <div className="flex w-full flex-col space-y-2 align-middle">
        <div className="flex flex-row items-center justify-between align-bottom">
          <p className="font-bold">Progress</p>
          <p className="text-xs text-black/60">
            {milestoneEnd - completedPoints} pts to{" "}
            {Object.keys(thresholds).find(
              (key) =>
                thresholds[Number(key) as keyof typeof thresholds] ===
                milestoneEnd,
            )}
            % completion
          </p>
        </div>
        <Progress
          size="md"
          aria-label="Loading..."
          color="warning"
          isIndeterminate={!status}
          value={status.completedPoints ?? 0}
          maxValue={status.totalTasksPoints ?? 10}
        />
        <p className="text-xs text-black/60">
          Completed <span className="font-bold">{status.completedTasks}</span>{" "}
          out of <span className="font-bold">{status.totalTasks}</span> total
          tasks
        </p>
      </div>
    </div>
  );
}
