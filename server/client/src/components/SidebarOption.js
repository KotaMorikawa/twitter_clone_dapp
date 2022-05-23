import React from "react";
import { useState } from "react";
import "../style/SidebarOption.css";

function SidebarOption({text, Icon, onPress}) {

    return(
        <div className="sidebarOption">
            <Icon />
            <h2>{text}</h2>
        </div>
    )

}

export default SidebarOption;