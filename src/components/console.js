import React, { useState } from "react";


const Console = () => {

    const [loger, setLoger] = useState(null)

    electron.consoleApi.recieveLog((log, e) => {
        if (e === "closed") {
            setLoger("")
            return
        }
        setLoger(e)
    })

    return (
        <div class="console">
        <p>{loger}</p>
        </div>
    )
}

export default Console;