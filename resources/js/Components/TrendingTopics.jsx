// Components/TrendingTopics.jsx
import { TrendingUp } from "lucide-react";

export const TrendingTopics = ({ topics }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Trending Topics
      </h3>
      <div className="space-y-3">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{topic.name}</span>
              {topic.trending && (
                <span className="bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded">
                  Trending
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {topic.posts} posts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
