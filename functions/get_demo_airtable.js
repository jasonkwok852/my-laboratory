export async function onRequest(context) {
  const AIRTABLE_API_KEY = context.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = context.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = context.env.AIRTABLE_TABLE_NAME;
  const offset = context.request.url.searchParams.get('offset') || '';

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?offset=${offset}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return new Response(`Error: ${response.statusText}`, { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}