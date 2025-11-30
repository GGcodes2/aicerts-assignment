let versions = global.versions || [];
global.versions = versions;

export async function GET() {
  return new Response(JSON.stringify([...versions].reverse()), {
    headers: { "Content-Type": "application/json" },
  });
}
