'use client';

import Link from 'next/link';
import { ClipboardList, Calendar, User, FileText, Search } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface DashboardSidebarProps {
  profile?: {
    name: string;
  };
  activePage?: 'dashboard' | 'trials' | 'profile' | 'documents';
}

export function DashboardSidebar({
  profile,
  activePage,
}: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex flex-col">
            <span className="font-medium">{profile?.name}</span>
            <span className="text-xs text-muted-foreground">
              Patient Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild active={activePage === 'dashboard'}>
              <Link href="/dashboard">
                <ClipboardList className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild active={activePage === 'trials'}>
              <Link href="/trials">
                <ClipboardList className="h-4 w-4" />
                <span>Clinical Trials</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild active={activePage === 'profile'}>
              <Link href="/profile">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild active={activePage === 'documents'}>
              <Link href="/documents/upload">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
