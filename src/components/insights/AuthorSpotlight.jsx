import React from 'react';
import { motion } from "framer-motion";

const AuthorSpotlight = () => {
  const featuredAuthors = [
    {
      name: "Sarah Johnson",
      role: "AI Research Director",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c1?auto=format&fit=crop&w=150&q=80",
      articles: 15,
      expertise: "Artificial Intelligence",
      bio: "Leading AI research with 10+ years in machine learning and neural networks."
    },
    {
      name: "Michael Chen",
      role: "Remote Work Strategist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      articles: 12,
      expertise: "Remote Leadership",
      bio: "Helping companies build successful distributed teams and remote cultures."
    },
    {
      name: "Emily Rodriguez",
      role: "Tech Innovation Lead",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      articles: 18,
      expertise: "Digital Transformation",
      bio: "Driving digital innovation strategies for Fortune 500 companies globally."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Expert Authors
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto">
            Meet the industry experts sharing their knowledge and insights with our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAuthors.map((author, index) => (
            <motion.div
              key={author.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#F6931B] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                  {author.articles}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {author.name}
              </h3>
              
              <p className="text-[#F6931B] font-medium text-sm mb-2">
                {author.role}
              </p>
              
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs mb-3">
                {author.expertise}
              </span>
              
              <p className="text-gray-600 text-xs leading-relaxed">
                {author.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthorSpotlight;