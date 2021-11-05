"use strict";
const express = require("express");
const { default: axios } = require('axios');
const { Configuration, PlaidApi, PlaidEnvironments, LinkTokenCreateRequest } = require('plaid');
const plaid = require('plaid')
// const { Configuration } = require('plaid');
let router = express.Router();

const configuration = new Configuration({
    basePath: PlaidEnvironments.development,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_DEV_SECRET
      },
    },
});

const plaidClient = new PlaidApi(configuration);

router.get('/queueSong/:trackId', (req, res) => {
    let spotifyApi = getSpotify();
    axios({
        method: 'post',
        url: 'https://api.spotify.com/v1/me/player/queue?uri=spotify:track:' + req.params.trackId,
        headers: {
            'Authorization': 'Bearer ' + spotifyApi.getAccessToken(),
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log('Queue Song Response Status: ' + res.status);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/getLinkToken', async (req, res) => {
    const linkTokenRequest = {
        user: {
            client_user_id: '5db3b2a411b5dd0014c12ed9',
          },
          client_name: 'Plaid Test App',
          products: ['auth', 'transactions'],
          country_codes: ['US'],
          language: 'en',
          webhook: 'https://sample-web-hook.com',
          account_filters: {
            depository: {
              account_subtypes: ['checking', 'savings'],
            },
          },
    };
    try {
        const response = await plaidClient.linkTokenCreate(linkTokenRequest);
        // console.log(response);
        const linkToken = response.data.link_token;
        console.log(linkToken);
        res.json({linkToken: linkToken});
    } catch (error) {
        console.log(error);
    }
});

router.get('/banks', async (req, res) => {
    const request = {
        count: 10,
        offset: 0,
        country_codes: ['US'],
        options: {
            routing_numbers: ['042000013'],
        }
    };
    const result = await plaidClient.institutionsGet(request);
    console.log(JSON.stringify(result.data.institutions, null, 2));
});

router.get('/exchangeToken', (req, res) => {
    
});

module.exports = router;