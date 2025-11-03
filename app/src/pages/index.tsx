import { FormEvent, useMemo, useState } from "react";

type Message = {
  id: string;
  author: "agent" | "customer";
  text: string;
  timestamp: string;
};

type Conversation = {
  id: string;
  customerName: string;
  status: "open" | "waiting" | "resolved";
  unread: number;
  lastMessage: string;
  lastUpdated: string;
  messages: Message[];
};

const conversationsSeed: Conversation[] = [
  {
    id: "1",
    customerName: "Alice Johnson",
    status: "open",
    unread: 2,
    lastMessage: "I still haven't received the tracking info.",
    lastUpdated: "2m ago",
    messages: [
      {
        id: "m1",
        author: "customer",
        text: "Hi! My order hasn't shipped yet. Can you check on it?",
        timestamp: "09:14",
      },
      {
        id: "m2",
        author: "agent",
        text: "Sure thing, Alice. Let me pull that up for you.",
        timestamp: "09:15",
      },
      {
        id: "m3",
        author: "customer",
        text: "Thanks! I still haven't received the tracking info.",
        timestamp: "09:17",
      },
    ],
  },
  {
    id: "2",
    customerName: "Carlos Mendes",
    status: "waiting",
    unread: 0,
    lastMessage: "Perfect, I'll wait for the update.",
    lastUpdated: "15m ago",
    messages: [
      {
        id: "m4",
        author: "customer",
        text: "When will the new stock arrive?",
        timestamp: "08:41",
      },
      {
        id: "m5",
        author: "agent",
        text: "We're expecting inventory tomorrow morning.",
        timestamp: "08:42",
      },
      {
        id: "m6",
        author: "customer",
        text: "Perfect, I'll wait for the update.",
        timestamp: "08:43",
      },
    ],
  },
  {
    id: "3",
    customerName: "Dana Gupta",
    status: "resolved",
    unread: 0,
    lastMessage: "Yes, the replacement worked. Thank you!",
    lastUpdated: "1h ago",
    messages: [
      {
        id: "m7",
        author: "customer",
        text: "The replacement worked. Thank you!",
        timestamp: "07:32",
      },
      {
        id: "m8",
        author: "agent",
        text: "Great to hear! Let us know if you need anything else.",
        timestamp: "07:33",
      },
    ],
  },
];

const statusColorMap: Record<Conversation["status"], string> = {
  open: "bg-emerald-100 text-emerald-700 border-emerald-200",
  waiting: "bg-amber-100 text-amber-700 border-amber-200",
  resolved: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>(conversationsSeed[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [draft, setDraft] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversationsSeed;
    const term = searchTerm.toLowerCase();
    return conversationsSeed.filter((conversation) =>
      `${conversation.customerName} ${conversation.lastMessage}`
        .toLowerCase()
        .includes(term),
    );
  }, [searchTerm]);

  const selectedConversation = useMemo(
    () =>
      filteredConversations.find(
        (conversation) => conversation.id === selectedId,
      ) ?? null,
    [filteredConversations, selectedId],
  );

  const activeConversation =
    selectedConversation ?? filteredConversations[0] ?? null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDraft("");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-80 flex-col border-r border-slate-200 bg-white">
        <header className="border-b border-slate-200 p-4">
          <h1 className="text-lg font-semibold text-slate-900">Inbox</h1>
          <p className="text-sm text-slate-500">
            {filteredConversations.length} conversation
            {filteredConversations.length === 1 ? "" : "s"}
          </p>
        </header>
        <div className="px-4 py-3">
          <input
            type="search"
            placeholder="Search conversations"
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <nav className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No conversations found.
            </div>
          ) : (
            <ul className="space-y-1 px-3 pb-3">
              {filteredConversations.map((conversation) => {
                const isActive = conversation.id === activeConversation?.id;
                return (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(conversation.id)}
                      className={`flex w-full flex-col gap-1 rounded-xl border border-transparent px-4 py-3 text-left transition ${
                        isActive
                          ? "border-slate-200 bg-slate-100 shadow-sm"
                          : "hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">
                          {conversation.customerName}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColorMap[conversation.status]}`}
                        >
                          {conversation.status}
                        </span>
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{conversation.lastUpdated}</span>
                        {conversation.unread > 0 ? (
                          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[0.7rem] font-semibold text-white">
                            {conversation.unread}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </aside>
      <section className="flex flex-1 flex-col">
        {activeConversation ? (
          <>
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {activeConversation.customerName}
                </h2>
                <p className="text-sm text-slate-500">
                  Last seen {activeConversation.lastUpdated}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
                >
                  Add Note
                </button>
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Mark as Resolved
                </button>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto bg-slate-50 px-8 py-6">
              <ul className="space-y-4">
                {activeConversation.messages.map((message) => (
                  <li
                    key={message.id}
                    className={`flex ${message.author === "agent" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-lg rounded-3xl px-5 py-3 text-sm shadow-sm ${
                        message.author === "agent"
                          ? "rounded-br-md bg-blue-600 text-white"
                          : "rounded-bl-md bg-white text-slate-800"
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">
                        {message.text}
                      </p>
                      <span
                        className={`mt-2 block text-xs ${
                          message.author === "agent"
                            ? "text-blue-100"
                            : "text-slate-400"
                        }`}
                      >
                        {message.timestamp}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <footer className="border-t border-slate-200 bg-white px-8 py-5">
              <form className="flex items-center gap-4" onSubmit={handleSubmit}>
                <textarea
                  name="reply"
                  rows={2}
                  className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                  placeholder="Type your reply..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-200"
                  disabled={!draft.trim()}
                >
                  Send
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-slate-50">
            <p className="text-sm text-slate-500">
              Select a conversation to view its messages.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
