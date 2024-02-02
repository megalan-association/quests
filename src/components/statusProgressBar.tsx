import { Card, CardBody, Progress } from "@nextui-org/react";
import { api } from "~/utils/api";

export default function StatusProgressBar() { 
  const statusArgs = api.progress.status.useQuery(undefined, { retry: false, refetchOnWindowFocus: true });
  const status = statusArgs.isSuccess ? statusArgs.data : undefined;

  if (!status || !status.totalTasksPoints) {
    return <>Loading...</>
  }

  const thresholds = {
    40: status.totalTasksPoints * 0.40,
    65: status.totalTasksPoints * 0.65,
    85: status.totalTasksPoints * 0.85,
    100: status.totalTasksPoints,
  }

  let milestone: number;

  let completedPoints = status.completedPoints;

  if (!completedPoints) {
    milestone = thresholds[40];
    completedPoints = 0;
  } else if (completedPoints > thresholds[85]) {
      milestone = thresholds[100];
  } else if (completedPoints > thresholds[65]) {
    milestone = thresholds[85];
  } else if (completedPoints > thresholds[40]) {
    milestone = thresholds[65];
  } else { // (completedPoints > 0) {
    milestone = thresholds[40];
  }

  console.log(Object.entries(thresholds));

  return (
    <div className="flex flex-row items-center w-full max-w-sm">
      <div className="flex text-2xl font-bold p-2">
        {(completedPoints / status.totalTasksPoints) * 100}%
      </div>
      <div className="flex flex-col w-full align-middle">
        <div className="flex flex-row justify-between align-bottom items-center">
          <p className="font-bold">
            Progress
          </p>
          <p className="text-black/60 text-xs">
            {milestone - completedPoints} pts to { Object.keys(thresholds).find(key => thresholds[Number(key) as keyof typeof thresholds] === milestone)}%
          </p>
        </div>
        <Progress size="md" aria-label="Loading..." value={40} />
        <p className="text-black/60 text-xs">Completed <span className="font-bold">{status.completedTasks}</span> out of <span className="font-bold">{status.totalTasks}</span> total tasks</p>
      </div>
    </div> 
  )
}