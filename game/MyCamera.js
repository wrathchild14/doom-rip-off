import Node from './Node.js';
import Camera from './Camera.js';

const mat4 = glMatrix.mat4;
const quat = glMatrix.quat;
const vec3 = glMatrix.vec3;


export default class MyCamera extends Node {
    constructor(options = {}) {
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

        //test
        this.aabb = {
            "min": [-0.2, -0.2, -0.2],
            "max": [0.2, 0.2, 0.2]
        }

        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keys = {};
    }

    update(dt) {
        const c = this;

        const forward = vec3.set(vec3.create(),
            -Math.sin(c.r[1]), 0, -Math.cos(c.r[1]));
        const right = vec3.set(vec3.create(),
            Math.cos(c.r[1]), 0, -Math.sin(c.r[1]));

        // 1: add movement acceleration
        let acc = vec3.create();
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            vec3.add(acc, acc, right);
        }
        if (this.keys['KeyA']) {
            vec3.sub(acc, acc, right);
        }

        // 2: update velocity
        vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

        // 3: if no movement, apply friction
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA']) {
            vec3.scale(c.velocity, c.velocity, 1 - c.friction);
        }

        // 4: limit speed
        const len = vec3.len(c.velocity);
        if (len > c.maxSpeed) {
            vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }

        // 5: update translation
        vec3.scaleAndAdd(c.translation, c.translation, c.velocity, dt);

        // 6: update the final transform
        const t = c.transform;
        mat4.identity(t);
        mat4.translate(t, t, c.translation);
        mat4.rotateY(t, t, c.r[1]);
        mat4.rotateX(t, t, c.r[0]);

        this.updateMatrix();
    }

    enable() {
        document.addEventListener('mousemove', this.mousemoveHandler);
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    disable() {
        document.removeEventListener('mousemove', this.mousemoveHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);

        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    mousemoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;
        const c = this;

        c.r[0] -= dy * c.mouseSensitivity;
        c.r[1] -= dx * c.mouseSensitivity;

        const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;

        if (c.r[0] > halfpi) {
            c.r[0] = halfpi;
        }
        if (c.r[0] < -halfpi) {
            c.r[0] = -halfpi;
        }

        c.r[1] = ((c.r[1] % twopi) + twopi) % twopi;

        const degrees = c.r.map(x => x * 180 / pi);
        c.rotation = quat.fromEuler(c.rotation, ...degrees);
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }
}