import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MeshStandardNodeMaterial, WebGPURenderer } from "three/webgpu";
import { float, uniform, uv, oscSine } from "three/tsl";

export default function RasenSphere() {
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

      material.colorNode = finalColor;

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
      <p>NodeMaterialテスト</p>
      <canvas ref={canvasRef} width={500} height={500}></canvas>
    </>
  );
}

{
  /* <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.webgpu.min.js",
      "three/webgpu": "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.webgpu.min.js",
      "three/tsl": "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.tsl.min.js",
      "tsl-textures": "https://cdn.jsdelivr.net/gh/boytchev/tsl-textures/dist/tsl-textures.js"
    }
  }
</script>

import * as THREE from "three";
import { zebraLines } from "tsl-textures";
model.material.colorNode = zebraLines ( {
	scale: 2,
	thinness: 0.5,
	phi: 0,
	theta: 0,
	color: new THREE.Color(0),
	background: new THREE.Color(16777215),
	flat: 0
} ); */
}
