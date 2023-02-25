import React, {useRef, useState, useEffect} from "react";

import Button from '@mui/material/Button';

import { TextField } from "@mui/material";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}
const Footer = () => {

    const [VersionsList, setVersionsList] = useState([]); 

    const [selectedVersion, setSelectedVersion] = useState("1.19.3")

    const username = useRef(null)

    const [disabledAttr, SetAttrs] = useState(false)

    const [isLoading, setIsLoading] = useState(true);

    const [isDisabled, setIsDisabled] = useState(true)

    const handleChange = (event) => {
        setSelectedVersion(event.target.value);
    }

    electron.versionsApi.receiveVersions((versions, list) => {
        setIsLoading(false)
        setVersionsList(list)
        setIsDisabled(false)
    })

    electron.consoleApi.receiveLog((log, e) => {
        if (e === "closed") { SetAttrs(false) }
    })

    const handleClick = function () {
        console.log(`${username.current.value} at handleClick`)
        if (username.current.value.length === 0 || hasWhiteSpace(username.current.value)){
            console.log(`Test Failed`)
            return
        }
        SetAttrs(true)
        electron.launcherApi.sendToLauncher(username.current.value, selectedVersion)

    }

    return (
        <div className="footer">
        <FormControl disabled={disabledAttr}>
            <InputLabel>Version</InputLabel>
            <Select value={selectedVersion} label="Version" onChange={handleChange}> 
                {VersionsList.map((version) => (
                    <MenuItem key={version.label} value={version.value}>{version.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
        <TextField label="Username" required disabled={disabledAttr} inputRef={username}></TextField>
        <Button disabled={disabledAttr} onClick={handleClick}>Launch</Button>
        </div>
    )
}

export default Footer;