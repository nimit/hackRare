// app/clinic/components/navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/lib/clinic_store";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Home, CirclePlusIcon } from "lucide-react";

export function ClinicNavbar({ isLoggedIn: isLoggedIn }) {
  const pathname = usePathname();
  const { clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearAuth();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="mr-4 hidden md:flex">
          <Link href="/clinic/dashboard">
            <div className="text-xl font-bold">Clinical Portal</div>
          </Link>
        </div>

        {isLoggedIn ? (
          <NavigationMenu className="mx-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/clinic/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === "/clinic/dashboard" &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/clinic/patients" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === "/clinic/newtrial" &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <CirclePlusIcon className="mr-2 h-4 w-4" />
                    New Trial
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <></>
        )}

        {/* {
          isLoggedIn ?
            (<NavigationMenu className="mx-6">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/clinic/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === '/clinic/dashboard' && "bg-accent text-accent-foreground"
                    )}>
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/clinic/patients" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === '/clinic/patients' && "bg-accent text-accent-foreground"
                    )}>
                      <Users className="mr-2 h-4 w-4" />
                      Patients
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/clinic/studies" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === '/clinic/studies' && "bg-accent text-accent-foreground"
                    )}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Studies
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>) : (<></>)} */}

        {isLoggedIn ? (
          <div className="ml-auto flex items-center">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
