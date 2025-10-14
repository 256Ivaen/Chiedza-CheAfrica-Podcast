"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllBlogs from "../components/Blogs/AllBlogs";

export default function AllBlogsPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBusinesses([]);
    setLoading(false);
  }, []);

  return <AllBlogs />;
}
