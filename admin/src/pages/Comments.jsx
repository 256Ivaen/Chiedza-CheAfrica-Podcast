"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Comments from "../components/Blog Actions/Comments";

export default function CommentsPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBusinesses([]);
    setLoading(false);
  }, []);

  return <Comments />;
}
