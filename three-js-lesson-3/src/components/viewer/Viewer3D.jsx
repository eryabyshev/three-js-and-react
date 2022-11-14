import React, {useEffect, useState} from 'react';
import ViewerCanvas from "./ViewerCanvas";
import Viewer from "../../core/viewer";
import * as THREE from "three";
import Loader from "../ui/loader/Loader";
import useBus from "use-bus";
import {ANIMATION_ADD, AXES_HELPER_OFF, AXES_HELPER_ON} from "./index";

const Viewer3D = ({renderSettings, elements, renderUpdatePool, id}) => {

    const canvasId = "canvas_" + id
    let viewer = {}
    let group = new THREE.Group()

    const isProperBusComponent= (e) => { return e.id === id }

    useBus((e) => isProperBusComponent(e) && e.type === AXES_HELPER_ON, () => {
        viewer.addAxesHelper()
    })
    useBus((e) => isProperBusComponent(e) && e.type === AXES_HELPER_OFF, () => {
        viewer.disposeAxesHelper()}
    )

    useBus((e) => isProperBusComponent(e) && e.type === ANIMATION_ADD, (e) => {
       console.log(e.payload)
        viewer.addUpdate(e.payload.name, { obj: e.payload.obj, animation: e.payload.animation })
    })

    useEffect(() => {
        viewer = new Viewer(
            {
                render: renderSettings,
                parent: document.getElementById(canvasId)
            }
        )

        viewer.scene.add(group)
        elements.forEach(it => group.add(it))
        for(let key in renderUpdatePool) {
            viewer.addUpdate(key, renderUpdatePool[key])
        }
    }, [])

    return (
        <ViewerCanvas id={canvasId} height="100%"/>
    );
};

export default Viewer3D;