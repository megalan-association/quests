import Image from "next/image";
import React, { useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
import MegaLanMap from "../../public/temptemptmep.jpg";
import MegaLanMap2 from "../../public/default.png";
import Layout from "./_layout";
import { Button } from "@nextui-org/react";

export default function Map() {
  const [mapSwitch, setMapSwitch] = useState(true);
  return (
    <Layout>
      <TransformWrapper initialScale={1} centerOnInit>
        {({ resetTransform }) => (
          <React.Fragment>
            <div className="mt-[-2rem]">
              <div className="absolute z-10 flex flex-row justify-start space-x-4 p-4 align-middle">
                <Button
                  className="bg-primary-foreground"
                  variant="bordered"
                  color="danger"
                  onClick={() => resetTransform()}
                >
                  Reset
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    setMapSwitch(true);
                    resetTransform();
                  }}
                >
                  Ground Floor
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    setMapSwitch(false);
                    resetTransform();
                  }}
                >
                  Floor 1
                </Button>
              </div>
              <TransformComponent>
                <div className="relative z-0 aspect-square h-[86vh] w-screen">
                  <Image
                    className="object-contain"
                    fill
                    src={mapSwitch ? MegaLanMap.src : MegaLanMap2.src}
                    alt="MegaLan Map"
                    priority={true}
                  />
                </div>
              </TransformComponent>
            </div>
          </React.Fragment>
        )}
      </TransformWrapper>
    </Layout>
  );
}
