import { PROFILE } from "@/domain/profile-data";
import { formatProfileJson } from "@/domain/protocol-export";

export const dynamic = "force-static";

export function GET() {
  return new Response(formatProfileJson(PROFILE), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
