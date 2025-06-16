export async function onRequest(context) {
  // 從環境變數獲取 Airtable 配置
  const {
    AIRTABLE_API_KEY,
    AIRTABLE_BASE_ID,
    AIRTABLE_TABLE_NAME = 'Table 1' // 默認表名
  } = context.env;

  // 從查詢參數獲取 offset
  const { searchParams } = new URL(context.request.url);
  const offset = searchParams.get('offset') || '';

  // 構建 Airtable API URL
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?${offset ? `offset=${encodeURIComponent(offset)}&` : ''}view=Grid%20view`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Airtable API error:', error);
      return new Response(JSON.stringify({ error: error.message || 'Airtable API 錯誤' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    // 可以在此處對數據進行處理或過濾
    const processedData = {
      records: data.records,
      offset: data.offset || null
    };

    return new Response(JSON.stringify(processedData), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // 緩存 60 秒
      },
    });
  } catch (error) {
    console.error('Error fetching from Airtable:', error);
    return new Response(JSON.stringify({ error: error.message || '伺服器錯誤' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}