import * as THREE from 'three';

export const RESIZE_RENDER = "resize_render"
export const RESIZE_CAMERA = "resize_camera"

export default class Viewer {

    axesHelper = new THREE.AxesHelper( 5 )

    constructor(settings) {
        this.#createResize();
        this.createRenderer(settings);
        this.createCamera();
        this.createScene();
        this.createLight();
        this.#update();
    }

    #getResizePollHooks() {
        return {
            "resize_render": () => {
                this.renderer.setSize(
                    this.renderer.domElement.parentNode.offsetWidth,
                    this.renderer.domElement.parentNode.offsetHeight
                )
            },
            "resize_camera": () => {
                this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
                this.camera.updateProjectionMatrix();
            }

        }
    }

    #resizePool = {}
    #updatePool = {}

    createRenderer(settings) {
        if (this.renderer) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            this.renderer.dispose();
        }

        this.renderer = new THREE.WebGLRenderer(settings);
        settings.parent.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(settings.clearColor || "black");
        this.renderer.setPixelRatio(settings.pixelRatio || devicePixelRatio)
        this.addResize(RESIZE_RENDER);
        this.executeResize(RESIZE_RENDER);
    }

    #createResize() {
        window.addEventListener("resize", () => {this.resize();});
    }

    addResize(name) {
        this.#resizePool[name] = this.#getResizePollHooks()[name]
    }

    removeResize(name) {
        delete this.#resizePool[name];
    }

    resize() {
        for (let key in this.#resizePool) this.#resizePool[key]();
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.renderer.domElement.width / this.renderer.domElement.height,
            1,
            100
        )
        this.addResize(RESIZE_CAMERA)
    }

    executeResize(name) {
        this.#resizePool[name]()
    }

    createScene() {
        this.scene = new THREE.Scene();
    }

    createLight() {
        this.light1 = new THREE.DirectionalLight(0xffffff, .5);
        this.scene.add(this.light1);
        this.light1.position.set(5, 5, 5);
    }

    /**
     * @param name - is name of render frame
     * @param frame - is next object {obj, animation}
     *
     * example {
     *     obj: new THREE.Mesh(new THREE.BoxGeometry(1,1,1),  new THREE.MeshBasicMaterial( {color : "grey"})),
     *     animation: (box) => { box.rotation.y += 0.01 }
     *}
     **/
    addUpdate(name, frame) {
        this.#updatePool[name] = frame;
    }

    removeUpdate(name) {
        delete this.#updatePool[name];
    }

    #update() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.#update();
        });
        for (let key in this.#updatePool) {
            let frame = this.#updatePool[key];
            frame.animation(frame.obj)
        }
    }

    addAxesHelper() {
        this.disposeAxesHelper()
        this.scene.add(this.axesHelper)
    }

    disposeAxesHelper() {
        this.axesHelper.dispose()
    }
}