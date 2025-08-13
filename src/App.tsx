import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MeshStandardNodeMaterial, WebGPURenderer } from "three/webgpu";
import {
  float,
  color,
  texture,
  uv,
  time,
  vec2,
  oscSine,
  uniform,
  grayscale,
} from "three/tsl";

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

      // テクスチャ読み込み、タイリング有効化
      const albedoTex = new THREE.TextureLoader().load("/test-img.png");
      albedoTex.wrapS = albedoTex.wrapT = THREE.RepeatWrapping;
      // カラースペースをSRGBに設定
      albedoTex.colorSpace = THREE.SRGBColorSpace;

      // 時間を0.5倍にして、uvをアニメーションさせる
      const scaledTime = time.mul(0.5);
      const uv0 = uv();
      const animateUv = vec2(uv0.x.add(oscSine(scaledTime)), uv0.y);

      const material = new MeshStandardNodeMaterial();

      const myMap = texture(albedoTex, animateUv).rgb;
      const myColor = uniform(new THREE.Color(0x0066ff));

      const desaturatedMap = grayscale(myMap.rgb);

      const finalColor = desaturatedMap.add(myColor);

      material.colorNode = finalColor;
      material.roughnessNode = float(0.2);
      const cube = new THREE.Mesh(geometry, material);
      cube.rotation.x = Math.PI / 4;
      cube.rotation.y = Math.PI / 4;
      scene.add(cube);

      camera.position.z = 5;

      const frame = () => {
        renderer.render(scene, camera);
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
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
