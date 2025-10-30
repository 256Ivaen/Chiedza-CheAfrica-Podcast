"use client"

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  FiChevronRight,
  FiUsers,
  FiSettings,
} from 'react-icons/fi'
import { ChevronLeft, X } from 'react-feather'
import { FileText, MessageSquare, Heart, Globe } from "lucide-react"
import { LuLayoutDashboard } from "react-icons/lu"

const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  userRole = 'admin',
  activeSection = 'dashboard',
  setActiveSection,
  isMobile = false
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState({ 
    blogs: true
  })

  const navData = useMemo(() => {
    return [
      {
        title: 'Dashboard',
        path: '/',
        section: 'dashboard',
        icon: <LuLayoutDashboard className="h-4 w-4" />,
      },
      {
        title: 'Website Analytics',
        path: '/analytics',
        section: 'analytics',
        icon: <Globe className="h-4 w-4" />,
      },
      {
        title: 'Blogs',
        icon: <FileText className="h-4 w-4" />,
        children: [
          {
            title: 'All Blogs',
            path: '/blogs',
            section: 'blogs',
          },
          {
            title: 'Create Blog',
            path: '/blogs/create',
            section: 'blogs-create',
          }
        ]
      },
      {
        title: 'Comments',
        path: '/comments',
        section: 'comments',
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        title: 'Reactions',
        path: '/reactions',
        section: 'reactions',
        icon: <Heart className="h-4 w-4" />,
      },
      {
        title: 'Users',
        path: '/users',
        section: 'users',
        icon: <FiUsers className="h-4 w-4" />,
      },
      {
        title: 'Settings',
        path: '/settings',
        section: 'settings',
        icon: <FiSettings className="h-4 w-4" />,
      }
    ]
  }, [])

  const toggleExpanded = (title) => {
    setExpandedItems(prev => ({
      ...prev,
      [title.toLowerCase()]: !prev[title.toLowerCase()]
    }))
  }

  const handleNavClick = (item) => {
    if (item.children) {
      toggleExpanded(item.title)
    } else if (item.path) {
      navigate(item.path)
      if (item.section && setActiveSection) {
        setActiveSection(item.section)
      }
      if (isMobile) {
        toggleSidebar(false)
      }
    }
  }

  const isActiveRoute = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true
    }

    if (path === '/analytics' && location.pathname === '/analytics') {
      return true
    }
    
    if (path === '/blogs' && location.pathname === '/blogs') {
      return true
    }
    
    if (path === '/blogs/create' && location.pathname === '/blogs/create') {
      return true
    }
    
    if (path === '/comments' && location.pathname === '/comments') {
      return true
    }
    
    if (path === '/reactions' && location.pathname === '/reactions') {
      return true
    }
    
    if (path === '/users' && location.pathname === '/users') {
      return true
    }
    
    if (path === '/settings' && location.pathname === '/settings') {
      return true
    }
    
    return false
  }

  return (
    <aside className={`
      bg-white text-gray-700 fixed left-0 top-0 bottom-0 
      ${isOpen ? 'w-64' : (isMobile ? '-translate-x-full w-64' : 'w-16')} 
      transition-all duration-300 shadow-lg border-r border-gray-200 flex flex-col z-40
      ${isMobile ? 'md:translate-x-0' : ''}
    `}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="expanded-logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="h-4 w-4 text-secondary" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Blog Admin</h1>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center mx-auto"
            >
              <FileText className="h-4 w-4 text-secondary" />
            </motion.div>
          )}
        </AnimatePresence>

        {isOpen && (
          <button
            onClick={() => toggleSidebar(false, true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {isMobile ? <X size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navData.map((item) => (
          <div key={item.title} className="space-y-1">
            <div className="relative group">
              <button
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center ${isOpen ? 'px-3' : 'justify-center px-2'} py-2.5 rounded-lg transition-all text-xs ${
                  !item.children && isActiveRoute(item.path)
                    ? 'bg-primary text-secondary font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && (
                  <div className="flex items-center justify-between flex-1 ml-3">
                    <span className="font-medium text-xs">{item.title}</span>
                    {item.children && (
                      <FiChevronRight 
                        className={`w-3 h-3 transition-transform ${
                          expandedItems[item.title.toLowerCase()] ? 'rotate-90' : ''
                        }`} 
                      />
                    )}
                  </div>
                )}
              </button>

              {!isOpen && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {item.title}
                </div>
              )}
            </div>

            {item.children && isOpen && expandedItems[item.title.toLowerCase()] && (
              <div className="ml-3 relative space-y-1 pl-3">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300"></div>
                
                {item.children.map((child) => (
                  <button
                    key={child.title}
                    onClick={() => handleNavClick(child)}
                    className={`w-full flex items-center pl-4 pr-3 py-2 rounded-lg transition-all text-xs relative ${
                      isActiveRoute(child.path)
                        ? 'bg-primary text-secondary font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium text-xs">{child.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {!isOpen && !isMobile && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => toggleSidebar(true, true)}
            className="w-full p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </aside>
  )
}

export default Sidebar