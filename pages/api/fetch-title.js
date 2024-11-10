import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await fetch(url);
        const text = await response.text();
        const dom = new JSDOM(text);
        const title = dom.window.document.querySelector('title').textContent;
        let favicon = dom.window.document.querySelector('link[rel="icon"]')?.href;

        if (!favicon) {
            favicon = `${new URL(url).origin}/favicon.ico`;
        } else if (!favicon.startsWith('http')) {
            favicon = new URL(favicon, url).href;
        }

        // Extract text from paragraph elements
        const paragraphs = dom.window.document.querySelectorAll('p');
        let bodyText = '';
        for (let i = 0; i < paragraphs.length; i++) {
            bodyText += paragraphs[i].textContent.trim() + ' ';
            if (bodyText.split(/\s+/).length >= 50) {
                break;
            }
        }
        bodyText = bodyText.trim().split(/\s+/).slice(0, 50).join(' ');

        res.status(200).json({ title, favicon, bodyText });
    } catch (error) {
        console.error('Error fetching page title:', error);
        res.status(500).json({ error: 'Failed to fetch page title' });
    }
}