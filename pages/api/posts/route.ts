// app/api/posts/route.ts
export async function GET() {
    const endpoint = process.env.WP_GRAPHQL_URL!; // e.g. https://your-site.com/graphql
    const query = `
    query Posts($first:Int!){
      posts(first:$first){
        nodes{ id databaseId title uri date }
      }
    }
  `;
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // If private, add an auth header or WP Application Passwords/JWT
        body: JSON.stringify({ query, variables: { first: 10 } }),
        // optional cache control for ISR:
        next: { revalidate: 60 }
    });
    const data = await res.json();
    return Response.json(data);
}
