import React from "react";
import { useGLTF } from "@react-three/drei";
import { useAtom } from "jotai";
import { mapAtom } from "./SocketManager";
import { SkeletonUtils } from "three-stdlib";

const Item = ({ item }) => {
  const { name, gridPosition, size, rotation } = item;
  const { scene } = useGLTF(`/models/${name}.glb`);
  const [map] = useAtom(mapAtom);

  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);

  return (
    <primitive
      object={clone}
      position={[
        size[0] / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
        0,
        size[0] / map.gridDivision / 2 + gridPosition[1] / map.gridDivision,
      ]}
      rotation-y={((rotation || 0) * Math.PI) / 2}
    />
  );
};

export default Item;
