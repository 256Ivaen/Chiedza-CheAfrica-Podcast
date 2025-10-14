"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SettingsPage from "../components/settings/settings";

export default function GroupsPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBusinesses([]);
    setLoading(false);
  }, []);

  return <SettingsPage />;
}
