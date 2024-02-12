import Layout from "./_layout";
import Prize0 from "../../public/prizes/aourus_motherboard.png";
import Prize1 from "../../public/prizes/aourus_chibi.webp";
import Prize2 from "../../public/prizes/aorus_pens.webp";

import { Image } from "@nextui-org/react";

const prizes = ["z790 AORUS ELITE AX Motherboard", "AOURUS Chibi", "AORUS Pens"];

export default function Prizes() {
  return (
    <Layout padding>
      <div className="flex flex-col">
        <h1 className="px-4 text-3xl font-bold">Prizes</h1>
        <div className="p-4">
          <h2 className="text-xl font-bold">{prizes[0]}</h2>
          <Image className="w-screen" src={Prize0.src} />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold">{prizes[1]}</h2>
          <Image className="w-screen" src={Prize1.src} />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold">{prizes[2]}</h2>
          <Image className="w-screen" src={Prize2.src} />
        </div>
      </div>
    </Layout>
  );
}
