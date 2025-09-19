// This script can be used for any custom JavaScript functionality beyond what Bootstrap provides.
// For now, Bootstrap's data-attributes handle the tab and accordion behavior,
// so this file is minimal but included as per the request for JavaScript.

// Data structure for tab content
const tabData = {
    tab1: {
        title: 'Tab One',
        accordions: [
            '1. Tersedia Standar Pelayanan (SP) sesuai dengan ketentuan peraturan perundang-undangan yang berlaku',
            'Accordion Item #2 for Tab One',
            'Accordion Item #3 for Tab One',
            'Accordion Item #4 for Tab One',
            'Accordion Item #5 for Tab One'
        ]
    },
    tab2: {
        title: 'Tab Two',
        accordions: [
            'Accordion Item #1 for Tab Two',
            'Accordion Item #2 for Tab Two',
            'Accordion Item #3 for Tab Two',
            'Accordion Item #4 for Tab Two',
            'Accordion Item #5 for Tab Two'
        ]
    },
    tab3: {
        title: 'Tab Three',
        accordions: [
            'Accordion Item #1 for Tab Three',
            'Accordion Item #2 for Tab Three',
            'Accordion Item #3 for Tab Three',
            'Accordion Item #4 for Tab Three',
            'Accordion Item #5 for Tab Three'
        ]
    },
    tab4: {
        title: 'Tab Four',
        accordions: [
            'Accordion Item #1 for Tab Four',
            'Accordion Item #2 for Tab Four',
            'Accordion Item #3 for Tab Four',
            'Accordion Item #4 for Tab Four',
            'Accordion Item #5 for Tab Four'
        ]
    },
    tab5: {
        title: 'Tab Five',
        accordions: [
            'Accordion Item #1 for Tab Five',
            'Accordion Item #2 for Tab Five',
            'Accordion Item #3 for Tab Five',
            'Accordion Item #4 for Tab Five',
            'Accordion Item #5 for Tab Five'
        ]
    },
    tab6: {
        title: 'Tab Six',
        accordions: [
            'Accordion Item #1 for Tab Six',
            'Accordion Item #2 for Tab Six',
            'Accordion Item #3 for Tab Six',
            'Accordion Item #4 for Tab Six',
            'Accordion Item #5 for Tab Six'
        ]
    },
    tab7: {
        title: 'Tab Seven',
        accordions: [
            'Accordion Item #1 for Tab Six',
            'Accordion Item #2 for Tab Six',
            'Accordion Item #3 for Tab Six',
            'Accordion Item #4 for Tab Six',
            'Accordion Item #5 for Tab Six'
        ]
    }
};

// Content for the info buttons within accordions
const infoContent = {
    1: "This is the *first* specific piece of information for this item. It expands on the accordion's main content.",
    2: "This is the *second* specific piece of information. It provides additional context or details.",
    3: "This is the *third* specific piece of information. It might offer a summary or a call to action."
};

/**
 * Generates the HTML string for a single Bootstrap accordion item.
 * @param {string} tabId The ID of the parent tab (e.g., 'tab1').
 * @param {number} itemIndex The zero-based index of the accordion item.
 * @param {string} headingText The text for the accordion button's heading.
 * @param {string} parentAccordionId The ID of the parent accordion container.
 * @returns {string} The HTML string for the accordion item.
 */
function generateAccordionItem(tabId, itemIndex, headingText, parentAccordionId) {
    const isFirstItem = itemIndex === 0;
    const ordinals = ["first", "second", "third", "fourth", "fifth"];
    const ordinal = ordinals[itemIndex] || (itemIndex + 1).toString(); // Fallback for more than 5 items
    const tabName = tabData[tabId].title;
    const collapseId = `collapse${itemIndex + 1}${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`; // e.g., collapse1Tab1
    const headingId = `heading${itemIndex + 1}${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`; // e.g., heading1Tab1

    return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="${headingId}">
                <button class="accordion-button ${isFirstItem ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${isFirstItem ? 'true' : 'false'}" aria-controls="${collapseId}">
                    ${headingText}
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse ${isFirstItem ? 'show' : ''}" aria-labelledby="${headingId}" data-bs-parent="#${parentAccordionId}">
                <div class="accordion-body">
                    <p>This is the body for the ${ordinal} accordion item in ${tabName}.</p>
                    <div class="mt-3">
                        <button class="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#infoModal"
                                data-tab-id="${tabId}" data-accordion-index="${itemIndex}" data-info-type="1">Show Info 1</button>
                        <button class="btn btn-success btn-sm me-2" data-bs-toggle="modal" data-bs-target="#infoModal"
                                data-tab-id="${tabId}" data-accordion-index="${itemIndex}" data-info-type="2">Show Info 2</button>
                        <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#infoModal"
                                data-tab-id="${tabId}" data-accordion-index="${itemIndex}" data-info-type="3">Show Info 3</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Keep track of tabs whose content has already been loaded to prevent redundant generation
const loadedTabs = new Set();

/**
 * Renders the content (h3 and accordion) for a specific tab into its designated pane.
 * @param {string} tabId The ID of the tab to render (e.g., 'tab1').
 */
function renderTabContent(tabId) {
    // Only load content if it hasn't been loaded before for this tab
    if (loadedTabs.has(tabId)) {
        return;
    }

    const tabPane = document.getElementById(tabId);
    if (!tabPane) {
        console.error(`Tab pane with ID "${tabId}" not found!`);
        return;
    }

    const data = tabData[tabId];
    if (!data) {
        console.warn(`No data found for tab: ${tabId}`);
        tabPane.innerHTML = `<h3>Content not found for ${tabId}</h3>`;
        loadedTabs.add(tabId); // Mark as loaded even if content is missing
        return;
    }

    // Generate a unique ID for the accordion within this tab
    const accordionId = `accordion${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`; // e.g., accordionTab1

    let accordionsHtml = '';
    data.accordions.forEach((headingText, index) => {
        accordionsHtml += generateAccordionItem(tabId, index, headingText, accordionId);
    });

    // Set the inner HTML of the tab pane
    // tabPane.innerHTML = `
    //     <h3>Content for ${data.title}</h3>
    //     <div class="accordion" id="${accordionId}">
    //         ${accordionsHtml}
    //     </div>
    // `;

    loadedTabs.add(tabId); // Mark this tab as loaded
    console.log(`Content loaded for tab: ${tabId}`);
}

// Theme management functions
const STORAGE_KEY_THEME_MODE = 'themeMode';
const STORAGE_KEY_THEME_COLOR = 'themeColor';

/**
 * Applies the selected theme to the document body and saves it to localStorage.
 * @param {string} mode 'light' or 'dark'
 * @param {string} color 'blue', 'green', or 'orange'
 */
function applyTheme(mode, color) {
    const body = document.body;

    // Remove existing mode classes
    body.classList.remove('light-theme', 'dark-theme');
    // Add the new mode class
    body.classList.add(`${mode}-theme`);

    // Remove existing color classes
    body.classList.remove('theme-blue', 'theme-green', 'theme-orange');
    // Add the new color class
    body.classList.add(`theme-${color}`);

    // Update localStorage
    localStorage.setItem(STORAGE_KEY_THEME_MODE, mode);
    localStorage.setItem(STORAGE_KEY_THEME_COLOR, color);

    // Update UI controls to reflect the current theme
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.checked = (mode === 'dark');
    }

    const colorThemeRadios = document.querySelectorAll('input[name="colorTheme"]');
    colorThemeRadios.forEach(radio => {
        radio.checked = (radio.value === color);
    });
}

