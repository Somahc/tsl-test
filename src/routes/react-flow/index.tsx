import style from "./index.module.scss";
import ReactFlowCanvas from "./ReactFlowCanvas";
import { ReactFlowProvider } from "@xyflow/react";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { MeshStandardNodeMaterial, WebGPURenderer } from "three/webgpu";
import { float, uniform, uv, oscSine } from "three/tsl";
import { normalizeReactFlowGraph } from "../../utils/ReactFlowGraphNormalizer";
import { GraphCompiler } from "../../utils/IR2TSL";

export default function ReactFlowPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<WebGPURenderer | null>(null);

  useEffect(() => {
    const setup = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const renderer = new WebGPURenderer({ canvas });
      rendererRef.current = renderer;

      if (!rendererRef.current) return;

      rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight);

      // ライト
      const ambient = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambient);

      const dir = new THREE.DirectionalLight(0xffffff, 1.2);
      dir.position.set(3, 3, 3);
      scene.add(dir);

      const geometry = new THREE.SphereGeometry(2, 32, 32);

      const material = new MeshStandardNodeMaterial();

      const baseColor = uniform(new THREE.Color(0x0066ff));

      const uv0 = uv();

      // 横線のストライプ模様を作成
      const stripeColor = uniform(new THREE.Color(0xffffff)); // 白いストライプ
      const stripePattern = oscSine(uv0.y.mul(20)).step(0.5); // Y座標で周期的なパターン

      // ストライプパターンをベースカラーに適用
      const finalColor = baseColor.mix(stripeColor, stripePattern.mul(1));

      const ir = normalizeReactFlowGraph(rfNodes, rfEdges);
      console.log("IR", ir);
      const compiler = new GraphCompiler(ir, material);
      compiler.compile();
      material.needsUpdate = true;

      // material.colorNode = finalColor;

      // 透明度を制御（白いストライプ部分を透明に）
      material.opacityNode = stripePattern.negate().add(1); // ストライプ部分を透明に
      material.transparent = true;

      material.roughnessNode = float(0.2);
      const cube = new THREE.Mesh(geometry, material);
      cube.rotation.x = Math.PI / 4;
      cube.rotation.y = Math.PI / 4;
      scene.add(cube);

      camera.position.z = 5;

      const frame = async () => {
        await rendererRef.current?.renderAsync(scene, camera);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    setup();
  }, []);
  return (
    <>
      <div className={style.container}>
        <h2>ノードベースエディタ</h2>
        <ReactFlowProvider>
          <ReactFlowCanvas />
        </ReactFlowProvider>
        <canvas ref={canvasRef} width={500} height={500} />
      </div>
    </>
  );
}

// ColorPickerとOutputのみが繋がれているケース
const rfNodes = [
  {
    id: "node-0",
    type: "colorPicker",
    position: {
      x: -49,
      y: -53,
    },
    data: {
      color: "#ffffff",
    },
    measured: {
      width: 254,
      height: 83,
    },
    selected: true,
    dragging: false,
  },
  {
    id: "node-1",
    type: "output",
    position: {
      x: -2,
      y: 69,
    },
    data: {
      color: "#ffffff",
    },
    measured: {
      width: 150,
      height: 85,
    },
    selected: false,
    dragging: false,
  },
];

// IR 型
// [
//   {
//       "id": "node-0",
//       "type": "colorPicker",
//       "params": {
//           "color": "#fff"
//       },
//       "inputs": {}
//   },
//   {
//       "id": "node-1",
//       "type": "output",
//       "params": {
//           "color": "#fff"
//       },
//       "inputs": {
//           "color_in": {
//               "node": "node-0",
//               "port": "color_out"
//           }
//       }
//   }
// ]

const rfEdges = [
  {
    source: "node-0",
    sourceHandle: "color_out",
    target: "node-1",
    targetHandle: "color_in",
    id: "xy-edge__node-0color_out-node-1color_in",
  },
];
