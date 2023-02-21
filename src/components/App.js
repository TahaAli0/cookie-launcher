import React from "react";

import Button from '@mui/material/Button';

const App = () => {

    const handleNotification = function () {
        electron.notificationApi.sendNotification("My custom Damnnn")
    }

    return (
        <>
        <h1>Hi there</h1>
        <Button onClick={handleNotification}>Notify</Button>
        </>
    )
}

export default App