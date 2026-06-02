
// prettier-ignore
// FIX: Import missing types to resolve 'Cannot find name' errors.
import { Language, ChangelogEntry, TrainingPath } from './types';

export const translations = {
  en: {
    header: {
      home: 'Dashboard',
      topic_deep_dive: 'Topic Deep Dive',
      news_briefing: 'News Briefing',
      saved_reports: 'My Reports',
      case_studies: 'Case Studies',
      subscriptions: 'Subscriptions',
      hugging_face_guide: 'Hugging Face Guide',
      deployment_guide: 'Deployment Guide',
      opposition_ai: 'Opposition AI',
      youtube_analyzer: 'Media Analyzer',
    },
    hero: {
      title: 'Generate Insightful <span class="text-teal-400">News Analysis</span> with AI',
      subtitle: 'Kavosh AI empowers editors and journalists to rapidly analyze complex topics, generate article ideas, and produce data-driven news briefings for economics and energy sectors.',
      button1: 'Start a Topic Deep Dive',
      button2: 'Generate a News Briefing',
      featuresTitle: 'Explore Our Core Tools',
      feature1Title: 'Topic Deep Dive',
      feature1Description: 'Unpack complex subjects with in-depth AI analysis, from key angles to counterarguments.',
      feature2Title: 'News Briefing',
      feature2Description: 'Instantly generate summaries, key takeaways, and headlines from news articles or events.',
      feature3Title: 'My Reports',
      feature3Description: 'Save, review, and manage all your generated deep dives and briefings in one place.',
      feature4Title: 'Case Studies',
      feature4Description: 'See examples of how Kavosh AI can be used to analyze real-world news and events.',
    },
    topicDeepDive: {
      title: 'AI Topic Deep Dive',
      descriptionLabel: 'Enter a topic, event, or question to analyze.',
      descriptionPlaceholder: 'e.g., "The impact of the new OPEC+ production cuts on the global oil market." or "What are the investment trends in renewable energy in the Middle East?"',
      voiceInputStart: 'Start voice input',
      voiceInputStop: 'Stop voice input',
      buttonText: 'Analyze Topic',
      sampleTitle: 'Or try an example:',
      sampleTexts: [
        { label: 'Energy Policy', value: 'Analyze the pros and cons of Germany\'s decision to phase out nuclear energy.' },
        { label: 'Economic Event', value: 'What is the expected economic impact of the Suez Canal blockage?' },
        { label: 'Tech Trend', value: 'The future of green hydrogen technology and its viability for mass adoption.' }
      ],
      validationError: 'Please provide a topic to analyze.',
      analysisTitle: 'AI-Generated Topic Analysis',
      generating: 'Generating analysis...',
      placeholder: 'Your deep dive will appear here. Describe a topic to begin.',
      // Result display
      keyAnglesTitle: 'Key Angles to Explore',
      talkingPointsTitle: 'Primary Talking Points',
      counterArgumentsTitle: 'Potential Counterarguments',
      disclaimerTitle: 'Disclaimer',
      saveAnalysis: 'Save Report',
       // Data Viz
      dataVizTitle: 'Data Visualization Suggestions',
      dataVizSubtitle: 'Effective ways to visualize the data for your article.',
      generateDataViz: 'Suggest Visualizations',
      generatingDataViz: 'Generating...',
      primaryViz: 'Primary Suggestion',
      secondaryViz: 'Secondary Suggestion',
      // Expert Profiles
      expertProfilesTitle: 'Expert Profiles to Interview',
      expertProfilesSubtitle: 'AI-generated expert archetypes to add depth to your reporting.',
      generateExpertProfiles: 'Suggest Expert Profiles',
      generatingExpertProfiles: 'Generating Profiles...',
      forAngleTitle: 'Pro-Argument Expert',
      againstAngleTitle: 'Counter-Argument Expert',
      expertise: 'Expertise',
      theDynamic: 'Role in Narrative',
      reasoning: 'Why this voice matters',
      // Publication Outlets
      publicationOutletTitle: 'Publication Outlet Suggestions',
      publicationOutletSubtitle: 'Exploring the best formats for this story.',
      generatePublicationOutlet: 'Suggest Publication Outlets',
      generatingPublicationOutlet: 'Analyzing...',
      primaryOutletTitle: 'Primary Outlet',
      secondaryOutletTitle: 'Secondary Outlet',
      viewIntimacyDetails: 'View Strategy Details', // Repurposed
      generatingIntimacyDetails: 'Generating Strategy...', // Repurposed
      intimacyDetailsModalTitle: 'Publication Strategy Details', // Repurposed
      introduction: 'Introduction',
      techniques: 'Tactics & Approaches', // Repurposed
      psychologicalBenefits: 'Strategic Benefits', // Repurposed
      focus: 'Focus',
      // Thematic Image
      thematicImageTitle: 'Thematic Image Concept',
      thematicImageSubtitle: 'An AI-generated artistic representation of the topic.',
      generateThematicImage: 'Generate Image',
      generatingThematicImage: 'Generating Artwork...',
      downloadImage: 'Download Image',
      // Trends
      findTrendsTitle: 'Current Trends & Developments',
      findTrendsSubtitle: 'Ground your analysis with the latest information from the web.',
      findTrendsButton: 'Find Current Trends',
      findingTrends: 'Searching for trends...',
      trendsSummaryTitle: 'AI-Generated Trend Summary',
      trendsSourcesTitle: 'Sources',
      // YouTube Videos
      findVideosTitle: "Related Video Content",
      findVideosSubtitle: "Discover relevant YouTube videos to enrich your story.",
      findVideosButton: "Find Related Videos",
      findingVideos: "Searching for videos...",
      videoFilters: {
        quality: "Quality",
        anyQuality: "Any",
        hd: "HD",
        fourK: "4K",
        uploadDate: "Upload Date",
        anyTime: "Any time",
        lastMonth: "Last month",
        thisYear: "This year",
        duration: "Duration",
        anyDuration: "Any",
        short: "Short (< 4 min)",
        long: "Long (> 20 min)",
      },
    },
    newsBriefing: {
      title: 'AI News Briefing Generator',
      descriptionLabel: 'Paste article text or describe the news event.',
      descriptionPlaceholder: 'e.g., Paste the full text of a press release here, or describe an event like "The central bank just raised interest rates by 25 basis points."',
      validationError: 'Please provide a description.',
      analysisTitle: 'AI-Generated News Briefing',
      generating: 'Generating briefing...',
      placeholder1: 'Your news briefing will appear here.',
      placeholder2: 'Describe a news event to get started.',
      detailsTitle: 'Additional Context (Optional)',
      sourceURL: 'Source URL',
      keyFigures: 'Key People/Companies Involved',
      specificQuestions: 'Specific Questions to Answer',
      audience: 'Target Audience',
      audiencePlaceholder: 'e.g., General public, Investors, Policymakers',
      tone: 'Desired Tone',
      tonePlaceholder: 'e.g., Neutral, Analytical, Urgent',
      specialistsTitle: 'Suggested Headlines',
      conditionsTitle: 'Key Takeaways & Insights',
      hideDetails: 'Hide Details',
      viewDetails: 'View Details',
      academicAnalysisButton: 'View Deeper Context',
      loadingDetails: 'Loading details...',
      loadingAcademicAnalysis: 'Loading context...',
      copySuccess: 'Copied!',
      findSpecialistsButton: 'Find Related Experts',
      requestResearchButton: 'Request Deeper Analysis',
      lowConfidenceFallback: 'The AI has low confidence in these results. Consider providing more text or context for a more accurate analysis.',
      careerSectionTitle: 'Stakeholder & Market Impact',
      currentJobAnalysisTitle: 'Stakeholder Analysis',
      jobSuggestionsTitle: 'Market Impact Analysis',
      followUpTitle: 'Follow-up Questions for the Editor',
      prepareSummaryButton: 'Generate Executive Summary',
      generatingSummary: 'Generating summary...',
      buttonText: 'Generate Briefing',
      relevance: 'Confidence'
    },
    savedReportsPage: {
      title: 'My Saved Reports',
      subtitle: 'Here are the briefings and deep dives you\'ve saved. You can restore one to review it or delete it.',
      restore: 'View',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to permanently delete this report?',
      savedOn: 'Saved on',
      emptyTitle: 'No saved reports yet',
      emptyText: 'When you generate a report, use the "Save Report" button to keep it here.',
      goBackButton: 'Analyze a New Topic',
      analysisTypeFlavor: 'Topic Deep Dive',
      analysisTypeCompatibility: 'News Briefing',
      untitledBriefing: 'Untitled News Briefing',
    },
    servicesPage: {
      title: 'Subscription Plans',
      subtitle: 'Empower your newsroom with our powerful AI analysis tools.',
      tier1: {
        title: 'Basic',
        price: 'Free',
        description: 'Access our core AI analysis tools to get started with AI-assisted journalism.',
        features: ['Topic Deep Dive Analysis', 'News Briefing Generator', 'Save & Review 10 Reports'],
        cta: 'Get Started',
      },
      tier2: {
        title: 'Professional',
        price: '$99',
        unit: '/ month',
        description: 'For individual journalists and small teams requiring more power and features.',
        features: ['Everything in Basic', 'Unlimited saved reports', 'Priority access to new features', 'URL-based analysis'],
        cta: 'Upgrade to Pro',
      },
      tier3: {
        title: 'Enterprise',
        price: 'Custom',
        unit: '/ newsroom',
        description: 'A complete solution for news organizations, with API access and custom model training.',
        features: ['Everything in Professional', 'Full API access', 'Custom-trained models', 'Team collaboration features', 'Dedicated support'],
        cta: 'Contact Sales',
      },
    },
    footer: {
      description: 'Kavosh AI is your intelligent assistant for rapid, insightful analysis of complex news topics.',
      copyright: '© 2024 Kavosh AI. All Rights Reserved.',
    },
    quotaErrorModal: {
      title: 'API Quota Exceeded',
      body: 'You have exceeded your daily limit for the Gemini API. Please check your billing settings or try again tomorrow.',
      cta: 'Check Billing',
      close: 'Close',
    },
    auth: {
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      loginTitle: 'Log in to Kavosh AI',
      signupTitle: 'Sign up for Kavosh AI',
      continueWith: 'Continue with {provider}',
    },
    executiveSummaryPreview: {
      title: 'Executive Summary Preview',
      style: 'Style',
      memo: 'Internal Memo',
      pressRelease: 'Press Release',
      copySummary: 'Copy Summary',
      subjectPlaceholder: 'Subject Line',
      toPlaceholder: 'To: All Editors',
    },
    researchRequestModal: {
        title: 'Deeper Analysis Requested',
        body: 'Thank you! Your request for a deeper analysis on "{topic}" has been noted. We will prioritize analysis on topics with high demand.',
        close: 'Close',
    },
    expertFinder: {
        title: 'Find an Expert',
        subtitle: 'Based on your analysis, the AI will search for fictional expert profiles.',
        validationError: 'Please generate a briefing first.',
        maxResults: 'Maximum Results',
        finding: 'Finding experts...',
        findButton: 'Find Experts',
        savedTitle: 'Saved Contacts',
        clearAll: 'Clear All',
        expertise: 'Expertise',
        contact: 'Contact',
        relevance: 'Relevance',
        notesLabel: 'My Notes',
        notesPlaceholder: 'Add interview notes here...',
        remove: 'Remove',
        crateTitle: 'Search Results',
        crateSubtitle: 'Review and save expert profiles for your story.',
        clearCrate: 'Clear Results',
        rankBy: 'Sort by',
        sort: {
            relevance: 'Relevance',
            institution: 'Institution',
            name: 'Name',
        },
        saved: 'Saved',
        save: 'Save',
        parseErrorTitle: 'Could not parse results',
        parseErrorSubtitle: 'The AI returned data in an unexpected format. Here is the raw text:',
        crateEmpty: 'Your expert search results will appear here.',
        filters: {
            title: 'Advanced Filters',
            nameInstitutionExpertise: 'Filter by name, institution, or expertise',
            relevanceRange: 'Relevance Score',
            reset: 'Reset Filters',
        }
    },
    interviewSimulator: {
        title: 'Interview Practice Simulator',
        subtitle: 'Practice your interview skills in a safe, AI-powered environment.',
        readyToPractice: 'Ready to Practice?',
        practiceDescription: 'Sharpen your questioning skills by engaging in realistic interview scenarios with an AI expert.',
        startSimulationButton: 'Start Interview Practice',
    },
    coach: {
        trainingPathsTitle: 'Interview Training Paths',
        trainingPathsSubtitle: 'Select a guided training path to improve specific interview skills.',
        startPathButton: 'Start Path',
        exitTraining: 'Exit Training',
        practiceButton: 'Practice',
        easy: 'Cooperative',
        hard: 'Evasive',
        analyzing: 'Analyzing interview...',
        goalAnalysisTitle: 'Practice Analysis',
        analysisTitle: 'Interview Analysis',
        scores: {
            clarity: 'Clarity',
            probing: 'Probing',
            structure: 'Structure',
            confidence: 'Confidence',
        },
        strengths: 'What Went Well',
        improvements: 'Areas to Improve',
        pathSuggestionTitle: 'Recommended Training Path',
        startThisPath: 'Start This Path',
        nextPractice: 'Next Scenario',
        endPractice: 'End Practice',
        finishAndReview: 'Finish & Review',
        startNewChat: 'Start New Interview',
        endScenarioButton: 'Finish Scenario',
        analysisPlaceholder: 'Your interview analysis will appear here after you end the session.',
        messagePlaceholder: 'Type your question...',
        partnerSelectLabel: 'Interview an:',
        trainingMode: 'Training Mode',
        endSessionButton: 'End & Analyze',
        fullReset: 'Reset All Progress',
        explorePaths: 'Explore Training Paths',
        difficultyTitle: 'Select Interviewee Style',
        selectButton: 'Select',
        easyReward: 'Goal',
        hardReward: 'Goal'
    },
    caseStudiesPage: {
      title: 'Case Studies & Sample Reports',
      subtitle: 'Examples of AI-generated analysis from the Kavosh AI platform.',
      table: {
        header: {
          name: 'Report Title',
          description: 'A brief summary of the analysis generated by the AI.',
          type: 'Report Type',
          topics: 'Key Topics',
          date: 'Date Generated',
        },
        body: [
          { name: 'Analysis of Q3 Global Shipping Disruptions', description: 'Generated a deep dive on the causes, economic impact, and future outlook of recent global shipping bottlenecks.', type: 'Topic Deep Dive', topics: 'Logistics, Economics, Global Trade', date: '2024-07-15' },
          { name: 'Briefing: "Innovate Solar" Secures $50M Funding', description: 'Summarized a press release, identifying key investors, market impact for competitors, and suggested headlines.', type: 'News Briefing', topics: 'Venture Capital, Renewable Energy', date: '2024-07-12' },
          { name: 'The Viability of Small Modular Reactors (SMRs)', description: 'Explored the key angles, talking points, and counterarguments for adopting SMR technology for national power grids.', type: 'Topic Deep Dive', topics: 'Nuclear Energy, Technology, Policy', date: '2024-07-10' },
          { name: 'Central Bank Interest Rate Hike: Market Reaction', description: 'Generated an immediate briefing on a 0.5% interest rate hike, analyzing stakeholder reactions and predicting short-term market effects.', type: 'News Briefing', topics: 'Monetary Policy, Finance', date: '2024-07-08' },
        ],
      },
    },
    huggingFaceGuidePage: {
      title: 'Deploying to Hugging Face Spaces',
      subtitle: 'A complete guide to deploying this application to a Hugging Face Space using Docker.',
      introTitle: 'Introduction',
      introContent: 'Hugging Face Spaces is an excellent platform for hosting web applications. This guide will walk you through containerizing this React application with Docker and deploying it. We will use a minimal Node.js/Express server to handle a critical task: securely managing your Gemini API key.',
      securityTitle: 'Core Concept: Securely Handling the API Key',
      securityContent: 'You should never expose your API key directly in frontend code (like React). Doing so would allow anyone to find it and use it, potentially exhausting your quota or incurring costs. The correct approach, and the one we will use, is to have a simple backend server that reads the API key from a secure environment variable (a Hugging Face "Secret") and injects it into the HTML file just before it\'s sent to the user. This way, the key never exists in your public source code.',
      step1Title: 'Step 1: Create a new Hugging Face Space',
      step1Content: 'Go to the Hugging Face website, click on your profile, and select "New Space". Choose "Docker" as the Space SDK and pick a name for your space. Make sure to select a public or private visibility that suits your needs.',
      step2Title: 'Step 2: Create the Backend Server',
      step2aTitle: 'A) `package.json`',
      step2aContent: 'This file tells our server environment which dependencies to install. We only need `express` for our simple web server. Create a new file named `package.json` with the following content:',
      step2bTitle: 'B) `server.js`',
      step2bContent: 'This small Node.js server serves your static files (HTML, JS, etc.) and safely injects your Gemini API key from the Hugging Face secrets into the application. Create a file named `server.js`:',
      step3Title: 'Step 3: Create the Docker Configuration',
      step3aTitle: 'A) `Dockerfile`',
      step3aContent: 'The `Dockerfile` contains the instructions for Hugging Face to build and run your application. It sets up a Node.js environment, installs the dependencies, copies your app files, and starts the server. Create a file named `Dockerfile` with exactly this content:',
      step3bTitle: 'B) `.dockerignore` (Recommended)',
      step3bContent: 'To keep your Docker image small and build times fast, it\'s a best practice to exclude unnecessary files. Create a file named `.dockerignore` to prevent local development folders from being copied into the container:',
      step4Title: 'Step 4: Upload All Files',
      step4Content: 'Upload all the application files and the new configuration files (`package.json`, `server.js`, `Dockerfile`, `.dockerignore`) to your Hugging Face Space repository. You can do this via the website or using git. Your final repository structure should look like this:',
      step5Title: 'Step 5: Add Your API Key as a Secret',
      step5Content: 'This is the most important step for security. Go to your Space settings, find the "Repository secrets" section, and add a new secret. Name the secret `API_KEY` and paste your Gemini API key into the value field. The `server.js` file is configured to read this secret.',
      conclusionTitle: 'Conclusion',
      conclusionContent: 'That\'s it! Hugging Face will automatically build and deploy your application. You can view the logs in the "Build logs" section. Once the build is complete, your application will be live and running securely.',
      fileStructure: 'File Structure',
      advancedSectionTitle: 'Advanced Example: Multi-Service Python Deployment',
      advancedSectionDisclaimer: 'The following configuration is an example for a more complex, multi-service application (e.g., one with a Python backend and a separate frontend). It uses Nginx as a reverse proxy. This is NOT required for the current application but is provided for educational purposes.',
      advancedDockerfileTitle: 'Example Dockerfile for a Python/Nginx service',
      advancedStartupScriptTitle: 'Example `startup.sh` script',
      advancedNginxConfigTitle: 'Example `nginx.conf` for reverse proxy',
    },
    deploymentGuidePage: {
      title: 'Free Deployment Guides',
      subtitle: 'Step-by-step guides for deploying your AI application to various free hosting platforms.',
      disclaimer: 'This is a general guide for deploying AI web applications. While the principles apply to this app, some steps (especially those mentioning Python backends) are for different architectures and can be adapted as needed.',
      base44Title: '1. Base44.app Free Hosting',
      base44Intro: 'Base44.app allows free hosting for web-based applications and AI projects.',
      base44Steps: `Steps:
1. Sign up or log in to Base44.app.
2. Create a new project or import your existing AI Studio project (usually via GitHub or by uploading files).
3. Ensure your project has an \`index.html\` or \`app\` entry point, along with all required dependencies.
4. Configure environment variables if your AI project requires API keys.
5. Click "Deploy" and wait for your project to be hosted.
6. You will get a URL like https://yourproject.base44.app to access your AI app.`,
      base44Tip: 'Base44.app supports Python backend only in specific project types; otherwise, consider building a REST API with FastAPI/Flask.',
      netlifyTitle: '2. Deploy to Netlify',
      netlifyIntro: 'Netlify is ideal for static front-end hosting but can also integrate with serverless functions for AI endpoints.',
      netlifySteps: `Steps:
1. Push your AI Studio project to GitHub or GitLab.
2. Go to https://www.netlify.com/ and log in.
3. Click "New site from Git" and connect your repository.
4. Configure the build settings:
   - Build command (if your project uses a build tool): e.g., \`npm run build\` or \`python -m build\`
   - Publish directory for static files, e.g., \`dist/\` or \`build/\`
5. Deploy the site, Netlify will provide a live URL.
6. For AI backend, you can use Netlify Functions (serverless) with Node.js, connecting to AI APIs.`,
      netlifyTip: 'If your AI project is heavy on Python processing, hosting the backend separately on Heroku, Railway, or Base44.app and calling it via API from Netlify front-end is recommended.',
      zapierTitle: '3. Zapier Integration',
      zapierIntro: 'Zapier allows automation and connecting your AI project to other apps without code.',
      zapierSteps: `Steps:
1. Make sure your AI project exposes a REST API endpoint (Base44.app or another backend host).
2. Sign up at https://zapier.com/.
3. Create a "Zap" and choose a trigger app (e.g., Google Sheets, Slack, or Webhooks by Zapier).
4. Choose "Webhooks by Zapier" as an action to call your AI API:
   - Method: POST or GET depending on your API
   - Data: Pass input parameters to your AI model
5. Test the Zap to ensure the AI response is correctly received.
6. Activate the Zap to automate tasks triggered by your AI Studio project.`,
      bestPracticesTitle: 'Best Practices',
      bestPracticesContent: `- Use proper authentication (API keys or OAuth) for your AI endpoints.
- Keep your API routes RESTful for smoother integration with Netlify and Zapier.
- Monitor usage limits for free hosting plans; AI processing can be heavy.`,
      summaryTitle: 'Summary',
      summaryContent: `- **Front-end hosting:** Netlify for static UI or Base44.app for full project hosting.
- **Backend API:** Host Python AI endpoints on Base44.app or another service.
- **Automation:** Connect your endpoints to Zapier via Webhooks for trigger-based automation.`,
    },
    oppositionAI: {
      title: "OppositionAI",
      subtitle: "Unified Intelligence for Iran's Opposition Landscape",
      tabs: {
        news: "News Monitor",
        layers: "Opposition Layers",
        simulation: "Simulation Arena",
        war_room: "War Room",
        scenario_map: "Scenario Map",
        resources: "Resources"
      },
      intro: {
        title: "OPPOSITION AI",
        line1: "Unified Intelligence Dashboard",
        line2: "",
        start: "ENTER SYSTEM"
      },
      monitor: {
        title: "Iran News – Live",
        refresh: "Refresh Intelligence",
        loading: "Scraping sources...",
        source: "Source",
        impact: "Impact Score",
        sentiment: "Sentiment",
        regimeImpact: "Regime Impact",
        oppositionImpact: "Opposition Impact",
        darkTriad: "Dark Triad Score",
        simulate: "Simulate Dialogue",
        analyze: "Analyze Impact",
        project: "Project Scenarios"
      },
      layers: {
        title: "Opposition Layers – Realtime",
        unityScore: "Unity Score",
        activeFactions: "Active Factions",
        core: "Core Layer",
        mid: "Mid Layer",
        outer: "Outer Layer",
        updateTime: "Last Updated",
        context: "Context: GAMAAN Polls (68% Opposition), NCRI Rallies, Time Article",
        mapTitle: "Tactical Map",
        mapSelect: "Select Area",
        runScraper: "Run AI Scraper",
        scraping: "Scraping Region...",
        sourcesTitle: "Verified Signals"
      },
      simulation: {
        title: "Unity Simulation Arena",
        desc: "Simulate a conversation between two factions regarding a recent event. The AI will flag 'Dark Triad' (manipulative) rhetoric versus 'Light Triad' (empathic) dialogue.",
        selectFaction1: "Select Faction A",
        selectFaction2: "Select Faction B",
        topicLabel: "Topic / Event",
        topicPlaceholder: "e.g., The recent Brussels Rally",
        runSim: "Run Simulation",
        running: "Simulating...",
        darkTriadAlert: "Dark Triad Alert",
        lightTriad: "Light Triad",
        analysis: "Analysis",
        launchMedia: "📢 Launch Unified Media Campaign",
        generatingMedia: "Drafting Campaign...",
        autoDetect: "Auto-Detect Situation & Map",
      },
      mediaCampaign: {
        title: "Unified Media Campaign",
        instagram: "Instagram Post",
        telegram: "Telegram Channel Post",
        actionPlan: "Action Plan / Demands",
        copy: "Copy"
      },
      warRoom: {
        title: "Strategic War Room",
        desc: "Analyze the strategic impact of news events and simulations on the Revolution's core metrics.",
        stats: "Current Stats",
        unity: "Unity",
        momentum: "Momentum",
        resources: "Resources",
        stability: "Regime Stability",
        turnHistory: "Turn History",
        processing: "Processing Turn...",
      },
      scenarioMap: {
        title: "Scenario Projection Map",
        desc: "Visualize potential futures based on current intelligence and game state.",
        generate: "Project Futures",
        projecting: "Calculating probabilities...",
        probability: "Probability",
        impact: "Impact",
        trigger: "Trigger Event",
        outcome: "Outcome",
        break: "⚡ Break Scenario",
        accelerate: "🚀 Accelerate",
        relevantFactions: "Required Actors"
      },
      resources: {
        text: "Love and hope are seeds that sprout even in the heart of stone.\nLet us build a green tomorrow for our Iran with kindness."
      },
      factions: [
        "Constitutional Monarchist",
        "Secular Republican",
        "Feminist Collective",
        "Kurdish Union",
        "Leftist Alliance",
        "Ex-MEK",
        "Ex-Reformist",
        "Non-Aligned",
        "Silent Observer"
      ],
      console: {
        title: "AI Scraper Console",
        runScraper: "Run Scraper",
        deepScan: "Deep Scan",
        verify: "Verify Integrity",
        export: "Export Report",
        clear: "Clear Log"
      }
    },
    // --- Rescue Storyteller (For Media Campaign Modal) ---
    rescueStoryteller: {
      title: 'Rescue Storyteller',
      subtitle: 'Generate compassionate and urgent social media campaigns for animal rescue cases.',
      validationError: 'Please fill in all fields to generate a story.',
      form: {
          nameLabel: 'Animal Name',
          namePlaceholder: 'e.g., Bella',
          conditionLabel: 'Condition / Story',
          conditionPlaceholder: 'e.g., Found with a broken leg on the highway...',
          needsLabel: 'Needs',
          needsPlaceholder: 'e.g., Surgery costs, foster home, specialized food...',
          toneLabel: 'Tone',
          toneUrgent: 'Urgent & Critical',
          toneHopeful: 'Hopeful & Inspiring',
          button: 'Generate Campaign'
      },
      results: {
          instagram: 'Instagram Post',
          telegram: 'Telegram Channel',
          wishlist: 'Wishlist & Needs'
      }
    }
  },
  fa: {
    header: {
      home: 'داشبورد',
      topic_deep_dive: 'تحلیل عمیق موضوع',
      news_briefing: 'خلاصه اخبار',
      saved_reports: 'گزارش‌های من',
      case_studies: 'مطالعات موردی',
      subscriptions: 'اشتراک‌ها',
      hugging_face_guide: 'راهنمای Hugging Face',
      deployment_guide: 'راهنمای استقرار',
      opposition_ai: 'هوش اپوزیسیون',
      youtube_analyzer: 'آنالیزگر رسانه',
    },
    hero: {
      title: '<span class="text-teal-400">تحلیل‌های خبری</span> هوشمند با هوش مصنوعی',
      subtitle: 'کاوش AI به سردبیران و روزنامه‌نگاران کمک می‌کند تا به سرعت موضوعات پیچیده را تحلیل کرده، ایده‌های مقاله تولید کنند و خلاصه‌های خبری داده-محور برای بخش‌های اقتصاد و انرژی تهیه نمایند.',
      button1: 'شروع تحلیل عمیق موضوع',
      button2: 'ایجاد خلاصه خبر',
      featuresTitle: 'ابزارهای اصلی ما را کاوش کنید',
      feature1Title: 'تحلیل عمیق موضوع',
      feature1Description: 'موضوعات پیچیده را با تحلیل عمیق هوش مصنوعی، از زوایای کلیدی تا استدلال‌های متقابل، باز کنید.',
      feature2Title: 'خلاصه خبر',
      feature2Description: 'خلاصه‌ها، نکات کلیدی و تیترها را از مقالات خبری یا رویدادها فوراً ایجاد کنید.',
      feature3Title: 'گزارش‌های من',
      feature3Description: 'تمام تحلیل‌های عمیق و خلاصه‌های تولید شده خود را در یک مکان ذخیره، بازبینی و مدیریت کنید.',
      feature4Title: 'مطالعات موردی',
      feature4Description: 'نمونه‌هایی از نحوه استفاده از کاوش AI برای تحلیل اخبار و رویدادهای دنیای واقعی را ببینید.',
    },
    topicDeepDive: {
      title: 'تحلیل عمیق موضوع با هوش مصنوعی',
      descriptionLabel: 'یک موضوع، رویداد یا سوال برای تحلیل وارد کنید.',
      descriptionPlaceholder: 'مثال: «تأثیر کاهش تولید جدید اوپک پلاس بر بازار جهانی نفت.» یا «روندهای سرمایه‌گذاری در انرژی‌های تجدیدپذیر در خاورمیانه چیست؟»',
      voiceInputStart: 'شروع ورودی صوتی',
      voiceInputStop: 'توقف ورودی صوتی',
      buttonText: 'تحلیل موضوع',
      sampleTitle: 'یا یک مثال را امتحان کنید:',
      sampleTexts: [
        { label: 'سیاست انرژی', value: 'تحلیل مزایا و معایب تصمیم آلمان برای حذف تدریجی انرژی هسته‌ای.' },
        { label: 'رویداد اقتصادی', value: 'تأثیر اقتصادی مورد انتظار انسداد کانال سوئز چیست؟' },
        { label: 'روند فناوری', value: 'آینده فناوری هیدروژن سبز و امکان‌سنجی آن برای استفاده انبوه.' }
      ],
      validationError: 'لطفاً برای تحلیل، یک موضوع ارائه دهید.',
      analysisTitle: 'تحلیل موضوع تولید شده با هوش مصنوعی',
      generating: 'در حال تولید تحلیل...',
      placeholder: 'تحلیل عمیق شما در اینجا نمایش داده خواهد شد. برای شروع، یک موضوع را توصیف کنید.',
      // Result display
      keyAnglesTitle: 'زوایای کلیدی برای بررسی',
      talkingPointsTitle: 'نکات اصلی بحث',
      counterArgumentsTitle: 'استدلال‌های متقابل احتمالی',
      disclaimerTitle: 'سلب مسئولیت',
      saveAnalysis: 'ذخیره گزارش',
      // Data Viz
      dataVizTitle: 'پیشنهادات تصویرسازی داده',
      dataVizSubtitle: 'روش‌های مؤثر برای نمایش داده‌ها در مقاله شما.',
      generateDataViz: 'پیشنهاد تصویرسازی',
      generatingDataViz: 'در حال آماده‌سازی...',
      primaryViz: 'پیشنهاد اصلی',
      secondaryViz: 'پیشنهاد فرعی',
      // Expert Profiles
      expertProfilesTitle: 'پروفایل کارشناسان برای مصاحبه',
      expertProfilesSubtitle: 'آرکتایپ‌های کارشناس تولید شده توسط هوش مصنوعی برای عمق بخشیدن به گزارش شما.',
      generateExpertProfiles: 'پیشنهاد پروفایل کارشناسان',
      generatingExpertProfiles: 'در حال تولید پروفایل‌ها...',
      forAngleTitle: 'کارشناس موافق',
      againstAngleTitle: 'کارشناس مخالف',
      expertise: 'حوزه تخصص',
      theDynamic: 'نقش در روایت',
      reasoning: 'چرا این دیدگاه مهم است',
      // Publication Outlets
      publicationOutletTitle: 'پیشنهاد فرمت انتشار',
      publicationOutletSubtitle: 'بررسی بهترین قالب‌ها برای این داستان.',
      generatePublicationOutlet: 'پیشنهاد فرمت',
      generatingPublicationOutlet: 'در حال تحلیل...',
      primaryOutletTitle: 'فرمت اصلی',
      secondaryOutletTitle: 'فرمت فرعی',
      viewIntimacyDetails: 'مشاهده جزئیات استراتژی', // Repurposed
      generatingIntimacyDetails: 'در حال تولید استراتژی...', // Repurposed
      intimacyDetailsModalTitle: 'جزئیات استراتژی انتشار', // Repurposed
      introduction: 'مقدمه',
      techniques: 'تاکتیک‌ها و رویکردها', // Repurposed
      psychologicalBenefits: 'مزایای استراتژیک', // Repurposed
      focus: 'تمرکز',
      // Thematic Image
      thematicImageTitle: 'ایده تصویر موضوعی',
      thematicImageSubtitle: 'یک نمایش هنری از موضوع، تولید شده توسط هوش مصنوعی.',
      generateThematicImage: 'تولید تصویر',
      generatingThematicImage: 'در حال خلق اثر هنری...',
      downloadImage: 'دانلود تصویر',
      // Trends
      findTrendsTitle: 'روندهای کنونی و تحولات اخیر',
      findTrendsSubtitle: 'تحلیل خود را با آخرین اطلاعات از وب به‌روز کنید.',
      findTrendsButton: 'یافتن روندهای روز',
      findingTrends: 'در حال جستجوی روندها...',
      trendsSummaryTitle: 'خلاصه روندهای تولید شده با هوش مصنوعی',
      trendsSourcesTitle: 'منابع',
      // YouTube Videos
      findVideosTitle: "محتوای ویدیویی مرتبط",
      findVideosSubtitle: "ویدیوهای یوتیوب مرتبط را برای غنی‌سازی داستان خود کشف کنید.",
      findVideosButton: "یافتن ویدیوهای مرتبط",
      findingVideos: "در حال جستجوی ویدیوها...",
      videoFilters: {
        quality: "کیفیت",
        anyQuality: "همه",
        hd: "HD",
        fourK: "4K",
        uploadDate: "تاریخ بارگذاری",
        anyTime: "هر زمان",
        lastMonth: "ماه گذشته",
        thisYear: "امسال",
        duration: "مدت زمان",
        anyDuration: "همه",
        short: "کوتاه (زیر ۴ دقیقه)",
        long: "بلند (بیش از ۲۰ دقیقه)",
      },
    },
    newsBriefing: {
      title: 'مولد خلاصه اخبار با هوش مصنوعی',
      descriptionLabel: 'متن مقاله را جای‌گذاری کنید یا رویداد خبری را توصیف کنید.',
      descriptionPlaceholder: 'مثال: متن کامل یک بیانیه مطبوعاتی را اینجا جای‌گذاری کنید، یا رویدادی مانند «بانک مرکزی نرخ بهره را ۲۵ صدم درصد افزایش داد» را توصیف کنید.',
      validationError: 'لطفاً توضیحی ارائه دهید.',
      analysisTitle: 'خلاصه خبر تولید شده با هوش مصنوعی',
      generating: 'در حال تولید خلاصه...',
      placeholder1: 'خلاصه خبر شما در اینجا نمایش داده خواهد شد.',
      placeholder2: 'برای شروع، یک رویداد خبری را توصیف کنید.',
      detailsTitle: 'زمینه بیشتر (اختیاری)',
      sourceURL: 'URL منبع',
      keyFigures: 'افراد/شرکت‌های کلیدی درگیر',
      specificQuestions: 'سوالات مشخص برای پاسخ',
      audience: 'مخاطب هدف',
      audiencePlaceholder: 'مثال: عموم مردم، سرمایه‌گذاران، سیاست‌گذاران',
      tone: 'لحن مورد نظر',
      tonePlaceholder: 'مثال: بی‌طرف، تحلیلی، فوری',
      specialistsTitle: 'تیترهای پیشنهادی',
      conditionsTitle: 'نکات کلیدی و بینش‌ها',
      hideDetails: 'پنهان کردن جزئیات',
      viewDetails: 'مشاهده جزئیات',
      academicAnalysisButton: 'مشاهده زمینه عمیق‌تر',
      loadingDetails: 'در حال بارگذاری جزئیات...',
      loadingAcademicAnalysis: 'در حال بارگذاری زمینه...',
      copySuccess: 'کپی شد!',
      findSpecialistsButton: 'یافتن کارشناسان مرتبط',
      requestResearchButton: 'درخواست تحلیل عمیق‌تر',
      lowConfidenceFallback: 'هوش مصنوعی از این نتایج اطمینان کمی دارد. برای تحلیل دقیق‌تر، متن یا زمینه بیشتری ارائه دهید.',
      careerSectionTitle: 'ذینفعان و تأثیر بازار',
      currentJobAnalysisTitle: 'تحلیل ذینفعان',
      jobSuggestionsTitle: 'تحلیل تأثیر بر بازار',
      followUpTitle: 'سوالات تکمیلی برای سردبیر',
      prepareSummaryButton: 'آماده‌سازی خلاصه اجرایی',
      generatingSummary: 'در حال تولید خلاصه...',
      buttonText: 'تولید خلاصه',
      relevance: 'اطمینان'
    },
    savedReportsPage: {
      title: 'گزارش‌های ذخیره شده من',
      subtitle: 'در اینجا خلاصه‌ها و تحلیل‌های عمیقی که ذخیره کرده‌اید قرار دارند. می‌توانید یکی را برای بازبینی مشاهده یا آن را حذف کنید.',
      restore: 'مشاهده',
      delete: 'حذف',
      deleteConfirm: 'آیا از حذف دائمی این گزارش مطمئن هستید؟',
      savedOn: 'ذخیره شده در',
      emptyTitle: 'هنوز گزارشی ذخیره نشده است',
      emptyText: 'وقتی گزارشی را تولید کردید، از دکمه «ذخیره گزارش» برای نگهداری آن در اینجا استفاده کنید.',
      goBackButton: 'تحلیل یک موضوع جدید',
      analysisTypeFlavor: 'تحلیل عمیق موضوع',
      analysisTypeCompatibility: 'خلاصه خبر',
      untitledBriefing: 'خلاصه خبر بدون عنوان',
    },
    servicesPage: {
      title: 'پلن‌های اشتراک',
      subtitle: 'اتاق خبر خود را با ابزارهای تحلیل قدرتمند هوش مصنوعی ما توانمند سازید.',
      tier1: {
        title: 'پایه',
        price: 'رایگان',
        description: 'برای شروع کار با روزنامه‌نگاری به کمک هوش مصنوعی، به ابزارهای تحلیل اصلی ما دسترسی پیدا کنید.',
        features: ['تحلیل عمیق موضوع', 'مولد خلاصه اخبار', 'ذخیره و بازبینی ۱۰ گزارش'],
        cta: 'شروع کنید',
      },
      tier2: {
        title: 'حرفه‌ای',
        price: '۹۹ دلار',
        unit: '/ ماه',
        description: 'برای روزنامه‌نگاران مستقل و تیم‌های کوچک که به قدرت و ویژگی‌های بیشتری نیاز دارند.',
        features: ['شامل تمام امکانات پلن پایه', 'گزارش‌های ذخیره نامحدود', 'دسترسی اولویت‌دار به ویژگی‌های جدید', 'تحلیل مبتنی بر URL'],
        cta: 'ارتقا به حرفه‌ای',
      },
      tier3: {
        title: 'سازمانی',
        price: 'سفارشی',
        unit: '/ برای اتاق خبر',
        description: 'یک راه‌حل کامل برای سازمان‌های خبری، با دسترسی API و آموزش مدل سفارشی.',
        features: ['شامل تمام امکانات پلن حرفه‌ای', 'دسترسی کامل API', 'مدل‌های آموزش‌دیده سفارشی', 'ویژگی‌های همکاری تیمی', 'پشتیبانی اختصاصی'],
        cta: 'تماس با فروش',
      },
    },
    footer: {
      description: 'کاوش AI دستیار هوشمند شما برای تحلیل سریع و عمیق موضوعات خبری پیچیده است.',
      copyright: '© ۲۰۲۴ کاوش AI. تمام حقوق محفوظ است.',
    },
     quotaErrorModal: {
      title: 'محدودیت API تمام شد',
      body: 'شما از سقف استفاده روزانه خود از Gemini API فراتر رفته‌اید. لطفاً تنظیمات صورتحساب خود را بررسی کنید یا فردا دوباره امتحان کنید.',
      cta: 'بررسی صورتحساب',
      close: 'بستن',
    },
    auth: {
      login: 'ورود',
      signup: 'ثبت نام',
      logout: 'خروج',
      loginTitle: 'ورود به کاوش AI',
      signupTitle: 'ثبت نام در کاوش AI',
      continueWith: 'ادامه با {provider}',
    },
    executiveSummaryPreview: {
      title: 'پیش‌نمایش خلاصه اجرایی',
      style: 'سبک',
      memo: 'یادداشت داخلی',
      pressRelease: 'بیانیه مطبوعاتی',
      copySummary: 'کپی خلاصه',
      subjectPlaceholder: 'موضوع',
      toPlaceholder: 'به: تمام سردبیران',
    },
    researchRequestModal: {
        title: 'درخواست تحلیل عمیق‌تر ثبت شد',
        body: 'متشکریم! درخواست شما برای تحلیل عمیق‌تر در مورد "{topic}" ثبت شد. ما تحلیل موضوعات با تقاضای بالا را در اولویت قرار خواهیم داد.',
        close: 'بستن',
    },
    expertFinder: {
        title: 'یافتن کارشناس',
        subtitle: 'بر اساس تحلیل شما، هوش مصنوعی پروفایل‌های کارشناسان ساختگی را جستجو می‌کند.',
        validationError: 'لطفاً ابتدا یک خلاصه خبر ایجاد کنید.',
        maxResults: 'حداکثر نتایج',
        finding: 'در حال یافتن کارشناسان...',
        findButton: 'یافتن کارشناسان',
        savedTitle: 'مخاطبین ذخیره شده',
        clearAll: 'پاک کردن همه',
        expertise: 'حوزه تخصص',
        contact: 'اطلاعات تماس',
        relevance: 'ارتباط',
        notesLabel: 'یادداشت‌های من',
        notesPlaceholder: 'یادداشت‌های مصاحبه را اینجا اضافه کنید...',
        remove: 'حذف',
        crateTitle: 'نتایج جستجو',
        crateSubtitle: 'پروفایل‌های کارشناسان را برای داستان خود بررسی و ذخیره کنید.',
        clearCrate: 'پاک کردن نتایج',
        rankBy: 'مرتب‌سازی بر اساس',
        sort: {
            relevance: 'ارتباط',
            institution: 'موسسه',
            name: 'نام',
        },
        saved: 'ذخیره شد',
        save: 'ذخیره',
        parseErrorTitle: 'نتایج قابل پردازش نبود',
        parseErrorSubtitle: 'هوش مصنوعی داده‌ها را در قالبی غیرمنتظره برگرداند. متن خام در زیر آمده است:',
        crateEmpty: 'نتایج جستجوی کارشناس شما در اینجا نمایش داده خواهد شد.',
        filters: {
            title: 'فیلترهای پیشرفته',
            nameInstitutionExpertise: 'فیلتر بر اساس نام، موسسه یا تخصص',
            relevanceRange: 'امتیاز ارتباط',
            reset: 'بازنشانی فیلترها',
        }
    },
    interviewSimulator: {
        title: 'شبیه‌ساز تمرین مصاحبه',
        subtitle: 'مهارت‌های مصاحبه خود را در یک محیط امن با هوش مصنوعی تمرین کنید.',
        readyToPractice: 'آماده تمرین هستید؟',
        practiceDescription: 'با شرکت در سناریوهای واقعی مصاحبه با یک کارشناس هوش مصنوعی، مهارت‌های پرسشگری خود را تقویت کنید.',
        startSimulationButton: 'شروع تمرین مصاحبه',
    },
    coach: {
        trainingPathsTitle: 'مسیرهای آموزشی مصاحبه',
        trainingPathsSubtitle: 'برای بهبود مهارت‌های خاص مصاحبه، یک مسیر آموزشی هدایت‌شده انتخاب کنید.',
        startPathButton: 'شروع مسیر',
        exitTraining: 'خروج از آموزش',
        practiceButton: 'تمرین',
        easy: 'همکار',
        hard: 'گریزان',
        analyzing: 'در حال تحلیل مصاحبه...',
        goalAnalysisTitle: 'تحلیل تمرین',
        analysisTitle: 'تحلیل مصاحبه',
        scores: {
            clarity: 'وضوح',
            probing: 'کاوشگری',
            structure: 'ساختار',
            confidence: 'اعتماد به نفس',
        },
        strengths: 'نقاط قوت',
        improvements: 'زمینه‌های بهبود',
        pathSuggestionTitle: 'مسیر آموزشی پیشنهادی',
        startThisPath: 'شروع این مسیر',
        nextPractice: 'سناریوی بعدی',
        endPractice: 'پایان تمرین',
        finishAndReview: 'پایان و بازبینی',
        startNewChat: 'شروع مصاحبه جدید',
        endScenarioButton: 'پایان سناریو',
        analysisPlaceholder: 'تحلیل مصاحبه شما پس از پایان جلسه در اینجا نمایش داده می‌شود.',
        messagePlaceholder: 'سوال خود را تایپ کنید...',
        partnerSelectLabel: 'مصاحبه با:',
        trainingMode: 'حالت تمرین',
        endSessionButton: 'پایان و تحلیل',
        fullReset: 'ریست کامل',
        explorePaths: 'کاوش مسیرهای آموزشی',
        difficultyTitle: 'انتخاب سبک مصاحبه‌شونده',
        selectButton: 'انتخاب',
        easyReward: 'هدف',
        hardReward: 'هدف',
    },
    caseStudiesPage: {
      title: 'مطالعات موردی و گزارش‌های نمونه',
      subtitle: 'نمونه‌هایی از تحلیل‌های تولید شده توسط هوش مصنوعی در پلتفرم کاوش AI.',
      table: {
        header: {
          name: 'عنوان گزارش',
          description: 'خلاصه‌ای کوتاه از تحلیل تولید شده توسط هوش مصنوعی.',
          type: 'نوع گزارش',
          topics: 'موضوعات کلیدی',
          date: 'تاریخ تولید',
        },
        body: [
          { name: 'تحلیل اختلالات حمل‌ونقل جهانی در سه‌ماهه سوم', description: 'ایجاد یک تحلیل عمیق از علل، تأثیرات اقتصادی و چشم‌انداز آینده تنگناهای اخیر حمل‌ونقل جهانی.', type: 'تحلیل عمیق موضوع', topics: 'لجستیک، اقتصاد، تجارت جهانی', date: '۲۰۲۴-۰۷-۱۵' },
          { name: 'خلاصه خبر: جذب سرمایه ۵۰ میلیون دلاری "Innovate Solar"', description: 'خلاصه‌سازی یک بیانیه مطبوعاتی، شناسایی سرمایه‌گذاران کلیدی، تأثیر بازار بر رقبا و پیشنهاد تیتر.', type: 'خلاصه خبر', topics: 'سرمایه‌گذاری خطرپذیر، انرژی تجدیدپذیر', date: '۲۰۲۴-۰۷-۱۲' },
          { name: 'امکان‌سنجی راکتورهای هسته‌ای کوچک ماژولار (SMRs)', description: 'بررسی زوایای کلیدی، نکات بحث و استدلال‌های متقابل برای پذیرش فناوری SMR برای شبکه‌های برق ملی.', type: 'تحلیل عمیق موضوع', topics: 'انرژی هسته‌ای، فناوری، سیاست‌گذاری', date: '۲۰۲۴-۰۷-۱۰' },
          { name: 'افزایش نرخ بهره بانک مرکزی: واکنش بازار', description: 'تولید یک خلاصه فوری در مورد افزایش ۰.۵٪ نرخ بهره، تحلیل واکنش ذینفعان و پیش‌بینی اثرات کوتاه‌مدت بازار.', type: 'خلاصه خبر', topics: 'سیاست پولی، امور مالی', date: '۲۰۲۴-۰۷-۰۸' },
        ],
      },
    },
    huggingFaceGuidePage: {
      title: 'استقرار در Hugging Face Spaces',
      subtitle: 'راهنمای کامل برای استقرار این اپلیکیشن در یک Hugging Face Space با استفاده از Docker.',
      introTitle: 'مقدمه',
      introContent: 'Hugging Face Spaces یک پلتفرم عالی برای میزبانی اپلیکیشن‌های وب است. این راهنما شما را در فرآیند کانتینرسازی این اپلیکیشن React با Docker و استقرار آن راهنمایی می‌کند. ما از یک سرور حداقلی Node.js/Express برای انجام یک وظیفه حیاتی استفاده خواهیم کرد: مدیریت امن کلید API Gemini شما.',
      securityTitle: 'مفهوم اصلی: مدیریت امن کلید API',
      securityContent: 'شما هرگز نباید کلید API خود را مستقیماً در کد فرانت‌اند (مانند React) قرار دهید. این کار به هر کسی اجازه می‌دهد آن را پیدا کرده و استفاده کند، که می‌تواند منجر به تمام شدن سهمیه شما یا ایجاد هزینه شود. رویکرد صحیح، و روشی که ما استفاده خواهیم کرد، داشتن یک سرور بک‌اند ساده است که کلید API را از یک متغیر محیطی امن (یک "Secret" در Hugging Face) می‌خواند و آن را درست قبل از ارسال فایل HTML به کاربر، به آن تزریق می‌کند. به این ترتیب، کلید هرگز در کد منبع عمومی شما وجود نخواهد داشت.',
      step1Title: 'مرحله ۱: یک Space جدید در Hugging Face ایجاد کنید',
      step1Content: 'به وب‌سایت Hugging Face بروید، روی پروفایل خود کلیک کرده و "New Space" را انتخاب کنید. "Docker" را به عنوان Space SDK انتخاب کرده و یک نام برای فضای خود برگزینید. اطمینان حاصل کنید که سطح دسترسی عمومی یا خصوصی را متناسب با نیاز خود انتخاب می‌کنید.',
      step2Title: 'مرحله ۲: سرور بک‌اند را ایجاد کنید',
      step2aTitle: 'الف) `package.json`',
      step2aContent: 'این فایل به محیط سرور ما می‌گوید که چه وابستگی‌هایی را نصب کند. ما فقط به `express` برای وب سرور ساده خود نیاز داریم. یک فایل جدید به نام `package.json` با محتوای زیر ایجاد کنید:',
      step2bTitle: 'ب) `server.js`',
      step2bContent: 'این سرور کوچک Node.js فایل‌های استاتیک شما (HTML، JS و غیره) را ارائه می‌دهد و کلید API Gemini شما را به طور امن از بخش secrets هاگینگ فیس به اپلیکیشن تزریق می‌کند. یک فایل به نام `server.js` ایجاد کنید:',
      step3Title: 'مرحله ۳: پیکربندی Docker را ایجاد کنید',
      step3aTitle: 'الف) `Dockerfile`',
      step3aContent: '`Dockerfile` شامل دستورالعمل‌هایی برای Hugging Face برای ساخت و اجرای اپلیکیشن شما است. این فایل یک محیط Node.js راه‌اندازی می‌کند، وابستگی‌ها را نصب می‌کند، فایل‌های برنامه شما را کپی می‌کند و سرور را اجرا می‌کند. یک فایل به نام `Dockerfile` با دقیقاً این محتوا ایجاد کنید:',
      step3bTitle: 'ب) `.dockerignore` (توصیه شده)',
      step3bContent: 'برای کوچک نگه داشتن ایمیج Docker و افزایش سرعت ساخت، بهتر است فایل‌های غیر ضروری را حذف کنید. یک فایل به نام `.dockerignore` ایجاد کنید تا از کپی شدن پوشه‌های توسعه محلی به داخل کانتینر جلوگیری شود:',
      step4Title: 'مرحله ۴: تمام فایل‌ها را آپلود کنید',
      step4Content: 'تمام فایل‌های اپلیکیشن و فایل‌های پیکربندی جدید (`package.json`, `server.js`, `Dockerfile`, `.dockerignore`) را در مخزن Hugging Face Space خود آپلود کنید. می‌توانید این کار را از طریق وب‌سایت یا با استفاده از git انجام دهید. ساختار نهایی مخزن شما باید به این شکل باشد:',
      step5Title: 'مرحله ۵: کلید API خود را به عنوان Secret اضافه کنید',
      step5Content: 'این مهم‌ترین مرحله برای امنیت است. به تنظیمات Space خود بروید، بخش "Repository secrets" را پیدا کنید و یک secret جدید اضافه کنید. نام secret را `API_KEY` بگذارید و کلید API Gemini خود را در قسمت مقدار جای‌گذاری کنید. فایل `server.js` برای خواندن این secret پیکربندی شده است.',
      conclusionTitle: 'نتیجه‌گیری',
      conclusionContent: 'تمام شد! Hugging Face به طور خودکار اپلیکیشن شما را ساخته و مستقر خواهد کرد. می‌توانید لاگ‌ها را در بخش "Build logs" مشاهده کنید. پس از اتمام ساخت، اپلیکیشن شما به صورت زنده و امن در حال اجرا خواهد بود.',
      fileStructure: 'ساختار فایل',
      advancedSectionTitle: 'مثال پیشرفته: استقرار چند سرویسی پایتون',
      advancedSectionDisclaimer: 'پیکربندی زیر یک مثال برای یک اپلیکیشن پیچیده‌تر و چند سرویسی است (مثلاً یکی با بک‌اند پایتون و یک فرانت‌اند جداگانه). این مثال از Nginx به عنوان پروکسی معکوس استفاده می‌کند. این برای اپلیکیشن فعلی لازم نیست اما برای اهداف آموزشی ارائه شده است.',
      advancedDockerfileTitle: 'نمونه Dockerfile برای سرویس پایتون/Nginx',
      advancedStartupScriptTitle: 'نمونه اسکریپت `startup.sh`',
      advancedNginxConfigTitle: 'نمونه `nginx.conf` برای پروکسی معکوس',
    },
    deploymentGuidePage: {
      title: 'راهنماهای استقرار رایگان',
      subtitle: 'راهنماهای گام به گام برای استقرار اپلیکیشن هوش مصنوعی شما در پلتفرم‌های میزبانی رایگان مختلف.',
      disclaimer: 'این یک راهنمای کلی برای استقرار اپلیکیشن‌های وب هوش مصنوعی است. در حالی که اصول آن برای این برنامه کاربرد دارد، برخی از مراحل (به ویژه آنهایی که به بک‌اند پایتون اشاره دارند) برای معماری‌های متفاوتی هستند و می‌توانند در صورت نیاز تطبیق داده شوند.',
      base44Title: '۱. میزبانی رایگان با Base44.app',
      base44Intro: 'Base44.app امکان میزبانی رایگان برای اپلیکیشن‌های مبتنی بر وب و پروژه‌های هوش مصنوعی را فراهم می‌کند.',
      base44Steps: `مراحل:
۱. در Base44.app ثبت‌نام کنید یا وارد شوید.
۲. یک پروژه جدید ایجاد کنید یا پروژه AI Studio موجود خود را وارد کنید (معمولاً از طریق گیت‌هاب یا با آپلود فایل‌ها).
۳. اطمینان حاصل کنید که پروژه شما دارای یک نقطه ورود \`index.html\` یا \`app\` به همراه تمام وابستگی‌های مورد نیاز است.
۴. اگر پروژه هوش مصنوعی شما به کلیدهای API نیاز دارد، متغیرهای محیطی را پیکربندی کنید.
۵. روی "Deploy" کلیک کنید و منتظر بمانید تا پروژه شما میزبانی شود.
۶. شما یک URL مانند https://yourproject.base44.app برای دسترسی به برنامه هوش مصنوعی خود دریافت خواهید کرد.`,
      base44Tip: 'Base44.app تنها در انواع خاصی از پروژه‌ها از بک‌اند پایتون پشتیبانی می‌کند؛ در غیر این صورت، ساخت یک REST API با FastAPI/Flask را در نظر بگیرید.',
      netlifyTitle: '۲. استقرار در Netlify',
      netlifyIntro: 'Netlify برای میزبانی فرانت‌اند استاتیک ایده‌آل است اما می‌تواند با توابع بدون سرور برای نقاط پایانی هوش مصنوعی نیز یکپارچه شود.',
      netlifySteps: `مراحل:
۱. پروژه AI Studio خود را در گیت‌هاب یا گیت‌لب پوش کنید.
۲. به https://www.netlify.com/ بروید و وارد شوید.
۳. روی "New site from Git" کلیک کرده و مخزن خود را متصل کنید.
۴. تنظیمات ساخت را پیکربندی کنید:
   - دستور ساخت (اگر پروژه شما از ابزار ساخت استفاده می‌کند): مثلاً \`npm run build\` یا \`python -m build\`
   - دایرکتوری انتشار برای فایل‌های استاتیک، مثلاً \`dist/\` یا \`build/\`
۵. سایت را مستقر کنید، Netlify یک URL زنده ارائه خواهد داد.
۶. برای بک‌اند هوش مصنوعی، می‌توانید از Netlify Functions (بدون سرور) با Node.js استفاده کرده و به APIهای هوش مصنوعی متصل شوید.`,
      netlifyTip: 'اگر پروژه هوش مصنوعی شما پردازش سنگین پایتون دارد، توصیه می‌شود بک‌اند را به طور جداگانه در Heroku، Railway یا Base44.app میزبانی کرده و از فرانت‌اند Netlify از طریق API آن را فراخوانی کنید.',
      zapierTitle: '۳. یکپارچه‌سازی با Zapier',
      zapierIntro: 'Zapier امکان اتوماسیون و اتصال پروژه هوش مصنوعی شما به سایر برنامه‌ها را بدون کد فراهم می‌کند.',
      zapierSteps: `مراحل:
۱. اطمینان حاصل کنید که پروژه هوش مصنوعی شما یک نقطه پایانی REST API را در اختیار قرار می‌دهد (در Base44.app یا یک میزبان بک‌اند دیگر).
۲. در https://zapier.com/ ثبت‌نام کنید.
۳. یک "Zap" ایجاد کنید و یک برنامه محرک انتخاب کنید (مثلاً Google Sheets، Slack یا Webhooks by Zapier).
۴. "Webhooks by Zapier" را به عنوان یک عمل برای فراخوانی API هوش مصنوعی خود انتخاب کنید:
   - متد: POST یا GET بسته به API شما
   - داده: پارامترهای ورودی را به مدل هوش مصنوعی خود ارسال کنید
۵. Zap را تست کنید تا اطمینان حاصل شود که پاسخ هوش مصنوعی به درستی دریافت می‌شود.
۶. Zap را فعال کنید تا وظایف را بر اساس محرک‌های پروژه AI Studio شما خودکارسازی کند.`,
      bestPracticesTitle: 'بهترین شیوه‌ها',
      bestPracticesContent: `- از احراز هویت مناسب (کلیدهای API یا OAuth) برای نقاط پایانی هوش مصنوعی خود استفاده کنید.
- مسیرهای API خود را به صورت RESTful نگه دارید تا یکپارچه‌سازی با Netlify و Zapier روان‌تر باشد.
- محدودیت‌های استفاده از پلن‌های میزبانی رایگان را کنترل کنید؛ پردازش هوش مصنوعی می‌تواند سنگین باشد.`,
      summaryTitle: 'خلاصه',
      summaryContent: `- **میزبانی فرانت‌اند:** Netlify برای رابط کاربری استاتیک یا Base44.app برای میزبانی کامل پروژه.
- **API بک‌اند:** نقاط پایانی هوش مصنوعی پایتون را در Base44.app یا سرویس دیگری میزبانی کنید.
- **اتوماسیون:** نقاط پایانی خود را از طریق Webhooks به Zapier برای اتوماسیون مبتنی بر محرک متصل کنید.`,
    },
    oppositionAI: {
      title: "هوش اپوزیسیون",
      subtitle: "اطلاعات یکپارچه برای چشم‌انداز اپوزیسیون ایران",
      tabs: {
        news: "رصد اخبار",
        layers: "لایه‌های اپوزیسیون",
        simulation: "میدان شبیه‌سازی",
        war_room: "اتاق جنگ استراتژیک",
        scenario_map: "نقشه پیش‌بینی سناریوها",
        resources: "منابع"
      },
      intro: {
        title: "هوش اپوزیسیون",
        line1: "داشبورد اطلاعاتی یکپارچه",
        line2: "",
        start: "ورود به سیستم"
      },
      monitor: {
        title: "اخبار ایران – همین لحظه",
        refresh: "به‌روزرسانی اطلاعات",
        loading: "در حال جمع‌آوری منابع...",
        source: "منبع",
        impact: "امتیاز تأثیر",
        sentiment: "احساس",
        regimeImpact: "تأثیر بر رژیم",
        oppositionImpact: "تأثیر بر اپوزیسیون",
        darkTriad: "امتیاز سه گانه تاریک",
        simulate: "این خبر رو ببر تو میدان شبیه‌سازی",
        analyze: "تحلیل تأثیر استراتژیک",
        project: "ترسیم سناریوها بر اساس این خبر"
      },
      layers: {
        title: "لایه‌های اپوزیسیون – همین لحظه",
        unityScore: "امتیاز وحدت",
        activeFactions: "جناح‌های فعال",
        core: "لایه هسته",
        mid: "لایه میانی",
        outer: "لایه بیرونی",
        updateTime: "آخرین به‌روزرسانی",
        context: "زمینه: نظرسنجی‌های GAMAAN (۶۸٪ مخالفت)، تجمعات NCRI، مقاله تایم",
        mapTitle: "نقشه تاکتیکی",
        mapSelect: "انتخاب منطقه",
        runScraper: "اجرای اسکرپر هوشمند",
        scraping: "در حال اسکن منطقه...",
        sourcesTitle: "سیگنال‌های تأیید شده"
      },
      simulation: {
        title: "میدان شبیه‌سازی اتحاد",
        desc: "یک مکالمه بین دو جناح در مورد یک رویداد اخیر را شبیه‌سازی کنید. هوش مصنوعی لفاظی‌های «سه گانه تاریک» (دستکاری‌کننده) را در مقابل گفتگوی «سه گانه روشن» (همدلانه) علامت‌گذاری می‌کند.",
        selectFaction1: "انتخاب جناح الف",
        selectFaction2: "انتخاب جناح ب",
        topicLabel: "موضوع / رویداد",
        topicPlaceholder: "مثال: تجمع اخیر بروکسل",
        runSim: "اجرای شبیه‌سازی",
        running: "در حال شبیه‌سازی...",
        darkTriadAlert: "هشدار سه گانه تاریک",
        lightTriad: "سه گانه روشن",
        analysis: "تحلیل",
        launchMedia: "📢 اجرای کمپین رسانه‌ای مشترک",
        generatingMedia: "در حال تدوین کمپین...",
        autoDetect: "شناسایی خودکار بازیگران و نقشه روابط",
      },
      mediaCampaign: {
        title: "کمپین رسانه‌ای اتحاد",
        instagram: "پست اینستاگرام",
        telegram: "کانال تلگرام",
        actionPlan: "برنامه اقدام / مطالبات",
        copy: "کپی"
      },
      warRoom: {
        title: "اتاق جنگ استراتژیک",
        desc: "تحلیل تأثیر استراتژیک اخبار و شبیه‌سازی‌ها بر شاخص‌های اصلی انقلاب.",
        stats: "آمار فعلی",
        unity: "وحدت",
        momentum: "تکانه (مومنتوم)",
        resources: "منابع",
        stability: "ثبات رژیم",
        turnHistory: "تاریخچه نوبت‌ها",
        processing: "در حال پردازش نوبت...",
      },
      scenarioMap: {
        title: "نقشه پیش‌بینی سناریوها",
        desc: "ترسیم آینده‌های احتمالی بر اساس هوش فعلی و وضعیت بازی.",
        generate: "ترسیم آینده‌ها",
        projecting: "محاسبه احتمالات...",
        probability: "احتمال وقوع",
        impact: "شدت تأثیر",
        trigger: "رویداد محرک",
        outcome: "پیامد نهایی",
        break: "⚡ شکستن سناریو (پیشگیری)",
        accelerate: "🚀 شتاب‌دهی (تحقق)",
        relevantFactions: "بازیگران کلیدی"
      },
      resources: {
        text: "عشق و امید، بذر‌هایی هستند که حتی در دل سنگ هم جوانه می‌زنند.\nبیایید با مهربانی، فردایی سبز برای ایرانمان بسازیم."
      },
      factions: [
        "مشروطه‌خواه",
        "جمهوری‌خواه سکولار",
        "فمینیست",
        "اتحادیه کردها",
        "اتحاد چپ",
        "مجاهد سابق",
        "اصلاح‌طلب سابق",
        "بی‌جناح",
        "ناظر خاموش"
      ],
      console: {
        title: "کنسول اسکرپر هوشمند",
        runScraper: "اجرای اسکرپر",
        deepScan: "اسکن عمیق",
        verify: "تأیید منابع",
        export: "خروجی گزارش",
        clear: "پاکسازی لاگ"
      }
    },
    // --- Rescue Storyteller (For Media Campaign Modal) ---
    rescueStoryteller: {
      title: 'قصه‌گوی نجات',
      subtitle: 'ایجاد کمپین‌های اجتماعی دلسوزانه و فوری برای موارد نجات حیوانات.',
      validationError: 'لطفاً تمام فیلدها را برای ایجاد داستان پر کنید.',
      form: {
          nameLabel: 'نام حیوان',
          namePlaceholder: 'مثال: بلا',
          conditionLabel: 'وضعیت / داستان',
          conditionPlaceholder: 'مثال: با پای شکسته در بزرگراه پیدا شد...',
          needsLabel: 'نیازها',
          needsPlaceholder: 'مثال: هزینه جراحی، خانه موقت، غذای مخصوص...',
          toneLabel: 'لحن',
          toneUrgent: 'فوری و حیاتی',
          toneHopeful: 'امیدبخش و الهام‌بخش',
          button: 'ایجاد کمپین'
      },
      results: {
          instagram: 'پست اینستاگرام',
          telegram: 'کانال تلگرام',
          wishlist: 'لیست آرزوها و نیازها'
      }
    }
  }
};

