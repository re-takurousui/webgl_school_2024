'use strict';

import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';

window.addEventListener('DOMContentLoaded', async () => {
  const wrapper = document.querySelector('#webgl');
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
  tubeCount = 9;
  // tubes = [];
  tube;
  tubeGeometry;
  material;
  curve;
  slider01;
  slider02;
  slider03;
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
      0xf4f4f7  //グレー
    ];
    const tubePositions = [
      {x: -27, y: 7, z: 2.0},
      {x: -45, y: -4, z: -5.0},
      {x: -15, y: 10, z: -12.0},
      {x: -27, y: 7, z: 2.0},
      {x: -45, y: -4, z: -5.0},
      {x: -15, y: 10, z: -12.0},
      {x: -27, y: 7, z: 2.0},
      {x: -45, y: -4, z: -5.0},
      {x: -15, y: 10, z: -12.0},
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
    ];

    this.slider01 = new THREE.Group();
    this.slider02 = new THREE.Group();
    this.slider03 = new THREE.Group();
    this.scene.add(this.slider01);
    this.scene.add(this.slider02);
    this.scene.add(this.slider03);
    
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
      }
    }
    this.slider02.position.x = 10;
    this.slider02.rotation.y = 10;
    this.slider03.position.x = 0.7;
    this.slider03.rotation.z = -1.5;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting) {
          // gsap.to(mat, {
          //   opacity: 0,
          //   duration: 2, // 2秒かけて変化
          //   onComplete: () => {
          //     console.log('アニメーション終了');
          //   },
          // });
          gsap.to(this.slider01.children, {
            opacity: 0,
            duration: 2, // アニメーションの時間（秒）
            onStart: () => {
              // 透明度を制御可能にするため、すべてのマテリアルのtransparentをtrueに設定
              this.slider01.children.forEach((child) => {
                if (child.material) {
                  child.material.transparent = true;
                }
              });
            },
            onComplete: () => {
              // アニメーション完了後に非表示
              this.slider01.visible = true;
            },
          });
          console.log('表');
        } else {
          console.log('消える');
          gsap.to(this.slider01.children, {
            opacity: 0,
            duration: 2, // アニメーションの時間（秒）
            onStart: () => {
              // 透明度を制御可能にするため、すべてのマテリアルのtransparentをtrueに設定
              this.slider01.children.forEach((child) => {
                if (child.material) {
                  child.material.transparent = true;
                }
              });
            },
            onComplete: () => {
              // アニメーション完了後に非表示
              this.slider01.visible = false;
            },
          });
        }
      });
    }, {
      rootMargin: '0% 0% 0% 0%',
    });
    observer.observe(document.querySelector('.fv'));
  }
  
  //描画
  moveLine() { 
    if (!this.isAnimation && !this.isWaiting) {
      // 描画アニメーション
      this.tube.geometry.setDrawRange(this.start, this.count);
      setTimeout(() => {
        this.count += 300;//.0001秒たったら描画スタート
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
        // console.log(this.currentIndex);
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

  //線を度からラジアン
  degToRad(deg) {
    return deg * Math.PI / 180;
  }
  render() {
    // this.moveLine();
    requestAnimationFrame(this.render);
    // this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
