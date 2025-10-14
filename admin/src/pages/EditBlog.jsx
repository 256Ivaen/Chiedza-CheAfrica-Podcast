"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditBlog from "../components/Blog Actions/EditBlog";

export default function EditBlogPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBusinesses([]);
    setLoading(false);
  }, []);

  return <EditBlog />;
}
