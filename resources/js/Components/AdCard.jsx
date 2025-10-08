import React from 'react';

export const AdCard = ({ title, description, image, ctaText }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      {image && (
        <div className="mb-3 overflow-hidden rounded-lg">
          <img src={image} alt={title} className="h-32 w-full object-cover" />
        </div>
      )}
      <h3 className="mb-2 font-semibold text-card-foreground">{title}</h3>
      <p className="mb-3 text-xs text-muted-foreground">{description}</p>
      <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
        {ctaText}
      </button>
    </div>
  );
};