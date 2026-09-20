/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, CheckCircle } from 'lucide-react'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const { notifications } = await res.json()
          setNotifications(notifications)
        }
      } catch (err) {
        console.error('Failed to fetch notifications')
      }
    }
    fetchNotifications()
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.readAt).length

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.readAt).map(n => n.id)
    if (unreadIds.length === 0) return

    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MARK_READ', notificationIds: unreadIds })
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })))
    } catch (err) {
      console.error('Failed to mark read')
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#071426]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                You have no notifications.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 transition-colors ${!notification.readAt ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                       <h4 className={`text-sm ${!notification.readAt ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                         {notification.title}
                       </h4>
                       {!notification.readAt && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5"></span>}
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{notification.message}</p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
