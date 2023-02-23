import React, {useRef, useState} from "react";

import Button from '@mui/material/Button';

import { TextField } from "@mui/material";

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}
const Footer = () => {

    const username = useRef(null)
    const [loger, setLoger] = useState(null)

    const [disabledAttr, SetAttrs] = useState(false)

    electron.consoleApi.recieveLog((log, e) => {
        if (e === "closed") {
            SetAttrs(false)
            setLoger("")
            return
        }
        setLoger(e)
    })

    const handleClick = function () {
        console.log(`${username.current.value} at handleClick`)
        if (username.current.value.length === 0 || hasWhiteSpace(username.current.value)){
            console.log(`Test Failed`)
            return
        }
        SetAttrs(true)
        electron.launcherApi.sendToLauncher(username.current.value)

    }
    //const handleNotification = function () {
    //    electron.notificationApi.sendNotification("My custom Damnnn")
    //}
    return (
        <div class="footer a">
        <TextField label="Username" required disabled={disabledAttr} inputRef={username}></TextField>
        <Button disabled={disabledAttr} onClick={handleClick}>Launch</Button>
        <p class="footer b">{loger}</p>
        </div>
    )
}

export default Footer;