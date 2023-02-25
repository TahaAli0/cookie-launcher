import React, { useState } from "react";


const Console = () => {

    const [logger, setLogger] = useState(null)

    electron.consoleApi.receiveLog((log, e) => {
        if (e === "closed") {
            setLogger("")
            return
        }
        setLogger(e)
    })

    return (
        <div className="console">
        <p>{logger}</p>
        </div>
    )
}

export default Console;