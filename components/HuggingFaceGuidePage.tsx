import React from 'react';
import { useLanguage } from '../types';

const packageJsonCode = `{
  "name": "kavosh-ai-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}`;

const serverJsCode = `const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 7860;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));

// Handle the main index.html file to inject the API key
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send("Error reading index.html");
    }

    // Get API_KEY from Hugging Face secrets (environment variables)
    const apiKey = process.env.API_KEY || '';
    
    // Replace the placeholder with the actual API key
    const result = data.replace('__API_KEY__', apiKey);
    
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(\`Server listening on port \${port}\`);
});
`;

const dockerfileCode = `# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Make port 7860 available to the world outside this container
EXPOSE 7860

# Run server.js when the container launches
CMD [ "node", "server.js" ]
`;

const dockerignoreCode = `node_modules
.env
dist
`;


const fileStructureCode = `
/
|-- components/
|   |-- ... (all component files)
|-- services/
|   |-- ... (all service files)
|-- .dockerignore   <-- NEW
|-- App.tsx
|-- Dockerfile      <-- NEW
|-- index.html      
|-- index.tsx
|-- metadata.json
|-- package.json    <-- NEW
|-- server.js       <-- NEW
|-- types.ts
`;

const advancedDockerfile = `# Dockerfile: ai_co_trainer_with_ai_studio.Dockerfile  
# Base from AI Co-Trainer Free image (replace "ai-co-trainer-free:latest" with actual image name)  
FROM ai-co-trainer-free:latest
# Set environment variables for domain and AI Studio port  
ENV USER_DOMAIN=yourdomain.com
ENV AI_STUDIO_PORT=8080
# Install dependencies for AI Studio (example assumes Python-based AI Studio)  
RUN apt-get update && apt-get install -y \\
git \\
python3 \\
python3-pip \\
curl \\
nginx \\
&& rm -rf /var/lib/apt/lists/*
# Clone AI Studio repository  
RUN git clone https://github.com/your-org/ai-studio.git /opt/ai-studio
# Install Python requirements for AI Studio  
RUN pip3 install --no-cache-dir -r /opt/ai-studio/requirements.txt
# Copy Nginx configuration for user domain  
COPY nginx-ai-studio.conf /etc/nginx/conf.d/default.conf
# Expose ports for AI Co-Trainer and AI Studio  
EXPOSE 5000 8080
# Start both AI Co-Trainer and AI Studio services using a startup script  
COPY startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh
CMD ["/usr/local/bin/startup.sh"]
`;

const advancedStartupSh = `#!/bin/bash  
  
# Start AI Co-Trainer Free (replace with actual start command)  
ai-co-trainer-free &
# Start AI Studio  
cd /opt/ai-studio
python3 app.py &
# Start nginx to handle domain routing  
nginx -g 'daemon off;'
`;

const advancedNginxConf = `# nginx-ai-studio.conf - Nginx config for user domain  
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:8080/;  # AI Studio backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /co-trainer/ {
        proxy_pass http://localhost:5000/;  # AI Co-Trainer backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
`;


const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
    return (
        <pre className="bg-gray-900/70 rounded-lg p-4 text-sm text-gray-200 overflow-x-auto border border-white/10">
            <code className={`language-${language}`}>{code.trim()}</code>
        </pre>
    );
};

const HuggingFaceGuidePage: React.FC = () => {
    const { t } = useLanguage();

    const Step: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-teal-300 mb-4">{title}</h3>
            <div className="space-y-4 text-gray-300">{children}</div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {t('huggingFaceGuidePage.title')}
                </h1>
                <p className="mt-4 text-lg text-gray-300">{t('huggingFaceGuidePage.subtitle')}</p>
            </div>

            <div className="mt-16 max-w-4xl mx-auto space-y-8">
                <Step title={t('huggingFaceGuidePage.introTitle')}>
                    <p>{t('huggingFaceGuidePage.introContent')}</p>
                </Step>

                <Step title={t('huggingFaceGuidePage.securityTitle')}>
                    <p>{t('huggingFaceGuidePage.securityContent')}</p>
                </Step>
                
                <Step title={t('huggingFaceGuidePage.step1Title')}>
                    <p>{t('huggingFaceGuidePage.step1Content')}</p>
                </Step>

                <Step title={t('huggingFaceGuidePage.step2Title')}>
                    <h4 className="font-semibold text-gray-200">{t('huggingFaceGuidePage.step2aTitle')}</h4>
                    <p>{t('huggingFaceGuidePage.step2aContent')}</p>
                    <CodeBlock code={packageJsonCode} language="json" />
                    <h4 className="font-semibold text-gray-200 pt-4">{t('huggingFaceGuidePage.step2bTitle')}</h4>
                    <p>{t('huggingFaceGuidePage.step2bContent')}</p>
                    <CodeBlock code={serverJsCode} language="javascript" />
                </Step>
                
                <Step title={t('huggingFaceGuidePage.step3Title')}>
                    <h4 className="font-semibold text-gray-200">{t('huggingFaceGuidePage.step3aTitle')}</h4>
                    <p>{t('huggingFaceGuidePage.step3aContent')}</p>
                    <CodeBlock code={dockerfileCode} language="dockerfile" />
                    <h4 className="font-semibold text-gray-200 pt-4">{t('huggingFaceGuidePage.step3bTitle')}</h4>
                    <p>{t('huggingFaceGuidePage.step3bContent')}</p>
                    <CodeBlock code={dockerignoreCode} language="text" />
                </Step>
                
                <Step title={t('huggingFaceGuidePage.step4Title')}>
                     <p>{t('huggingFaceGuidePage.step4Content')}</p>
                     <h4 className="font-semibold pt-2">{t('huggingFaceGuidePage.fileStructure')}</h4>
                     <CodeBlock code={fileStructureCode} language="text" />
                </Step>
                
                <Step title={t('huggingFaceGuidePage.step5Title')}>
                    <p>{t('huggingFaceGuidePage.step5Content')}</p>
                    <img src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/hub/spaces-settings-secrets.png" alt="Hugging Face Secrets Settings" className="rounded-md border border-gray-600 mt-4"/>
                </Step>

                <Step title={t('huggingFaceGuidePage.conclusionTitle')}>
                    <p>{t('huggingFaceGuidePage.conclusionContent')}</p>
                </Step>

                {/* Advanced Section from User */}
                <div className="pt-8 mt-8 border-t-2 border-dashed border-gray-600">
                    <Step title={t('huggingFaceGuidePage.advancedSectionTitle')}>
                        <div className="p-4 bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-300 text-sm" role="alert">
                            <p>{t('huggingFaceGuidePage.advancedSectionDisclaimer')}</p>
                        </div>
                        <h4 className="font-semibold text-gray-200 pt-4">{t('huggingFaceGuidePage.advancedDockerfileTitle')}</h4>
                        <CodeBlock code={advancedDockerfile} language="dockerfile" />
                        
                        <h4 className="font-semibold text-gray-200 pt-4">{t('huggingFaceGuidePage.advancedStartupScriptTitle')}</h4>
                        <CodeBlock code={advancedStartupSh} language="bash" />

                        <h4 className="font-semibold text-gray-200 pt-4">{t('huggingFaceGuidePage.advancedNginxConfigTitle')}</h4>
                        <CodeBlock code={advancedNginxConf} language="nginx" />
                    </Step>
                </div>
            </div>
        </div>
    );
};

export default HuggingFaceGuidePage;