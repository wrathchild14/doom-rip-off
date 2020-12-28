import Application from '../../common/Application.js';
import * as WebGL from './WebGL.js';
import GLTFLoader from './GLTFLoader.js';
import Renderer from './Renderer.js';

import PerspectiveCamera from './PerspectiveCamera.js';
import Node from './Node.js';
import MyCamera from './MyCamera.js';
import Bullet from './Bullet.js';
import Physics from './Physics.js';
import OrthographicCamera from './OrthographicCamera.js';


const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

class App extends Application {

	async start() {
		this.loader = new GLTFLoader();
		// await this.loader.load('../../common/models/Cube/Cube.gltf');
		// await this.loader.load('../../common/models/BoxTextured/BoxTextured.gltf');
		// await this.loader.load('../../common/models/monkey/monkey.gltf');
		// await this.loader.load('../../common/models/test/test.gltf');
		// await this.loader.load('../../common/models/untitled/untitled.gltf');
		await this.loader.load('../../common/models/1level/1level.gltf');
		// await this.loader.load('../../common/models/collision_test/collision_test.gltf');
		// await this.loader.load('../../common/models/aabbtest/aabbtest.gltf');
		// await this.loader.load('../../common/models/pyramid/pyramid.gltf');
		// await this.loader.load('../../common/models/myLevel/myLevel.gltf')

		console.log(this.loader);

		this.scene = await this.loader.loadScene(this.loader.defaultScene);
		//this.camera = await this.loader.loadNode('Camera');

		this.camera = new MyCamera();
		this.camera.translation = vec3.fromValues(0, 1, 2);
		// this.camera.updateMatrix();
		this.camera.maxSpeed = 10;
		this.camera.acceleration = 50;

		this.camera.camera = new PerspectiveCamera();
		this.scene.addNode(this.camera);

		// adding nodes manually to test my bullets
		// let bullet = new Bullet();
		this.bulletMesh = this.scene.nodes[3].mesh;
		this.bullet = new Bullet(this.bulletMesh);
		this.bullet.translation = vec3.fromValues(1, 1, 4);
		this.scene.addNode(this.bullet);

		console.log(this.scene);
		this.physics = new Physics(this.scene);
		console.log(this.physics);

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
			this.camera.update(dt); // returns rotation (or usefulstuff shooting)
			this.bullets = this.camera.getBullets();
		}

		if (this.physics) {
			this.physics.update(dt);
		}
		// bad
		if (this.bullet) {
			this.bullet.update(dt);
			
			// this.bullet = this.bullets[0];
			// this.sceneBullets(this.bullet);
			// for (const bullet of this.bullets) {
			// 	this.sceneBullets();
			// 	bullet.mesh = this.bulletMesh;
			// 	bullet.update(dt);
			// }
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