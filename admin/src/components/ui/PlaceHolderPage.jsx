import { motion } from "framer-motion";
import { Construction, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-8"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex justify-center mb-4"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Construction className="w-8 h-8 text-secondary" />
              </div>
            </motion.div>
            
            <h1 className="text-xl font-medium text-foreground mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm">
              Under Construction
            </p>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <p className="text-muted-foreground text-sm">
              This page is currently being developed and will be available soon.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground rounded text-sm hover:bg-muted"
            >
              Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
            >
              Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlaceholderPage;