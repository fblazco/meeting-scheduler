import React from 'react';

export const Card = ({
  children,
  title,
  description,
  action,
  className = '',
  onClick,
  ...props
}) => {
  const isClickable = !!onClick;

  return (
    <div
      className={`card ${isClickable ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {(title || action) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      {description && <p className="card-description">{description}</p>}
      {children}
    </div>
  );
};

export default Card;
