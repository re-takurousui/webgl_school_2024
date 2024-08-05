'use strict';

import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';

window.addEventListener('DOMContentLoaded', async () => {
  const wrapper = document.querySelector('#webgl');
  const app = new ThreeApp(wrapper);
  app.render();
}, false);

class ThreeApp {
	static CAMERA_PARAM = {
		fovy: 85,
		aspect: window.innerWidth / window.innerHeight,
		near: 0.1,
		far: 500.0,
		position: new THREE.Vector3(0, 0, 50),
		lookAt: new THREE.Vector3(0, 0, 0),
	};

	static RENDERER_PARAM = {
		clearColor: 0xffffff,
		width: window.innerWidth,
		height: window.innerHeight,
	};

	static DIRECTIONAL_LIGHT_PARAM = {
		color: 0xffffff,
		intensity: 1.0,
		position: new THREE.Vector3(1.0, 1.0, 1.0),
	};

	static AMBIENT_LIGHT_PARAM = {
		color: 0xffffff,
		intensity: 0.1,
	};

	static MACHINE_CONFIG = {
		bladeNum: 1,
		bladeGeometory: {
			color: 0x5c50e6,
      
		},
		bodyMaterial: {
			color: 0x5c50e6
		},
		operationMaterial: {
			color: 0x7d7d7d
		}
	};

  static RENDER_TARGET_SIZE = 1000;

  /**
   * レイが交差した際のマテリアル定義のための定数 @@@
   */
  // static INTERSECTION_MATERIAL_PARAM = {
  //   color: 0x00ff00,
  // };

	renderer;
	scene;
	camera;
	directionalLight;
	ambientLight;
	blades;
  boxGeometory
	controls;
	axesHelper;
	body;
  offscreenScene;   // オフスクリーン用のシーン @@@
  offscreenCamera;  // オフスクリーン用のカメラ @@@
  plane;            // 板ポリゴン @@@
  mario;
  headwrap;
  raycaster;        // レイキャスター @@@
  isOPEN = false;

