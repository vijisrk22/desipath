const fs = require('fs');
const unzipper = require('unzipper');

async function extractTextFromDocx(docxPath) {
    try {
        const directory = await unzipper.Open.file(docxPath);
        const documentXml = directory.files.find(d => d.path === 'word/document.xml');
        if (!documentXml) {
            console.error('word/document.xml not found in the docx file.');
            return;
        }
        const content = await documentXml.buffer();
        const xmlString = content.toString('utf8');
        const text = xmlString.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log(text);
    } catch (e) {
        console.error('Error:', e);
    }
}

if (process.argv.length > 2) {
    extractTextFromDocx(process.argv[2]);
}
