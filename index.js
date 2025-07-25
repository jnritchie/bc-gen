const express = require('express');
const bwipjs = require('bwip-js');

const app = express();
const port = 3000;

app.use(express.json());

// GET route - Generate barcode from query
app.get('/barcode', (req, res) => {
    const { text = '', bcType = 'code128' } = req.query;

    if (!text) {
        return res.status(400).json({ error: 'Missing `text` parameter' });
    }

    try {
        bwipjs.toBuffer({
            bcid: bcType,       // Barcode type (e.g. code128, qrcode, etc.)
            text: text,         // Text to encode
            scale: 3,           // 3x scaling factor
            height: 10,         // Bar height (for linear barcodes)
            includetext: true,  // Show human-readable text
            textxalign: 'center',
        }, function (err, png) {
            if (err) {
                return res.status(500).json({ error: err.message });
            } else {
                res.set('Content-Type', 'image/png');
                res.send(png);
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST route - JSON body
app.post('/barcode', (req, res) => { 
    const { text = '', bcType = 'code128' } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Missing `text` in body' });
    }

    try {
        bwipjs.toBuffer({
            bcid: bcType,
            text: text,
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: 'center',
        }, function (err, png) {
            if (err) {
                return res.status(500).json({ error: err.message });
            } else {
                res.set('Content-Type', 'image/png');
                res.send(png);
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Barcode generator running at http://localhost:${port}`);
});
