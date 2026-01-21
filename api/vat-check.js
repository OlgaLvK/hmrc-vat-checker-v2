const axios = require('axios');

const HMRC_CONFIG = {
  clientId: 'MTaxlPbM5R2SbC58KNwVgMKyAf80',
  clientSecret: 'a635a9e7-1e11-4771-a488-7a4c3796c7c4',
  sandboxUrl: 'https://test-api.service.hmrc.gov.uk',
  useSandbox: true
};

const baseUrl = HMRC_CONFIG.sandboxUrl;

let tokenCache = {
  token: null,
  expiresAt: null
};

async function getAccessToken() {
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', HMRC_CONFIG.clientId);
  params.append('client_secret', HMRC_CONFIG.clientSecret);

  const response = await axios.post(`${baseUrl}/oauth/token`, 
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    }
  );

  tokenCache = {
    token: response.data.access_token,
    expiresAt: Date.now() + (3.5 * 60 * 60 * 1000)
  };

  return response.data.access_token;
}

function formatVATNumber(vat) {
  return vat.replace(/\s+/g, '').toUpperCase();
}

function validateVATFormat(vat) {
  const formatted = formatVATNumber(vat);
  return /^[0-9]{9}$|^[0-9]{12}$/.test(formatted);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { vatNumber } = req.body;

  if (!vatNumber) {
    return res.status(400).json({ error: 'VAT number is required' });
  }

  if (!validateVATFormat(vatNumber)) {
    return res.status(400).json({ 
      error: 'Invalid VAT number format. UK VAT numbers should be 9 or 12 digits.' 
    });
  }

  const formattedVAT = formatVATNumber(vatNumber);

  try {
    const token = await getAccessToken();
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ 
      message: 'Use POST method',
      method: req.method 
    });
  }

  const { vatNumber } = req.body || {};

  if (!vatNumber) {
    return res.status(400).json({ 
      error: 'VAT number is required',
      body: req.body
    });
  }

  // Временный тестовый ответ
  const testData = {
    '553557881': {
      valid: true,
      vatNumber: '553557881',
      name: 'Credite Sberger Donal Inc.',
      address: {
        line1: '131B Barton Hamlet',
        postcode: 'SW97 5CK',
        countryCode: 'GB'
      }
    }
  };

  const formatted = vatNumber.replace(/\s+/g, '').toUpperCase();

  if (testData[formatted]) {
    return res.status(200).json(testData[formatted]);
  }

  return res.status(200).json({
    valid: false,
    vatNumber: formatted,
    message: 'VAT number not found (test mode)'
  });
}
