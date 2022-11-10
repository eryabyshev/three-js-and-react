import React, {useEffect, useState} from 'react';
import ViewerCanvas from "./ViewerCanvas";
import Viewer from "../../core/viewer";

const Viewer3D = ({renderSettings, object3d, renderUpdatePool, props}) => {

    const [id, setId] = useState(
        "canvas_" + (Math.random() * 10).toString(36).replace('.', '')
    )

    const [viewer, setViewer] = useState(null)
    useEffect(() => {
         let newViewer =  new Viewer(
            {
                render: renderSettings,
                parent: document.getElementById(id)
            }
         )

        newViewer.scene.add(object3d)
        for(let key in renderUpdatePool) {
            newViewer.addUpdate(key, renderUpdatePool[key])
        }
        setViewer(newViewer)
    }, [])

    return (
        <ViewerCanvas id={id} height="100%"/>
    );
};

export default Viewer3D;