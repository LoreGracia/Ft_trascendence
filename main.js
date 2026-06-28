import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder } from "@babylonjs/core";

// 1. Coger el canvas del HTML
const canvas = document.getElementById("renderCanvas");

// 2. Crear el motor (engine), que conecta Babylon con el canvas
const engine = new Engine(canvas, true);

// 3. Crear la escena (el "escenario" donde viven todos los objetos)
const createScene = () => {
  const scene = new Scene(engine);

  // 4. Cámara: ArcRotateCamera orbita alrededor de un punto (ideal para inspeccionar un objeto, como un dado)
  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,   // alpha: ángulo horizontal de partida
    Math.PI / 2.5,  // beta: ángulo vertical de partida
    10,             // radio: distancia inicial al objetivo
    Vector3.Zero(), // objetivo: mira al origen (0,0,0)
    scene
  );
  camera.attachControl(canvas, true); // permite controlar la cámara con ratón/touch

  // 5. Luz: sin esto, todo se ve negro
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // 6. Nuestro primer objeto: un cubo (pronto será nuestro dado)
  const dado = MeshBuilder.CreateBox("dado", { size: 2 }, scene);

  return scene;
};

const scene = createScene();

// 7. Bucle de renderizado: redibuja la escena en cada frame (~60 veces por segundo)
engine.runRenderLoop(() => {
  scene.render();
});

// 8. Ajustar el canvas si cambia el tamaño de la ventana
window.addEventListener("resize", () => {
  engine.resize();
});