import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';

window.addEventListener('DOMContentLoaded', async () => {
  const wrapper = document.querySelector('#webgl');
  const app = new ThreeApp(wrapper);
  // await app.load();
  app.render();
}, false);

class ThreeApp {
  /**
   * カメラ定義のための定数
   */
  static CAMERA_PARAM = {
    fovy: 60,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 150.0,
    position: new THREE.Vector3(0.0, 0.0, 15.0),
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };
  /**
   * レンダラー定義のための定数
   */
  static RENDERER_PARAM = {
    clearColor: 0x000000,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  /**
   * 平行光源定義のための定数
   */
  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1.0,
    position: new THREE.Vector3(1.0, 1.0, 1.0),
  };
  /**
   * アンビエントライト定義のための定数
   */
  static AMBIENT_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 0.1,
  };
  /**
   * マテリアル定義のための定数
   */
  static MATERIAL_PARAM = {
    color: 0xa00404,
  };

  renderer;         // レンダラ
  scene;            // シーン
  camera;           // カメラ
  directionalLight; // 平行光源（ディレクショナルライト）
  ambientLight;     // 環境光（アンビエントライト）
  material;         // マテリアル
  boxGeometry;
  box;
  coneGeometry;    // トーラスジオメトリ
  cone;
  coneArray;        // トーラスメッシュの配列
  cylinderGeometry;
  cylinder;
  wrapArray;
  controls;         // オービットコントロール
  axesHelper;       // 軸ヘルパー
  isDown;           // キーの押下状態用フラグ

  /**
   * コンストラクタ
   * @constructor
   * @param {HTMLElement} wrapper - canvas 要素を append する親要素
   */
  constructor(wrapper) {
    // レンダラー
    const color = new THREE.Color(ThreeApp.RENDERER_PARAM.clearColor);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(color);
    this.renderer.setSize(ThreeApp.RENDERER_PARAM.width, ThreeApp.RENDERER_PARAM.height);
    wrapper.appendChild(this.renderer.domElement);

    // シーン
    this.scene = new THREE.Scene();

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      ThreeApp.CAMERA_PARAM.fovy,
      ThreeApp.CAMERA_PARAM.aspect,
      ThreeApp.CAMERA_PARAM.near,
      ThreeApp.CAMERA_PARAM.far,
    );
    this.camera.position.copy(ThreeApp.CAMERA_PARAM.position);
    this.camera.lookAt(ThreeApp.CAMERA_PARAM.lookAt);

    // ディレクショナルライト（平行光源）
    this.directionalLight = new THREE.DirectionalLight(
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.color,
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.copy(ThreeApp.DIRECTIONAL_LIGHT_PARAM.position);
    this.scene.add(this.directionalLight);

    // アンビエントライト（環境光）
    this.ambientLight = new THREE.AmbientLight(
      ThreeApp.AMBIENT_LIGHT_PARAM.color,
      ThreeApp.AMBIENT_LIGHT_PARAM.intensity,
    );
    this.scene.add(this.ambientLight);

    // マテリアル
    this.material = new THREE.MeshPhongMaterial(ThreeApp.MATERIAL_PARAM);

    //グループ
    this.circle = new THREE.Group();
    this.wrap = new THREE.Group();
    this.wrap.add(this.circle);
    this.scene.add(this.wrap);

    //ボックス
    this.boxGeometry = new THREE.BoxGeometry(.7, .7, .7);
    this.box = new THREE.Mesh(this.boxGeometry, this.material);
    this.circle.add(this.box); 

    //棒
    this.cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10.0);
    this.cylinder = new THREE.Mesh(this.cylinderGeometry, this.material);
    this.wrap.add(this.cylinder); 

    //三角錐
    const coneCount = 36;
    this.coneGeometry = new THREE.ConeGeometry(0.5, 1.0, 10);
    this.coneArray = [];   

    const positions = [
      { x: 0.0, y: 3.0, z: 0.0 },
      { x: 2.0, y: 2.0, z: 0.0 },
      { x: 3.0, y: 0.0, z: 0.0 },
      { x: 2.0, y: -2.0, z: 0.0 },
      { x: 0.0, y: -3.0, z: 0.0 },
      { x: -2.0, y: -2.0, z: 0.0 },
      { x: -3.0, y: 0.0, z: 0.0 },
      { x: -2.0, y: 2.0, z: 0.0 },
      { x: -.7, y: 1.9, z: 1 },//2行目
      { x: .6, y: 1.8, z: 1 },
      { x: 1.7, y: .7, z: 1 },
      { x: 1.7, y: -.7, z: 1 },
      { x: .7, y: -1.8, z: 1 },
      { x: -.7, y: -1.8, z: 1 },
      { x: -1.9, y: -.8, z: 1 },
      { x: -2.0, y: 0.7, z: 1 },
      { x: -.7, y: 1.9, z: -1 },//3
      { x: .6, y: 1.8, z: -1 },
      { x: 1.7, y: .7, z: -1 },
      { x: 1.7, y: -.7, z: -1 },
      { x: .7, y: -1.8, z: -1 },
      { x: -.7, y: -1.8, z: -1 },
      { x: -1.9, y: -.8, z: -1 },
      { x: -2.0, y: 0.7, z: -1 },  
      { x: -1, y: .8, z: 2 },//4行目
      { x: .2, y: 1, z: 2 },
      { x: 1.15, y: .0, z: 2 },
      { x: .8, y: -.9, z: 2 },
      { x: -.3, y: -1.0, z: 2 },
      { x: -1.2, y: -.3, z: 2 },
      { x: -1, y: .8, z: -2 },//4行目
      { x: .2, y: 1, z: -2 },
      { x: 1.15, y: .0, z: -2 },
      { x: .8, y: -.9, z: -2 },
      { x: -.3, y: -1.0, z: -2 },
      { x: -1.2, y: -.3, z: -2 },
    ];
    
    const rotations = [
      { x: 0, y: 0, z: -1.2 },
      { x: 0, y: 0, z: Math.PI / -1.8 },
      { x: 0, y: 0, z: Math.PI / -1.2 },
      { x: 0, y: 0, z: Math.PI / -.9 },
      { x: 0, y: 0, z: Math.PI / -.7 },
      { x: 0, y: 0, z: Math.PI / -.6 },
      { x: 0, y: 0, z: Math.PI / -.5 },
      { x: 0, y: 0, z: Math.PI / -5.6 },
      { x: 0, y: 0, z: Math.PI / -3.5 },//2行目
      { x: 0, y: 0, z: Math.PI / -1.5 },
      { x: 0, y: 0, z: Math.PI / -1.2 },
      { x: 0, y: 0, z: Math.PI / -.9 },
      { x: 0, y: 0, z: Math.PI / 1.4 },
      { x: 0, y: 0, z: Math.PI / 3.9 },
      { x: 0, y: 0, z: Math.PI / 5 },
      { x: 0, y: 0, z: Math.PI / -5.6 },
      { x: 0, y: 0, z: Math.PI / -3.5 },//3行目
      { x: 0, y: 0, z: Math.PI / -1.5 },
      { x: 0, y: 0, z: Math.PI / -1.2 },
      { x: 0, y: 0, z: Math.PI / -.9 },
      { x: 0, y: 0, z: Math.PI / 1.4 },
      { x: 0, y: 0, z: Math.PI / 3.9 },
      { x: 0, y: 0, z: Math.PI / 5 },
      { x: 0, y: 0, z: Math.PI / -5.6 },
      { x: 0, y: 0, z: Math.PI / -3.5 },//4行目
      { x: 0, y: 0, z: Math.PI / -1.8 },
      { x: 0, y: 0, z: Math.PI / -1.1 },
      { x: 0, y: 0, z: Math.PI / -.8 },
      { x: 0, y: 0, z: Math.PI / 2.9 },
      { x: 0, y: 0, z: Math.PI / 8 },
      { x: 0, y: 0, z: Math.PI / -3.5 },//4行目
      { x: 0, y: 0, z: Math.PI / -1.8 },
      { x: 0, y: 0, z: Math.PI / -1.1 },
      { x: 0, y: 0, z: Math.PI / -.8 },
      { x: 0, y: 0, z: Math.PI / 2.9 },
      { x: 0, y: 0, z: Math.PI / 8 },
    ];
    
    for (let i = 0; i < coneCount; i++) {
      const cone = new THREE.Mesh(this.coneGeometry, this.material);
      cone.position.set(positions[i].x, positions[i].y, positions[i].z);
      cone.rotation.set(rotations[i].x, rotations[i].y, rotations[i].z);
      this.circle.add(cone);
    }
    this.cylinder.position.set(0, -5, 0);
    this.wrap.position.set(0, 1.3, 0);

    // 軸ヘルパー
    const axesBarLength = 5.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // this のバインド
    this.render = this.render.bind(this);

    // キーの押下状態を保持するフラグ
    this.isDown = false;

    // キーの押下や離す操作を検出できるようにする
    window.addEventListener('keydown', (keyEvent) => {
      switch (keyEvent.key) {
        case ' ':
          this.isDown = true;
          break;
        default:
      }
    }, false);
    window.addEventListener('keyup', (keyEvent) => {
      this.isDown = false;
    }, false);

    // ウィンドウのリサイズを検出できるようにする
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);
  }

  // load() {
  //   return new Promise((resolve) => {
  //     const imagePath = './sample.jpg';
  //     const loader = new THREE.TextureLoader();
  //     loader.load(imagePath, (texture) => {
  //       this.material.map = texture;
  //       resolve();
  //     });
  //   });
  // }

  /* 描画処理 */
  render() {
    // 恒常ループ
    requestAnimationFrame(this.render);

    // コントロールを更新
    this.controls.update();

    // フラグに応じてオブジェクトの状態を変化させる
    if (this.isDown === true) {
      this.circle.rotation.z += 0.03;
      this.box.rotation.y -= 0.01;
      this.wrap.rotation.y += 0.01; 
    }

    // レンダラーで描画
    this.renderer.render(this.scene, this.camera);
  }
}