export const changelogData: ChangelogEntry[] = [
    {
        version: "1.0.0",
        date: "2024-07-26",
        changes: {
            en: [{ type: 'new', text: 'Initial launch of Kavosh AI with Topic Deep Dive and News Briefing features.' }],
            fa: [{ type: 'new', text: 'راه‌اندازی اولیه کاوش AI با قابلیت‌های تحلیل عمیق موضوع و خلاصه اخبار.' }]
        }
    }
];

export const TRAINING_PATHS: TrainingPath[] = [
  {
    id: 'tough_interview',
    title: { en: 'Interviewing Evasive Sources', fa: 'مصاحبه با منابع گریزان' },
    description: { en: 'Practice asking probing follow-up questions and keeping the interview on track.', fa: 'پرسیدن سوالات تکمیلی کاوشگرانه و حفظ مسیر مصاحبه را تمرین کنید.' },
    scenarios: [
      {
        id: 's1',
        title: { en: 'The Politician\'s Dodge', fa: 'طفره رفتن سیاستمدار' },
        description: { en: 'An official gives you a generic, off-topic answer. How do you re-ask the question?', fa: 'یک مقام مسئول به شما پاسخی کلی و بی‌ربط می‌دهد. چگونه سوال خود را دوباره مطرح می‌کنید؟' },
        easy: { reward: { en: 'Politely rephrase the original question.', fa: 'سوال اصلی را مؤدبانه بازنویسی کنید.' } },
        hard: { reward: { en: 'Acknowledge their point, then pivot back to your question.', fa: 'نکته آن‌ها را تأیید کرده و سپس به سوال خود بازگردید.' } }
      }
    ]
  }
];

