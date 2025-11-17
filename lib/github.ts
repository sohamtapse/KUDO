export async function postCommitReview(
  repoFullName: string,
  sha: string,
  body: string
) {
  await fetch(
    `https://api.github.com/repos/${repoFullName}/commits/${sha}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_PAT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    }
  );
}
