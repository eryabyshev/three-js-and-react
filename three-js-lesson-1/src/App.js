import './App.css';
import Viewer3D from "./components/viewer/Viewer3D";
import {useState} from "react";
import * as THREE from 'three';

function App() {

  const [settings, setSettings] = useState({
        antialias: true,
        alpha: false,
        clearColor: "grey",
        pixelRatio: 1
      }
  )

  const box = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshBasicMaterial( {color : "grey"})
  )
  box.position.z = -5

  const updatePool = {
    "rotate_object": () => {
      box.rotation.y += 0.01
    }
  }

  return (
    <div className="App">
      <Viewer3D renderSettings={settings} object3d={box} renderUpdatePool={updatePool}/>
    </div>
  );
}

export default App;
