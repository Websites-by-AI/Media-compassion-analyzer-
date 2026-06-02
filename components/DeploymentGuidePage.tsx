
import React from 'react';
import { useLanguage } from '../types';

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
    return (
        <pre className="bg-gray-900/70 rounded-lg p-4 text-sm text-gray-200 overflow-x-auto border border-white/10">
            <code className={`language-${language}`}>{code.trim()}</code>
        </pre>
    );
};

const DeploymentGuidePage: React.FC = () => {
    const { t } = useLanguage();

    const GuideSection: React.FC<{ title: string; intro: string; steps: string; tip?: string; }> = ({ title, intro, steps, tip }) => (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-teal-300 mb-2">{title}</h3>
            <p className="text-gray-300 mb-4">{intro}</p>
            <CodeBlock code={steps} language="text" />
            {tip && (
                <div className="mt-4 p-3 bg-blue-900/30 border-l-4 border-blue-500 text-blue-300 text-sm" role="alert">
                    <p><strong>Tip:</strong> {tip}</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {t('deploymentGuidePage.title')}
                </h1>
                <p className="mt-4 text-lg text-gray-300">{t('deploymentGuidePage.subtitle')}</p>
            </div>

            <div className="mt-16 max-w-4xl mx-auto space-y-8">
                <div className="p-4 bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-300 text-sm" role="alert">
                    <p>{t('deploymentGuidePage.disclaimer')}</p>
                </div>

                <GuideSection 
                    title={t('deploymentGuidePage.base44Title')} 
                    intro={t('deploymentGuidePage.base44Intro')}
                    steps={t('deploymentGuidePage.base44Steps')}
                    tip={t('deploymentGuidePage.base44Tip')}
                />

                <GuideSection 
                    title={t('deploymentGuidePage.netlifyTitle')}
                    intro={t('deploymentGuidePage.netlifyIntro')}
                    steps={t('deploymentGuidePage.netlifySteps')}
                    tip={t('deploymentGuidePage.netlifyTip')}
                />
                
                <GuideSection 
                    title={t('deploymentGuidePage.zapierTitle')}
                    intro={t('deploymentGuidePage.zapierIntro')}
                    steps={t('deploymentGuidePage.zapierSteps')}
                />

                <GuideSection 
                    title="4. Deploy to Cloudflare Pages"
                    intro="Cloudflare Pages is optimal for Vite apps. You can deploy automatically via Git or manually by uploading the built folder."
                    steps={`Important: Cloudflare requires the *built* static files (HTML/CSS/JS), not the source code (.ts/.tsx).

Option A: Git Integration (Recommended)
1. Push your code to a repository (GitHub/GitLab).
2. In Cloudflare Dashboard, go to Pages > Connect to Git.
3. Select your repository.
4. Configure Build Settings:
   - Framework preset: **Vite**
   - Build command: \`npm run build\`
   - Build output directory: \`dist\`
5. Environment Variables:
   - Add \`API_KEY\` with your Gemini API key.

Option B: Direct Upload (Manual)
*Use this if you see the error: "This uploader does not yet support projects that require a build process."*
1. Run \`npm run build\` on your local machine.
2. This generates a \`dist\` folder containing the compiled app.
3. Upload **only the dist folder** to Cloudflare Pages.

Configuration Checks:
- **package.json**: Must contain a build script (e.g., \`"build": "tsc && vite build"\`).
- **vite.config.ts**: Standard configuration works. Ensure it builds to the \`dist\` folder.`}
                    tip="SPA Routing: To prevent 404 errors on refresh, create a file named \`_redirects\` in your \`public\` folder with the content: \`/* /index.html 200\`."
                />

                <div className="bg-gray-800/50 rounded-lg p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-teal-300 mb-4">{t('deploymentGuidePage.bestPracticesTitle')}</h3>
                    <CodeBlock code={t('deploymentGuidePage.bestPracticesContent')} language="text" />
                </div>
                
                 <div className="bg-gray-800/50 rounded-lg p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-teal-300 mb-4">{t('deploymentGuidePage.summaryTitle')}</h3>
                    <CodeBlock code={t('deploymentGuidePage.summaryContent')} language="text" />
                </div>
            </div>
        </div>
    );
};

export default DeploymentGuidePage;
