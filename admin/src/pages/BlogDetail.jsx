"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogDetail from "../components/Blogs/BlogDetail";

export default function BlogDetailsPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBusinesses([]);
    setLoading(false);
  }, []);

  return <BlogDetail />;
}
