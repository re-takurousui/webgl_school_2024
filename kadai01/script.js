import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';

window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('#webgl');
  const app = new ThreeApp(wrapper);
  app.render();
}, false);

class ThreeApp {
  /**
   * カメラ定義のための定数 @@@
   */
  static CAMERA_PARAM = {
    // fovy は Field of View Y のことで、縦方向の視野角を意味する
    fovy: 60,
    // 描画する空間のアスペクト比（縦横比）
    aspect: window.innerWidth / window.innerHeight,
    // 描画する空間のニアクリップ面（最近面）
    near: 0.1,
    // 描画する空間のファークリップ面（最遠面）
    far: 150.0,
    // カメラの座標
    position: new THREE.Vector3(0.0, 0.0,40.0),
    // カメラの注視点
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };
  /**
   * レンダラー定義のための定数
   */
  static RENDERER_PARAM = {
    clearColor: 0x184da3,       // 画面をクリアする色
    width: window.innerWidth,   // レンダラーに設定する幅
    height: window.innerHeight, // レンダラーに設定する高さ
  };
  /**
   * 平行光源定義のための定数
   */
  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,                            // 光の色
    intensity: 1.0,                             // 光の強度
    position: new THREE.Vector3(1.0, 1.0, 1.0), // 光の向き
  };
  /**
   * アンビエントライト定義のための定数
   */
  static AMBIENT_LIGHT_PARAM = {
    color: 0xffffff, // 光の色
    intensity: 0.1,  // 光の強度
  };
  /**
   * マテリアル定義のための定数
   */
  static MATERIAL_PARAM = {
    color: 0x3399ff, // マテリアルの基本色
  };

  renderer;         // レンダラ
  scene;            // シーン
  camera;           // カメラ
  directionalLight; // 平行光源（ディレクショナルライト）
  ambientLight;     // 環境光（アンビエントライト）
  material;         // マテリアル
  boxGeometry;      // ボックスジオメトリ
  box;              // ボックスメッシュ
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

    // 各種ジオメトリからメッシュを生成し、シーンに追加する
    this.boxGeometry = new THREE.BoxGeometry(2.0, 2.0, 2.0);
    this.box = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box);
    this.box01 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box01);
    this.box02 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box02);
    this.box03 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box03);
    this.box04 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box04);
    this.box05 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box05);
    this.box06 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box06);
    this.box07 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box07);
    this.box08 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box08);
    this.box09 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box09);
    this.box10 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box10);
    this.box11 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box11);
    this.box12 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box12);
    this.box13 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box13);
    this.box14 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box14);
    this.box15 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box15);
    this.box16 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box16);
    this.box17 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box17);
    this.box18 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box18);
    this.box19 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box19);
    this.box20 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box20);
    this.box21 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box21);
    this.box22 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box22);
    this.box23 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box23);
    this.box24 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box24);
    this.box25 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box25);
    this.box26 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box26);
    this.box27 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box27);
    this.box28 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box28);
    this.box29 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box29);
    this.box30 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box30);
    this.box31 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box31);
    this.box32 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box32);
    this.box33 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box33);
    this.box34 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box34);
    this.box35 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box35);
    this.box36 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box36);
    this.box37 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box37);
    this.box38 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box38);
    this.box39 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box39);
    this.box40 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box40);
    this.box41 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box41);
    this.box42 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box42);
    this.box43 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box43);
    this.box44 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box44);
    this.box45 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box45);
    this.box46 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box46);
    this.box47 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box47);
    this.box48 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box48);
    this.box49 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box49);
    this.box50 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box50);
    this.box51 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box51);
    this.box52 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box52);
    this.box53 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box53);
    this.box54 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box54);
    this.box55 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box55);
    this.box56 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box56);
    this.box57 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box57);
    this.box58 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box58);
    this.box59 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box59);
    this.box60 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box60);
    this.box61 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box61);
    this.box62 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box62);
    this.box63 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box63);
    this.box64 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box64);
    this.box65 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box65);
    this.box66 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box66);
    this.box67 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box67);
    this.box68 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box68);
    this.box69 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box69);
    this.box70 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box70);
    this.box71 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box71);
    this.box72 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box72);
    this.box73 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box73);
    this.box74 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box74);
    this.box75 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box75);
    this.box76 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box76);
    this.box77 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box77);
    this.box78 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box78);
    this.box79 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box79);
    this.box80 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box80);
    this.box81 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box81);
    this.box82 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box82);
    this.box83 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box83);
    this.box84 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box84);
    this.box85 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box85);
    this.box86 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box86);
    this.box87 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box87);
    this.box88 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box88);
    this.box89 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box89);
    this.box90 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box90);
    this.box91 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box91);
    this.box92 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box92);
    this.box93 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box93);
    this.box94 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box94);
    this.box95 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box95);
    this.box96 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box96);
    this.box97 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box97);
    this.box98 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box98);
    this.box99 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box99);
    this.box100 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box100);
    this.box101 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box101);
    this.box102 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box102);
    this.box103 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box103);
    this.box104 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box104);
    this.box105 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box105);
    this.box106 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box106);
    this.box107 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box107);
    this.box108 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box108);
    this.box109 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box109);
    this.box110 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box110);
    this.box111 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box111);
    this.box112 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box112);
    this.box113 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box113);
    this.box114 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box114);
    this.box115 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box115);
    this.box116 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box116);
    this.box117 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box117);
    this.box118 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box118);
    this.box119 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box119);
    this.box120 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box120);
    this.box121 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box121);
    this.box122 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box122);
    this.box123 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box123);
    this.box124 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box124);
    this.box125 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box125);
    this.box126 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box126);
    this.box127 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box127);
    this.box128 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box128);
    this.box129 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box129);
    this.box130 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box130);
    this.box131 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box131);
    this.box132 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box132);
    this.box133 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box133);
    this.box134 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box134);
    this.box135 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box135);
    this.box136 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box136);
    this.box137 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box137);
    this.box138 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box138);
    this.box139 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box139);
    this.box140 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box140);
    this.box141 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box141);
    this.box142 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box142);
    this.box143 = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box143);
    
    // 各種メッシュは少しずつ動かしておく
    this.box.position.set(-20.0, 8.0, 15.0);//1
    this.box01.position.set(-7.0, 14.0, -2.0);
    this.box02.position.set(-1.0, 14.0, 1.0);
    this.box03.position.set(5.0, 16.0, 1.0);
    this.box04.position.set(5.0, 14.0, -5.0);
    this.box05.position.set(-11.0, 9.0, 0.0);//2
    this.box06.position.set(5.0, 12.0, 1.0);
    this.box07.position.set(-3.0, 12.0, 14.0);
    this.box08.position.set(-1.0, 12.0, 4.0);
    this.box09.position.set(5.0, 12.0, 42.0);
    this.box10.position.set(3.0, 12.0, 1.0);
    this.box11.position.set(5.0, 12.0, -7.0);
    this.box12.position.set(7.0, 12.0, 1.0);
    this.box13.position.set(17.0, 12.0, 0.0);
    this.box14.position.set(11.0, 12.0, -8.0);
    this.box15.position.set(-17.0, 10.0, 3.0);//3
    this.box16.position.set(-5.0, 10.0, 0.0);
    this.box17.position.set(-3.0, 10.0, 2.0);
    this.box18.position.set(-1.0, 10.0, -42.0);
    this.box19.position.set(1.0, 10.0, 10.0);
    this.box20.position.set(6.0, 10.0, 64.0);
    this.box21.position.set(9.0, 10.0, -9.0);
    this.box22.position.set(-9.0, 8.0, 3.0);//4
    this.box23.position.set(-7.0, 8.0, 5.0);
    this.box24.position.set(-5.0, 8.0, 0.0);
    this.box25.position.set(-3.0, 8.0, -5.0);
    this.box26.position.set(-1.0, 8.0, 2.0);
    this.box27.position.set(8.0, 8.0, 8.0);
    this.box28.position.set(3.0, 8.0, 3.0);
    this.box29.position.set(5.0, 8.0, 2.0);
    this.box30.position.set(7.0, 8.0, -4.0);
    this.box31.position.set(9.0, 8.0, -7.0);
    this.box32.position.set(-9.0, 6.0, 3.0);//5
    this.box33.position.set(-7.0, 6.0, 5.0);
    this.box34.position.set(-5.0, 6.0, 3.0);
    this.box35.position.set(-3.0, 6.0, 1.0);
    this.box36.position.set(-1.0, 6.0, 0.0);
    this.box37.position.set(1.0, 6.0, 0.0);
    this.box38.position.set(3.0, 6.0, 7.0);
    this.box39.position.set(5.0, 6.0, -8.0);
    this.box40.position.set(7.0, 6.0, 9.0);
    this.box41.position.set(9.0, 6.0, 2.0);
    this.box42.position.set(11.0, 6.0, 1.0);
    this.box43.position.set(-9.0, 4.0, 0.0);//6
    this.box44.position.set(-7.0, 4.0, -11.0);
    this.box45.position.set(-5.0, 4.0, 7.0);
    this.box46.position.set(-3.0, 4.0, 9.0);
    this.box47.position.set(-1.0, 4.0, 3.0);
    this.box48.position.set(1.0, 4.0, -2.0);
    this.box49.position.set(3.0, 4.0, 0.0);
    this.box50.position.set(5.0, 4.0, 1.0);
    this.box51.position.set(7.0, 4.0, 7.0);
    this.box52.position.set(30.0, 4.0, 5.0);
    this.box53.position.set(-5.0, 2.0, 3.0);//7
    this.box54.position.set(-3.0, 2.0, -0.0);
    this.box55.position.set(-1.0, 2.0, 2.0);
    this.box56.position.set(1.0, 2.0, 4.0);
    this.box57.position.set(3.0, 2.0, 7.0);
    this.box58.position.set(5.0, 2.0, 9.0);
    this.box59.position.set(7.0, 2.0, 0.0);
    this.box60.position.set(-7.0, 0.0, 1.0);//8
    this.box61.position.set(-5.0, 0.0, -6.0);
    this.box62.position.set(-3.0, 0.0, 8.0);
    this.box63.position.set(-1.0, 0.0, 1.0);
    this.box64.position.set(1.0, 0.0, 0.0);
    this.box65.position.set(3.0, 0.0, 3.0);
    this.box66.position.set(-15.0, -2.0, 10.0);//9
    this.box67.position.set(-7.0, -2.0, 8.0);
    this.box68.position.set(-5.0, -2.0, 9.0);
    this.box69.position.set(-3.0, -2.0, 0.0);
    this.box70.position.set(-1.0, -2.0, 3.0);
    this.box71.position.set(1.0, -2.0, 2.0);
    this.box72.position.set(3.0, -2.0, -9.0);
    this.box73.position.set(5.0, -2.0, 10.0);
    this.box74.position.set(7.0, -2.0, 11.0);
    this.box75.position.set(9.0, -2.0, 3.0);
    this.box76.position.set(-11.0, -4.0, 2.0);//10
    this.box77.position.set(-9.0, -4.0, 9.0);
    this.box78.position.set(-7.0, -4.0, -10.0);
    this.box79.position.set(-5.0, -4.0, 3.0);
    this.box80.position.set(-3.0, -4.0, 1.0);
    this.box81.position.set(-1.0, -4.0, 0.0);
    this.box82.position.set(1.0, -4.0, 1.0);
    this.box83.position.set(3.0, -4.0, -77.0);
    this.box84.position.set(5.0, -4.0, 0.0);
    this.box85.position.set(7.0, -4.0, -6.0);
    this.box86.position.set(9.0, -4.0, 3.0);
    this.box87.position.set(15.0, -4.0, 2.0);
    this.box88.position.set(-11.0, -6.0, 8.0);//11
    this.box89.position.set(-9.0, -6.0, 5.0);
    this.box90.position.set(-7.0, -6.0, -33.0);
    this.box91.position.set(-5.0, -6.0, 7.0);
    this.box92.position.set(-3.0, -6.0, 9.0);
    this.box93.position.set(-1.0, -6.0, 3.0);
    this.box94.position.set(1.0, -6.0, -1.0);
    this.box95.position.set(3.0, -6.0, 0.0);
    this.box96.position.set(5.0, -6.0, 2.0);
    this.box97.position.set(7.0, -6.0, -64.0);
    this.box98.position.set(9.0, -6.0, 7.0);
    this.box99.position.set(11.0, -6.0, 8.0);
    this.box100.position.set(-11.0, -8.0, -1.0);//12
    this.box101.position.set(-9.0, -8.0, 0.0);
    this.box102.position.set(-7.0, -8.0, 1.0);
    this.box103.position.set(-5.0, -8.0, 2.0);
    this.box104.position.set(-3.0, -8.0, 8.0);
    this.box105.position.set(-1.0, -8.0, -94.0);
    this.box106.position.set(1.0, -8.0, -30.0);
    this.box107.position.set(3.0, -8.0, -24.0);
    this.box108.position.set(5.0, -8.0, 6.0);
    this.box109.position.set(7.0, -8.0, 8.0);
    this.box110.position.set(9.0, -8.0, 2.0);
    this.box111.position.set(11.0, -8.0, 0.0);
    this.box112.position.set(-11.0, -10.0, 1.0);//12
    this.box113.position.set(-9.0, -10.0, -8.0);
    this.box114.position.set(-7.0, -10.0, 14.0);
    this.box115.position.set(-5.0, -10.0, 16.0);
    this.box116.position.set(-3.0, -10.0, 67.0);
    this.box117.position.set(-1.0, -10.0, 4.0);
    this.box118.position.set(1.0, -10.0, 99.0);
    this.box119.position.set(3.0, -10.0, -8.0);
    this.box120.position.set(5.0, -10.0, -24.0);
    this.box121.position.set(7.0, -10.0, 44.0);
    this.box122.position.set(9.0, -10.0, 77.0);
    this.box123.position.set(11.0, -10.0, 8.0);
    this.box124.position.set(-7.0, -12.0, -1.0);//13
    this.box125.position.set(-5.0, -12.0, 8.0);
    this.box126.position.set(-3.0, -12.0, 90.0);
    this.box127.position.set(3.0, -12.0, 35.0);
    this.box128.position.set(5.0, -12.0, 29.0);
    this.box129.position.set(7.0, -12.0, 54.0);
    this.box130.position.set(-9.0, -14.0, -76.0);//14
    this.box131.position.set(-7.0, -14.0, 93.0);
    this.box132.position.set(-5.0, -14.0, 23.0);
    this.box133.position.set(9.0, -14.0, 32.0);
    this.box134.position.set(7.0, -14.0, 10.0);
    this.box135.position.set(5.0, -14.0, 9.0);
    this.box136.position.set(-11.0, -16.0, 56.0);//15
    this.box137.position.set(-9.0, -16.0, 40.0);
    this.box138.position.set(-7.0, -16.0, 20.0);
    this.box139.position.set(-5.0, -16.0, 10.0);
    this.box140.position.set(11.0, -16.0, 0.0);
    this.box141.position.set(9.0, -16.0, 9.0);
    this.box142.position.set(7.0, -16.0, 1.0);
    this.box143.position.set(5.0, -16.0, 0.0);

    const newMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const newMaterial02 = new THREE.MeshPhongMaterial({ color: 0x808000 });
    const newMaterial03 = new THREE.MeshPhongMaterial({ color: 0xffa500 });
    this.box.material = newMaterial;
    this.box01.material = newMaterial;
    this.box02.material = newMaterial;
    this.box03.material = newMaterial;
    this.box04.material = newMaterial;
    this.box05.material = newMaterial;
    this.box06.material = newMaterial;
    this.box07.material = newMaterial;
    this.box08.material = newMaterial;
    this.box09.material = newMaterial;
    this.box10.material = newMaterial;
    this.box11.material = newMaterial;
    this.box12.material = newMaterial;
    this.box13.material = newMaterial;
    this.box14.material = newMaterial;
    this.box15.material = newMaterial02;
    this.box16.material = newMaterial02;
    this.box17.material = newMaterial02;
    this.box18.material = newMaterial03;
    this.box19.material = newMaterial03;
    this.box20.material = newMaterial02;
    this.box21.material = newMaterial03;
    this.box22.material = newMaterial02;
    this.box23.material = newMaterial03;
    this.box24.material = newMaterial02;
    this.box25.material = newMaterial03;
    this.box26.material = newMaterial03;
    this.box27.material = newMaterial03;
    this.box28.material = newMaterial02;
    this.box29.material = newMaterial03;
    this.box30.material = newMaterial03;
    this.box31.material = newMaterial03;
    this.box32.material = newMaterial02;
    this.box33.material = newMaterial03;
    this.box34.material = newMaterial02;
    this.box35.material = newMaterial02;
    this.box36.material = newMaterial03;
    this.box37.material = newMaterial03;
    this.box38.material = newMaterial03;
    this.box39.material = newMaterial02;
    this.box40.material = newMaterial03;
    this.box41.material = newMaterial03;
    this.box42.material = newMaterial03;
    this.box43.material = newMaterial02;
    this.box44.material = newMaterial02;
    this.box45.material = newMaterial03;
    this.box46.material = newMaterial03;
    this.box47.material = newMaterial03;
    this.box48.material = newMaterial03;
    this.box49.material = newMaterial02;
    this.box50.material = newMaterial02;
    this.box51.material = newMaterial02;
    this.box52.material = newMaterial02;
    this.box53.material = newMaterial03;
    this.box54.material = newMaterial03;
    this.box55.material = newMaterial03;
    this.box56.material = newMaterial03;
    this.box57.material = newMaterial03;
    this.box58.material = newMaterial03;
    this.box59.material = newMaterial03;
    this.box60.material = newMaterial02;
    this.box61.material = newMaterial02;
    this.box62.material = newMaterial;
    this.box63.material = newMaterial02;
    this.box64.material = newMaterial02;
    this.box65.material = newMaterial02;
    this.box66.material = newMaterial02;
    this.box67.material = newMaterial02;
    this.box68.material = newMaterial02;
    this.box69.material = newMaterial;
    this.box70.material = newMaterial02;
    this.box71.material = newMaterial02;
    this.box72.material = newMaterial;
    this.box73.material = newMaterial02;
    this.box74.material = newMaterial02;
    this.box75.material = newMaterial02;
    this.box76.material = newMaterial02;
    this.box77.material = newMaterial02;
    this.box78.material = newMaterial02;
    this.box79.material = newMaterial02;
    this.box80.material = newMaterial;
    this.box81.material = newMaterial;
    this.box82.material = newMaterial;
    this.box83.material = newMaterial;
    this.box84.material = newMaterial02;
    this.box85.material = newMaterial02;
    this.box86.material = newMaterial02;
    this.box87.material = newMaterial02;
    this.box88.material = newMaterial03;
    this.box89.material = newMaterial03;
    this.box90.material = newMaterial02;
    this.box91.material = newMaterial;
    this.box92.material = newMaterial03;
    this.box93.material = newMaterial;
    this.box94.material = newMaterial;
    this.box95.material = newMaterial03;
    this.box96.material = newMaterial;
    this.box97.material = newMaterial02;
    this.box98.material = newMaterial03;
    this.box99.material = newMaterial03;
    this.box100.material = newMaterial03;
    this.box101.material = newMaterial03;
    this.box102.material = newMaterial03;
    this.box103.material = newMaterial;
    this.box104.material = newMaterial;
    this.box105.material = newMaterial;
    this.box106.material = newMaterial;
    this.box107.material = newMaterial;
    this.box108.material = newMaterial;
    this.box109.material = newMaterial03;
    this.box110.material = newMaterial03;
    this.box111.material = newMaterial03;
    this.box112.material = newMaterial03;
    this.box113.material = newMaterial03;
    this.box114.material = newMaterial;
    this.box115.material = newMaterial;
    this.box116.material = newMaterial;
    this.box117.material = newMaterial;
    this.box118.material = newMaterial;
    this.box119.material = newMaterial;
    this.box120.material = newMaterial;
    this.box121.material = newMaterial;
    this.box122.material = newMaterial03;
    this.box123.material = newMaterial03;
    this.box124.material = newMaterial;
    this.box125.material = newMaterial;
    this.box126.material = newMaterial;
    this.box127.material = newMaterial;
    this.box128.material = newMaterial;
    this.box129.material = newMaterial;
    this.box130.material = newMaterial02;
    this.box131.material = newMaterial02;
    this.box132.material = newMaterial02;
    this.box133.material = newMaterial02;
    this.box134.material = newMaterial02;
    this.box135.material = newMaterial02;
    this.box136.material = newMaterial02;
    this.box137.material = newMaterial02;
    this.box138.material = newMaterial02;
    this.box139.material = newMaterial02;
    this.box140.material = newMaterial02;
    this.box141.material = newMaterial02;
    this.box142.material = newMaterial02;
    this.box143.material = newMaterial02;
    
    // 軸ヘルパー
    const axesBarLength = 40.0;
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

    // リサイズイベント @@@
    // - ウィンドウサイズの変更に対応 -----------------------------------------
    // JavaScript ではブラウザウィンドウの大きさが変わったときに resize イベント
    // が発生します。three.js や WebGL のプログラムを書く際はウィンドウや canvas
    // の大きさが変化したときは、カメラやレンダラーなどの各種オブジェクトに対し
    // てもこの変更内容を反映してやる必要があります。
    // three.js の場合であれば、レンダラーとカメラに対し、以下のように設定してや
    // ればよいでしょう。
    // ------------------------------------------------------------------------
    window.addEventListener('resize', () => {
      // レンダラの大きさを設定
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // カメラが撮影する視錐台のアスペクト比を再設定
      this.camera.aspect = window.innerWidth / window.innerHeight;
      // カメラのパラメータが変更されたときは行列を更新する
      // ※なぜ行列の更新が必要なのかについては、将来的にもう少し詳しく解説します
      this.camera.updateProjectionMatrix();
    }, false);
  }

  /**
   * 描画処理
   */
  render() {
    // 恒常ループの設定
    requestAnimationFrame(this.render);

    // コントロールを更新
    this.controls.update();

    // フラグに応じてオブジェクトの状態を変化させる
    if (this.isDown === true) {
      this.box.position.set(-5.0, 14.0, 0.0);//1
      this.box01.position.set(-3.0, 14.0, 0.0);
      this.box02.position.set(-1.0, 14.0, 0.0);
      this.box03.position.set(1.0, 14.0, 0.0);
      this.box04.position.set(3.0, 14.0, 0.0);
      this.box05.position.set(-7.0, 12.0, 0.0);//2
      this.box06.position.set(-5.0, 12.0, 0.0);
      this.box07.position.set(-3.0, 12.0, 0.0);
      this.box08.position.set(-1.0, 12.0, 0.0);
      this.box09.position.set(1.0, 12.0, 0.0);
      this.box10.position.set(3.0, 12.0, 0.0);
      this.box11.position.set(5.0, 12.0, 0.0);
      this.box12.position.set(7.0, 12.0, 0.0);
      this.box13.position.set(9.0, 12.0, 0.0);
      this.box14.position.set(11.0, 12.0, 0.0);
      this.box15.position.set(-7.0, 10.0, 0.0);//3
      this.box16.position.set(-5.0, 10.0, 0.0);
      this.box17.position.set(-3.0, 10.0, 0.0);
      this.box18.position.set(-1.0, 10.0, 0.0);
      this.box19.position.set(1.0, 10.0, 0.0);
      this.box20.position.set(3.0, 10.0, 0.0);
      this.box21.position.set(5.0, 10.0, 0.0);
      this.box22.position.set(-9.0, 8.0, 0.0);//4
      this.box23.position.set(-7.0, 8.0, 0.0);
      this.box24.position.set(-5.0, 8.0, 0.0);
      this.box25.position.set(-3.0, 8.0, 0.0);
      this.box26.position.set(-1.0, 8.0, 0.0);
      this.box27.position.set(1.0, 8.0, 0.0);
      this.box28.position.set(3.0, 8.0, 0.0);
      this.box29.position.set(5.0, 8.0, 0.0);
      this.box30.position.set(7.0, 8.0, 0.0);
      this.box31.position.set(9.0, 8.0, 0.0);
      this.box32.position.set(-9.0, 6.0, 0.0);//5
      this.box33.position.set(-7.0, 6.0, 0.0);
      this.box34.position.set(-5.0, 6.0, 0.0);
      this.box35.position.set(-3.0, 6.0, 0.0);
      this.box36.position.set(-1.0, 6.0, 0.0);
      this.box37.position.set(1.0, 6.0, 0.0);
      this.box38.position.set(3.0, 6.0, 0.0);
      this.box39.position.set(5.0, 6.0, 0.0);
      this.box40.position.set(7.0, 6.0, 0.0);
      this.box41.position.set(9.0, 6.0, 0.0);
      this.box42.position.set(11.0, 6.0, 0.0);
      this.box43.position.set(-9.0, 4.0, 0.0);//6
      this.box44.position.set(-7.0, 4.0, 0.0);
      this.box45.position.set(-5.0, 4.0, 0.0);
      this.box46.position.set(-3.0, 4.0, 0.0);
      this.box47.position.set(-1.0, 4.0, 0.0);
      this.box48.position.set(1.0, 4.0, 0.0);
      this.box49.position.set(3.0, 4.0, 0.0);
      this.box50.position.set(5.0, 4.0, 0.0);
      this.box51.position.set(7.0, 4.0, 0.0);
      this.box52.position.set(9.0, 4.0, 0.0);
      this.box53.position.set(-5.0, 2.0, 0.0);//7
      this.box54.position.set(-3.0, 2.0, 0.0);
      this.box55.position.set(-1.0, 2.0, 0.0);
      this.box56.position.set(1.0, 2.0, 0.0);
      this.box57.position.set(3.0, 2.0, 0.0);
      this.box58.position.set(5.0, 2.0, 0.0);
      this.box59.position.set(7.0, 2.0, 0.0);
      this.box60.position.set(-7.0, 0.0, 0.0);//8
      this.box61.position.set(-5.0, 0.0, 0.0);
      this.box62.position.set(-3.0, 0.0, 0.0);
      this.box63.position.set(-1.0, 0.0, 0.0);
      this.box64.position.set(1.0, 0.0, 0.0);
      this.box65.position.set(3.0, 0.0, 0.0);
      this.box66.position.set(-9.0, -2.0, 0.0);//9
      this.box67.position.set(-7.0, -2.0, 0.0);
      this.box68.position.set(-5.0, -2.0, 0.0);
      this.box69.position.set(-3.0, -2.0, 0.0);
      this.box70.position.set(-1.0, -2.0, 0.0);
      this.box71.position.set(1.0, -2.0, 0.0);
      this.box72.position.set(3.0, -2.0, 0.0);
      this.box73.position.set(5.0, -2.0, 0.0);
      this.box74.position.set(7.0, -2.0, 0.0);
      this.box75.position.set(9.0, -2.0, 0.0);
      this.box76.position.set(-11.0, -4.0, 0.0);//10
      this.box77.position.set(-9.0, -4.0, 0.0);
      this.box78.position.set(-7.0, -4.0, 0.0);
      this.box79.position.set(-5.0, -4.0, 0.0);
      this.box80.position.set(-3.0, -4.0, 0.0);
      this.box81.position.set(-1.0, -4.0, 0.0);
      this.box82.position.set(1.0, -4.0, 0.0);
      this.box83.position.set(3.0, -4.0, 0.0);
      this.box84.position.set(5.0, -4.0, 0.0);
      this.box85.position.set(7.0, -4.0, 0.0);
      this.box86.position.set(9.0, -4.0, 0.0);
      this.box87.position.set(11.0, -4.0, 0.0);
      this.box88.position.set(-11.0, -6.0, 0.0);//11
      this.box89.position.set(-9.0, -6.0, 0.0);
      this.box90.position.set(-7.0, -6.0, 0.0);
      this.box91.position.set(-5.0, -6.0, 0.0);
      this.box92.position.set(-3.0, -6.0, 0.0);
      this.box93.position.set(-1.0, -6.0, 0.0);
      this.box94.position.set(1.0, -6.0, 0.0);
      this.box95.position.set(3.0, -6.0, 0.0);
      this.box96.position.set(5.0, -6.0, 0.0);
      this.box97.position.set(7.0, -6.0, 0.0);
      this.box98.position.set(9.0, -6.0, 0.0);
      this.box99.position.set(11.0, -6.0, 0.0);
      this.box100.position.set(-11.0, -8.0, 0.0);//12
      this.box101.position.set(-9.0, -8.0, 0.0);
      this.box102.position.set(-7.0, -8.0, 0.0);
      this.box103.position.set(-5.0, -8.0, 0.0);
      this.box104.position.set(-3.0, -8.0, 0.0);
      this.box105.position.set(-1.0, -8.0, 0.0);
      this.box106.position.set(1.0, -8.0, 0.0);
      this.box107.position.set(3.0, -8.0, 0.0);
      this.box108.position.set(5.0, -8.0, 0.0);
      this.box109.position.set(7.0, -8.0, 0.0);
      this.box110.position.set(9.0, -8.0, 0.0);
      this.box111.position.set(11.0, -8.0, 0.0);
      this.box112.position.set(-11.0, -10.0, 0.0);//12
      this.box113.position.set(-9.0, -10.0, 0.0);
      this.box114.position.set(-7.0, -10.0, 0.0);
      this.box115.position.set(-5.0, -10.0, 0.0);
      this.box116.position.set(-3.0, -10.0, 0.0);
      this.box117.position.set(-1.0, -10.0, 0.0);
      this.box118.position.set(1.0, -10.0, 0.0);
      this.box119.position.set(3.0, -10.0, 0.0);
      this.box120.position.set(5.0, -10.0, 0.0);
      this.box121.position.set(7.0, -10.0, 0.0);
      this.box122.position.set(9.0, -10.0, 0.0);
      this.box123.position.set(11.0, -10.0, 0.0);
      this.box124.position.set(-7.0, -12.0, 0.0);//13
      this.box125.position.set(-5.0, -12.0, 0.0);
      this.box126.position.set(-3.0, -12.0, 0.0);
      this.box127.position.set(3.0, -12.0, 0.0);
      this.box128.position.set(5.0, -12.0, 0.0);
      this.box129.position.set(7.0, -12.0, 0.0);
      this.box130.position.set(-9.0, -14.0, 0.0);//14
      this.box131.position.set(-7.0, -14.0, 0.0);
      this.box132.position.set(-5.0, -14.0, 0.0);
      this.box133.position.set(9.0, -14.0, 0.0);
      this.box134.position.set(7.0, -14.0, 0.0);
      this.box135.position.set(5.0, -14.0, 0.0);
      this.box136.position.set(-11.0, -16.0, 0.0);//15
      this.box137.position.set(-9.0, -16.0, 0.0);
      this.box138.position.set(-7.0, -16.0, 0.0);
      this.box139.position.set(-5.0, -16.0, 0.0);
      this.box140.position.set(11.0, -16.0, 0.0);
      this.box141.position.set(9.0, -16.0, 0.0);
      this.box142.position.set(7.0, -16.0, 0.0);
      this.box143.position.set(5.0, -16.0, 0.0);
    }

    // レンダラーで描画
    this.renderer.render(this.scene, this.camera);
  }
}
