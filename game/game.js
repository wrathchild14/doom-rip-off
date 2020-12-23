import Application from '../../common/Application.js';
import * as WebGL from './WebGL.js';
import GLTFLoader from './GLTFLoader.js';
import Renderer from './Renderer.js';

import PerspectiveCamera from './PerspectiveCamera.js';
import Node from './Node.js';
import MyCamera from './MyCamera.js';
import Physics from './Physics.js';
import OrthographicCamera from './OrthographicCamera.js';


const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

class App extends Application {

	async start() {
		this.loader = new GLTFLoader();
		// await this.loader.load('../../common/models/monkey/monkey.gltf');
		// await this.loader.load('../../common/models/test/test.gltf');
		// await this.loader.load('../../common/models/pyramid/pyramid.gltf');
		await this.loader.load('../../common/models/myLevel/myLevel.gltf')

		this.scene = await this.loader.loadScene(this.loader.defaultScene);
		this.camera = await this.loader.loadNode('Camera');

		this.camera = new MyCamera();
		this.camera.updateTransform();
		this.camera.updateMatrix();

		this.camera.translation = vec3.fromValues(1, 1, 5);
		this.camera.updateMatrix();
		this.camera.camera = new PerspectiveCamera();
		this.scene.addNode(this.camera);

		// physics can pause
		// this.physics = new Physics(this.scene);

		this.renderer = new Renderer(this.gl);
		this.renderer.prepareScene(this.scene);
		this.resize();

		this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
		document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);
	}

	enableCamera() {
		this.canvas.requestPointerLock();
	}

	pointerlockchangeHandler() {
		if (document.pointerLockElement === this.canvas) {
			this.camera.enable();
		} else {
			this.camera.disable();
		}
	}

	update() {
		this.time = Date.now();
		const dt = (this.time - this.startTime) * 0.001;
		this.startTime = this.time;

		if (this.camera) {
			this.camera.update(dt);
		}

		if (this.physics) {
			this.physics.update(dt);
		}
	}

	render() {
		if (this.renderer) {
			this.renderer.render(this.scene, this.camera);
		}
	}

	resize() {
		const w = this.canvas.clientWidth;
		const h = this.canvas.clientHeight;
		const aspectRatio = w / h;

		if (this.camera) {
			this.camera.camera.aspect = aspectRatio;
			this.camera.camera.updateMatrix();
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.querySelector('canvas');
	const app = new App(canvas);
	const gui = new dat.GUI();
	gui.add(app, 'enableCamera');
});