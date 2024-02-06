import { useState } from "react";

interface Props {
  text: string;
}

const SeeMore: React.FC<Props> = ({ text }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {text.length > 100 ? (
        <p>
          {text.substring(0, 100)}
          {open && text.substring(100)}
          <button
            onClick={() => setOpen(!open)}
            className="inline-block pl-1 text-blue-500 underline"
          >
            {!open ? "see more" : "see less"}
          </button>
        </p>
      ) : (
        <p>{text}</p>
      )}
    </>
  );
};
export default SeeMore;
