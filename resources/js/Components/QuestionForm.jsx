import { useState } from "react";
import { X, Image, Link2, Code, Smile, Hash } from "lucide-react";
import  {Button}  from "@/Components/ui/Button";
import  {Input}  from "@/Components/ui/Input";
import  {Textarea}  from "@/Components/ui/Textarea";
import  {Badge}  from "@/Components/ui/Badge";

export const QuestionForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const suggestedTags = ["javascript", "react", "career", "programming", "webdev", "beginners"];

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag.toLowerCase())) {
      setTags([...tags, currentTag.toLowerCase()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Ask a Question</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Question Title *
          </label>
          <Input
            id="title"
            placeholder="e.g., How do I optimize React performance in large applications?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Details *
          </label>
          <Textarea
            id="content"
            placeholder="Provide details about your question. What have you tried? What are you expecting?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 mt-2 p-2 border rounded-lg">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Image className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Code className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add tags..."
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              Add
            </Button>
          </div>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                <Hash className="h-3 w-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {/* Suggested Tags */}
          <div className="text-sm text-muted-foreground mb-1">Suggested tags:</div>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => {
                  if (!tags.includes(tag)) {
                    setTags([...tags, tag]);
                  }
                }}
              >
                <Hash className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title || !content}>
            Post Question
          </Button>
        </div>
      </form>
    </div>
  );
};
