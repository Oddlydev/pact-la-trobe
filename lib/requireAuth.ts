import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export async function requireAuth<T = any>(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<T> | null> {
  const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";
  const NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  const token = ctx.req.cookies?.[COOKIE_NAME];

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    } as GetServerSidePropsResult<T>;
  }

  if (NEXT_PUBLIC_WORDPRESS_URL) {
    try {
      const meRes = await fetch(
        `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users/me&context=edit`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!meRes.ok) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        } as GetServerSidePropsResult<T>;
      }
    } catch {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      } as GetServerSidePropsResult<T>;
    }
  }

  return null;
}

