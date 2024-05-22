const express = require('express');
const router = express.Router();
const Url = require('../models/Url'); // Ensure this path is correct
const axios = require('axios');

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send({ error: 'URL is required' });
  }

  try {
    console.log('Submitting URL to VirusTotal:', url);
    const virusTotalResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      { url },
      {
        headers: {
          'x-apikey': process.env.VIRUSTOTAL_API_KEY,
        }
      }
    );

    console.log('VirusTotal response:', virusTotalResponse.data);

    const newUrl = new Url({
      url,
      analysisResult: virusTotalResponse.data,
      createdAt: new Date(),
    });

    await newUrl.save();
    res.status(201).send(newUrl);
  } catch (error) {
    console.error('Error during URL analysis:', error.message);
    res.status(500).send({ error: 'Failed to analyze URL' });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('Fetching all URLs');
    const urls = await Url.find();
    res.status(200).send(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error.message);
    res.status(500).send({ error: 'Failed to fetch URLs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching URL by ID:', req.params.id);
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
