// Registration is managed through Clerk.

export async function POST() {
  return Response.json(
    { success: false, error: { message: 'Registration is managed through Clerk.' } },
    { status: 400 }
  );
}
