import Bullet from './Bullet.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const quat = glMatrix.quat;
const vec3 = glMatrix.vec3;


export default class Enemy extends Node {
	constructor(options = {}) {
		super(options = {});

		this.counter = 0;
		this.id = "enemy"; // for traverse, to see if its a enemy
		this.r = options.r ?
			vec3.clone(options.r) :
			vec3.fromValues(0, 0, 0);
		this.velocity = options.velocity ?
			vec3.clone(options.velocity) :
			vec3.fromValues(0, 0, 0);
		this.mouseSensitivity = 0.002;
		this.maxSpeed = 1.5;
		this.friction = 0.2;
		this.acceleration = 20;

		// this.mesh = null; // put the mesh later

		let min = vec3.scale(vec3.create(), this.scale, -1);
		let max = vec3.scale(vec3.create(), this.scale, 1);
		this.aabb = {
			"min": min,
			"max": max
		}
		this.updateTransformB();
	}

	update(dt) {
		// randomize direction towards the player?
		this.r = this.playerRotation;
		const c = this;

		const forward = vec3.set(vec3.create(),
			Math.sin(c.r[1]), 0, Math.cos(c.r[1])); 
		// this is forwards the player (its the behind of the rotation)

		let acc = vec3.create(0, 0, 0);

		// just make them go back lol :D
		vec3.add(acc, acc, forward);
		vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);
		const len = vec3.len(c.velocity);
		if (len > c.maxSpeed) {
			vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
		}
		vec3.scaleAndAdd(c.translation, c.translation, c.velocity, dt);
		this.updateMatrix();

		// if (this.counter % 100 == 0) {
// 
		// 	console.log("im shooitng");
		// 	let bullet = new Bullet();
		// 	bullet.translation = vec3.add(vec3.create(), this.translation, forward);
		// 	bullet.r = vec3.add(vec3.create(), this.r, vec3.create());
// 
		// 	return bullet;
		// 	// shoot the bullets somoehow, its in physics file
		// }
		// this.counter++;
	}
}