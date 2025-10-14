"use client"

import { useState, useCallback, useEffect } from "react"
import { Edit, Trash2, Building2, Plus, X, ChevronLeft, ChevronRight, Check, Eye, Loader2, AlertTriangle, RefreshCw, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { get } from '../../utils/service'

interface Business {
  business_id: string
  business_name: string
  verification_status: 'approved' | 'pending' | 'rejected'
  assignment_status: 'active' | 'inactive'
  assigned_on: string
}

interface BusinessManagementProps {
  businesses?: Business[]
  setBusinesses?: (businesses: Business[]) => void
  userRole?: string
  onCreateBusiness?: (data: any) => Promise<{success: boolean, error?: string}>
  onUpdateBusiness?: (id: string, data: Partial<Business>) => Promise<{success: boolean, error?: string}>
  onDeleteBusiness?: (id: string) => Promise<{success: boolean, error?: string}>
  loading?: boolean
  error?: string | null
  onRefresh?: () => Promise<void>
}

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 relative animate-pulse">
    <div className="flex items-start gap-3 mb-3">
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
)

// Business Card Component matching the exact image design
const BusinessCard = ({ business }: { business: Business }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 relative">
    {/* Header with icon and business info */}
    <div className="flex items-start gap-3 mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{business.business_name}</h3>
        <p className="text-xs text-gray-500">
          {business.verification_status === 'approved' ? 'Verified' : 
           business.verification_status === 'pending' ? 'Pending Verification' : 'Not Verified'}
        </p>
      </div>
    </div>
    
    {/* Bottom section with status badge */}
    <div className="flex items-center justify-between">
      <div className="text-xs text-gray-500">
        Assigned: {new Date(business.assigned_on).toLocaleDateString()}
      </div>
      
      <Badge 
        className={`text-[10px] px-5 uppercase py-1 rounded-full font-normal ${
          business.assignment_status === 'active' 
            ? 'bg-primary/30 text-secondary' 
            : 'bg-secondary/30 text-white'
        }`}
      >
        {business.assignment_status}
      </Badge>
    </div>
  </div>
)

// MAIN COMPONENT
export default function BusinessManagement({ 
  businesses: propBusinesses, 
  setBusinesses: propSetBusinesses, 
  userRole, 
  onCreateBusiness,
  onUpdateBusiness,
  onDeleteBusiness,
  loading: propLoading = false,
  error: propError = null,
  onRefresh: propOnRefresh
}: BusinessManagementProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [agentInfo, setAgentInfo] = useState<{ agentId: string; agentName: string } | null>(null)

  // Fetch businesses from API
  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await get('agents/businesses')
      
      if (response?.status === 200 && response?.data) {
        const { agentId, agentName, businesses: businessList } = response.data
        
        setAgentInfo({ agentId, agentName })
        setBusinesses(businessList || [])
        
        if (propSetBusinesses) {
          propSetBusinesses(businessList || [])
        }
      } else {
        throw new Error(response?.message || 'Failed to fetch businesses')
      }
    } catch (err) {
      console.error('Failed to fetch businesses:', err)
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load businesses'
      setError(errorMessage)
      toast.error(errorMessage)
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }, [propSetBusinesses])

  // Initial fetch
  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  const onRefresh = propOnRefresh || fetchBusinesses

  // Use prop businesses if provided, otherwise use state
  const displayBusinesses = propBusinesses || businesses

  // Pagination
  const totalPages = Math.ceil(displayBusinesses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBusinesses = displayBusinesses.slice(startIndex, startIndex + itemsPerPage)

  // Reset to page 1 when businesses change
  useEffect(() => {
    setCurrentPage(1)
  }, [displayBusinesses.length])

  const isLoading = propLoading || loading
  const displayError = propError || error

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Select Business for Campaign
            </h1>
            <p className="text-sm text-gray-600">
              Choose a business to create a new campaign for. Only active businesses are eligible for new campaigns.
            </p>
            {agentInfo && (
              <p className="text-xs text-gray-500 mt-2">
                Agent: {agentInfo.agentName} (ID: {agentInfo.agentId})
              </p>
            )}
          </div>

          {/* Error Alert */}
          {displayError && (
            <Alert className="border-red-200 bg-red-50 mb-6">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                {displayError}
                <button 
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="ml-4 inline-flex items-center px-2 py-1 text-xs bg-white border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Retry
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Skeleton Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : (
            <>
              {/* Businesses Grid */}
              {displayBusinesses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {paginatedBusinesses.map((business) => (
                      <BusinessCard 
                        key={business.business_id} 
                        business={business}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mb-8">
                      <div className="text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, displayBusinesses.length)} of {displayBusinesses.length} businesses
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </button>
                        <span className="text-sm text-gray-500">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Empty State */
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No businesses found</h3>
                  <p className="text-sm text-gray-500 mb-4">Contact your administrator to add businesses</p>
                  <button
                    onClick={onRefresh}
                    className="inline-flex items-center px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { BusinessManagement }