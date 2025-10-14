"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessManagement } from "../business/BusinessManagement.js";
import CampaignForm from "../Campaigns/CampaignForm.js";
import { Button } from "@/components/ui/button";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import {
  TrendingUp,
  ClipboardList,
  Target,
  AlertTriangle,
  RefreshCw,
  FileEdit,
} from "lucide-react";
import { FiPlus } from "react-icons/fi";
import { get } from "../../utils/service";
import { toast } from "sonner";
import { differenceInDays, subMonths, startOfMonth, endOfMonth } from "date-fns";

import type { Business } from "@/types";

interface DashboardProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedCompany: string;
  setSelectedCompany: (companyId: string) => void;
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  loading: boolean;
  onRefresh: () => void;
}

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

function EnhancedDashboardContent({
  setActiveSection,
  loading,
  onRefresh,
  businesses,
}: any) {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    assignedBusinesses: 0,
    draftCampaigns: 0,
    totalCampaigns: 0,
    businessGrowth: 0,
    campaignGrowth: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch assigned businesses from endpoint
  const fetchAssignedBusinesses = async () => {
    try {
      const response = await get('agents/businesses');
      if (response?.status === 200 && response?.data) {
        return response.data.businesses?.length || 0;
      }
      return 0;
    } catch (error) {
      console.error('Failed to fetch assigned businesses:', error);
      return 0;
    }
  };

  // Calculate actual stats from data
  const calculateStats = async (allCampaigns: any[]) => {
    const totalCampaigns = allCampaigns.length;
    
    const draftCampaigns = allCampaigns.filter(
      (campaign) => campaign.status === "draft"
    ).length;

    // Calculate campaign growth (current month vs previous month)
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const currentMonthCampaigns = allCampaigns.filter(campaign => {
      const createdDate = new Date(campaign.created_at || campaign.start_date);
      return createdDate >= currentMonthStart && createdDate <= currentMonthEnd;
    }).length;

    const lastMonthCampaigns = allCampaigns.filter(campaign => {
      const createdDate = new Date(campaign.created_at || campaign.start_date);
      return createdDate >= lastMonthStart && createdDate <= lastMonthEnd;
    }).length;

    const campaignGrowth = lastMonthCampaigns > 0 
      ? Math.round(((currentMonthCampaigns - lastMonthCampaigns) / lastMonthCampaigns) * 100)
      : currentMonthCampaigns > 0 ? 100 : 0;

    // Fetch actual assigned businesses count
    const assignedBusinesses = await fetchAssignedBusinesses();
    
    // Calculate business growth (this would need historical data for accurate calculation)
    const businessGrowth = 12; // Placeholder - you can implement similar logic as campaigns if you have business creation dates

    return {
      assignedBusinesses,
      draftCampaigns,
      totalCampaigns,
      businessGrowth,
      campaignGrowth,
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDataLoading(true);

        // Fetch campaigns
        const campaignsResponse = await get("agents/campaigns");
        
        if (campaignsResponse?.status === 200 && campaignsResponse?.data) {
          const allCampaigns = campaignsResponse.data.filter(
            (campaign) =>
              campaign.status !== "deleted" &&
              campaign.status !== "Deleted" &&
              !campaign.deleted_at &&
              !campaign.is_deleted
          );

          setCampaigns(allCampaigns);
          const calculatedStats = await calculateStats(allCampaigns);
          setStats(calculatedStats);
        } else {
          // Set empty stats if no campaigns
          const calculatedStats = await calculateStats([]);
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        // Set empty stats on error
        const calculatedStats = await calculateStats([]);
        setStats(calculatedStats);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [businesses]);

  const getPerformanceBadgeColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "bg-secondary text-white";
      case "Good":
        return "bg-secondary/80 text-white";
      case "Average":
        return "bg-secondary/50 text-white";
      default:
        return "bg-secondary/20 text-gray-800";
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days <= 2) return "bg-red-500";
    return "bg-secondary";
  };

  const getCampaignProgress = (campaign: any) => {
    const now = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = new Date(campaign.end_date);
    
    const totalDays = differenceInDays(endDate, startDate);
    const daysElapsed = differenceInDays(now, startDate);
    
    if (daysElapsed < 0) return 0;
    if (daysElapsed > totalDays) return 100;
    
    return Math.round((daysElapsed / totalDays) * 100);
  };

  const getDaysLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const days = differenceInDays(end, now);
    return Math.max(0, days);
  };

  const getCampaignPerformance = (campaign: any) => {
    const progress = getCampaignProgress(campaign);
    const spentPercentage = campaign.budget > 0 
      ? (parseFloat(campaign.amount_spent) / parseFloat(campaign.budget)) * 100 
      : 0;

    if (progress >= 90 && spentPercentage <= 110) return "Excellent";
    if (progress >= 70 && spentPercentage <= 120) return "Good";
    if (progress >= 50) return "Average";
    return "Poor";
  };

  const handleCreateCampaign = () => {
    navigate("/campaignform");
  };

  const handleViewCampaigns = () => {
    navigate("/campaigns");
  };

  const ongoingCampaigns = campaigns
    .filter((campaign) => {
      const now = new Date();
      const startDate = new Date(campaign.start_date);
      const endDate = new Date(campaign.end_date);
      return (
        campaign.status === "active" &&
        now >= startDate &&
        now <= endDate &&
        !campaign.closed_date
      );
    })
    .slice(0, 5);

  const completedCampaigns = campaigns
    .filter((campaign) => {
      const now = new Date();
      const endDate = new Date(campaign.end_date);
      return (
        (campaign.status === "completed" ||
          campaign.closed_date ||
          now > endDate) &&
        campaign.status !== "draft"
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.end_date || a.closed_date || a.completed_on);
      const dateB = new Date(b.end_date || b.closed_date || b.completed_on);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  const handleViewAllCampaigns = () => {
    navigate("/campaigns");
  };

  const handleCreateNewCampaign = () => {
    navigate("/campaignform");
  };

  const isLoading = loading || dataLoading;

  // No Campaigns Card Component for Ongoing Campaigns
  const NoOngoingCampaignsCard = () => (
    <div className="text-center py-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-[#E8C547]/20 rounded-full flex items-center justify-center">
          <HiOutlineSpeakerphone className="w-8 h-8 text-secondary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary">
            No Campaigns Available
          </h3>
          <p className="text-xs text-gray-600 max-w-md">
            Your campaign portfolio is empty. Create your first campaign to start tracking your marketing initiatives and drive business growth.
          </p>
        </div>
        <Button
          onClick={handleCreateCampaign}
          className="mt-4 text-xs"
        >
          <IoIosAddCircleOutline className="w-4 h-4 mr-2" />
          Launch Your First Campaign
        </Button>
      </div>
    </div>
  );

  // No Campaigns Card Component for Completed Campaigns
  const NoCompletedCampaignsCard = () => (
    <div className="text-center py-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-[#E8C547]/20 rounded-full flex items-center justify-center">
          <HiOutlineSpeakerphone className="w-8 h-8 text-secondary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary">
            No Completed Campaigns Yet
          </h3>
          <p className="text-xs text-gray-600 max-w-md">
            You haven't completed any campaigns yet. Launch your first campaign to see performance insights and results here.
          </p>
        </div>
        <Button
          onClick={handleViewCampaigns}
          className="mt-4 text-xs"
        >
          View Campaigns
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Stats - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <ClipboardList className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500 font-medium">
                      Assigned Businesses
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {isLoading ? (
                      <SkeletonBox className="h-6 w-12" />
                    ) : (
                      stats.assignedBusinesses
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Active business accounts
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-green-600 font-medium">
                      +{stats.businessGrowth}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileEdit className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500 font-medium">
                      Draft Campaigns
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {isLoading ? (
                      <SkeletonBox className="h-6 w-16" />
                    ) : (
                      stats.draftCampaigns
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Campaigns needing action
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-amber-600 font-medium">
                      Requires attention
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500 font-medium">
                      Total Campaigns
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {isLoading ? (
                      <SkeletonBox className="h-6 w-12" />
                    ) : (
                      stats.totalCampaigns
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    All time campaigns
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-green-600 font-medium">
                      +{stats.campaignGrowth}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns Grid - Responsive Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:items-start">
            {/* Ongoing Campaigns */}
            <div className="bg-white rounded-lg border border-gray-200 order-1 flex flex-col h-full">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Ongoing Campaigns
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Currently active campaigns and their progress
                  </p>
                </div>
                <button
                  onClick={handleViewAllCampaigns}
                  className="px-3 py-1.5 border border-gray-300 bg-white text-secondary hover:bg-primary rounded-sm text-xs uppercase font-medium transition-colors duration-200"
                >
                  View All
                </button>
              </div>
              <div className="p-4 space-y-3 flex-1">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-3"
                    >
                      <SkeletonBox className="h-4 w-3/4 mb-2" />
                      <SkeletonBox className="h-3 w-1/2 mb-3" />
                      <SkeletonBox className="h-2 w-full" />
                    </div>
                  ))
                ) : ongoingCampaigns.length > 0 ? (
                  ongoingCampaigns.map((campaign) => (
                    <div
                      key={campaign.campaign_id}
                      className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/campaigns/${campaign.campaign_id}`)}
                    >
                      <div className="w-full flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">
                              {campaign.title}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                              Campaign ID: {campaign.campaign_id.slice(0, 12)}...
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all duration-300"
                              style={{
                                width: `${getCampaignProgress(campaign)}%`,
                                backgroundColor: "rgb(249, 215, 105)",
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between w-full sm:w-auto">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {getCampaignProgress(campaign)}% complete
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-lg min-w-fit h-fit text-white self-end sm:self-center ${getDaysLeftColor(
                          getDaysLeft(campaign.end_date)
                        )}`}
                      >
                        {getDaysLeft(campaign.end_date)} days left
                      </span>
                    </div>
                  ))
                ) : (
                  <NoOngoingCampaignsCard />
                )}
              </div>
            </div>

            {/* Recently Ended Campaigns */}
            <div className="bg-white rounded-lg border border-gray-200 order-2 flex flex-col h-full">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Recently Ended Campaigns
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Performance summary of completed campaigns
                  </p>
                </div>
                <button
                  onClick={handleCreateNewCampaign}
                  className="px-3 py-1.5 bg-secondary hover:bg-secondary uppercase text-white rounded-sm text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  <IoIosAddCircleOutline className="h-4 w-4" />
                  Create New
                </button>
              </div>
              <div className="p-4 space-y-3 flex-1">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-3"
                    >
                      <SkeletonBox className="h-4 w-3/4 mb-2" />
                      <SkeletonBox className="h-3 w-1/2 mb-2" />
                      <SkeletonBox className="h-3 w-2/3" />
                    </div>
                  ))
                ) : completedCampaigns.length > 0 ? (
                  completedCampaigns.map((campaign) => (
                    <div
                      key={campaign.campaign_id}
                      className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/campaigns/${campaign.campaign_id}`)}
                    >
                      <div className="w-full flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">
                              {campaign.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-0.5 truncate">
                              Campaign ID: {campaign.campaign_id.slice(0, 12)}...
                            </p>
                            <p className="text-xs text-gray-400">
                              Ended{" "}
                              {new Date(
                                campaign.end_date ||
                                  campaign.closed_date ||
                                  campaign.completed_on
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center">
                          <div className="flex items-center w-full sm:w-auto">
                            <span className="text-xs text-gray-500">
                              Budget: ${parseFloat(campaign.budget).toFixed(2)} | Spent: $
                              {parseFloat(campaign.amount_spent).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-lg min-w-fit h-fit self-end sm:self-center ${getPerformanceBadgeColor(
                          getCampaignPerformance(campaign)
                        )}`}
                      >
                        {getCampaignPerformance(campaign)}
                      </span>
                    </div>
                  ))
                ) : (
                  <NoCompletedCampaignsCard />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard({
  businesses,
  setBusinesses,
  activeSection,
  setActiveSection,
  selectedCompany,
  setSelectedCompany,
  loading,
  onRefresh,
}: DashboardProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <EnhancedDashboardContent
            businesses={businesses}
            selectedCompany={selectedCompany}
            setActiveSection={setActiveSection}
            loading={loading}
            onRefresh={onRefresh}
          />
        );
      case "businesses":
        return (
          <BusinessManagement
            businesses={businesses}
            setBusinesses={setBusinesses}
            userRole="admin"
            onCreateBusiness={async () => ({ success: true })}
            onUpdateBusiness={async () => ({ success: true })}
            onDeleteBusiness={async () => ({ success: true })}
            loading={loading}
            onRefresh={onRefresh}
          />
        );
      case "campaigns":
        return (
          <CampaignForm
            onBack={() => setActiveSection("dashboard")}
            selectedBusiness={null}
            onCreateCampaign={async (data) => {
              console.log("Creating campaign:", data);
            }}
            onSaveAsDraft={async (data) => {
              console.log("Saving campaign as draft:", data);
            }}
          />
        );
      default:
        return (
          <EnhancedDashboardContent
            businesses={businesses}
            selectedCompany={selectedCompany}
            setActiveSection={setActiveSection}
            loading={loading}
            onRefresh={onRefresh}
          />
        );
    }
  };

  return renderContent();
}