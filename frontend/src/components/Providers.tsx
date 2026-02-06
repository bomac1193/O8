"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            ...darkTheme({
              accentColor: "#F5F3F0",
              accentColorForeground: "#0A0A0A",
              borderRadius: "none",
              fontStack: "system",
              overlayBlur: "none",
            }),
            fonts: {
              body: "var(--font-plex-sans), system-ui, sans-serif",
            },
            colors: {
              accentColor: "#F5F3F0",
              accentColorForeground: "#0A0A0A",
              actionButtonBorder: "#2A2A2A",
              actionButtonBorderMobile: "#2A2A2A",
              actionButtonSecondaryBackground: "#1A1A1A",
              closeButton: "#8A8A8A",
              closeButtonBackground: "#0A0A0A",
              connectButtonBackground: "#0A0A0A",
              connectButtonBackgroundError: "#8B4049",
              connectButtonInnerBackground: "#1A1A1A",
              connectButtonText: "#F5F3F0",
              connectButtonTextError: "#F5F3F0",
              connectionIndicator: "#4A7C59",
              downloadBottomCardBackground: "#0A0A0A",
              downloadTopCardBackground: "#0A0A0A",
              error: "#8B4049",
              generalBorder: "#2A2A2A",
              generalBorderDim: "#1A1A1A",
              menuItemBackground: "#1A1A1A",
              modalBackdrop: "rgba(10, 10, 10, 0.8)",
              modalBackground: "#0A0A0A",
              modalBorder: "#2A2A2A",
              modalText: "#F5F3F0",
              modalTextDim: "#8A8A8A",
              modalTextSecondary: "#8A8A8A",
              profileAction: "#1A1A1A",
              profileActionHover: "#2A2A2A",
              profileForeground: "#0A0A0A",
              selectedOptionBorder: "#F5F3F0",
              standby: "#8A8A8A",
            },
            radii: {
              actionButton: "0px",
              connectButton: "0px",
              menuButton: "0px",
              modal: "0px",
              modalMobile: "0px",
            },
            shadows: {
              connectButton: "none",
              dialog: "none",
              profileDetailsAction: "none",
              selectedOption: "none",
              selectedWallet: "none",
              walletLogo: "none",
            },
          }}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
