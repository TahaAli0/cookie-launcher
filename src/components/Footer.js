import React, {useRef, useState} from "react";

import Button from '@mui/material/Button';

import { TextField } from "@mui/material";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}
const Footer = () => {

    const [VersionsList, setVersionsList] = useState(null); 

    const [selectedVersion, setSelectedVersion] = useState(null)

    const username = useRef(null)

    const [disabledAttr, SetAttrs] = useState(false)

    const [isLoading, setIsLoading] = useState(true);

    const [isDisabled, setIsDisabled] = useState(true)

    const handleChange = (event) => {
        setSelectedVersion(event.target.value);

    electron.versionsApi.receiveVersions((versions, list) => {
        setIsLoading(false)
        setVersionsList(list)
        setIsDisabled(false)
    })

    electron.consoleApi.recieveLog((log, e) => {
        if (e === "closed") { SetAttrs(false) }
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
    return (
        <div class="footer">
        <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Version</InputLabel>
        <Select
          value={selectedVersion}
          onChange={handleChange}
          label="Versions"
        >{
            VersionsList.map((version) => (
            <MenuItem
              key={version.label}
              value={version.value}
            >
              {version.label}
            </MenuItem>
            ))
          }
          </Select>
        <TextField label="Username" required disabled={disabledAttr} inputRef={username}></TextField>
        <Button disabled={disabledAttr} onClick={handleClick}>Launch</Button>
        </FormControl>
        </div>

    )
}
}

export default Footer;