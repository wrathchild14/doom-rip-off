import Node from './Node.js';

const mat4 = glMatrix.mat4;
const quat = glMatrix.quat;
const vec3 = glMatrix.vec3;


export default class Enemy extends Node {
	constructor(options = {}) {
		super(options = {});

		this.id = "enemy"; // for traverse, to see if its a enemy
		this.r = options.r ?
			vec3.clone(options.r) :
			vec3.fromValues(0, 0, 0);
		this.velocity = options.velocity ?
			vec3.clone(options.velocity) :
			vec3.fromValues(0, 0, 0);
		this.mouseSensitivity = 0.002;
		this.maxSpeed = 3;
		this.friction = 0.2;
		this.acceleration = 20;

		// this.mesh = null; // put the mesh later

		let min = vec3.create();
		vec3.scale(min, this.scale, -1);
		let max = vec3.create();
		vec3.scale(max, this.scale, 1);
		this.aabb = {
			"min": min,
			"max": max
		}
		this.updateTransformB();
	}

	update(dt) {
		// randomize direction towards the player?
	}
}