// Share links: a workspace packed into the URL fragment, so a snippet made
// elsewhere (an AI assistant, the MCP server, another person) opens in the
// editor with one click. The fragment never reaches the server.
//
//   https://…/#import=<base64url(deflate-raw(JSON))>
//
// Uses only CompressionStream, TextEncoder and btoa/atob, so the same code
// runs in the browser and in Node 18+.
import { isWorkspaceState, type WorkspaceState } from "./workspaces";

export const SHARE_PARAM = "import";

async function pipe(
  bytes: Uint8Array,
  stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const body = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(body).arrayBuffer());
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array {
  const base64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** Packs a workspace into the text used after `#import=`. */
export async function encodeWorkspace(state: WorkspaceState): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(state));
  return toBase64Url(await pipe(json, new CompressionStream("deflate-raw")));
}

/** Unpacks the text after `#import=`; throws if it is not a workspace. */
export async function decodeWorkspace(text: string): Promise<WorkspaceState> {
  let value: unknown;
  try {
    const bytes = await pipe(
      fromBase64Url(text),
      new DecompressionStream("deflate-raw"),
    );
    value = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error("The shared link is damaged or incomplete.");
  }
  if (!isWorkspaceState(value)) {
    throw new Error("The shared link does not contain a Blockly workspace.");
  }
  return value;
}

/** A link that opens the workspace in the editor at `baseUrl`. */
export async function shareUrl(
  baseUrl: string,
  state: WorkspaceState,
  name?: string,
): Promise<string> {
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  const extra = params.size ? `&${params}` : "";
  const base = baseUrl.replace(/#.*$/, "");
  return `${base}#${SHARE_PARAM}=${await encodeWorkspace(state)}${extra}`;
}

/** The packed workspace and optional name in a URL fragment, if any. */
export function readShareHash(
  hash: string,
): { data: string; name?: string } | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const data = params.get(SHARE_PARAM);
  if (!data) return null;
  return { data, name: params.get("name")?.trim() || undefined };
}
