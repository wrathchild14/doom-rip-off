import Application from '../../common/Application.js';
import * as WebGL from './WebGL.js';
import GLTFLoader from './GLTFLoader.js';
import Renderer from './Renderer.js';

import PerspectiveCamera from './PerspectiveCamera.js';
import Node from './Node.js';
import MyCamera from './MyCamera.js';
import Bullet from './Bullet.js';
import Physics from './Physics.js';
import BulletPhysics from './BulletPhysics.js';
import OrthographicCamera from './OrthographicCamera.js';

import Enemy from './Enemy.js';

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

		this.scene = await this.loader.loadScene(this.loader.defaultScene);

		this.my_bullet = await this.loader.loadNode("Sphere");
		// sphere is my bullet
		this.my_bullet.translation = vec3.fromValues(0, -1, 0);
		this.my_bullet.updateMatrix();

		this.my_enemy = await this.loader.loadNode("Cube.001");
		this.my_enemy.translation = vec3.fromValues(100, -1, 0);
		this.my_enemy.updateMatrix();

		this.kill_counter = -2;

		// making the "player"
		this.camera = new MyCamera();
		this.camera.translation = vec3.fromValues(0, 1, 0);
		this.camera.updateMatrix();
		this.camera.maxSpeed = 7;
		this.camera.acceleration = 40;
		this.camera.camera = new PerspectiveCamera();
		this.scene.addNode(this.camera);

		this.bullets = [];
		this.physics = new Physics(this.scene);

		console.log(this.scene, this.physics);

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
			this.bullets = this.camera.getBullets();

			// this is an oof
			if (this.bullets.length > 0) {
				// this.bulletPhysics.add(this.bullets[0]);
				// so that we dont need the bulletphysics class, we just make and add the bullet here
				this.bullets[0].mesh = this.my_bullet.mesh;
				this.bullets[0].updateMatrix();
				this.scene.addNode(this.bullets[0]);

				this.bullets = [];
				this.camera.delBullets();
			}
			// checks if there are any bullets and if they are, it gets it from the camera
			// and adds it to the bullet phyics which updates it later on
		}

		if (this.physics) {
			this.physics.update(dt);
		}

		// checks how many enemies in the scene and if its less that 2, 
		// randomly spawns in another enemy, can optimize this
		if (this.scene) {
			this.enemy_count = 0;
			for (let i = 0; i < this.scene.nodes.length; i++) {
				if (this.scene.nodes[i].id == "enemy") {
					this.enemy_count++;
				}
			}
		}

		if (this.enemy_count < 2) {
			let enemy = new Enemy();
			this.kill_counter++;
			let x = Math.random() * (5 - -5) + -5;
			let z = Math.random() * (5 - -5) + -5;
			enemy.translation = [x, 1, z];
			enemy.mesh = this.my_enemy.mesh;
			enemy.updateMatrix();
			this.scene.addNode(enemy);
		}

		// delete the bullets if they are out of range 50 on x and y
		if (this.scene) {
			for (let i = 0; i < this.scene.nodes.length; i++) {
				let x = this.scene.nodes[i].translation[0],
					// y = this.scene.nodes[i].translation[1],
					// no need for y
					z = this.scene.nodes[i].translation[2];
				if (x > 50 || x < -50) {
					this.scene.nodes.splice(i, 1);
				} else if (z > 50 || z < -50) {
					this.scene.nodes.splice(i, 1);
				}
			}
		}

		console.log(this.kill_counter);
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