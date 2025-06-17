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
        'self-driving-car-sim': {
            displayName: 'Self-Driving Car Simulator',
            media: {
                type: 'video',
                url: 'videos/self-driving-car-sim-demo.mp4',
                poster: 'images/self-driving-car-sim-demo.png'
            }
        },
        'LLM-Semantic-Book-Recommender': {
            displayName: 'LLM Semantic Book Recommender',
            customDescription: 'An advanced machine learning solution for healthcare diagnostics',
            // media: {
            //     type: 'image',
            //     url: 'images/project1.jpg',
            //     alt: 'Screenshot of ML healthcare dashboard'
            // }
        },
        'AI-Stock-Sentiment': {
            displayName: 'AI Stock Sentiment Analysis',
            // media: {
            //     type: 'image',
            //     url: 'images/project2.jpg',
            //     alt: 'Signal processing visualization'
            // }
        },
        
        'Healthcare-Costs-Web-Crawler': {
            displayName: 'Healthcare Costs Web Crawler',
            // media: {
            //     type: 'image',
            //     url: 'images/project4.jpg',
            //     alt: 'Data visualization interface'
            // }
        },
        'Breast-Cancer-Prognosis-ML-Algorithm': {
            displayName: 'Ensemble ML model to predict breast cancer prognosis',
        },
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
    // Create a link element as the container
    const projectContainer = document.createElement('a');
    projectContainer.className = 'portfolio__item';
    projectContainer.href = project.html_url;
    projectContainer.target = "_blank";
    projectContainer.rel = "noopener noreferrer";
    
    // Use custom name if provided, otherwise use repo name
    const displayName = customInfo?.displayName || project.name;
    
    // Use custom description if provided, otherwise use GitHub description
    const description = customInfo?.customDescription || project.description || 'No description available';
    
    // Get languages used
    let language = customInfo?.customLanguage || project.language || '';
    let languageHtml = language ? `<div class="portfolio__tech">Technologies: ${language}</div>` : '';
    
    // Create media element if provided
    let mediaHtml = '';
    if (customInfo?.media) {
        const media = customInfo.media;
        if (media.type === 'image') {
            mediaHtml = `
                <div class="portfolio__media">
                    <img src="${media.url}" alt="${media.alt || displayName}" class="portfolio__image">
                </div>
            `;
        } else if (media.type === 'video') {
            mediaHtml = `
                <div class="portfolio__media">
                    <video class="portfolio__video" autoplay muted loop playsinline ${media.poster ? `poster="${media.poster}"` : ''}>
                        <source src="${media.url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        }
    }
    
    // Create the main content without the separate GitHub button
    projectContainer.innerHTML = `
        ${mediaHtml}
        <div class="portfolio__content">
            <h3 class="portfolio__title">${displayName}</h3>
            <p class="portfolio__description">${description}</p>
            ${languageHtml}
            <div class="portfolio__github-indicator">
                <i class="fab fa-github"></i> View on GitHub
            </div>
        </div>
    `;
    
    return projectContainer;
}