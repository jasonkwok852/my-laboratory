export async function onRequest(context) {
  // 從環境變數獲取 Airtable 配置
  const AIRTABLE_API_KEY = context.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = context.env.AIRTABLE_BASE_ID;
  // 從查詢參數獲取表名，默認為環境變數中的表名
  const tableName = context.request.url.searchParams.get('table') || context.env.AIRTABLE_TABLE_NAME;
  const offset = context.request.url.searchParams.get('offset') || '';

  // 驗證必要參數
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !tableName) {
    return new Response(
      JSON.stringify({ error: 'Missing required environment variables or table name' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 構建 Airtable API URL
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}?offset=${offset}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Airtable API error: ${response.statusText}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}