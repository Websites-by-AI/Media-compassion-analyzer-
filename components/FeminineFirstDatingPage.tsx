import React, { useState } from 'react';

const FeminineFirstDatingPage: React.FC = () => {
    const [auditOutput, setAuditOutput] = useState("Console output will appear here.");
    const [repoInfo, setRepoInfo] = useState("No repo linked.");

    const runAudit = () => {
        setAuditOutput("Running quick audit...\n1) Profile fields: OK\n2) Diversity toggle: MISSING\n3) Explainable matches: MISSING\n4) Moderation: PARTIAL\n\nRecommendations: add diversity toggle, add match explanations, start daily logs.");
    };

    const openGit = () => {
        const repoUrl = "https://github.com/your-org/your-repo"; // <-- replace this
        setRepoInfo(repoUrl);
        window.open(repoUrl, '_blank');
    };

    const Card: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => (
        <div className={`bg-gray-800/50 p-6 rounded-lg border border-white/10 ${className}`}>
            {children}
        </div>
    );

    const H2: React.FC<{children: React.ReactNode}> = ({children}) => (
        <h2 className="text-xl font-semibold text-rose-300 mb-3">{children}</h2>
    );
    
    const H3: React.FC<{children: React.ReactNode}> = ({children}) => (
        <h3 className="text-lg font-semibold text-gray-200 mb-3">{children}</h3>
    );

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-white text-center mb-2">When Dating Turns Feminine-First</h1>
        <p className="text-gray-400 text-center mb-10">A guide for product teams building dating systems that emphasize feminine expression.</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <Card>
              <H2>Overview</H2>
              <p className="text-gray-300">Shifts in cultural aesthetics and algorithmic incentives may lead to dating platforms that prioritize feminine traits. This page outlines causes, effects, and safeguards for designers and engineers.</p>
            </Card>

            <Card>
              <H2>Design Recommendations</H2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Inclusive profiles: let users describe gender and expression.</li>
                <li>Preference transparency: users pick which signals matter.</li>
                <li>Diversity-boost toggle to surface non-conforming profiles.</li>
                <li>Explainable matches and consent-first flows.</li>
                <li>Bias audits, human moderation and clear community norms.</li>
              </ul>
            </Card>

            <Card>
              <H2>Suggested Metrics</H2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Match acceptance rate across demographics</li>
                  <li>Harassment reports / appeals</li>
                  <li>Diversity in top 20 matches</li>
                  <li>User well-being survey (NPS-style)</li>
              </ul>
            </Card>

            <Card>
              <H2>Short Article</H2>
              <p className="text-gray-300"><strong>When Dating Turns Feminine-First:</strong> Society’s dating systems reflect biology, culture, and tech. Feminine-first trends can empower but also commodify. Prioritize inclusion, explainability, and safety to shape a healthier future.</p>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <H3>Actions</H3>
              <div className="flex flex-col gap-3">
                <button className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors" onClick={runAudit}>Run Bias Audit</button>
                <button className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 transition-colors" onClick={openGit}>Open GitHub Repo</button>
              </div>
              <p className="text-gray-400 text-sm mt-4">Use these to start governance & development work.</p>
            </Card>

            <Card>
              <H3>Quick Checklist</H3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Enable inclusive profile fields.</li>
                <li>Add explainable match reasons.</li>
                <li>Implement diversity-boost toggle.</li>
                <li>Start logging anonymity + survey feedback.</li>
                <li>Open a public issues board on GitHub.</li>
              </ol>
            </Card>

            <Card>
              <H3>Repository</H3>
              <p className="text-gray-400 text-sm break-all">{repoInfo}</p>
            </Card>
          </div>
        </div>

        <pre className="w-full mt-6 bg-gray-900 text-gray-300 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">{auditOutput}</pre>
      </div>
    );
};

export default FeminineFirstDatingPage;
