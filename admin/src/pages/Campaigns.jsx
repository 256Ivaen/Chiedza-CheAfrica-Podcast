"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Campaigns from "../components/Campaigns/Campaigns";

export default function CampaignsPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBusinesses([]);
    setLoading(false);
  }, []);

  return <Campaigns />;
}
