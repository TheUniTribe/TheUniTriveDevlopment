import React, { useMemo, useState } from "react";

// Utility: simple class merger
function cx(...args) {
  return args.filter(Boolean).join(" ");
}

// ----------------------------------------------
// Reusable primitives
// ----------------------------------------------
function SectionCard({ title, action, children, className }) {
  return (
    <section className={cx("rounded-xl border border-gray-200 bg-white p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}

function TabNav({ tabs, active, onChange }) {
  return (
    <nav className="flex mb-6 border-b border-gray-200" role="tablist" aria-label="Profile sections">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={cx(
            "px-4 py-3 text-sm font-medium transition-all duration-200 relative",
            active === t.key
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {t.label}
          {active === t.key && (
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900"></div>
          )}
        </button>
      ))}
    </nav>
  );
}

// ----------------------------------------------
// Editable avatar & personal details
// ----------------------------------------------
function EditableAvatar({ src, editable, onChange }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative w-28 h-28 md:w-32 md:h-32"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt="User avatar"
        className="w-full h-full rounded-xl object-cover border-2 border-gray-100 shadow-sm"
      />
      {editable && (
        <label
          className={cx(
            "absolute inset-0 rounded-xl grid place-items-center text-xs font-medium cursor-pointer transition-all duration-200",
            hovered ? "bg-black/60 text-white" : "bg-black/0 text-white"
          )}
        >
          <span className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20">
            Change
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => onChange(String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
        </label>
      )}
    </div>
  );
}

function PersonalDetails({ data, editable, onChange }) {
  const [local, setLocal] = useState(data);

  React.useEffect(() => {
    setLocal(data);
  }, [data, editable]);

  const fields = [
    { key: "name", label: "Full Name", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "email", label: "Email", type: "email" },
  ];

  if (!editable) {
    return (
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {fields.map((f) => (
          <div key={f.key} className="min-w-0">
            <dt className="text-gray-500 text-xs uppercase tracking-wide mb-1">{f.label}</dt>
            <dd className="font-medium text-gray-900 truncate">{data[f.key]}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onChange(local);
      }}
    >
      {fields.map((f) => (
        <label key={f.key} className="grid gap-1.5 text-sm">
          <span className="text-gray-700 font-medium">{f.label}</span>
          <input
            type={f.type}
            value={local[f.key]}
            onChange={(e) => setLocal((s) => ({ ...s, [f.key]: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors duration-200"
          />
        </label>
      ))}
      <div className="col-span-full flex gap-2 pt-2">
        <button className="rounded-lg px-4 py-2.5 text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 font-medium">
          Save Changes
        </button>
        <button
          type="button"
          className="rounded-lg px-4 py-2.5 text-sm border border-gray-300 hover:bg-gray-50 transition-colors duration-200 font-medium"
          onClick={() => setLocal(data)}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

// ----------------------------------------------
// Feature sections
// ----------------------------------------------
function SocialLinks({ links, editable, onChange }) {
  if (editable) {
    return (
      <div className="space-y-3">
        {Object.entries(links).map(([platform, url]) => (
          <div key={platform} className="flex items-center gap-3">
            <label className="w-20 text-sm font-medium text-gray-700 capitalize">{platform}</label>
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors duration-200"
              value={url}
              placeholder={`${platform} URL`}
              onChange={(e) =>
                onChange({
                  ...links,
                  [platform]: e.target.value,
                })
              }
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(links).map(([platform, url]) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
        >
          <span className="truncate max-w-[8rem]">{platform}</span>
        </a>
      ))}
    </div>
  );
}

const Discussions = ({ items }) => (
  <ul className="space-y-4">
    {items.map((item, idx) => (
      <li
        key={idx}
        className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-pointer"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-semibold text-sm md:text-base break-words flex-1 min-w-0 text-gray-900">
            {item.title}
          </h4>
          <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md font-medium shrink-0">
            {item.tag}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">{item.when}</p>
        <p className="text-sm text-gray-600 mt-2 break-words">{item.snippet}</p>
      </li>
    ))}
  </ul>
);

function Reputation({ stats, details }) {
  return (
    <div className="space-y-6">
      {/* Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-600 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      {details && details.length > 0 && (
        <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
          <h4 className="text-sm font-semibold mb-4 text-gray-900">Detailed Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="py-2.5 px-4 font-medium">Category</th>
                  <th className="py-2.5 px-4 font-medium">Count</th>
                  <th className="py-2.5 px-4 font-medium">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-white transition-colors duration-200">
                    <td className="py-2.5 px-4 font-medium text-gray-900">{d.category}</td>
                    <td className="py-2.5 px-4 font-medium text-gray-900">{d.count}</td>
                    <td className="py-2.5 px-4 text-gray-500">{d.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const Activities = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item, idx) => (
      <li
        key={idx}
        className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm md:text-base font-medium text-gray-900 break-words">{item.title}</p>
            <p className="text-xs text-gray-500 mt-1.5">{item.when}</p>
          </div>
        </div>
      </li>
    ))}
  </ul>
);

// Comment Form Component
function CommentForm({ onSubmit }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    await onSubmit(comment);
    setComment("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Add a Comment</h4>
      <div className="mb-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows="3"
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors duration-200 resize-none"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="rounded-lg px-4 py-2.5 text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}

function Comments({ items, onAddComment }) {
  return (
    <div>
      <CommentForm onSubmit={onAddComment} />
      
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          items.map((c) => (
            <div key={c.id} className="flex gap-3">
              <img src={c.avatar} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0 rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                  <span className="text-xs text-gray-500">{c.when}</span>
                </div>
                <p className="text-sm text-gray-700 break-words">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------
// Main Page
// ----------------------------------------------
export default function Profile() {
  const [editable, setEditable] = useState(false);
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop"
  );
  const [details, setDetails] = useState({
    name: "Alex Johnson",
    title: "Senior Software Engineer",
    location: "Bengaluru, India",
    email: "alex@example.com",
  });
  const [social, setSocial] = useState({
    LinkedIn: "https://linkedin.com/in/alexjohnson",
    GitHub: "https://github.com/alexj",
    Twitter: "https://twitter.com/alexdev",
  });

  const tabs = useMemo(
    () => [
      { key: "overview", label: "Overview" },
      { key: "discussions", label: "Discussions" },
      { key: "reputation", label: "Reputation" },
      { key: "activities", label: "Activities" },
      { key: "comments", label: "Comments" },
    ],
    []
  );
  const [active, setActive] = useState(tabs[0].key);

  const discussionItems = [
    {
      id: 1,
      title: "Optimizing React renders with memo",
      tag: "Popular",
      when: "2d ago",
      snippet: "Tips on profiling components and reducing unnecessary re-renders...",
    },
    {
      id: 2,
      title: "Best practices for Tailwind theming",
      tag: "Latest",
      when: "5h ago",
      snippet: "A compact strategy for color tokens and dark mode...",
    },
    {
      id: 3,
      title: "Best practices for React theming",
      tag: "Best",
      when: "10h ago",
      snippet: "A compact strategy for color tokens and dark mode...",
    },
  ];

  const repStats = [
    { label: "Upvotes", value: 1280 },
    { label: "Marks Accepted", value: 214 },
    { label: "Answers", value: 356 },
    { label: "Badges", value: 18 },
  ];

  const repDetails = [
    { category: "React", count: 620, last: "2d ago" },
    { category: "Tailwind", count: 280, last: "5h ago" },
    { category: "JavaScript", count: 380, last: "1w ago" },
    { category: "Badges Earned", count: 18, last: "1d ago" },
  ];

  const activities = [
    { id: 1, icon: "🧩", title: "Commented on Hooks vs Signals", when: "Yesterday" },
    { id: 2, icon: "✅", title: "Answer accepted in Debouncing inputs", when: "2 days ago" },
  ];

  const [comments, setComments] = useState([
    { 
      id: 1, 
      name: "Mark T.", 
      when: "1h ago", 
      text: "Loved the memoization tip! It helped reduce our bundle size significantly.", 
      avatar: "https://i.pravatar.cc/72?img=7" 
    },
    { 
      id: 2, 
      name: "Isha P.", 
      when: "3h ago", 
      text: "Please share more on performance budgets. We're struggling with this in our current project.", 
      avatar: "https://i.pravatar.cc/72?img=14" 
    },
  ]);

  const handleAddComment = async (commentText) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newComment = {
      id: comments.length + 1,
      name: "You",
      when: "Just now",
      text: commentText,
      avatar: "https://i.pravatar.cc/72?img=1"
    };
    
    setComments([newComment, ...comments]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-6xl mx-auto px-4 py-8 grid gap-6">
        {/* Identity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-6">
            <EditableAvatar src={avatar} editable={editable} onChange={setAvatar} />
            <div className="flex-1 grid gap-4">
              {/* Name + edit toggle inline */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{details.name}</h2>
                <button
                  className={cx(
                    "rounded-lg px-4 py-2.5 text-sm border font-medium transition-colors duration-200",
                    editable
                      ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
                      : "border-gray-300 hover:bg-gray-50"
                  )}
                  onClick={() => setEditable((v) => !v)}
                >
                  {editable ? "Editing" : "Edit Profile"}
                </button>
              </div>
              <PersonalDetails data={details} editable={editable} onChange={setDetails} />
              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Social Profiles</h4>
                <SocialLinks links={social} editable={editable} onChange={setSocial} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <TabNav tabs={tabs} active={active} onChange={setActive} />

        {/* Content */}
        {active === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Latest & Popular Discussions">
              <Discussions items={discussionItems} />
            </SectionCard>
            <SectionCard title="Reputation">
              <Reputation stats={repStats} details={repDetails} />
            </SectionCard>
            <SectionCard title="Activities">
              <Activities items={activities} />
            </SectionCard>
            <SectionCard title="Comments from Users">
              <div className="space-y-4">
                {comments.slice(0, 2).map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <img src={c.avatar} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0 rounded-xl border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                        <span className="text-xs text-gray-500">{c.when}</span>
                      </div>
                      <p className="text-sm text-gray-700 break-words">{c.text}</p>
                    </div>
                  </div>
                ))}
                {comments.length > 2 && (
                  <div className="text-center pt-2">
                    <button 
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                      onClick={() => setActive("comments")}
                    >
                      View all comments ({comments.length})
                    </button>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {active === "discussions" && (
          <SectionCard title="Discussions">
            <Discussions items={discussionItems} />
          </SectionCard>
        )}
        {active === "reputation" && (
          <SectionCard title="Reputation">
            <Reputation stats={repStats} details={repDetails} />
          </SectionCard>
        )}
        {active === "activities" && (
          <SectionCard title="Activities">
            <Activities items={activities} />
          </SectionCard>
        )}
        {active === "comments" && (
          <SectionCard title="Comments from Users">
            <Comments items={comments} onAddComment={handleAddComment} />
          </SectionCard>
        )}
      </main>
    </div>
  );
}