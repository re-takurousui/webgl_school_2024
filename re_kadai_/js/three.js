'use strict';

import * as THREE from './lib/three.module.js';
// import { OrbitControls } from '../lib/OrbitControls.js';

window.addEventListener('DOMContentLoaded', async () => {
  const wrapper = document.querySelector('#bg');
  const app = new ThreeApp(wrapper);
  app.init();
  app.createLine();
  app.render();
}, false);

class ThreeApp {
  //カメラ定義のための定数
  static CAMERA_PARAM = {
    fovy: 70,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 60.0,
    position: new THREE.Vector3(0.0, 0.0, 25.0),
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };
  //レンダラー定義のための定数
  static RENDERER_PARAM = {
    clearColor: 0xffffff,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  //平行光源定義のための定数
  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 2.7,
    position: new THREE.Vector3(1.0, 1.0, 1.0),
  };
  //アンビエントライト定義のための定数
  static AMBIENT_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1.0,
  };
  //マテリアル定義のための定数
  // static MATERIAL_PARAM = {
  //   color: 0xf08300,
  // };
  //フォグの定義のための定数
  static FOG_PARAM = {
    color: 0xffffff,
    near: 40.0,
    far: 60.0,
  };

  wrapper;          // canvas の親要素
  renderer;         // レンダラ
  scene;            // シーン
  camera;           // カメラ
  directionalLight; // 平行光源（ディレクショナルライト）
  ambientLight;     // 環境光（アンビエントライト）
  controls;         // オービットコントロール
  axesHelper;       // 軸ヘルパー
  line;
  mat;
  geo;
  points;
  pointNum = 50;
  start = 0;
  count = 2;
  line;
  points = [];
  tubeCount = 19;
  tube;
  tubeGeometry;
  material;
  curve;
  slider01;
  slider02;
  slider03;
  aboutSlider;
  isAnimation = false;//アニメーション許可
  isWaiting = false;//待ち時間
  sliders;
  currentIndex = 0;
  
  /**
   * コンストラクタ
   * @constructor
   * @param {HTMLElement} wrapper - canvas 要素を append する親要素
   */
  constructor(wrapper) {
    // 初期化時に canvas を append できるようにプロパティに保持
    this.wrapper = wrapper;

    // 再帰呼び出しのための this 固定
    this.render = this.render.bind(this);

    // リサイズイベント
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);
  }

  /**
   * 初期化処理
   */
  init() {
    // レンダラー
    const color = new THREE.Color(ThreeApp.RENDERER_PARAM.clearColor);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(color);
    this.renderer.setSize(ThreeApp.RENDERER_PARAM.width, ThreeApp.RENDERER_PARAM.height);
    this.wrapper.appendChild(this.renderer.domElement);

    // シーン
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(
      ThreeApp.FOG_PARAM.color,
      ThreeApp.FOG_PARAM.near,
      ThreeApp.FOG_PARAM.far
    );

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

    // コントロール
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // ヘルパー
    const axesBarLength = 5.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);
  }
  //線
  createLine() {
    for (let i = 0; i < this.pointNum; i++) {
      const x = i;
      const rad = this.degToRad(360 / this.pointNum * i);
      const y = 7.5 * Math.sin(rad);
      const z = 0;
      const p = new THREE.Vector3(x, y, z);
      this.points.push(p);
    }
    // カーブを生成
    this.curve = new THREE.CatmullRomCurve3(this.points);
    // チューブジオメトリを生成
    this.tubeGeometry = new THREE.TubeGeometry(this.curve, 500, 1.5, 10, false);
    const mat = new THREE.MeshBasicMaterial({ 
      color: 0xf08300,
      opacity: 1,
      transparent: true,
    });
    this.tube = new THREE.Mesh(this.tubeGeometry, mat);
    const tubeColors = [
      0xf08300, //オレンジ
      0x25589b, //ブルー
      0xf4f4f7,  //グレー
      0xf08300, //オレンジ
      0x25589b, //ブルー
      0xf4f4f7, //グレー
      0xf08300, //オレンジ
      0x25589b, //ブルー
      0xf4f4f7,  //グレー
      0xf08300, //オレンジ
      0x25589b, //ブルー
      0xf4f4f7,  //グレー
      0x25589b, //ブルー
      0xf08300, //オレンジ
      0xf4f4f7,  //グレー
      0x25589b, //ブルー
      0xf08300, //オレンジ
      0x25589b, //ブルー
      0xf4f4f7,  //グレー
    ];
    const tubePositions = [
      {x: -27, y: 7, z: 2.0},//
      {x: -45, y: -4, z: -5.0},
      {x: -15, y: 10, z: -12.0},
      {x: -8, y: 11, z: 7.0},//
      {x: -30, y: -10, z: -15.0},
      {x: -15, y: 10, z: -15.0},
      {x: -27, y: 7, z: 2.0},//
      {x: -45, y: -4, z: -5.0},
      {x: -15, y: 10, z: -12.0},
      {x: -50, y: 15, z: -46.0},//about
      {x: 20, y: 10, z: -45.0},
      {x: -20, y: 17, z: -45.0},//com
      {x: -40, y: 20, z: -45.0},
      {x: 50, y: 20, z: -35.0},
      {x: -20, y: 20, z: -45.0},
      {x: -50, y: -3, z: -49.0},
      {x: 50, y: 5, z: -49.0},
      {x: -31, y: 20, z: -45.0},
      {x: 7, y: 18, z: -45.0},
    ];
    const tubeRotates = [
      {x: 0, y: -0.4, z: -0.15},
      {x: 0, y: -0.4, z: 0.0},
      {x: 0, y: -0.4, z: -0.2},
      {x: 0, y: -0.4, z: -0.15},
      {x: 0, y: -0.4, z: 0.0},
      {x: 0, y: -0.4, z: -0.2},
      {x: 0, y: -0.4, z: -0.15},
      {x: 0, y: -0.4, z: 0.0},
      {x: 0, y: -0.4, z: -0.2},
      {x: 3.7, y: 0.4, z: 0.3},//about
      {x: 0, y: 3.5, z: 4.0},
      {x: 0, y: 3, z: 4.5},//com
      {x: 0, y: 3, z: 3.5},
      {x: 0, y: 3, z: 6.0},
      {x: 0, y: 3, z: 4.6},
      {x: 3.0, y: 0.3, z: 0.0},
      {x: -6.0, y: 3.4, z: 6.3},
      {x: 3.3, y: 0.3, z: 1.6},
      {x: -6.0, y: 3.5, z: 5.0},
    ];

    this.slider01 = new THREE.Group();
    this.slider02 = new THREE.Group();
    this.slider03 = new THREE.Group();
    this.aboutSlider = new THREE.Group();
    this.companySlider = new THREE.Group();
    this.serviceSlider = new THREE.Group();
    this.recruitSlider = new THREE.Group();
    this.contactSlider01 = new THREE.Group();
    this.contactSlider02 = new THREE.Group();
    this.scene.add(this.slider01);
    this.scene.add(this.slider02);
    this.scene.add(this.slider03);
    this.scene.add(this.aboutSlider);
    this.scene.add(this.companySlider);
    this.scene.add(this.serviceSlider);
    this.scene.add(this.recruitSlider);
    this.scene.add(this.contactSlider01);
    this.scene.add(this.contactSlider02);
    
    for (let i = 0; i < this.tubeCount; i++) {
      this.material = new THREE.MeshPhongMaterial({ color: tubeColors[i] });
      this.tube = new THREE.Mesh(this.tubeGeometry, this.material);
      this.tube.position.set(tubePositions[i].x, tubePositions[i].y, tubePositions[i].z);
      this.tube.rotation.set(tubeRotates[i].x, tubeRotates[i].y, tubeRotates[i].z);
      this.scene.add(this.tube);
      if (i >= 0 && i <= 2) { // 1~3
        this.slider01.add(this.tube);
      } else if (i >= 3 && i <= 5) { // 4~6
        this.slider02.add(this.tube);
      } else if (i >= 6 && i <= 8) { // 7~9
        this.slider03.add(this.tube);
      } else if (i >= 9 && i <= 10) { // 10~11
        this.aboutSlider.add(this.tube);
      } else if (i == 11) { // 10~11
        this.companySlider.add(this.tube);
      } else if (i == 12) { // 10~11
        this.serviceSlider.add(this.tube);
      } else if (i >= 13 && i <= 14) { // 10~11
        this.recruitSlider.add(this.tube);
      } else if (i >= 15 && i <= 16) { // 10~11
        this.contactSlider01.add(this.tube);
      } else if (i >= 17 && i <= 18) { // 10~11
        this.contactSlider02.add(this.tube);
      }
    }
    this.slider02.position.x = 10;
    this.slider02.rotation.y = 10;
    this.slider03.position.x = 0.7;
    this.slider03.rotation.z = -1.5;
    gsap.to(this.slider01.position, {
      z: 60, 
      scrollTrigger: {
        trigger: ".fv",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(this.slider02.position, {
      z: 60,
      scrollTrigger: {
        trigger: ".fv",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(this.slider03.position, {
      z: 60,
      scrollTrigger: {
        trigger: ".fv",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(this.aboutSlider.position, {
      z: 70,
      scrollTrigger: {
        trigger: ".about",
        start: "top 80%",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(this.companySlider.position, {
      z: 70,
      scrollTrigger: {
        trigger: ".company",
        start: "top 100%",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(this.serviceSlider.position, {
      z: 70,
      scrollTrigger: {
        trigger: ".service",
        start: "top 80%",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(this.recruitSlider.position, {
      z: 70,
      scrollTrigger: {
        trigger: ".recruit",
        start: "top 60%",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(this.contactSlider01.position, {
      z: 70,
      scrollTrigger: {
        trigger: ".contact",
        start: "top 150%",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(this.contactSlider02.position, {
      z: 58,
      scrollTrigger: {
        trigger: ".contact",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }
  
  //FV描画
  moveLine() { 
    const targetTube01 = this.slider01.children;
    const targetTube02 = this.slider02.children;
    const targetTube03 = this.slider03.children;
    if(targetTube01 && targetTube02 && targetTube03) {
      if (!this.isAnimation && !this.isWaiting) {
        // 描画アニメーション
        this.tube.geometry.setDrawRange(this.start, this.count);
        setTimeout(() => {
          this.count += 300;
        },1);
        if (this.count > this.tubeGeometry.index.count) {
          // setTimeout(() => {
            this.isAnimation = true;
            this.isWaiting = false;
          // }, 1);
        }
      } else if (this.isAnimation) {
        // 消去アニメーション
        this.tube.geometry.setDrawRange(this.start, this.count);
        this.start += 291;
        if (this.start >= this.tubeGeometry.index.count) {
          // 消去完了したらリセットして再ループ
          this.start = 0;
          this.count = 2;
          this.isAnimation = false;
          // 次のスライダーに移行
          this.currentIndex = (this.currentIndex + 1) % this.sliders.length;
        }
      }
      this.sliders = [this.slider01, this.slider02, this.slider03];
      const addNextSlider = () => {
        // すべてのスライダーを一度シーンから削除
        this.sliders.forEach((slider) => this.scene.remove(slider));
    
        // 現在のスライダーをシーンに追加
        this.scene.add(this.sliders[this.currentIndex]);
  
        // 1秒後に次のスライダーを追加
        // setTimeout(addNextSlider, 1000);
      };
      // 初回実行
      addNextSlider();
    }
  }

  //線を度からラジアン
  degToRad(deg) {
    return deg * Math.PI / 180;
  }
  render() {
    this.moveLine();
    requestAnimationFrame(this.render);
    // this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}