import React from "react";

import Button from '@mui/material/Button';

import { TextField } from "@mui/material";

const Footer = () => {
    const handleNotification = function () {
        electron.notificationApi.sendNotification("My custom Damnnn")
    }
    return (
        <div class="footer">
        <TextField>Insert</TextField>
        <Button onClick={handleNotification}>Notify</Button>
        </div>
    )
}

export default Footer;