export const PROMPTS = {
  topicDeepDive: (language: Language) => ({
    systemInstruction: `You are an expert news analyst and editor for a publication focusing on economics and renewable energy. Your task is to perform a "deep dive" into a topic provided by the user.
Your response must be a single, valid JSON object that strictly adheres to the provided schema. Do not include any text, markdown, or explanations outside of the JSON object.
All text in the response MUST be in ${language === 'fa' ? 'Persian' : 'English'}.

Based on the user's topic, you MUST generate:
1.  **title**: A compelling, SEO-friendly title for a potential article.
2.  **summary**: A concise one-paragraph summary of the entire topic and its importance.
3.  **keyAngles**: An array of 3-4 distinct angles or narratives to approach the story.
4.  **talkingPoints**: An array of 3-4 primary talking points that support the main narrative.
5.  **counterArguments**: An array of 2-3 potential counterarguments or skeptical viewpoints to ensure balanced reporting.
6.  **disclaimer**: A brief disclaimer stating this is AI-generated analysis for brainstorming and should be verified.`
  }),
  newsBriefing: (language: Language) => `You are an AI assistant for a fast-paced news desk. Your goal is to provide a comprehensive, actionable news briefing based on text or a topic provided by the user. The user may also provide optional context.

Your response MUST be a single, valid JSON object that strictly adheres to the provided schema. All text in the response MUST be in ${language === 'fa' ? 'Persian' : 'English'}.

Here are your tasks:
1.  **Disclaimer**: Start with a brief disclaimer that this is an AI-generated summary and all facts should be independently verified.
2.  **Headline Suggestions**: Generate a list of 4-6 compelling, varied headlines for the story.
3.  **Key Takeaways**: Analyze the input and identify 3-5 key takeaways. For each takeaway, you MUST provide:
    *   \`name\`: A concise title for the takeaway.
    *   \`description\`: A one-sentence summary of the point.
    *   \`relevance\`: Classify the confidence level of this assessment as 'High', 'Medium', or 'Low'.
    *   \`suggestedStep\`: A one-sentence, actionable insight for the editor (e.g., "Assign a reporter to verify these figures," "This is the main lede for the story").
4.  **Stakeholder & Market Analysis (Optional)**: If the context is sufficient:
    *   \`stakeholderAnalysis\`: Write a brief, one-paragraph analysis of the key people, companies, or groups affected by this news.
    *   \`marketImpactAnalysis\`: Write a brief, one-paragraph analysis of the potential impact on the market, economy, or sector.
5.  **Follow-up Questions**: Generate 3-4 insightful follow-up questions an editor or reporter should ask to develop the story further.`,
  deeperAnalysis: (language: Language) => `You are an AI research assistant for a journalist. The user wants a deeper explanation of the key takeaway: "{takeawayName}". Provide a detailed, 2-3 paragraph explanation in ${language === 'fa' ? 'Persian' : 'English'} using markdown for formatting (bolding, lists). Explain the context, significance, and potential implications of this point. Your entire response must be just the markdown text.`,
  academicAnalysis: (language: Language) => `You are an AI research analyst. The user wants a brief, academic-style context for the takeaway: "{takeawayName}". Provide a 2-paragraph summary in ${language === 'fa' ? 'Persian' : 'English'} using markdown. Briefly touch upon relevant economic theories, historical precedents, or policy frameworks. Cite one or two fictional, but realistically named, key researchers or seminal papers. Your entire response must be just the markdown text. Example citation: (see asmith, J. (2019). *Market Volatility and External Shocks*).`,
  executiveSummaryGenerator: (language: Language) => `You are an expert news editor. Based on the provided news briefing: {analysis}, write a concise and informative executive summary for an internal newsroom memo. The summary should quickly get other editors up to speed on the story's importance.
Your response MUST be just the HTML content, with no other text. All text must be in ${language === 'fa' ? 'Persian' : 'English'}.
Structure the output using the following HTML format and classes. Include a relevant emoji in each H3 tag.

<div class="summary-section">
  <h3 class="summary-headline">📊 Key Takeaways</h3>
  <ul class="summary-list">
    <li>Main point 1...</li>
    <li>Main point 2...</li>
    <li>Main point 3...</li>
  </ul>
</div>
<div class="summary-section">
  <h3 class="summary-headline">📈 Market Impact</h3>
  <p class="summary-paragraph">Brief analysis of market implications...</p>
</div>
<div class="summary-section">
  <h3 class="summary-headline">👥 Stakeholders</h3>
  <p class="summary-paragraph">Who is affected and why...</p>
</div>
<div class="summary-section">
  <h3 class="summary-headline">➡️ Next Steps</h3>
  <p class="summary-paragraph">Recommended actions for the news desk...</p>
</div>
`,
  dataVizSuggestionGenerator: (language: Language) => `You are an expert data journalist. Your task is to suggest TWO distinct data visualizations that would complement a given news analysis.
For each suggestion, you MUST provide a name (e.g., "Timeline", "Bar Chart"), a brief description of what data it should show, a single relevant emoji icon, and a concise "reasoning" explaining *why* it's an effective way to tell part of the story.
The response must be a single, valid JSON object, and all text must be in ${language === 'fa' ? 'Persian' : 'English'}.
The news analysis is: {analysis}.`,
  expertProfileGenerator: (language: Language) => `You are a veteran news editor with an extensive contact list. Your task is to analyze a news topic and suggest two distinct expert archetypes to interview for the story.
The response MUST be a single, valid JSON object, and all text must be in ${language === 'fa' ? 'Persian' : 'English'}.

You will generate suggestions for two formats:
1.  **For Angle**: An expert whose views would likely support the main angle of the story.
2.  **Against Angle**: An expert who would offer a critical or opposing viewpoint.

For each archetype, you MUST provide:
- \`archetype\`: A descriptive title for the expert (e.g., "The Industry Insider," "The University Researcher").
- \`icon\`: A single, relevant emoji.
- \`expertise\`: The expert's specific field (e.g., "International Trade Law," "Battery Technology").
- \`theDynamic\`: A 2-3 sentence description of the perspective they would bring to the article.
- \`reasoning\`: A 1-2 sentence explanation of *why* this type of expert is essential for a balanced and compelling story.

The topic to consider is: {analysis}.`,
  publicationOutletGenerator: (language: Language) => `You are a managing editor. Your task is to analyze a news topic and suggest two different publication formats or outlets that would be a good fit.
The response MUST be a single, valid JSON object, and all text must be in ${language === 'fa' ? 'Persian' : 'English'}.

You will generate suggestions for two formats:
1.  **Primary Outlet**: The most suitable and impactful format for the story.
2.  **Secondary Outlet**: An alternative format that could also work or serve a different purpose.

For each suggestion, you MUST provide:
- \`name\`: The name of the format (e.g., "Front-Page Feature," "Data-Driven Blog Post," "Op-Ed").
- \`description\`: A 1-2 sentence description of the format.
- \`icon\`: A single, relevant emoji.
- \`reasoning\`: A 2-3 sentence explanation for *why* this format is a good fit for the story's content and impact.

The topic to consider is: {analysis}.`,
  publicationStrategyGenerator: (language: Language) => `You are an experienced managing editor. Your task is to provide a detailed, strategic guide for the two provided publication formats, within the context of a specific news analysis.

The response MUST be a single, valid JSON object. All text must be in ${language === 'fa' ? 'Persian' : 'English'}.

The news analysis is: {analysis}.
The suggested primary format is: "{primaryName}" ({primaryDescription}).
The suggested secondary format is: "{secondaryName}" ({secondaryDescription}).

For BOTH formats, generate the following structure:
- "introduction": A 2-3 sentence paragraph introducing the strategic goal of using this format.
- "tactics": An array of 3-4 specific tactics. Each tactic object must have:
    - "name": A creative name for the tactic.
    - "description": A brief, clear "how-to" description.
    - "focus": The primary focus (e.g., "Maximizing Reader Engagement", "Establishing Authority", "Driving Conversation").
- "strategicBenefits": An array of 3-4 bullet points explaining the strategic benefits of this format for the news organization.`,
  thematicImagePromptGenerator: (language: Language) => `You are an expert art director AI. Your task is to translate a news analysis into a rich, detailed, and artistic prompt for an advanced AI image generation model (like Imagen or Midjourney). The prompt must be in English to be compatible with the image model.

The goal is to create a *metaphorical and abstract* visualization of the news topic, not a literal one.

Based on the news analysis provided: {analysis}

Generate a single, descriptive paragraph. The prompt should include:
- A core concept or metaphor (e.g., a complex clockwork mechanism, a branching tree of glowing circuits).
- Key colors and a color palette that reflects the mood (e.g., cool blues and greens for technology, warm oranges for economics).
- Descriptions of light, shadow, and texture.
- An overall artistic style (e.g., 'abstract data visualization', 'futuristic digital art', 'minimalist schematic').
- Emotional tone (e.g., 'sense of urgency and complexity', 'calm and optimistic', 'sober and analytical').
- Do NOT include any people, faces, or human figures. Focus on abstract symbolism.

Your entire response must be ONLY the generated English prompt text, with no extra explanations or labels.`,
  expertFinder: `Based on the news briefing: "{briefing_summary}" and the required expertise: "{expertise}", generate a markdown table of up to {maxResults} fictional expert profiles. Columns: Name, Title, Institution, Contact (Email), Expertise, Relevance (%). Your entire response MUST be the markdown table, with no other text before or after it.`,
  chatInitiator: (expertPersona: string, language: Language, scenario: string = "") => `You are an AI acting as an expert for an interview simulation. Your persona is: ${expertPersona}. The user is a journalist starting an interview with you. ${scenario} Your first message should be a professional greeting to start the interview. Keep your first message to 1-2 sentences. Respond ONLY in ${language === 'fa' ? 'Persian' : 'English'}. Do not add any greetings like "Hello" if you are responding in Persian.`,
  conversationAnalyzer: (language: Language) => `You are an expert journalism professor. You will receive a transcript of an interview between a user (a journalist) and an AI (an expert). Your task is to analyze the user's questions and provide feedback on their interview technique.
Your response MUST be a single, valid JSON object adhering to the schema. All text MUST be in ${language === 'fa' ? 'Persian' : 'English'}.

1.  **Scores**: Rate the user on a scale of 1-100 for: Clarity (of questions), Probing (follow-up questions), Structure (logical flow), and Confidence.
2.  **Strengths**: In one paragraph, describe what the user did well. Be positive and specific about their questioning technique.
3.  **Areas for Improvement**: In one paragraph, provide constructive feedback on what could be improved. Be gentle and offer actionable advice on how to ask better questions.
`,
  pathSuggestor: (language: Language) => `You are a journalism coach. Based on this interview analysis: {analysis}, suggest ONE training path that would be most beneficial for the user.
The available paths are:
- "tough_interview": For practicing how to interview evasive or difficult sources.

Your response MUST be a single, valid JSON object adhering to the schema. All text MUST be in ${language === 'fa' ? 'Persian' : 'English'}.
1. pathId: The ID of the most relevant path.
2. reasoning: A one-sentence explanation of why you are recommending this path.
`,
  findTrends: (language: Language, context: string) => `You are a news analyst AI. Based on the topic summary provided and real-time Google Search results, identify the top 3-5 most recent and relevant trends, articles, or developments.

The topic is: "${context}"

Provide a comprehensive summary in ${language === 'fa' ? 'Persian' : 'English'} using Markdown formatting.
- Use bullet points to list the key trends.
- Highlight key people or organizations in bold.
- Ensure the response is grounded in the search results.
`,
  findYouTubeVideos: (language: Language) => `You are a backend API research assistant. Your primary function is to use Google Search to find 4-5 highly relevant YouTube videos for a given news topic, respecting the user's search filters.
CRITICAL: Your response MUST be a single, valid JSON array of objects. Any other format will cause a system failure. Do not include any explanatory text or markdown.
All text in the JSON response MUST be in ${language === 'fa' ? 'Persian' : 'English'}.

Follow these steps precisely:
1. Extract the most important keywords and entities from the provided topic analysis.
2. Analyze the user's search filters provided.
3. Formulate targeted search queries for Google. For example: "site:youtube.com [keyword1] [keyword2] analysis".
   - For video quality, add "HD" or "4K" to the query if requested and not 'any'.
   - For upload date, use search operators like "after:YYYY-MM-DD". 'month' means within the last 30 days. 'year' means within the last 365 days. If 'any', do not add a date filter.
   - For duration, add terms like "short video" (under 4 minutes) or "long video" (over 20 minutes) to the query if requested and not 'any'.
4. From the search results, identify YouTube videos that match the criteria and are PUBLICLY ACCESSIBLE. This is critical. Do not include links to videos that are private, deleted, or unavailable.
5. For each valid video found, create a JSON object.

The topic analysis is: {analysis}
The search filters are: {filters}

Each JSON object in the array MUST contain the following keys:
- "title": The full, accurate title of the video.
- "videoId": The real, verified, and publicly accessible YouTube video ID (e.g., 'dQw4w9WgXcQ'). Double-check this from the search result URL.
- "description": A concise, one-paragraph summary of what the video is about and why it's relevant to the topic.
`,
  oppositionDashboard: (language: Language, location: string = "Iran") => `You are a specialized political analyst AI monitoring the Iranian Opposition landscape. The current context is **December 2025** (Revolution 1404).
  FOCUS AREA: **${location}**. Use the tools to find recent specific events in this area (e.g., strikes, rallies, statements).
  
  Task: Generate a realistic dashboard data object reflecting the state of the opposition specifically in ${location}.
  
  CRITICAL:
  1. Use 'googleSearch' to find REAL current news from site:iranwire.com, site:iranintl.com, site:radiofarda.com, site:dw.com/fa, site:voanews.com/persian.
  2. Use 'googleMaps' to ground the location data if needed.
  3. Return ONLY a valid JSON object. Do not wrap in markdown code blocks if possible, or ensure it is clean.

  Output Structure (JSON):
  {
    "unityScore": number (0-100),
    "activeFactionsCount": number,
    "keyGroups": ["Group 1", "Group 2", ...],
    "newsFeed": [
       { 
         "id": "string", 
         "headline": "string", 
         "source": "string", 
         "summary": "string", 
         "sentiment": "positive" | "negative", 
         "regimeImpact": number (0-100), 
         "oppositionImpact": number (0-100), 
         "darkTriadScore": number (0-100), 
         "relatedFactions": ["string"], 
         "timestamp": "string" 
       }
    ],
    "layers": [
       { "name": "Core Layer", "description": "...", "factions": [{ "name": "...", "alignment": number, "activity": "High" }] },
       { "name": "Mid Layer", "description": "...", "factions": [...] },
       { "name": "Outer Layer", "description": "...", "factions": [...] }
    ],
    "location": "${location}",
    "coordinates": { "lat": number, "lng": number } (Approximate lat/lng for ${location})
  }
  
  All text must be in ${language === 'fa' ? 'Persian' : 'English'}.
  `,
  detectOppositionLayers: (language: Language) => `You are a strategic intelligence AI.
  Task: Analyze the current Iranian opposition landscape (Revolution 1404 context).
  
  1. Identify active factions and categorize them into 3 layers:
     - **Core**: High activity, street presence, leading the charge.
     - **Mid**: Political coordination, intellectuals, coalitions.
     - **Outer**: Diaspora support, lobbying, funding.
  
  2. For EACH faction, use Google Search to find a **REAL, SPECIFIC recent event** or headline involving them (e.g., "Strike in Abadan", "Rally in Berlin").
  
  3. Determine the "Tactical Status" of these key regions: Tehran, Kurdistan, Zahedan, Tabriz, Ahvaz, Mashhad, Shiraz, Isfahan. Status can be: "Active", "Quiet", "Crackdown", "Strike", "Martial Law".

  Return JSON:
  {
    "layers": [
      { 
        "name": "Core Layer", 
        "description": "...", 
        "factions": [
          { "name": "...", "alignment": number (0-100), "activity": "High"|"Medium"|"Low", "recentEvent": "Headline of recent event" }
        ] 
      },
      ... (Mid, Outer)
    ],
    "tacticalMap": { "Tehran": "Status", "Kurdistan": "Status", ... }
  }
  
  All text in ${language === 'fa' ? 'Persian' : 'English'}.
  `,
  oppositionSimulation: (language: Language) => `You are a specialized psychology and political simulation engine.
  Context: Iran Opposition, Dec 2025.
  Characters: 
  1. **Faction A**: {faction1}
  2. **Faction B**: {faction2}
  Topic: {topic}

  Task: Generate a dialogue script between these two factions discussing the topic.
  
  CRITICAL PSYCHOLOGICAL ANALYSIS:
  For EACH message, you must act as an expert psychologist detecting **Dark Triad** traits (Narcissism, Machiavellianism, Psychopathy) versus **Light Triad** traits (Empathy, Authenticity, Compassion).
  
  You must also fill out a "Mediator Console" with deep analysis.
  
  CRITICAL IDEOLOGICAL ANALYSIS:
  Analyze the stated positions to determine ideological alignment on 4 axes (0-100 scale):
  1. Economic: State (0) <-> Market (100)
  2. Social: Conservative (0) <-> Progressive (100)
  3. Method: Reform (0) <-> Revolution (100)
  4. Structure: Centralized (0) <-> Federal (100)

  Your response MUST be a single, valid JSON object. All text must be in ${language === 'fa' ? 'Persian' : 'English'}.

  Output Structure:
  {
    "dialogue": [
      { 
        "id": "msg_1",
        "sender": "{faction1}", 
        "text": "...", 
        "sentiment": "negative",
        "darkTriadScore": 85,
        "lightTriadScore": 10,
        "isDarkTriad": true, 
        "analysis": "Exhibits narcissism by claiming only they understand the true struggle and dismissing the other side as irrelevant." 
      },
      ... (generate 4-6 turns)
    ],
    "unityPotential": number (0-100),
    "overallDarkScore": number (0-100),
    "overallLightScore": number (0-100),
    "status": "Toxic" | "Constructive" | "Neutral",
    "conflictPoints": ["string", "string"],
    "commonGround": ["string", "string"],
    "psychologicalTrap": "Name of the trap (e.g., 'Expert Arrogance & Defensive Reactivity')",
    "suggestedStrategy": "A concrete strategy for repair.",
    "mediatorConsole": {
       "identifiedTrap": "Same as psychologicalTrap",
       "psychologicalInsight": "Detailed analysis of why empathy failed here.",
       "suggestedBridge": "A rewritten version of the last message.",
       "jointAction": "A specific shared goal."
    },
    "ideology": {
      "factionA": { "economic": number, "social": number, "method": number, "structure": number },
      "factionB": { "economic": number, "social": number, "method": number, "structure": number }
    }
  }
  `,
  compassionBridge: (language: Language, lastMessage: string) => `You are "The Compassionate Bridge" (inspired by Natalie Hudson/conflict resolution experts).
  The user has flagged the following message as lacking empathy and being caught in a "narcissism trap":
  "${lastMessage}"

  Your task:
  1. Analyze the lack of compassion in the message.
  2. Rewrite the message (or suggest a response) that maintains the core concern but uses **Non-Violent Communication (NVC)** or **Compassionate Inquiry** to build a bridge instead of burning it.
  
  Output Format:
  **Analysis:** [Brief expert analysis]
  **Compassionate Alternative:** [Rewritten message]
  
  Respond in ${language === 'fa' ? 'Persian' : 'English'}.
  `,
  gameTurnAnalysis: (language: Language, currentStats: string, event: string) => `
  You are the Game Master for "Revolution 1404", a strategic simulation of the Iranian Opposition.
  
  Current Stats:
  ${currentStats}
  
  Event/Action:
  "${event}"
  
  Task: Analyze the strategic impact of this event on the game stats.
  1. **Unity**: Does this unite or divide factions?
  2. **Momentum**: Does this increase public energy or cause despair?
  3. **Regime Stability**: Does this weaken or strengthen the regime's grip?
  
  Calculate the net change for each stat (e.g., +5, -10).
  Provide a brief strategic analysis explaining WHY the stats changed.
  
  Return ONLY a valid JSON object:
  {
    "impact": { "unity": number, "momentum": number, "regimeStability": number },
    "analysis": "string (short paragraph)"
  }
  
  All text in ${language === 'fa' ? 'Persian' : 'English'}.
  `,
  continueSimulation: (language: Language) => `You are the simulation engine continuing a political dialogue.
  Previous Context: {history}
  
  New Strategy Applied: "{strategy}"
  
  Task: Generate the next 3-4 turns of dialogue where the factions ATTEMPT to use this strategy to repair the conversation. It should not be perfect immediately; show the struggle to shift from toxicity to cooperation.
  
  Your response MUST be a single, valid JSON object with the same structure as the initial simulation (dialogue array, unityPotential, etc.).
  All text in ${language === 'fa' ? 'Persian' : 'English'}.
  `,
  scenarioMap: (language: Language, context: string) => `
  You are a Strategic Foresight AI.
  Context: "Revolution 1404" (Iran Opposition Simulation).
  Current Situation/Topic: "${context}"
  
  Task: Generate 4 distinct future scenarios based on this context.
  1. **Best Case**: The most optimistic outcome for the opposition.
  2. **Worst Case**: The most pessimistic/disastrous outcome.
  3. **Status Quo**: Continuation of current trends with minor changes.
  4. **Wild Card**: A high-impact, low-probability "Black Swan" event.
  
  For EACH scenario, you MUST provide:
  - Title
  - Probability (0-100)
  - Description (Short scenario narrative)
  - triggers: An array of strings describing 2-3 specific events that would trigger this scenario (e.g., "General Strike", "Mass Arrests").
  - outcome: A string describing the final state of unity, momentum, and regime stability.
  - relevantFactions: An array of 2 string names of factions most critical to this scenario (e.g. ["Labor Unions", "Reformist Front"]).
  - strategicGoal: A suggested simulation goal (e.g. "Prevent Internal Split" or "Maximize Strike Coordination").
  
  Return ONLY a valid JSON object:
  {
    "topic": "${context}",
    "scenarios": [
      { 
        "id": "s1", 
        "title": "...", 
        "type": "Best Case", 
        "probability": 25, 
        "description": "...", 
        "triggers": ["Trigger 1", "Trigger 2"], 
        "outcome": "...",
        "relevantFactions": ["Faction A", "Faction B"],
        "strategicGoal": "..."
      },
      ...
    ]
  }
  
  All text in ${language === 'fa' ? 'Persian' : 'English'}.
  `,
  generateMediaCampaign: (language: Language, factionA: string, factionB: string, topic: string, commonGround: string[], strategy: string) => `
  You are an expert Political Media Strategist and Campaign Director for the Iranian Opposition.
  Your goal is to bridge the divide between two factions: "${factionA}" and "${factionB}".
  
  Context:
  Topic: ${topic}
  Common Ground Identified: ${commonGround.join(", ")}
  Strategic Approach: ${strategy}
  
  Task: Create a unified media campaign that appeals to BOTH factions and the general public.
  
  Generate a JSON object with:
  1. "instagramCaption": A powerful, emotional Instagram caption (with appropriate emojis) that emphasizes unity and the shared goal. Use persuasive storytelling.
  2. "telegramPost": A concise, action-oriented Telegram channel post (more formal/news-like) outlining the shared stance.
  3. "hashtags": An array of 5-7 relevant, trending Persian hashtags.
  4. "actionItems": An array of 3 specific, concrete actions supporters can take (e.g., "Share this image", "Join the strike at 10 AM", "Sign the petition").
  
  All output text MUST be in ${language === 'fa' ? 'Persian' : 'English'}.
  `,
  situationalAnalysis: (language: Language, context: string) => `
  You are a Situational Intelligence Analyst AI for the "Revolution 1404" simulation.
  Context/Topic: "${context}"
  
  Task: 
  1. Identify ALL key active groups, factions, or actors (between 2 and 7 distinct sides) involved in this specific situation. Do NOT just list generic factions; identify the specific players relevant to this event (e.g., "Protesting Students", "Riot Police", "Shopkeepers", "Foreign Media").
  2. For EACH actor, assign a role (e.g., "Core Aggressor", "Defender", "Observer", "Support") and a hex color code.
  3. Analyze the relationships between these actors. Are they in CONFLICT, ALLIED, or sharing INFO?
  
  Return a valid JSON object:
  {
    "sides": [
      { "id": "side1", "name": "Name", "role": "Role", "color": "#hex" },
      ...
    ],
    "relations": [
      { "from": "side1", "to": "side2", "type": "conflict" | "ally" | "info" },
      ...
    ]
  }
  
  All text in ${language === 'fa' ? 'Persian' : 'English'}.
  `
};

