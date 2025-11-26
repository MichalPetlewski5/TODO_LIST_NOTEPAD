import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

export default function UserSideBar() {
  return (
    <Sidebar aria-label="Default sidebar example">
      <SidebarItems>
        <SidebarItemGroup>
          <div className="flex justify-center flex-col items-start px-8 ">
            <SidebarItem href="#" icon={HiChartPie}>
              Dashboard
            </SidebarItem>
            <SidebarItem href="#" icon={HiViewBoards} label="Pro" labelColor="dark">
              Kanban
            </SidebarItem>
            <SidebarItem href="#" icon={HiInbox} label="3">
              Inbox
            </SidebarItem>
            <SidebarItem href="#" icon={HiUser}>
              Users
            </SidebarItem>
            <SidebarItem href="#" icon={HiShoppingBag}>
              Products
            </SidebarItem>
            <SidebarItem href="#" icon={HiArrowSmRight}>
              Sign In
            </SidebarItem>
            <SidebarItem href="#" icon={HiTable}>
              Sign Up
            </SidebarItem>
          </div>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}