'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home,
  Search,
  FileText,
  Calendar,
  Pill,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PatientProfile } from '@/lib/firestore';

interface DashboardSidebarProps {
  profile?: PatientProfile;
  activePage?: string;
}

export function DashboardSidebar({
  profile,
  activePage,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <Home size={20} />,
      path: '/dashboard',
      badge: null,
    },
    {
      name: 'Find Trials',
      icon: <Search size={20} />,
      path: '/trials',
      badge: '12',
    },
    {
      name: 'Add Documents',
      icon: <FileText size={20} />,
      path: '/documents/upload',
      badge: null,
    },
    {
      name: 'Appointments',
      icon: <Calendar size={20} />,
      path: '/appointments',
      badge: '2',
    },
    {
      name: 'Report Event',
      icon: <FileText size={20} />,
      path: '/report',
      badge: '3',
    },
  ];

  // const bottomMenuItems = [
  //   { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  //   { name: 'Help', icon: <HelpCircle size={20} />, path: '/help' },
  //   { name: 'Logout', icon: <LogOut size={20} />, path: '/logout' },
  // ];

  return (
    <motion.div
      className={cn(
        'h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out',
        collapsed ? 'w-[70px]' : 'w-[240px]'
      )}
      animate={{ width: collapsed ? 70 : 240 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle button */}
      <div className="absolute -right-3 top-12">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-6 w-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>

      {/* User profile */}
      <div
        className={cn(
          'flex items-center p-4 border-b border-gray-200 dark:border-gray-700',
          collapsed ? 'justify-center' : 'px-6'
        )}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <p className="font-medium truncate">John Doe</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Patient ID: #12345
            </p>
          </div>
        )}
      </div>

      {/* Main menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.path} className="block">
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg transition-colors',
                  activePage === item.path.substring(1)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                )}
              >
                <div
                  className={cn(
                    'flex items-center',
                    collapsed ? 'justify-center w-full' : ''
                  )}
                >
                  <span
                    className={cn(
                      activePage === item.path.substring(1)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="ml-3 flex-1">{item.name}</span>
                  )}

                  {/* {!collapsed && item.badge && (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                    >
                      {item.badge}
                    </Badge>
                  )}

                  {collapsed && item.badge && (
                    <Badge className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 h-4 w-4 p-0 flex items-center justify-center bg-blue-500 text-[10px]">
                      {item.badge}
                    </Badge>
                  )} */}
                </div>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom menu
      <div className="border-t border-gray-200 dark:border-gray-700 py-4 px-2">
        <nav className="space-y-1">
          {bottomMenuItems.map((item) => (
            <Link key={item.name} href={item.path} className="block">
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg transition-colors',
                  activePage === item.path.substring(1)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                )}
              >
                <div
                  className={cn(
                    'flex items-center',
                    collapsed ? 'justify-center w-full' : ''
                  )}
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.icon}
                  </span>

                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </div>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div> */}
    </motion.div>
  );
}
