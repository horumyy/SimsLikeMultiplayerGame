import { useAtom } from "jotai";
import * as THREE from "three";
import { mapAtom } from "../components/SocketManager";

const useGrid = () => {
  const [map] = useAtom(mapAtom);
  console.log(map, "map");
  const gridToVector3 = (gridPosition, width = 1, height = 1) => {
    return new THREE.Vector3(
      width / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
      0,
      height / map.gridDivision / 2 + gridPosition[1] / map.gridDivision,
    );
  };

  const vector3ToGrid = (vector3) => {
    return [
      Math.floor(vector3.x * map.gridDivision),
      Math.floor(vector3.z * map.gridDivision),
    ];
  };
  return {
    vector3ToGrid,
    gridToVector3,
  };
};

export default useGrid;
