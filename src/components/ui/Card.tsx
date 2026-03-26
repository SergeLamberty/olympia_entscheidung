import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Card({ children, className = "", as: Tag = "div" }: CardProps) {
  return (
    <Tag className={`bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 card-hover ${className}`}>
      {children}
    </Tag>
  );
}