	constructor(wrapper){
		// renderer
		const color = new THREE.Color(ThreeApp.RENDERER_PARAM.clearColor);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(color);
		this.renderer.setSize(ThreeApp.RENDERER_PARAM.width, ThreeApp.RENDERER_PARAM.height);
		wrapper.appendChild(this.renderer.domElement);

    // bind
		this.render = this.render.bind(this);

		// resize
		window.addEventListener('resize', ()=>{
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		}, false);
		// scene
		this.scene = new THREE.Scene();

    //offscreen
    this.offscreenScene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(
			ThreeApp.CAMERA_PARAM.fovy,
			ThreeApp.CAMERA_PARAM.aspect,
			ThreeApp.CAMERA_PARAM.near,
			ThreeApp.CAMERA_PARAM.far,
		);
		this.camera.position.copy(ThreeApp.CAMERA_PARAM.position);
		this.camera.lookAt(ThreeApp.CAMERA_PARAM.lookAt);

		// directional light
		this.directionalLight = new THREE.DirectionalLight(
			ThreeApp.DIRECTIONAL_LIGHT_PARAM.color,
			ThreeApp.DIRECTIONAL_LIGHT_PARAM.intensity,
		);
		this.directionalLight.position.copy(ThreeApp.DIRECTIONAL_LIGHT_PARAM.position);
		this.scene.add(this.directionalLight);
    this.offscreenScene.add(this.directionalLight.clone());

		// ambient light
		this.ambientLight = new THREE.AmbientLight(
			ThreeApp.AMBIENT_LIGHT_PARAM.color,
			ThreeApp.AMBIENT_LIGHT_PARAM.intensity,
		);
		this.scene.add(this.ambientLight);
    this.offscreenScene.add(this.ambientLight.clone());

    //軸ヘルパー
		// const axesBarLength = 10.0;
		// this.axesHelper = new THREE.AxesHelper(axesBarLength);
    // this.offscreenScene.add(this.axesHelper.clone());
		// this.scene.add(this.axesHelper);

		// control
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		const bodyMaterial = new THREE.MeshPhongMaterial(ThreeApp.MACHINE_CONFIG.bodyMaterial);
		const operationMaterial = new THREE.MeshPhongMaterial(ThreeApp.MACHINE_CONFIG.operationMaterial);

		// machine
    this.machine = new THREE.Group();
		this.scene.add(this.machine);

		// head
		const headGeometory = new THREE.BoxGeometry(30, 27 , 4);
    const head = new THREE.Mesh(headGeometory, bodyMaterial);
    head.position.y = 15;
    head.position.z = 0;
		this.machine.add(head);

		// 支柱
		const standGeometory = new THREE.CylinderGeometry(1.5, 1.5, 30, 100);
		const stand = new THREE.Mesh(standGeometory, bodyMaterial);
		stand.rotation.x = 90 * Math.PI / 180;
    stand.rotation.z = 90 * Math.PI / 180;
		this.machine.add(stand);

    // foot
		const footGeometory = new THREE.BoxGeometry(30, 30.5, 6);
    const foot = new THREE.Mesh(footGeometory, bodyMaterial);
    this.machine.add(foot);

    //ライトボタン
    const rightButtonGeometry = new THREE.CylinderGeometry(1, 1, 5);
    const rightButton = new THREE.Mesh(rightButtonGeometry, operationMaterial);
    rightButton.position.x = 0;
    rightButton.position.y = 7;
    rightButton.position.z = 1;
    rightButton.rotation.x = 1.55;
    this.machine.add(rightButton);

    //セレクト、スタートボタン
    const underButtons = new THREE.Group();
    const underButtonCount = 2;
    const underButtonPosition = [
      {x: 2, y: 0, z: 0},
      {x: -2, y: 0, z: 0},
    ];
    for(let i = 0; i < underButtonCount; i++) {
      const underButtonGeometry = new THREE.CylinderGeometry(1, 1, 5);
      const underButton = new THREE.Mesh(underButtonGeometry, operationMaterial);
      underButton.position.set(underButtonPosition[i].x, underButtonPosition[i].y, underButtonPosition[i].z);
      underButtons.add(underButton);
    }
    underButtons.position.x = 0;
    underButtons.position.y = -12;
    underButtons.position.z = 1;
    underButtons.rotation.x = 1.55;

    //ABボタン
    const buttonwrap = new THREE.Group();
    const buttonCount = 2;
    const buttonposition = [
      {x: 5, y: 0, z: -1},
      {x: 0, y: 0, z: 0.0},
    ];
    for(let i = 0; i < buttonCount; i++) {
      const buttonGeometry = new THREE.CylinderGeometry(1.5, 1.5, 5);
      const button = new THREE.Mesh(buttonGeometry, operationMaterial);
      button.position.set(buttonposition[i].x, buttonposition[i].y, buttonposition[i].z);
      buttonwrap.add(button);
    }
    buttonwrap.position.x = 5;
    buttonwrap.position.y = 1;
    buttonwrap.position.z = 1;
    buttonwrap.rotation.x = 1.55;

    //十字キー
    const directionkeywrap = new THREE.Group();
    const directionkeyCount = 2;
    const directionkeyposition = [
      {x: 0, y: 0, z: 0},
      {x: 0, y: 0, z: 0},
    ];
    for(let i = 0; i < directionkeyCount; i++) {
      const directionkeyGeometry = new THREE.BoxGeometry(8, 2.5, 5);
      const directionkey = new THREE.Mesh(directionkeyGeometry, operationMaterial);
      directionkey.position.set(directionkeyposition[i].x, directionkeyposition[i].y, directionkeyposition[i].z);
      if (i === 1) {
        directionkey.rotation.z = 90 * Math.PI / 180;
      }
      directionkeywrap.add(directionkey);
    }
    directionkeywrap.position.x = -6.5;
    directionkeywrap.position.y = 1;
    directionkeywrap.position.z = 1;

    //headwrap
    this.headwrap = new THREE.Group();
    this.headwrap.add(head);
    this.headwrap.add(stand);
    this.headwrap.position.y = 0;
    this.headwrap.position.z = -1.18;
    this.machine.add(this.headwrap);
    this.headwrap.rotation.x = 2.15;
    
    //footwrap
    const footwrap = new THREE.Group();
    footwrap.add(underButtons);
    footwrap.add(rightButton);
    footwrap.add(buttonwrap);
    footwrap.add(directionkeywrap);
    footwrap.add(foot);
    footwrap.position.y = -11;
    footwrap.position.z = 7.5;
    footwrap.rotation.x = -1;
    this.machine.add(footwrap);
    
    
    // マリオ
    this.mario = new THREE.Group();
    const marioCount = 172;
    this.boxGeometry = new THREE.BoxGeometry(.2, .2, 1);
    const marioPosition = [
      {x: 0.0, y: 1.5, z: 0.0},
      {x: 0.2, y: 1.5, z: 0.0},
      {x: .4, y: 1.5, z: 0.0},
      {x: .6, y: 1.5, z: 0.0},
      {x: .8, y: 1.5, z: 0.0},
      {x: 1.4, y: 1.5, z: 0.0},
      {x: 1.6, y: 1.5, z: 0.0},
      {x: 1.8, y: 1.5, z: 0.0},
      {x: 1.4, y: 1.7, z: 0.0},
      {x: 1.6, y: 1.7, z: 0.0},
      {x: 1.8, y: 1.7, z: 0.0},
      {x: -.2, y: 1.3, z: 0.0},//2
      {x: 0.0, y: 1.3, z: 0.0},
      {x: 0.2, y: 1.3, z: 0.0},
      {x: .4, y: 1.3, z: 0.0},
      {x: .6, y: 1.3, z: 0.0},
      {x: .8, y: 1.3, z: 0.0},
      {x: 1, y: 1.3, z: 0.0},
      {x: 1.2, y: 1.3, z: 0.0},
      {x: 1.4, y: 1.3, z: 0.0},
      {x: 1.6, y: 1.3, z: 0.0},
      {x: 1.8, y: 1.3, z: 0.0},
      {x: -.2, y: 1.1, z: 0.0},//3
      {x: 0.0, y: 1.1, z: 0.0},
      {x: 0.2, y: 1.1, z: 0.0},
      {x: .4, y: 1.1, z: 0.0},
      {x: .6, y: 1.1, z: 0.0},
      {x: .8, y: 1.1, z: 0.0},
      {x: 1, y: 1.1, z: 0.0},
      {x: 1.4, y: 1.1, z: 0.0},
      {x: 1.6, y: 1.1, z: 0.0},
      {x: 1.8, y: 1.1, z: 0.0},
      {x: -.4, y: .9, z: 0.0},//4
      {x: -.2, y: .9, z: 0.0},
      {x: 0.0, y: .9, z: 0.0},
      {x: 0.2, y: .9, z: 0.0},
      {x: .4, y: .9, z: 0.0},
      {x: .6, y: .9, z: 0.0},
      {x: .8, y: .9, z: 0.0},
      {x: 1, y: .9, z: 0.0},
      {x: 1.2, y: .9, z: 0.0},
      {x: 1.4, y: .9, z: 0.0},
      {x: 1.6, y: .9, z: 0.0},
      {x: 1.8, y: .9, z: 0.0},
      {x: -.4, y: .7, z: 0.0},//5
      {x: -.2, y: .7, z: 0.0},
      {x: 0.0, y: .7, z: 0.0},
      {x: 0.2, y: .7, z: 0.0},
      {x: .4, y: .7, z: 0.0},
      {x: .6, y: .7, z: 0.0},
      {x: .8, y: .7, z: 0.0},
      {x: 1, y: .7, z: 0.0},
      {x: 1.2, y: .7, z: 0.0},
      {x: 1.4, y: .7, z: 0.0},
      {x: 1.6, y: .7, z: 0.0},
      {x: 1.8, y: .7, z: 0.0},
      {x: -.4, y: .5, z: 0.0},//6
      {x: -.2, y: .5, z: 0.0},
      {x: 0.0, y: .5, z: 0.0},
      {x: 0.2, y: .5, z: 0.0},
      {x: .4, y: .5, z: 0.0},
      {x: .6, y: .5, z: 0.0},
      {x: .8, y: .5, z: 0.0},
      {x: 1, y: .5, z: 0.0},
      {x: 1.2, y: .5, z: 0.0},
      {x: 1.4, y: .5, z: 0.0},
      {x: 1.6, y: .5, z: 0.0},
      {x: 1.8, y: .5, z: 0.0},
      {x: 0.0, y: .3, z: 0.0},//7
      {x: 0.2, y: .3, z: 0.0},
      {x: .4, y: .3, z: 0.0},
      {x: .6, y: .3, z: 0.0},
      {x: .8, y: .3, z: 0.0},
      {x: 1, y: .3, z: 0.0},
      {x: 1.2, y: .3, z: 0.0},
      {x: 1.4, y: .3, z: 0.0},
      {x: -.8, y: .1, z: 0.0},//8
      {x: -.6, y: .1, z: 0.0},
      {x: -.4, y: .1, z: 0.0},
      {x: -.2, y: .1, z: 0.0},
      {x: 0.0, y: .1, z: 0.0},
      {x: 0.2, y: .1, z: 0.0},
      {x: .4, y: .1, z: 0.0},
      {x: .6, y: .1, z: 0.0},
      {x: .8, y: .1, z: 0.0},
      {x: 1, y: .1, z: 0.0},
      {x: 1.2, y: .1, z: 0.0},
      {x: -1.0, y: -.1, z: 0.0},//9
      {x: -.8, y: -.1, z: 0.0},
      {x: -.6, y: -.1, z: 0.0},
      {x: -.4, y: -.1, z: 0.0},
      {x: -.2, y: -.1, z: 0.0},
      {x: 0.0, y: -.1, z: 0.0},
      {x: 0.2, y: -.1, z: 0.0},
      {x: .4, y: -.1, z: 0.0},
      {x: .6, y: -.1, z: 0.0},
      {x: .8, y: -.1, z: 0.0},
      {x: 1, y: -.1, z: 0.0},
      {x: 1.2, y: -.1, z: 0.0},
      {x: 1.8, y: -.1, z: 0.0},
      {x: -1.2, y: -.3, z: 0.0},//10
      {x: -1.0, y: -.3, z: 0.0},
      {x: -.8, y: -.3, z: 0.0},
      {x: -.6, y: -.3, z: 0.0},
      {x: -.4, y: -.3, z: 0.0},
      {x: -.2, y: -.3, z: 0.0},
      {x: 0.0, y: -.3, z: 0.0},
      {x: 0.2, y: -.3, z: 0.0},
      {x: .4, y: -.3, z: 0.0},
      {x: .6, y: -.3, z: 0.0},
      {x: .8, y: -.3, z: 0.0},
      {x: 1, y: -.3, z: 0.0},
      {x: 1.2, y: -.3, z: 0.0},
      {x: 1.8, y: -.3, z: 0.0},
      {x: -1.2, y: -.5, z: 0.0},//11
      {x: -1.0, y: -.5, z: 0.0},
      {x: -.8, y: -.5, z: 0.0},
      {x: -.4, y: -.5, z: 0.0},
      {x: -.2, y: -.5, z: 0.0},
      {x: 0.0, y: -.5, z: 0.0},
      {x: 0.2, y: -.5, z: 0.0},
      {x: .4, y: -.5, z: 0.0},
      {x: .6, y: -.5, z: 0.0},
      {x: .8, y: -.5, z: 0.0},
      {x: 1, y: -.5, z: 0.0},
      {x: 1.2, y: -.5, z: 0.0},
      {x: 1.4, y: -.5, z: 0.0},
      {x: 1.6, y: -.5, z: 0.0},
      {x: 1.8, y: -.5, z: 0.0},
      {x: -1.0, y: -.7, z: 0.0},//12
      {x: -.6, y: -.7, z: 0.0},
      {x: -.4, y: -.7, z: 0.0},
      {x: -.2, y: -.7, z: 0.0},
      {x: 0.0, y: -.7, z: 0.0},
      {x: 0.2, y: -.7, z: 0.0},
      {x: .4, y: -.7, z: 0.0},
      {x: .6, y: -.7, z: 0.0},
      {x: .8, y: -.7, z: 0.0},
      {x: 1, y: -.7, z: 0.0},
      {x: 1.2, y: -.7, z: 0.0},
      {x: 1.4, y: -.7, z: 0.0},
      {x: 1.6, y: -.7, z: 0.0},
      {x: 1.8, y: -.7, z: 0.0},
      {x: -.8, y: -.9, z: 0.0},//13
      {x: -.6, y: -.9, z: 0.0},
      {x: -.4, y: -.9, z: 0.0},
      {x: -.2, y: -.9, z: 0.0},
      {x: 0.0, y: -.9, z: 0.0},
      {x: 0.2, y: -.9, z: 0.0},
      {x: .4, y: -.9, z: 0.0},
      {x: .6, y: -.9, z: 0.0},
      {x: .8, y: -.9, z: 0.0},
      {x: 1, y: -.9, z: 0.0},
      {x: 1.2, y: -.9, z: 0.0},
      {x: 1.4, y: -.9, z: 0.0},
      {x: 1.6, y: -.9, z: 0.0},
      {x: 1.8, y: -.9, z: 0.0},
      {x: -1.0, y: -1.1, z: 0.0},//14
      {x: -.8, y: -1.1, z: 0.0},
      {x: -.6, y: -1.1, z: 0.0},
      {x: -.4, y: -1.1, z: 0.0},
      {x: -.2, y: -1.1, z: 0.0},
      {x: 0.0, y: -1.1, z: 0.0},
      {x: 0.2, y: -1.1, z: 0.0},
      {x: .4, y: -1.1, z: 0.0},
      {x: .6, y: -1.1, z: 0.0},
      {x: .8, y: -1.1, z: 0.0},
      {x: -1.0, y: -1.3, z: 0.0},//15
      {x: -.4, y: -1.3, z: 0.0},
      {x: -.2, y: -1.3, z: 0.0},
      {x: 0.0, y: -1.3, z: 0.0},
      {x: 0.2, y: -1.3, z: 0.0},
    ];
    const marioColors = {
      0: 0xff0000,//赤
      1: 0xff0000,
      2: 0xff0000,
      3: 0xff0000,
      4: 0xff0000,
      5: 0xf8b500,//茶色
      6: 0xf8b500,
      7: 0xf8b500,
      8: 0xf8b500,
      9: 0xf8b500,
      10: 0xf8b500,
      11: 0xff0000,
      12: 0xff0000,
      13: 0xff0000,
      14: 0xff0000,
      15: 0xff0000,
      16: 0xff0000,
      17: 0xff0000,
      18: 0xff0000,
      19: 0xff0000,
      20: 0xf8b500,
      21: 0xf8b500,
      22: 0x666600,//緑
      23: 0x666600,
      24: 0x666600,
      25: 0xf8b500,
      26: 0xf8b500,
      27: 0x666600,
      28: 0xf8b500,
      29: 0x666600,
      30: 0x666600,
      31: 0x666600,
      32: 0x666600,
      33: 0xf8b500,
      34: 0x666600,
      35: 0xf8b500,
      36: 0xf8b500,
      37: 0xf8b500,
      38: 0x666600,
      39: 0xf8b500,
      40: 0xf8b500,
      41: 0x666600,
      42: 0x666600,
      43: 0x666600,
      44: 0x666600,
      45: 0xf8b500,
      46: 0x666600,
      47: 0x666600,
      48: 0xf8b500,
      49: 0xf8b500,
      50: 0xf8b500,
      51: 0x666600,
      52: 0xf8b500,
      53: 0xf8b500,
      54: 0xf8b500,
      55: 0x666600,
      56: 0x666600,
      57: 0x666600,
      58: 0xf8b500,
      59: 0xf8b500,
      60: 0xf8b500,
      61: 0xf8b500,
      62: 0x666600,
      63: 0x666600,
      64: 0x666600,
      65: 0x666600,
      66: 0x666600,
      67: 0x666600,
      68: 0xf8b500,
      69: 0xf8b500,
      70: 0xf8b500,
      71: 0xf8b500,
      72: 0xf8b500,
      73: 0xf8b500,
      74: 0xf8b500,
      75: 0x666600,
      76: 0x666600,
      77: 0x666600,
      78: 0x666600,
      79: 0x666600,
      80: 0x666600,
      81: 0xff0000,
      82: 0x666600,
      83: 0x666600,
      84: 0x666600,
      85: 0xff0000,
      86: 0x666600,
      87: 0x666600,
      88: 0x666600,
      89: 0x666600,
      90: 0x666600,
      91: 0x666600,
      92: 0x666600,
      93: 0x666600,
      94: 0xff0000,
      95: 0x666600,
      96: 0x666600,
      97: 0x666600,
      98: 0xff0000,
      99: 0x666600,
      100: 0xf8b500,
      101: 0xf8b500,
      102: 0xf8b500,
      103: 0x666600,
      104: 0x666600,
      105: 0x666600,
      106: 0x666600,
      107: 0x666600,
      108: 0xff0000,
      109: 0xff0000,
      110: 0xff0000,
      111: 0xff0000,
      112: 0xff0000,
      113: 0x666600,
      114: 0xf8b500,
      115: 0xf8b500,
      116: 0xf8b500,
      117: 0xff0000,
      118: 0xff0000,
      119: 0x666600,
      120: 0xff0000,
      121: 0xff0000,
      122: 0xf8b500,
      123: 0xff0000,
      124: 0xff0000,
      125: 0xf8b500,
      126: 0xff0000,
      127: 0x666600,
      128: 0x666600,
      129: 0xf8b500,
      130: 0x666600,
      131: 0xff0000,
      132: 0xff0000,
      133: 0xff0000,
      134: 0xff0000,
      135: 0xff0000,
      136: 0xff0000,
      137: 0xff0000,
      138: 0xff0000,
      139: 0xff0000,
      140: 0xff0000,
      141: 0x666600,
      142: 0x666600,
      143: 0x666600,
      144: 0x666600,
      145: 0x666600,
      146: 0xff0000,
      147: 0xff0000,
      148: 0xff0000,
      149: 0xff0000,
      150: 0xff0000,
      151: 0xff0000,
      152: 0xff0000,
      153: 0xff0000,
      154: 0xff0000,
      155: 0x666600,
      156: 0x666600,
      157: 0x666600,
      158: 0x666600,
      159: 0x666600,
      160: 0xff0000,
      161: 0xff0000,
      162: 0xff0000,
      163: 0xff0000,
      164: 0xff0000,
      165: 0xff0000,
      166: 0xff0000,
      167: 0x666600,
      168: 0xff0000,
      169: 0xff0000,
      170: 0xff0000,
      171: 0xff0000,
      172: 0xff0000,
    };
    for(let i = 0; i < marioCount; i++) {
      this.boxMaterial = new THREE.MeshPhongMaterial({ color: marioColors[i] });
      const marioBox = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
      marioBox.position.set(marioPosition[i].x, marioPosition[i].y, marioPosition[i].z);
      this.mario.add(marioBox);
    }
    this.mario.scale.setScalar(10);
    this.offscreenScene.add(this.mario);

    // Raycaster のインスタンスを生成する @@@
    this.raycaster = new THREE.Raycaster();
    // マウスのクリックイベントの定義 @@@
    window.addEventListener('click', (mouseEvent) => {
      // スクリーン空間の座標系をレイキャスター用に正規化する（-1.0 ~ 1.0 の範囲）
      const x = mouseEvent.clientX / window.innerWidth * 2.0 - 1.0;
      const y = mouseEvent.clientY / window.innerHeight * 2.0 - 1.0;
      // スクリーン空間は上下が反転している点に注意（Y だけ符号を反転させる）
      const v = new THREE.Vector2(x, -y);
      // レイキャスターに正規化済みマウス座標とカメラを指定する
      this.raycaster.setFromCamera(v, this.camera);
      // scene に含まれるすべてのオブジェクト（ここでは Mesh）を対象にレイキャストする
      const intersects = this.raycaster.intersectObject(this.machine);

      if (intersects.length > 0) {
        if(this.isOPEN) {
          this.isOPEN = false;
        } else {
          this.isOPEN = true;
        }
      }
    }, false);
    
    // レンダーターゲットをアスペクト比 1.0 の正方形で生成する @@@
    this.renderTarget = new THREE.WebGLRenderTarget(ThreeApp.RENDER_TARGET_SIZE, ThreeApp.RENDER_TARGET_SIZE);
    this.offscreenCamera = this.camera.clone();
    this.offscreenCamera.aspect = 1.0;
    this.offscreenCamera.updateProjectionMatrix();
    
    const planeGeometry = new THREE.PlaneGeometry(25, 22);
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane.position.y = 16;
    this.plane.position.z = 2.1;
    planeMaterial.map = this.renderTarget.texture;
    this.scene.add(this.plane);
    this.blackColor = new THREE.Color(0x00d5ff);
    this.whiteColor = new THREE.Color(0xffffff);
    this.headwrap.add(this.plane);
	}
	render(){
		requestAnimationFrame(this.render);
    
		this.controls.update();
    // まず最初に、オフスクリーンレンダリングを行う @@@
    this.renderer.setRenderTarget(this.renderTarget);
    // オフスクリーンレンダリングは常に固定サイズ
    this.renderer.setSize(ThreeApp.RENDER_TARGET_SIZE, ThreeApp.RENDER_TARGET_SIZE);
    // わかりやすくするために、背景を黒にしておく
    this.renderer.setClearColor(this.blackColor, 1.0);
    // オフスクリーン用のシーン（Duck が含まれるほう）を描画する
    this.renderer.render(this.offscreenScene, this.offscreenCamera);

    // 次に最終的な画面の出力用のシーンをレンダリングするため null を指定しもとに戻す @@@
    this.renderer.setRenderTarget(null);
    // 最終的な出力はウィンドウサイズ
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // わかりやすくするために、背景を白にしておく
    this.renderer.setClearColor(this.whiteColor, 1.0);
    // 板ポリゴンが１枚置かれているだけのシーンを描画sする
    this.renderer.render(this.scene, this.camera);

    if(this.isOPEN) {
      this.headwrap.rotation.x -= .04;
    } else {
      this.headwrap.rotation.x += .04;
    }
    if(this.headwrap.rotation.x < 0) {
      this.headwrap.rotation.x = 0;
    } else if(this.headwrap.rotation.x > 2.15) {
      this.headwrap.rotation.x = 2.15;
    }
	}
}
