export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pat = process.env.AIRTABLE_PAT;

  if (!pat) {
    return res.status(500).json({ error: 'AIRTABLE_PAT not set in Vercel environment variables' });
  }

  try {
    const allRecords = [];
    let offset = null;

    do {
      const url = new URL(
        'https://api.airtable.com/v0/appFFVHaVSXzcouF2/tblyqIvAKntnv9WQD'
      );
      url.searchParams.set('pageSize', '100');
      if (offset) url.searchParams.set('offset', offset);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${pat}` }
      });

      if (!response.ok) {
        const errBody = await response.text();
        return res.status(response.status).json({
          error: `Airtable returned ${response.status}`,
          detail: errBody
        });
      }

      const page = await response.json();
      allRecords.push(...(page.records || []));
      offset = page.offset || null;

    } while (offset);

    return res.status(200).json({ records: allRecords });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
