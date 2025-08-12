import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MeshStandardNodeMaterial, WebGPURenderer } from "three/webgpu";
import { uniform, float, color } from "three/tsl";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      // ライト
      const ambient = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambient);

      const dir = new THREE.DirectionalLight(0xffffff, 1.2);
      dir.position.set(3, 3, 3);
      scene.add(dir);

      const geometry = new THREE.BoxGeometry(2, 2, 2);
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const material = new MeshStandardNodeMaterial();
      material.colorNode = uniform(material.color).mul(color(1.0, 0, 0.0));
      material.roughnessNode = float(0.2);
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 5;

      const frame = () => {
        renderer.render(scene, camera);
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
      <p>NodeMaterialテスト</p>
      <canvas ref={canvasRef} width={500} height={500}></canvas>
    </>
  );
}

export default App;
