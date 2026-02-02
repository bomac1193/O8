// IPFS upload utilities using Pinata SDK + client-side SHA-256

export async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function uploadToPinata(
  file: File
): Promise<{ cid: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!jwt) {
      return { cid: "", error: "Pinata JWT not configured. Enter CID manually." };
    }

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!res.ok) {
      return { cid: "", error: "Upload failed. Enter CID manually." };
    }

    const data = await res.json();
    return { cid: data.IpfsHash };
  } catch {
    return { cid: "", error: "Upload failed. Enter CID manually." };
  }
}
