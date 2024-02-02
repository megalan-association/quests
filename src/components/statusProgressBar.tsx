import { Progress } from "@nextui-org/react";

export default function StatusProgressBar() { 
    return (
        <div className="flex flex-col gap-6 w-full max-w-sm">
            <Progress size="lg" aria-label="Loading..." value={40} />
        </div> 
    )
}