import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { Environment } from "@react-three/drei";
import { Label } from "semantic-ui-react";

import { useLayoutEffect } from "react";

type Props = {
  fileUrl: string;
  fileName: string;
};

const loader = new GLTFLoader();
loader.register((parser) => {
  return new VRMLoaderPlugin(parser);
});

const useWindowSize = (): number[] => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export function GltfCanvas({ fileUrl, fileName }: Props) {
  const gltfCanvasParentRef = useRef<HTMLDivElement>(null);
  const [canvasWidthAndHeight, setCanvasWidthAndHeight] = useState<number>(0);
  const windowSize = useWindowSize();
  const [gltf, setGltf] = useState<GLTF>();

  useEffect(() => {
    if (gltfCanvasParentRef.current?.offsetWidth) {
      setCanvasWidthAndHeight(gltfCanvasParentRef.current.offsetWidth);
    }

    console.log("start loading");
    const loader = new GLTFLoader();
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });

    loader.load(fileUrl, (tmpGltf) => {
      setGltf(tmpGltf);
    });
  }, [windowSize, fileUrl]);

  return (
    <div
      ref={gltfCanvasParentRef}
      style={{ height: `${canvasWidthAndHeight}px` }}
    >
      <Label content={`Previewing ${fileName}`}></Label>
      <Canvas
        frameloop="demand"
        camera={{ fov: 20, near: 0.1, far: 300, position: [0, 1, -11] }}
        flat
      >
        <Suspense>
          <directionalLight position={[1, 1, -1]} color={"0xFFFFFF"} />
          <>{gltf ? <primitive object={gltf.scene} /> : <></>}</>
          <Environment preset="sunset" background />
          <color attach="background" args={["#f7f7f7"]} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping={false}
          />
          <gridHelper />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default GltfCanvas;
