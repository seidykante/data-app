import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  titleClassName?: string;
}

const Card = ({
  children,
  className = "",
  title,
  titleClassName = "",
}: CardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow p-6 ${className}`}>
      {title && (
        <h3
          className={`text-lg font-semibold text-gray-700 mb-4 ${titleClassName}`}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
