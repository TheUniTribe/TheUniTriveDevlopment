import React from 'react';

// AdCard (JSX)
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

// PostCard (JSX)
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/Avatar";
import { Button } from "@/Components/ui/Button";

export const PostCard = ({
  author,
  authorImage,
  timestamp,
  content,
  image,
  upvotes,
  comments,
  shares,
  type = "text",
}) => {
  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={authorImage} alt={author} />
            <AvatarFallback>{author ? author[0] : "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-card-foreground">{author}</h3>
            <p className="text-xs text-muted-foreground">{timestamp}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-3">
        <p className={`text-sm ${type === "quote" ? "italic" : ""} text-card-foreground`}>
          {content}
        </p>
      </div>

      {image && (
        <div className="mb-3 overflow-hidden rounded-lg">
          <img src={image} alt="Post content" className="h-auto w-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-4 border-t border-border pt-3">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
          <ThumbsUp className="h-4 w-4" />
          <span className="text-xs">{upvotes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
          <Share2 className="h-4 w-4" />
          <span className="text-xs">{shares}</span>
        </Button>
      </div>
    </article>
  );
};