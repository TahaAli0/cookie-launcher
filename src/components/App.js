import React from "react";

const App = () => {

    const handleNotification = function () {
        electron.notificationApi.sendNotification("My custom Damnnn")
    }

    return (
        <>
        <h1>Hi there</h1>
        <button onClick={handleNotification}>Notify</button>
        </>
    )
}

export default App