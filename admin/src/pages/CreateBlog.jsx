"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateBlog from "../components/Blogs/CreateBlog";

export default function AllBlogsPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBusinesses([]);
    setLoading(false);
  }, []);

  return <CreateBlog />;
}
