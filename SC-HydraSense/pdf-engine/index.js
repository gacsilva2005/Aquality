const express = require('express');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '50mb' }));

app.post('/generate', async (req, res) => {
    let browser = null;
    try {
        const { tipo, payload } = req.body;
        
        let templateFile;
        switch(tipo) {
            case 'geral':
                templateFile = 'template-geral.ejs';
                break;
            case 'equipe':
                templateFile = 'template-equipe.ejs';
                break;
            case 'sessao':
            default:
                templateFile = 'template-atleta.ejs';
        }

        // Carrega o template EJS injetando os dados do payload
        const html = await ejs.renderFile(path.join(__dirname, 'templates', templateFile), { data: payload });

        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        
        // Define o conteúdo HTML processado pelo EJS com timeout seguro (8s) para redes acadêmicas
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 8000 }).catch(e => {
            console.log("Aviso: Timeout ao carregar recursos externos (CDNs). Gerando PDF com o que foi carregado.");
        });

        // Gera o PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length
        });
        res.end(pdfBuffer);

    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`PDF Engine listening on port ${PORT}`);
});
