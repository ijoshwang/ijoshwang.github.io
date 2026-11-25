import { PROFILE } from "@/domain/profile-data";
import { formatLlmsTxt } from "@/domain/protocol-export";

export const dynamic = "force-static";

export function GET() {
  return new Response(formatLlmsTxt(PROFILE), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
