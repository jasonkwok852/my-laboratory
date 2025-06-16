export async function onRequest(context) {
  // 從環境變數獲取 Airtable 配置（使用小寫名稱）
  const airtable_api_key = context.env.airtable_api_key;
  const airtable_base_id = context.env.airtable_base_id;
  // 從查詢參數獲取表名，默認為環境變數中的表名
  const tableName = context.request.url.searchParams.get('table') || context.env.airtable_table_name;
  const offset = context.request.url.searchParams.get('offset') || '';

  // 驗證必要參數
  if (!airtable_api_key || !airtable_base_id || !tableName) {
    return new Response(
      JSON.stringify({ error: 'Missing required environment variables or table name' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 構建 Airtable API URL
  const url = `https://api.airtable.com/v0/${airtable_base_id}/${encodeURIComponent(tableName)}?offset=${offset}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${airtable_api_key}`,
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