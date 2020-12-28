import Node from './Node.js';

const mat4 = glMatrix.mat4;
const quat = glMatrix.quat;
const vec3 = glMatrix.vec3;


export default class Bullet extends Node {
	constructor(mesh, options = {}) {
		super(options = {});

		this.r = options.r ?
			vec3.clone(options.r) :
			vec3.fromValues(0, 0, 0);
		// this.projection = options.projection ?
		//     mat4.clone(options.projection) :
		//     mat4.create();
		this.velocity = options.velocity ?
			vec3.clone(options.velocity) :
			vec3.fromValues(0, 0, 0);
		this.mouseSensitivity = 0.002;
		this.maxSpeed = 3;
		this.friction = 0.2;
		this.acceleration = 20;

		this.scale = vec3.fromValues(0.1, 0.1, 0.1);

		this.mesh = mesh;

		this.aabb = {
			"min": [-0.1, -0.1, -0.1],
			"max": [0.1, 0.1, 0.1]
		}

		this.updateTransformB();
	}

	update(dt) {
		// const c = this;

		const forward = vec3.set(vec3.create(),
			-Math.sin(this.rotation[1]), 0, -Math.cos(this.rotation[1]));

		let acc = vec3.create(0,0,0);
		vec3.add(acc, acc, forward);

		vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

		const len = vec3.len(this.velocity);
		if (len > this.maxSpeed) {
			vec3.scale(this.velocity, this.velocity, this.maxSpeed / len);
		}

		vec3.scaleAndAdd(this.translation, this.translation, this.velocity, dt);

		this.updateMatrix();
	}
}