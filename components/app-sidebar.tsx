"use client"

import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { usePathname } from "next/navigation"
import SignOutButton from "./SignOutButton"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Photo Management",
      url: "#",
      items: [
        {
          title: "Overview",
          url: "/admin/dashboard",
        },
        {
          title: "Upload Photos",
          url: "/admin/upload"
        },
        {
          title: "Collections",
          url: "#",
        },
        {
          title: "See All",
          url: "#"
        }
      ],
    },
    {
      title: "Fujifilm",
      url: "#",
      items: [
        {
          title: "View Recipes",
          url: "/admin/fuji/recipes"
        },
        {
          title: "Add New Recipe",
          url: "/admin/fuji/add-recipe"
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {
          title: "Personal Information",
          url: "#",
        }
      ],
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Homepage</span>
                  <span className="">sanjayspics.com</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem className="gap-2 ml-2">
              <SignOutButton />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
