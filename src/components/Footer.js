import React, {useRef, useState} from "react";

import Button from '@mui/material/Button';

import { TextField } from "@mui/material";

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}


const Footer = () => {

    const username = useRef(null)

    const handleClick = function () {
        console.log(`${username.current.value} at handleClick`)
        if (username.current.value.length === 0 || hasWhiteSpace(username.current.value)){
            console.log(`Test Failed`)
            return
        }
        electron.launcherApi.sendToLauncher(username.current.value)

    }
    //const handleNotification = function () {
    //    electron.notificationApi.sendNotification("My custom Damnnn")
    //}
    return (
        <div class="footer">
        <TextField label="Username" required inputRef={username}></TextField>
        <Button onClick={handleClick}>Show name</Button>
        </div>
    )
}

export default Footer;