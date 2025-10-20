"use client"

import { useState } from "react"
import { WebsiteAnalytics } from "../components/analytics/Analytics"

export default function DashboardPage() {
  const [ setActiveSection] = useState("analytics")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [loading] = useState(false)

  return (
      <WebsiteAnalytics
        setActiveSection={setActiveSection}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        loading={loading}
      />
  )
}