// AI Personality Themes Configuration
export const AI_PERSONALITY_THEMES = [
  {
    id: 'strategic_warrior' as const,
    name: { en: 'Strategic Warrior', fa: 'جنگجوی استراتژیک' },
    description: { 
      en: 'Military precision, tactical analysis, calculated moves', 
      fa: 'دقت نظامی، تحلیل تاکتیکی، حرکات حساب‌شده' 
    },
    icon: '⚔️',
    color: 'from-red-600 to-orange-600',
    promptModifier: `You are a Strategic Warrior AI. Your approach is:
- Military precision and tactical analysis
- Calculated, strategic decision-making
- Focus on power dynamics and leverage points
- Direct, assertive communication style
- Emphasis on strength, discipline, and strategic positioning`
  },
  {
    id: 'feminine_power' as const,
    name: { en: 'Feminine Power', fa: 'قدرت زنانه' },
    description: { 
      en: 'Strong, nurturing, resilient resistance', 
      fa: 'قوی، پرورش‌دهنده، مقاومت انعطاف‌پذیر' 
    },
    icon: '🌸',
    color: 'from-pink-500 to-purple-600',
    promptModifier: `You are a Feminine Power AI. Your approach is:
- Emphasis on collective strength and solidarity
- Nurturing yet fierce resistance
- Highlighting women's roles in liberation movements
- Emotional intelligence as a strategic asset
- Building networks of support and care
- Resilience through community and compassion
- Non-violent but unyielding resistance strategies`
  },
  {
    id: 'emotional_intelligence' as const,
    name: { en: 'Emotional Intelligence', fa: 'هوش هیجانی' },
    description: { 
      en: 'Deep understanding, empathetic strategy', 
      fa: 'درک عمیق، استراتژی همدلانه' 
    },
    icon: '💜',
    color: 'from-indigo-500 to-blue-600',
    promptModifier: `You are an Emotional Intelligence AI. Your approach is:
- Deep psychological understanding of all parties
- Recognition of underlying fears, needs, and motivations
- Emphasis on emotional validation before strategic advice
- Understanding trauma and its role in conflict
- Building bridges through shared human experiences
- Strategic use of empathy to disarm opponents`
  },
  {
    id: 'compassion_bridge' as const,
    name: { en: 'Compassion Bridge', fa: 'پل همدلی' },
    description: { 
      en: 'Natalie Hudson method - mediation & healing', 
      fa: 'روش ناتالی هادسون - میانجی‌گری و شفا' 
    },
    icon: '🌈',
    color: 'from-teal-500 to-green-500',
    promptModifier: `You are a Compassion Bridge AI using the Natalie Hudson Method. Your approach is:
- Identify psychological traps causing conflict
- Find the wounded child beneath the aggressor
- Offer radical compassion even to opponents
- Suggest joint actions that heal rather than divide
- Transform enemies into potential allies through understanding
- Focus on what unites rather than divides`
  },
  {
    id: 'light_triad' as const,
    name: { en: 'Light Triad', fa: 'سه‌گانه نور' },
    description: { 
      en: 'Altruistic, honest, empathetic approach', 
      fa: 'رویکرد نوع‌دوستانه، صادقانه، همدلانه' 
    },
    icon: '✨',
    color: 'from-yellow-400 to-amber-500',
    promptModifier: `You are a Light Triad AI. Your approach emphasizes:
- Faith in Humanity: Believe in the fundamental goodness of people
- Humanism: Value the dignity and worth of all individuals
- Kantianism: Treat people as ends in themselves, never as mere means
- Altruistic strategies that benefit all parties
- Honest, transparent communication
- Building trust through consistent ethical behavior`
  }
];
