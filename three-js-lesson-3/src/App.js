import './App.css';
import Viewer3D from "./components/viewer/Viewer3D";
import {useContext, useEffect, useState} from "react";
import * as THREE from 'three';
import Loader from "./components/ui/loader/Loader";
import ViewerEvent from "./components/viewer";

function App() {

    const viewerId = "some"


    const [settings, setSettings] = useState({
            antialias: true,
            alpha: false,
            clearColor: "grey",
            pixelRatio: 1
        }
    )

    const clock = new THREE.Clock()

    const [sceneObjects, setSceneObjects] = useState([])

    const [animationFrames, setAnimationFrames] = useState({})

    const addSceneElements = (obj) => {
        setSceneObjects([...sceneObjects, obj])
    }

    const addAnimation = (obj, animation) => {
        let frameName = "Frame_" + Object.keys(animationFrames).length
        animationFrames[frameName] = {
            obj: obj,
            animation: animation
        }
        setAnimationFrames(animationFrames)
        return frameName
    }
    useEffect(() => {
        const box = new THREE.Mesh(
                new THREE.BoxGeometry(10,10,10),
                new THREE.MeshBasicMaterial( {color : "green"})
            )

        addSceneElements(box)
    }, [])

    if(sceneObjects.length === 0) {
        return <Loader/>
    }

    return (
        <div className="App">
            <Viewer3D renderSettings={settings} elements={sceneObjects} renderUpdatePool={animationFrames} id={viewerId}/>
            <button onClick={(e) => {
                e.preventDefault()
                ViewerEvent.addAxesHelper(viewerId)}}
            >Add Axes Helper</button>
            <button onClick={() => {
                const callback = (box) => {
                    const elapsedTime = clock.getElapsedTime()
                    box.position.x = Math.sin(elapsedTime) * 10
                    box.position.y = Math.cos(elapsedTime) * 10
                }
                let frameName = addAnimation(sceneObjects[0], callback)
                ViewerEvent.addAnimation(viewerId, sceneObjects[0], frameName, callback)
            }}>
                Add Animation
            </button>

        </div>
    );
}

export default App;
