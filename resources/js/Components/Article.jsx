import React from 'react';

// Medium-like responsive feed layout (React + Tailwind)
// Drop into a Create React App / Next.js project. Tailwind must be configured.
// This is a visual layout only — replace sampleData with real API data.

const sampleArticles = [
  {
    id: 1,
    title: 'DeepSeek is Finally Back, Solving Sparse Attention.',
    subtitle: 'A Years-old Mystery, Solved',
    author: 'Ignacio de Gregorio',
    time: '22h ago',
    claps: 325,
    responses: 4,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=60',
    tag: 'Research',
  },
  {
    id: 2,
    title: "Male Friendships Are Batshit Crazy",
    subtitle: "Why do you know the horsepower of his last three cars but not his last name?",
    author: 'Robin Wilding',
    time: '1d ago',
    claps: 477,
    responses: 8,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60',
    tag: 'Relationships',
  },
  {
    id: 3,
    title: "99% of Users Don't Know About These 10 ChatGPT Secret Codes",
    subtitle: "You ever feel like you're using just 10% of ChatGPT's brainpower? I did, until I fell headfirst into the rabbit hole...",
    author: 'Hamza M.',
    time: 'Jul 17',
    claps: 4800,
    responses: 127,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=60',
    tag: 'Productivity',
  },
  // add more items as needed
];

function Icon({ children }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-700">
      {children}
    </span>
  );
}

function LeftNav() {
  const items = [
    { label: 'Home', icon: HomeIcon },
    { label: 'Library', icon: BookIcon },
    { label: 'Profile', icon: UserIcon },
    { label: 'Stories', icon: FileIcon },
    { label: 'Stats', icon: ChartIcon },
  ];

  return (
    <nav className="hidden lg:flex lg:flex-col gap-2 w-48 px-2">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold">M</div>
        <div className="font-semibold">MediumClone</div>
      </div>

      {items.map((it) => (
        <button key={it.label} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700">
          <it.icon className="w-5 h-5 text-gray-600" />
          <span>{it.label}</span>
        </button>
      ))}

      <div className="mt-4 border-t pt-3 px-3 text-sm text-gray-500">Following</div>
    </nav>
  );
}

function RightSidebar() {
  const picks = [
    { title: 'We All Need a Place for the Tears We Shed Through the Years', author: 'Ryan Chin', date: 'Jul 9' },
    { title: 'What Looking At Paintings Means to Me', author: 'Christopher P Jones', date: 'Sep 25' },
  ];

  const topics = ['Technology', 'Writing', 'Machine Learning', 'Politics', 'Productivity', 'Psychology'];

  return (
    <aside className="hidden xl:block w-80 space-y-6">
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-sm font-semibold mb-3">Staff Picks</h3>
        <div className="space-y-3">
          {picks.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-gray-500 mt-1">{p.author} • {p.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h4 className="text-sm font-semibold mb-2">Recommended topics</h4>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button key={t} className="px-3 py-1 border rounded-full text-xs text-gray-600">{t}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded shadow p-4 text-sm text-gray-500">
        <div className="font-semibold mb-2">Who to follow</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>
                <div className="text-sm">letters from rosie</div>
                <div className="text-xs text-gray-400">Publication</div>
              </div>
            </div>
            <button className="text-sm px-3 py-1 border rounded">Follow</button>
          </div>
          {/* more follows... */}
        </div>
      </div>
    </aside>
  );
}

export default function Article() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-12 gap-6 py-6">
          <div className="col-span-12 lg:col-span-2">
            <LeftNav />
          </div>

          <div className="col-span-12 lg:col-span-7">
            <main className="space-y-6">
              <div className="bg-white rounded shadow p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold">For you</h2>
                  <button className="text-sm text-gray-500">Featured</button>
                </div>
                <div className="flex items-center gap-3">
                  <input className="border rounded px-3 py-2 text-sm w-56" placeholder="Search" />
                  <button className="px-3 py-2 border rounded text-sm">Write</button>
                </div>
              </div>

              <section className="space-y-4">
                {sampleArticles.map((a) => (
                  <article key={a.id} className="bg-white rounded shadow p-5 flex gap-4 items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div>{a.author}</div>
                        <div>•</div>
                        <div>{a.time}</div>
                      </div>

                      <h3 className="text-xl font-semibold leading-tight mb-2">{a.title}</h3>
                      <p className="text-gray-600 mb-3">{a.subtitle}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.462a1 1 0 00-.364 1.118l1.287 3.973c.3.921-.755 1.688-1.54 1.118l-3.388-2.462a1 1 0 00-1.176 0L5.17 17.063c-.784.57-1.838-.197-1.539-1.118l1.286-3.973a1 1 0 00-.364-1.118L1.166 8.392c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.05 2.927z"/></svg>
                          <span>{a.claps}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                          <span>{a.responses}</span>
                        </div>

                        <div className="text-xs text-gray-400">{a.tag}</div>

                        <div className="ml-auto text-gray-400 flex items-center gap-3">
                          <button className="text-sm">Save</button>
                          <button className="text-sm">•••</button>
                        </div>
                      </div>
                    </div>

                    <div className="w-36 h-24 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={a.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  </article>
                ))}
              </section>
            </main>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- small icon components ---
function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 11L12 3l9 8v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8z" />
    </svg>
  );
}
function BookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M2 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v12"/><path d="M7 7v12"/></svg>
  );
}
function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
  );
}
function FileIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
  );
}
function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M3 3v18h18"/><path d="M7 13v6"/><path d="M12 9v10"/><path d="M17 5v14"/></svg>
  );
}
