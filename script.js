document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav__link');
    
    navToggle.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
        });
    });
    
    // Fetch GitHub projects
    fetchGitHubProjects();
});

async function fetchGitHubProjects() {
    const username = 'saathvikc'; // Your GitHub username
    const projectsContainer = document.getElementById('github-projects');
    
    // Map repository names to custom display names and additional info
    const projectsMap = {
        'LLM-Semantic-Book-Recommender': {
            displayName: 'LLM Semantic Book Recommender',
            // Optional: customDescription: '...' (if you want to override GitHub description)
            // Optional: customLanguage: '...' (if you want to override GitHub language)
        },
        'AI-Stock-Sentiment': {
            displayName: 'AI Stock Sentiment Analysis',
        },
        'self-driving-car-sim': {
            displayName: 'Self-Driving Car Simulator',
        },
        'Healthcare-Costs-Web-Crawler': {
            displayName: 'Healthcare Costs Web Crawler to Identify Price Disparities',
        },
        'Breast-Cancer-Prognosis-ML-Algorithm': {
            displayName: 'Ensemble ML model to predict breast cancer prognosis',
        }
    };
    
    try {
        // Fetch all your repositories
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        
        const allProjects = await response.json();
        
        // Clear loading message
        projectsContainer.innerHTML = '';
        
        // Filter projects to only show the featured ones
        const featuredRepoNames = Object.keys(projectsMap);
        const filteredProjects = allProjects.filter(project => 
            featuredRepoNames.includes(project.name)
        );
        
        // Sort projects to match the order in featuredRepoNames array
        filteredProjects.sort((a, b) => {
            return featuredRepoNames.indexOf(a.name) - featuredRepoNames.indexOf(b.name);
        });
        
        // Display projects
        if (filteredProjects.length > 0) {
            filteredProjects.forEach(project => {
                const customInfo = projectsMap[project.name];
                const projectElement = createProjectElement(project, customInfo);
                projectsContainer.appendChild(projectElement);
            });
        } else {
            projectsContainer.innerHTML = `<div class="portfolio__loading">No featured projects found. Please check repository names.</div>`;
        }
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsContainer.innerHTML = `<div class="portfolio__loading">Error loading projects: ${error.message}</div>`;
    }
}

function createProjectElement(project, customInfo) {
    const projectLink = document.createElement('a');
    projectLink.href = project.html_url;
    projectLink.className = 'portfolio__item';
    projectLink.target = '_blank';
    projectLink.rel = 'noopener noreferrer';
    
    // Use custom name if provided, otherwise use repo name
    const displayName = customInfo?.displayName || project.name;
    
    // Use custom description if provided, otherwise use GitHub description
    const description = customInfo?.customDescription || project.description || 'No description available';
    
    // Get languages used - use custom if provided
    let language = customInfo?.customLanguage || project.language || '';
    let languageHtml = language ? `<div class="portfolio__tech">Technology: ${language}</div>` : '';
    
    projectLink.innerHTML = `
        <h3 class="portfolio__title">${displayName}</h3>
        <p class="portfolio__description">${description}</p>
        ${languageHtml}
    `;
    
    return projectLink;
}