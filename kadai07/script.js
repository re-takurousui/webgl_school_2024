'use strict'

import { WebGLUtility } from './lib/webgl.js';
import { Mat4 } from './lib/math.js';
import { WebGLGeometry } from './lib/geometry.js';
import { WebGLOrbitCamera } from './lib/camera.js';
import { Pane } from './lib/tweakpane-4.0.3.min.js';

window.addEventListener('DOMContentLoaded', async () => {
  const app = new App();
  app.init();
  app.setupPane();
  await app.load();
  app.setupGeometry();
  app.setupLocation();
  app.start();
}, false);

class App {
  canvas;     
  gl;         
  program;
  attributeLocation;
  attributeStride;
  uniformLocation;
  planeGeometry;
  planeVBO;
  planeIBO;
  startTime;
  camera;
  isRendering;
  texture0;
  texture1;
  textureVisibility;
  fade;

  constructor() {
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
  }

  init() {
    this.canvas = document.getElementById('webgl-canvas');
    this.gl = WebGLUtility.createWebGLContext(this.canvas);

    const cameraOption = {
      distance: 5.0,
      min: 1.0,
      max: 10.0,
      move: 2.0,
    };
    this.camera = new WebGLOrbitCamera(this.canvas, cameraOption);

    this.resize();

    window.addEventListener('resize', this.resize, false);

    this.gl.enable(this.gl.DEPTH_TEST);

    this.textureVisibility = true;
  }

  setupPane() {
    const gl = this.gl;
    const pane = new Pane();
    const parameter = {
      texture: this.textureVisibility,
      filter: gl.NEAREST,
    };
    pane.addBinding(parameter, 'texture')
    .on('change', (v) => {
      this.textureVisibility = v.value;
    });
    pane.addBinding(parameter, 'filter', {
      options: {
        NEAREST: gl.NEAREST,
        LINEAR: gl.LINEAR,
        NEAREST_MIPMAP_NEAREST: gl.NEAREST_MIPMAP_NEAREST,
        NEAREST_MIPMAP_LINEAR: gl.NEAREST_MIPMAP_LINEAR,
        LINEAR_MIPMAP_NEAREST: gl.LINEAR_MIPMAP_NEAREST,
        LINEAR_MIPMAP_LINEAR: gl.LINEAR_MIPMAP_LINEAR,
      },
    })
    .on('change', (v) => {
      this.setTextureFilter(v.value);
    });
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  load() {
    return new Promise(async (resolve, reject) => {
      const gl = this.gl;
      if (gl == null) {
        const error = new Error('not initialized');
        reject(error);
      } else {
        const VSSource = await WebGLUtility.loadFile('./main.vert');
        const FSSource = await WebGLUtility.loadFile('./main.frag');
        const vertexShader = WebGLUtility.createShaderObject(gl, VSSource, gl.VERTEX_SHADER);
        const fragmentShader = WebGLUtility.createShaderObject(gl, FSSource, gl.FRAGMENT_SHADER);
        this.program = WebGLUtility.createProgramObject(gl, vertexShader, fragmentShader);
        const image0 = await WebGLUtility.loadImage('./sample.jpg');
        const image1 = await WebGLUtility.loadImage('./sample02.jpg');
        this.texture0 = WebGLUtility.createTexture(gl, image0);
        this.texture1 = WebGLUtility.createTexture(gl, image1);
        resolve();
      }
    });
  }

  setupGeometry() {
    const size = 2.5;
    const color = [1.0, 1.0, 1.0, 1.0];
    this.planeGeometry = WebGLGeometry.plane(size, size, color);

    this.planeVBO = [
      WebGLUtility.createVBO(this.gl, this.planeGeometry.position),
      WebGLUtility.createVBO(this.gl, this.planeGeometry.normal),
      WebGLUtility.createVBO(this.gl, this.planeGeometry.color),
      WebGLUtility.createVBO(this.gl, this.planeGeometry.texCoord),
    ];
    this.planeIBO = WebGLUtility.createIBO(this.gl, this.planeGeometry.index);
  }

  setupLocation() {
    const gl = this.gl;
    this.attributeLocation = [
      gl.getAttribLocation(this.program, 'position'),
      gl.getAttribLocation(this.program, 'normal'),
      gl.getAttribLocation(this.program, 'color'),
      gl.getAttribLocation(this.program, 'texCoord'),
    ];
    this.attributeStride = [ 3, 3, 4, 2 ];
    this.uniformLocation = {
      mvpMatrix: gl.getUniformLocation(this.program, 'mvpMatrix'),
      normalMatrix: gl.getUniformLocation(this.program, 'normalMatrix'),
      textureUnit0: gl.getUniformLocation(this.program, 'textureUnit0'),
      textureUnit1: gl.getUniformLocation(this.program, 'textureUnit1'),
      useTexture: gl.getUniformLocation(this.program, "useTexture"), 
      fade: gl.getUniformLocation(this.program, 'fade'),
    };
  }

  setupRendering() {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  start() {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture0);
    
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texture1);
    this.startTime = Date.now();
    this.isRendering = true;
    this.render();
  }

  stop() {
    this.isRendering = false;
  }

  render() {
    const gl = this.gl;

    if (this.isRendering === true) {
      requestAnimationFrame(this.render);
    }

    const nowTime = (Date.now() - this.startTime) * 0.0005;
    this.fade = (Math.sin(nowTime) + 1.0) / 2.0;

    this.setupRendering();

    const m = Mat4.identity();

    const v = this.camera.update();
    const fovy = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1
    const far = 10.0;
    const p = Mat4.perspective(fovy, aspect, near, far);

    const vp = Mat4.multiply(p, v);
    const mvp = Mat4.multiply(vp, m);

    const normalMatrix = Mat4.transpose(Mat4.inverse(m));

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniformLocation.mvpMatrix, false, mvp);
    gl.uniformMatrix4fv(this.uniformLocation.normalMatrix, false, normalMatrix);
    gl.uniform1f(this.uniformLocation.fade, this.fade);
    gl.uniform1i(this.uniformLocation.textureUnit0, 0);
    gl.uniform1i(this.uniformLocation.textureUnit1, 1);
    
    WebGLUtility.enableBuffer(gl, this.planeVBO, this.attributeLocation, this.attributeStride, this.planeIBO);
    gl.drawElements(gl.TRIANGLES, this.planeGeometry.index.length, gl.UNSIGNED_SHORT, 0);
  }
}
