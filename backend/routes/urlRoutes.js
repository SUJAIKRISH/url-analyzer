const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const axios = require('axios');
const { URLSearchParams } = require('url');

// POST /api/urls - Submit a new URL for analysis
router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send({ error: 'URL is required' });
  }

  try {
    const formData = new URLSearchParams();
    formData.append('url', url);

    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      formData.toString(),
      {
        headers: {
          'x-apikey': process.env.VIRUSTOTAL_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const analysisId = submitResponse.data.data.id;

    // Sleep for a few seconds to ensure the analysis is completed
    await new Promise(resolve => setTimeout(resolve, 20000)); // Wait for 20 seconds

    const analysisResult = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: {
          'x-apikey': process.env.VIRUSTOTAL_API_KEY
        }
      }
    );

    const newUrl = new Url({
      url,
      analysisResult: analysisResult.data,
      createdAt: new Date(),
    });

    await newUrl.save();
    res.status(201).send(newUrl);
  } catch (error) {
    console.error('Error during URL analysis:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Failed to analyze URL' });
  }
});

// GET /api/urls - Retrieve all submitted URLs
router.get('/', async (req, res) => {
  try {
    const urls = await Url.find();
    res.status(200).send(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error.message);
    res.status(500).send({ error: 'Failed to fetch URLs' });
  }
});

// GET /api/urls/:id - Retrieve a specific URL by ID
router.get('/:id', async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) {
      return res.status(404).send({ error: 'URL not found' });
    }
    res.status(200).send(url);
  } catch (error) {
    console.error('Error fetching URL by ID:', error.message);
    res.status(500).send({ error: 'Failed to fetch URL' });
  }
});

module.exports = router;
