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

      {/* Quick Start */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-12">
            Get Started in 3 Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <div className="text-3xl font-medium text-[#F5F3F0] mb-4">1</div>
              <p className="text-sm uppercase tracking-widest text-[#8A8A8A] mb-3">
                Create or Import
              </p>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">
                Start from scratch or use our Suno bookmarklet to auto-fill track data. Takes 10 seconds.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <div className="text-3xl font-medium text-[#F5F3F0] mb-4">2</div>
              <p className="text-sm uppercase tracking-widest text-[#8A8A8A] mb-3">
                Document Process
              </p>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">
                Add tools, AI percentages, collaborators, and methodology. Be as detailed or minimal as you want.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <div className="text-3xl font-medium text-[#F5F3F0] mb-4">3</div>
              <p className="text-sm uppercase tracking-widest text-[#8A8A8A] mb-3">
                Save & Share
              </p>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">
                Get a unique URL for your declaration. Share it, embed it, or mint it on-chain later.
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
            Created a track with Suno? Document it in 10 seconds with our one-click bookmarklet.
          </p>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 mb-8">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
              QUICK SETUP
            </p>
            <p className="text-sm text-[#8A8A8A] mb-6">
              Click below to copy the bookmarklet code, then add it to your browser's bookmarks bar.
            </p>
            <button
              onClick={() => {
                const bookmarkletCode = `javascript:(function(){const hostname=window.location.hostname;let isSuno=hostname.includes('suno');let isUdio=hostname.includes('udio');if(!isSuno&&!isUdio){alert('⚠️ Please run this on suno.com or udio.com');return;}let title='';let prompt='';let lyrics='';let artist='';let model='';let platformName=isSuno?'Suno':'Udio';const titleEls=document.querySelectorAll('h1, [class*="title"], [class*="Title"], [class*="song"]');for(const el of titleEls){const text=el.textContent.trim();if(text&&text.length<100&&!text.includes(platformName)&&!text.includes('Create')){title=text;break;}}const textareas=document.querySelectorAll('textarea');for(const ta of textareas){const text=ta.value||ta.textContent||'';const placeholder=ta.placeholder||'';if(placeholder.toLowerCase().includes('descri')||placeholder.toLowerCase().includes('prompt')){if(text&&!lyrics){prompt=text;}}else if(text.length>50){lyrics=text;}}if(!prompt&&lyrics){const lines=lyrics.split('\\n');if(lines.length>0){prompt='Song with lyrics: '+lines[0].substring(0,100)+'...';}}const buttons=document.querySelectorAll('button, a, span, div');for(const btn of buttons){const text=btn.textContent?.trim()||'';if(text.includes('@')&&text.length<30){artist=text.replace('@','').trim();break;}}let versionMatch=document.body.innerHTML.match(/[Vv](ersion)?\\s*[0-9.]+/);if(!versionMatch){versionMatch=document.body.textContent.match(/v[0-9.]+/i);}if(versionMatch){let versionStr=versionMatch[0].replace(/version/i,'').replace(/\\s+/g,'').trim();if(!versionStr.startsWith('v')){versionStr='v'+versionStr;}model=platformName+' '+versionStr;}else{model=isSuno?'Suno v4':'Udio v1.5';}if(!title){title='Untitled Track';}if(!prompt){prompt='Generated with '+platformName+' AI';}const baseUrl=hostname.includes('localhost')?'http://localhost:3000/new':'https://inf8.vercel.app/new';const params=new URLSearchParams({title:title,aiPrompt:prompt,methodology:'AI-generated track with '+platformName+'. Review and describe your actual process.',model:model,artist:artist||'Your Name',aiModels:model,daws:'N/A',plugins:'N/A',hardware:'N/A',aiComp:'100',aiArr:'100',aiProd:'100',aiMix:'100',aiMaster:'100'});const url=\`\${baseUrl}?\${params.toString()}\`;window.open(url,'_blank');alert('✅ Opening ∞8 ARCH declaration form with '+platformName+' data!');})();`;
                navigator.clipboard.writeText(bookmarkletCode);
                alert('✅ Bookmarklet code copied! Now follow the setup instructions below.');
              }}
              className="px-6 py-3 bg-[#1A1A1A] border border-[#8A8A8A] text-[#F5F3F0] text-sm font-medium hover:bg-[#2A2A2A] transition-colors duration-100"
            >
              📋 Copy Bookmarklet Code
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-[#F5F3F0] font-medium mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span> One-Time Setup
              </p>
              <div className="space-y-3 pl-7">
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">1</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Click the "Copy Bookmarklet Code" button above
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">2</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Right-click your bookmarks bar → "Add page" or "Add bookmark"
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">3</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Name: "∞8 + Suno" → URL field: paste the code (Ctrl+V) → Save
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#F5F3F0] font-medium mb-4 flex items-center gap-2">
                <span className="text-xl">⚡</span> Daily Usage
              </p>
              <div className="space-y-3 pl-7">
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">1</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Go to suno.com and create your track
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">2</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Click "∞8 + Suno" in your bookmarks bar
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">3</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Declaration form opens pre-filled → Add details → Save
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[#0D0D0D] border border-[#2A2A2A]">
            <p className="text-xs text-[#8A8A8A]">
              <span className="text-[#F5F3F0]">Tip:</span> The bookmarklet extracts track title, prompt, and model version automatically. Works on any Suno track page.
            </p>
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

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                Do I need a crypto wallet to use ∞8 ARCH?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                No. You can create declarations anonymously during beta. Connecting a wallet enables on-chain minting, revenue splits via smart contracts, and permanent provenance records. But basic documentation works without one.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                What happens to my data?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Declarations are stored in our database and can be viewed publicly in the gallery. Audio files are stored on IPFS (Pinata). Anonymous declarations can be deleted during beta. Wallet-connected and minted declarations become permanent for provenance integrity.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                How is the transparency score calculated?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                It's based on declaration completeness: how many fields you fill, whether you've uploaded audio, documented your creative stack, added collaborators, etc. Higher scores indicate more thorough documentation, not "better" music.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                Can I document non-AI music?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Absolutely. Set all AI contribution percentages to 0% and document your traditional workflow. The protocol works for any creative process—AI-native, hybrid, or fully human.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                What does "minting" mean and why would I do it?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Minting creates an NFT of your declaration on the blockchain, making it permanently immutable. Benefits: cryptographic proof of creation date, integration with ISSUANCE platform for revenue streams, ability to track lineage and derivatives, and enforcing smart contract splits for collaborators.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                Is this just for Suno? What about other AI music tools?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                The bookmarklet is Suno-specific for convenience, but you can manually create declarations for any tool: Udio, Stable Audio, AIVA, or even traditional DAWs. The protocol is tool-agnostic.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                Can I edit declarations after creating them?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Not yet. Once created, declarations are immutable by design to maintain provenance integrity. If you need to update information, create a new declaration with parentRelation set to "remix" or "derivative." Edit functionality may be added for pre-minted declarations.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                What's the difference between collaborators and contributors?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Collaborators get revenue splits (on-chain enforcement via smart contracts). Contributors get credit but no direct splits (think: session musicians, studio engineers, co-writers). Both are recorded in the declaration for attribution.
              </p>
            </div>
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
