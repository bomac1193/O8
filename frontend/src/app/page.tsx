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

      {/* Suno Integration */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-6">
            Suno Integration
          </h2>
          <p className="text-[#8A8A8A] leading-relaxed mb-8">
            Created a track with Suno? Document it in 10 seconds.
          </p>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 mb-6">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
              ONE-CLICK BOOKMARKLET
            </p>
            <p className="text-sm text-[#8A8A8A] mb-6">
              Click the button below to copy the bookmarklet code, then follow the manual setup instructions.
            </p>
            <button
              onClick={() => {
                const bookmarkletCode = `javascript:(function(){if(!window.location.hostname.includes('suno')){alert('⚠️ Please run this bookmarklet while on suno.com');return;}let title='';let prompt='';let model='Suno';const titleSelectors=['[data-testid="song-title"]','.song-title','h1','[class*="title"]'];for(const selector of titleSelectors){const el=document.querySelector(selector);if(el&&el.textContent.trim()){title=el.textContent.trim();break;}}const promptSelectors=['[data-testid="prompt"]','[class*="prompt"]','textarea','[placeholder*="describe"]'];for(const selector of promptSelectors){const el=document.querySelector(selector);if(el){prompt=el.value||el.textContent.trim();if(prompt)break;}}const versionMatch=document.body.textContent.match(/v[0-9.]+/i);if(versionMatch){model='Suno '+versionMatch[0];}if(!title&&!prompt){title='Untitled Track';prompt='Generated with Suno AI';}const baseUrl=window.location.hostname.includes('localhost')?'http://localhost:3000/new':'https://inf8.vercel.app/new';const params=new URLSearchParams({title:title||'Untitled Track',prompt:prompt||'AI-generated track',model:model,artist:'Your Name'});const url=\`\${baseUrl}?\${params.toString()}\`;window.open(url,'_blank');alert('✅ Opening ∞8 ARCH declaration form with Suno data!');})();`;
                navigator.clipboard.writeText(bookmarkletCode);
                alert('✅ Bookmarklet code copied! Now follow the manual setup instructions below.');
              }}
              className="px-6 py-3 bg-[#1A1A1A] border border-[#8A8A8A] text-[#F5F3F0] text-sm font-medium hover:bg-[#2A2A2A] transition-colors duration-100"
            >
              Copy Bookmarklet Code
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-[#F5F3F0] font-medium mb-2">Manual Setup (One-Time):</p>
            <div className="flex items-start gap-4">
              <span className="text-[#8A8A8A] font-mono text-sm shrink-0">1.</span>
              <p className="text-sm text-[#8A8A8A]">Click "Copy Bookmarklet Code" button above</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#8A8A8A] font-mono text-sm shrink-0">2.</span>
              <p className="text-sm text-[#8A8A8A]">Right-click on your Favorites Bar → Add page → Name it "∞8 + Suno"</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#8A8A8A] font-mono text-sm shrink-0">3.</span>
              <p className="text-sm text-[#8A8A8A]">In the URL field, paste the copied code (Ctrl+V) → Save</p>
            </div>

            <p className="text-sm text-[#F5F3F0] font-medium mb-2 mt-6">Using the Bookmarklet:</p>
            <div className="flex items-start gap-4">
              <span className="text-[#8A8A8A] font-mono text-sm shrink-0">4.</span>
              <p className="text-sm text-[#8A8A8A]">Go to suno.com and generate a track</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#8A8A8A] font-mono text-sm shrink-0">5.</span>
              <p className="text-sm text-[#8A8A8A]">Click the "∞8 + Suno" bookmark in your favorites bar</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#8A8A8A] font-mono text-sm shrink-0">6.</span>
              <p className="text-sm text-[#8A8A8A]">Declaration form opens with track data pre-filled → Add details → Save</p>
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
          <p className="text-[#8A8A8A] leading-relaxed mb-6">
            You're building tracks with Suno-generated melodies, live instruments, three remote collaborators, and AI-assisted mixing. Traditional metadata (ISRC codes, liner notes) can't capture what you're actually doing.
          </p>
          <p className="text-[#8A8A8A] leading-relaxed mb-6">
            You see your workflow's complexity—the precise 73% AI composition paired with hand-crafted arrangement—not as something to hide, but as proof you understand your tools at a level most producers never reach.
          </p>
          <p className="text-[#8A8A8A] leading-relaxed mb-6">
            You're working on remixes where every sample has a source chain. Derivative works where lineage matters. Collaborative projects where 15 people contributed and everyone needs verifiable attribution.
          </p>
          <p className="text-[#8A8A8A] leading-relaxed mb-16">
            The infrastructure you need doesn't exist in the legacy music industry. You're here because you see what's already happening, and you want tools built for that reality.
          </p>

          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-8">
            Who This Is NOT For
          </h2>
          <p className="text-[#8A8A8A] leading-relaxed mb-6">
            This makes sense to you, or it doesn't.
          </p>
          <p className="text-[#8A8A8A] leading-relaxed mb-6">
            If documenting your creative stack feels like exposure rather than demonstration—if showing your AI contribution percentages feels risky instead of valuable—this infrastructure isn't for you yet.
          </p>
          <p className="text-[#8A8A8A] leading-relaxed">
            No judgment. Different tools for different moments. The protocol exists when you're ready.
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

      {/* Disclaimer */}
      <section className="py-12 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <p className="text-xs text-[#8A8A8A] leading-relaxed mb-4">
            <span className="text-[#F5F3F0] font-medium">Disclaimer:</span> ∞8 ARCH provides infrastructure for creative provenance documentation. Users are solely responsible for the accuracy of their declarations and compliance with applicable laws. We make no warranties regarding the legal enforceability of declarations or rights claimed therein. This service is provided "as-is" without guarantees of any kind.
          </p>
          <p className="text-xs text-[#8A8A8A] leading-relaxed">
            AI model names (Suno, Udio, AIVA, etc.) are trademarks of their respective owners. Mention of these tools is for descriptive purposes only and does not imply endorsement or affiliation. Users should comply with the terms of service of any third-party tools they document in their declarations.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#8A8A8A]">
          <div>∞8 ARCH — Open Protocol</div>
          <div className="flex gap-8">
            <Link
              href="/gallery"
              className="hover:text-[#F5F3F0] transition-opacity duration-100"
            >
              Gallery
            </Link>
            <a
              href="https://github.com/bomac1193/Inf8"
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