/**
 * Loads the theme preference from localStorage and applies it.
 * If no preference is found, applies default theme.
 */
function loadTheme() {
    const savedMode = localStorage.getItem(STORAGE_KEY_THEME_MODE) || 'light';
    const savedColor = localStorage.getItem(STORAGE_KEY_THEME_COLOR) || 'orange';
    applyTheme(savedMode, savedColor);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Web page loaded successfully!');

    // Load theme on page load
    loadTheme();

    // Get all tab buttons
    const tabTriggers = document.querySelectorAll('#myTab button');
    const tabContentContainer = document.getElementById('myTabContent');

    // Identify the initially active tab and render its content
    const initialActiveTabButton = document.querySelector('#myTab button.active');
    if (initialActiveTabButton) {
        const initialTabId = initialActiveTabButton.id.replace('-tab', '');
        renderTabContent(initialTabId);
    }

    // Attach event listeners to tab buttons to load content when a tab is shown
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('shown.bs.tab', event => {
            const activatedTabId = event.target.id.replace('-tab', '');
            console.log(`Tab shown: ${activatedTabId}`);
            console.log(`Previous tab: ${event.relatedTarget ? event.relatedTarget.id : 'None'}`);
            renderTabContent(activatedTabId); // Load content for the newly activated tab
        });
    });

    // Using event delegation for accordion opens/closes for dynamically loaded content
    // Attach listener to the common parent '#myTabContent'
    if (tabContentContainer) {
        tabContentContainer.addEventListener('shown.bs.collapse', event => {
            console.log(`Accordion item opened: ${event.target.id}`);
        });
        tabContentContainer.addEventListener('hidden.bs.collapse', event => {
            console.log(`Accordion item closed: ${event.target.id}`);
        });
    } else {
        console.warn('myTabContent container not found for accordion event delegation.');
    }

    // Theme settings event listeners
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const colorThemeRadios = document.querySelectorAll('input[name="colorTheme"]');

    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', () => {
            const currentMode = darkModeSwitch.checked ? 'dark' : 'light';
            const currentColor = document.querySelector('input[name="colorTheme"]:checked')?.value || 'blue';
            applyTheme(currentMode, currentColor);
        });
    }

    colorThemeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const currentMode = darkModeSwitch.checked ? 'dark' : 'light';
            const currentColor = radio.value;
            applyTheme(currentMode, currentColor);
        });
    });

    // Info Modal event listener
    const infoModalElement = document.getElementById('infoModal');
    const infoModalTitle = document.getElementById('infoModalLabel');
    const infoModalBody = document.getElementById('infoModalBody');

    if (infoModalElement) {
        infoModalElement.addEventListener('show.bs.modal', function (event) {
            // Button that triggered the modal
            const button = event.relatedTarget;
            // Extract info from data-* attributes
            const tabId = button.dataset.tabId;
            const accordionIndex = parseInt(button.dataset.accordionIndex, 10);
            const infoType = button.dataset.infoType;

            const tabName = tabData[tabId] ? tabData[tabId].title : 'Unknown Tab';
            const accordionHeading = tabData[tabId] && tabData[tabId].accordions[accordionIndex] ? tabData[tabId].accordions[accordionIndex] : `Accordion Item #${accordionIndex + 1}`;

            // Update the modal's content
            if (infoModalTitle) {
                infoModalTitle.textContent = `Details from "${tabName}" - "${accordionHeading}" (Info ${infoType})`;
            }
            if (infoModalBody) {
                infoModalBody.innerHTML = `
                    <p>${infoContent[infoType]}</p>
                    <p class="text-muted small">This content is from Tab: <strong>${tabName}</strong>, Accordion: <strong>${accordionHeading}</strong>.</p>
                `;
            }
        });
    } else {
        console.warn('Info Modal element not found.');
    }
});