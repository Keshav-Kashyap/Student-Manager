import React from "react";
import NavigationLinks from "./NavigationLinks";
import UserDropdown from "./UserDropdown";

const DesktopMenu = ({ user }) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <NavigationLinks />
      <UserDropdown user={user} />
    </div>
  );
};

export default DesktopMenu;