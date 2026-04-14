export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const pat = process.env.AIRTABLE_PAT;

  const response = await fetch(
    'https://api.airtable.com/v0/appFFVHaVSXzcouF2/tblyqIvAKntnv9WQD?maxRecords=100',
    {
      headers: {
        'Authorization': `Bearer ${pat}`
      }
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
