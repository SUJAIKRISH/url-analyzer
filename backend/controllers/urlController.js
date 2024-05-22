const axios = require('axios');
const Url = require('../models/Url');

const submitUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await axios.post('https://www.virustotal.com/api/v3/urls', 
      { url },
      {
        headers: {
          'x-apikey': process.env.VIRUSTOTAL_API_KEY
        }
      }
    );

    const analysisId = response.data.data.id;

    const analysisResult = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, 
      {
        headers: {
          'x-apikey': process.env.VIRUSTOTAL_API_KEY
        }
      }
    );

    const newUrl = new Url({
      url,
      analysisResult: analysisResult.data
    });

    await newUrl.save();

    res.status(201).json(newUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find();
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitUrl,
  getAllUrls,
  getUrlById
};
