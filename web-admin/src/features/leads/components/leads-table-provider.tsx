'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ColumnVisibility {
  name: boolean
  email: boolean
  company: boolean
  status: boolean
  source: boolean
  interests: boolean
  priority: boolean
  assignedTo: boolean
  created: boolean
}

interface LeadsTableContextType {
  columnVisibility: ColumnVisibility
  toggleColumn: (columnId: keyof ColumnVisibility) => void
}

const LeadsTableContext = createContext<LeadsTableContextType | undefined>(undefined)

export function LeadsTableProvider({ children }: { children: ReactNode }) {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    email: true,
    company: true,
    status: true,
    source: true,
    interests: true,
    priority: true,
    assignedTo: true,
    created: true,
  })

  const toggleColumn = (columnId: keyof ColumnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  return (
    <LeadsTableContext.Provider value={{ columnVisibility, toggleColumn }}>
      {children}
    </LeadsTableContext.Provider>
  )
}

export function useLeadsTable() {
  const context = useContext(LeadsTableContext)
  if (context === undefined) {
    throw new Error('useLeadsTable must be used within a LeadsTableProvider')
  }
  return context
}

