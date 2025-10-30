"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Reactions from "../components/Blog Actions/Reactions";

export default function ReactionsPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBusinesses([]);
    setLoading(false);
  }, []);

  return <Reactions />;
}
