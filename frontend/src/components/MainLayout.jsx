import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
const MainLayout=()=>{
    return(
        <div className="flex md:flex-col-reverse justify-center gap-2">
            <LeftSidebar/>
            <div>
                <Outlet/>
                {/*the Outlet component is used as a placeholder to render child routes within a parent route. It allows for nested routing, enabling you to organize your application into hierarchies and reuse layout components effectively*/}
            </div>
        </div>
    )
}
export default MainLayout