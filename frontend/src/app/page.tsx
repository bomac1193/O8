"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section - Full viewport, vertically centered */}
      <section className="min-h-[100vh] flex flex-col items-center justify-center px-6 md:px-16">
        <div className="max-w-[640px] text-center">
          {/* Wordmark */}
          <h1
            className="text-[56px] md:text-[72px] font-normal text-[#F5F3F0] tracking-tight mb-8"
            style={{ fontFamily: "'Söhne', var(--font-space-grotesk), sans-serif" }}
          >
            ∞8
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-[#8A8A8A] mb-8">
            ARCH
          </p>

          {/* Product Name */}
          <p className="text-base uppercase tracking-widest text-[#8A8A8A] mb-6">
            Declarations v1.0
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-[#F5F3F0] font-medium leading-relaxed mb-6">
            Prove your process. Immortalize your chain.
          </p>

          <p className="text-base text-[#8A8A8A] leading-relaxed mb-16">
            Creative provenance protocol for AI-native music.
            Machine-readable declarations. Verifiable lineage.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/new"
              className="px-6 py-3 bg-[#F5F3F0] text-[#0A0A0A] font-medium text-sm tracking-wide hover:opacity-85 transition-opacity duration-100"
            >
              Create Declaration
            </Link>
            <Link
              href="/gallery"
              className="px-6 py-3 border border-[#2A2A2A] text-[#F5F3F0] font-medium text-sm tracking-wide hover:border-[#8A8A8A] transition-colors duration-100"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* What it is Section */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-12">
            What ∞8 ARCH Does
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                Identity
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                Cryptographically verifiable artist identity. Collaborators with
                revenue splits. Contributors with roles.
              </p>
            </div>

            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                Creative Stack
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                Document every tool in your workflow. DAWs, plugins, AI models,
                hardware. The full picture.
              </p>
            </div>

            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                Production Intelligence
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                Quantified AI contribution by phase. Composition, arrangement,
                production, mixing, mastering. Methodology notes.
              </p>
            </div>

            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                Provenance Chain
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                IPFS CID links to source material, samples, stems. Immutable
                revision history. Audio fingerprint verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Declaration Preview */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-12">
            Declaration Structure
          </h2>

          <div className="bg-[#0D0D0D] border border-[#2A2A2A] p-6 md:p-8 overflow-x-auto">
            <pre
              className="text-sm leading-relaxed"
              style={{ fontFamily: "'Söhne Mono', var(--font-plex-mono), monospace" }}
            >
              <code>
                <span className="text-[#F5F3F0]">{"{"}</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  version</span>
                <span className="text-[#F5F3F0]">: </span>
                <span className="text-[#B8A586]">&quot;1.0&quot;</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  declaration_id</span>
                <span className="text-[#F5F3F0]">: </span>
                <span className="text-[#B8A586]">
                  &quot;∞8-Qm...&quot;
                </span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  identity</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">primary_artist, collaborators, contributors</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  creative_stack</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">daws, plugins, ai_models, hardware</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  production_intelligence</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">ai_contribution, methodology</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  provenance</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">ipfs_cid, source_material, stems</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  audio_fingerprint</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">sha256, duration_ms, format</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                {"\n"}
                <span className="text-[#F5F3F0]">{"}"}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-8">
            Who This Is For
          </h2>
          <p className="text-[#8A8A8A] leading-relaxed mb-8">
            Masters-level producers using AI as serious creative tools, not
            crutches. Remix artists building complex derivative works who need
            verifiable source chains. Collaborative creators working across
            platforms, tools, and contributors who need attribution
            infrastructure.
          </p>
          <p className="text-[#8A8A8A] leading-relaxed mb-16">
            Forward-thinking labels building the next generation of music IP.
            Anyone who believes the future of music is multiplayer, generative,
            and AI-enabled.
          </p>

          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-8">
            Who This Is NOT For
          </h2>
          <p className="text-[#8A8A8A] leading-relaxed mb-4">
            Casual beatmakers chasing presets.<br />
            AI toy users posting "Suno magic."<br />
            Artists afraid to show their workflow.
          </p>
          <p className="text-lg text-[#F5F3F0] font-medium leading-relaxed">
            Using AI tools isn't shameful. Hiding your process is.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[640px] mx-auto text-center">
          <p className="text-xl text-[#8A8A8A] mb-8">
            Using AI tools is not shameful. Using them poorly is.
          </p>
          <Link
            href="/new"
            className="inline-block px-6 py-3 bg-[#F5F3F0] text-[#0A0A0A] font-medium text-sm tracking-wide hover:opacity-85 transition-opacity duration-100"
          >
            Create Your First Declaration
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#8A8A8A]">
          <div>∞8 ARCH</div>
          <div className="flex gap-8">
            <Link
              href="/gallery"
              className="hover:text-[#F5F3F0] transition-opacity duration-100"
            >
              Gallery
            </Link>
            <a
              href="https://github.com/bomac1193/O8"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5F3F0] transition-opacity duration-100"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
