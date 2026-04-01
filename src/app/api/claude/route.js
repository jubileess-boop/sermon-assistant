// src/app/api/claude/route.js
// Claude API를 서버에서 호출 - API 키가 클라이언트에 노출되지 않음

export async function POST(request) {
  try {
    const body = await request.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json({ error }, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}
