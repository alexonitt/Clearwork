export function ClearworkMockup() {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-apex-border bg-[#FAFAF8] p-4">
      <div className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
        </div>
        <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          Notion template
        </p>
        <h3 className="mt-1 font-serif text-lg text-zinc-800">
          Work with more clarity.
        </h3>
        <div className="mt-3 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <span className="text-[9px] font-medium uppercase text-zinc-500">
              Dashboard
            </span>
            <span className="rounded border border-zinc-200 px-1.5 py-0.5 text-[8px] text-zinc-500">
              Notion
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <div className="rounded border border-zinc-200 bg-white p-1.5">
              <p className="text-[9px] font-medium text-zinc-800">This week</p>
              <p className="text-[8px] text-zinc-500">Routines · Tasks</p>
            </div>
            <div className="rounded border border-zinc-200 bg-white p-1.5">
              <p className="text-[9px] font-medium text-zinc-800">Today</p>
              <p className="text-[8px] text-zinc-500">Focus · Reviews</p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] font-medium text-zinc-600">
          Ultimate Life Planner — $29
        </p>
      </div>
    </div>
  );
}

export function TrackrMockup() {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-apex-border bg-zinc-900 p-4">
      <div className="flex h-full flex-col rounded-lg border border-zinc-700 bg-zinc-950 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-xs font-semibold text-white">
            Trackr
          </span>
          <span className="rounded bg-zinc-700 px-1.5 py-0.5 text-[8px] text-zinc-300">
            Portfolio
          </span>
        </div>
        <div className="mt-2 flex-1 rounded border border-zinc-700 bg-zinc-900/50 p-2">
          <div className="mb-2 flex gap-2">
            <div className="h-6 flex-1 rounded bg-zinc-700" />
            <div className="h-6 w-16 rounded bg-zinc-600" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded border border-zinc-700 bg-zinc-800/50 p-1.5"
              >
                <div className="h-2 w-3/4 rounded bg-zinc-600" />
                <div className="mt-1 h-3 w-1/2 rounded bg-zinc-500" />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            <div className="h-4 flex-1 rounded bg-emerald-500/20" />
            <div className="h-4 flex-1 rounded bg-zinc-600" />
          </div>
        </div>
        <p className="mt-2 text-center text-[9px] text-zinc-400">
          Crypto AI · Waitlist
        </p>
      </div>
    </div>
  );
}

export function TitanMockup() {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-apex-border bg-zinc-900 p-4">
      <div className="flex h-full flex-col rounded-lg border border-zinc-700 bg-zinc-950 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-xs font-semibold text-white">
            Titan Entertainment
          </span>
          <span className="text-[8px] text-zinc-400">Music & Events</span>
        </div>
        <div className="mt-2 flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="h-8 flex-1 rounded border border-zinc-700 bg-zinc-800/50" />
            <div className="h-8 w-12 rounded border border-zinc-600 bg-zinc-700" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {['Show 1', 'Show 2'].map((label) => (
              <div
                key={label}
                className="rounded border border-zinc-700 bg-zinc-800/50 p-2"
              >
                <div className="h-2 w-full rounded bg-zinc-600" />
                <div className="mt-1 h-1.5 w-2/3 rounded bg-zinc-700" />
                <div className="mt-1.5 h-3 w-12 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-center text-[9px] text-zinc-400">
          Upcoming shows · Tickets
        </p>
      </div>
    </div>
  );
}
