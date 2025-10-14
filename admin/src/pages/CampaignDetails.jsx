"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CampaignDetailsPage from "../components/CampaignDetails/CampaignDetails";

export default function CampaignDetails() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBusinesses([]);
    setLoading(false);
  }, []);

  return <CampaignDetailsPage />;
}
