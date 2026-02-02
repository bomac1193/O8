"use client";

export function DeclarationBadge({ declared }: { declared: boolean }) {
  if (declared) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest font-medium bg-[#F5F3F0] text-[#0A0A0A]">
        <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Ø8</span>
        Declared
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest text-[#8A8A8A] border border-[#2A2A2A]">
      Unverified
    </span>
  );
}
