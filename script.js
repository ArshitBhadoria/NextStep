/* =========================================================
   NEXTSTEP
   AI-Powered Student Benefits Discovery
========================================================= */

const API_URL = "https://nextstep-4-amwe.onrender.com/analyze";

let selectedCategory = "";
let userProfile = {};
let loadingTimer = null;
let abortController = null;


/* =========================================================
   BACKGROUND PARTICLES
========================================================= */

const canvas = document.getElementById("bgCanvas");

if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];

        const count = Math.min(
            90,
            Math.floor(window.innerWidth / 15)
        );

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.4 + 0.3,
                speedX: (Math.random() - 0.5) * 0.25,
                speedY: (Math.random() - 0.5) * 0.25,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) {
                particle.x = canvas.width;
            }

            if (particle.x > canvas.width) {
                particle.x = 0;
            }

            if (particle.y < 0) {
                particle.y = canvas.height;
            }

            if (particle.y > canvas.height) {
                particle.y = 0;
            }

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(123,164,255,${particle.opacity})`;

            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    createParticles();
    animateParticles();

    window.addEventListener("resize", () => {
        resizeCanvas();
        createParticles();
    });
}


/* =========================================================
   NAVIGATION
========================================================= */

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function scrollToProfile() {
    const section =
        document.getElementById("profile");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}

function scrollToCategories() {
    const section =
        document.getElementById("categories");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}

function scrollToDiscovery() {
    const section =
        document.getElementById("discovery");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* =========================================================
   PROFILE
========================================================= */

function collectProfile() {
    userProfile = {
        age:
            document
                .getElementById("age")
                ?.value
                .trim() || "",

        college:
            document
                .getElementById("college")
                ?.value
                .trim() || "",

        degree:
            document
                .getElementById("degree")
                ?.value
                .trim() || "",

        branch:
            document
                .getElementById("branch")
                ?.value
                .trim() || "",

        year:
            document
                .getElementById("year")
                ?.value || "",

        semester:
            document
                .getElementById("semester")
                ?.value || "",

        location:
            document
                .getElementById("location")
                ?.value
                .trim() || "",

        academic:
            document
                .getElementById("academic")
                ?.value
                .trim() || "",

        category:
            document
                .getElementById("category")
                ?.value || ""
    };

    return userProfile;
}


function useProfile() {
    collectProfile();

    if (!userProfile.age) {
        alert("Please enter your age.");

        document
            .getElementById("age")
            ?.focus();

        return;
    }

    if (!userProfile.college) {
        alert(
            "Please enter your college/university."
        );

        document
            .getElementById("college")
            ?.focus();

        return;
    }

    if (!userProfile.degree) {
        alert(
            "Please enter your degree."
        );

        document
            .getElementById("degree")
            ?.focus();

        return;
    }

    if (!userProfile.year) {
        alert(
            "Please select your current year."
        );

        document
            .getElementById("year")
            ?.focus();

        return;
    }

    if (!userProfile.location) {
        alert("Please enter your location.");

        document
            .getElementById("location")
            ?.focus();

        return;
    }

    scrollToCategories();
}


/* =========================================================
   CATEGORY
========================================================= */

function selectCategory(element) {
    document
        .querySelectorAll(".category-card")
        .forEach((card) => {
            card.classList.remove("active");
        });

    element.classList.add("active");

    selectedCategory =
        element.dataset.category || "";

    const categoryMessages = {
        scholarships:
            "Find scholarships suitable for my college profile.",

        internships:
            "Find internships suitable for my degree, branch and current year.",

        student_discounts:
            "Find current student discounts available in India.",

        travel_benefits:
            "Find travel benefits and student concessions available to college students in India.",

        education_rights:
            "Tell me about college and academic rights relevant to my situation.",

        refunds:
            "Find refunds, compensation or reimbursement that may apply to my situation."
    };

    setQuery(
        categoryMessages[selectedCategory] || ""
    );

    scrollToDiscovery();
}


function setQuery(text) {
    const input =
        document.getElementById(
            "situationInput"
        );

    if (!input) return;

    input.value = text;
    input.focus();
}


/* =========================================================
   SAFE URL
========================================================= */

function safeURL(url) {
    if (!url) {
        return "";
    }

    try {
        const parsed =
            new URL(String(url).trim());

        if (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        ) {
            return parsed.href;
        }
    } catch (error) {
        return "";
    }

    return "";
}


/* =========================================================
   LOADING
========================================================= */

const loadingMessages = [
    "Understanding your profile...",
    "Searching relevant opportunities...",
    "Checking available information...",
    "Verifying sources...",
    "Preparing your results..."
];


function showLoading() {
    const overlay =
        document.getElementById(
            "loadingOverlay"
        );

    const progress =
        document.getElementById(
            "progressBar"
        );

    const percent =
        document.getElementById(
            "loadingPercent"
        );

    const text =
        document.getElementById(
            "loadingText"
        );

    if (!overlay) return;

    overlay.classList.add("show");

    let progressValue = 0;
    let messageIndex = 0;

    if (progress) {
        progress.style.width = "0%";
    }

    if (percent) {
        percent.textContent = "0%";
    }

    if (text) {
        text.textContent =
            loadingMessages[0];
    }

    clearInterval(loadingTimer);

    loadingTimer = setInterval(() => {

        if (progressValue < 90) {

            progressValue +=
                Math.random() * 5 + 1;

            progressValue =
                Math.min(
                    progressValue,
                    90
                );

            if (progress) {
                progress.style.width =
                    `${progressValue}%`;
            }

            if (percent) {
                percent.textContent =
                    `${Math.floor(progressValue)}%`;
            }
        }

        if (
            progressValue > 20 &&
            messageIndex <
                loadingMessages.length - 1
        ) {

            messageIndex++;

            if (text) {
                text.textContent =
                    loadingMessages[
                        messageIndex
                    ];
            }
        }

    }, 700);
}


function finishLoading() {
    clearInterval(
        loadingTimer
    );

    const progress =
        document.getElementById(
            "progressBar"
        );

    const percent =
        document.getElementById(
            "loadingPercent"
        );

    if (progress) {
        progress.style.width =
            "100%";
    }

    if (percent) {
        percent.textContent =
            "100%";
    }

    setTimeout(() => {

        document
            .getElementById(
                "loadingOverlay"
            )
            ?.classList.remove(
                "show"
            );

    }, 300);
}


/* =========================================================
   MAIN DISCOVERY
========================================================= */

async function discoverBenefits() {

    collectProfile();

    if (
        !userProfile.age ||
        !userProfile.college ||
        !userProfile.degree ||
        !userProfile.year ||
        !userProfile.location
    ) {

        alert(
            "Please complete your college profile first."
        );

        scrollToProfile();

        return;
    }

    const input =
        document.getElementById(
            "situationInput"
        );

    const request =
        input?.value.trim() || "";

    if (!request) {

        alert(
            "Please describe what you want to discover."
        );

        input?.focus();

        return;
    }

    const finalSituation = {

        student_type:
            "college_student",

        profile:
            userProfile,

        selected_category:
            selectedCategory ||
            "student_benefits",

        request:
            request
    };

    const payload = {

        profile:
            "college_student",

        purpose:
            selectedCategory ||
            "student_benefits",

        situation:
            JSON.stringify(
                finalSituation
            )
    };

    showLoading();

    abortController =
        new AbortController();

    const timeout =
        setTimeout(() => {
            abortController.abort();
        }, 45000);

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        ),

                    signal:
                        abortController.signal
                }
            );

        clearTimeout(timeout);

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail ||
                `Backend error: ${response.status}`
            );
        }

        finishLoading();

        setTimeout(() => {
            renderResults(data);
        }, 350);

    } catch (error) {

        clearTimeout(timeout);

        finishLoading();

        console.error(
            "NEXTSTEP ERROR:",
            error
        );

        setTimeout(() => {
            renderError(error);
        }, 350);
    }
}


/* =========================================================
   RESULTS
========================================================= */

function renderResults(data) {

    const overlay =
        document.getElementById("resultOverlay");

    const content =
        document.getElementById("resultContent");

    const profileText =
        document.getElementById("resultProfile");

    if (!overlay || !content) return;

    if (profileText) {
        profileText.textContent = buildProfileText();
    }

    content.innerHTML = "";

    /* STRUCTURED RESULTS */

    if (
        Array.isArray(data.results) &&
        data.results.length > 0
    ) {

        data.results.forEach((result, index) => {

            const card =
                document.createElement("div");

            card.className =
                "result-card animated-result-card";

            card.style.animationDelay =
                `${index * 100}ms`;

            const title =
                result.title ||
                result.name ||
                "Opportunity";

            const category =
                result.category ||
                "Potential Match";

            const description =
                result.description ||
                result.why ||
                result.benefit ||
                "Potentially relevant to your profile.";

            const officialURL =
                safeURL(
                    result.url ||
                    result.link ||
                    result.official_link ||
                    ""
                );

            card.innerHTML = `
                <div class="result-card-top">
                    <div>
                        <div class="result-category">
                            ✦ ${escapeHTML(category)}
                        </div>

                        <h3>${escapeHTML(title)}</h3>
                    </div>

                    <div class="result-match">
                        <span></span>
                        POTENTIAL MATCH
                    </div>
                </div>

                <div class="result-description">
                    ${escapeHTML(description)}
                </div>

                <div class="result-details">
                    ${detailBox("Eligibility", result.eligibility)}
                    ${detailBox("Benefit", result.benefit)}
                    ${detailBox("Deadline", result.deadline)}
                    ${detailBox("Next Steps", result.next_steps)}
                </div>

                ${
                    officialURL
                        ? `
                            <div class="result-action">
                                <a
                                    href="${escapeHTML(officialURL)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="official-link"
                                >
                                    View Official Source ↗
                                </a>
                            </div>
                        `
                        : ""
                }
            `;

            content.appendChild(card);
        });

        renderSources(data.sources, content);
    }

    /* AI ANSWER */

    else if (data.answer) {

        const wrapper =
            document.createElement("div");

        wrapper.className = "ai-result-wrapper";

        const header =
            document.createElement("div");

        header.className = "ai-result-header";

        header.innerHTML = `
            <div class="ai-result-icon">✦</div>

            <div>
                <div class="ai-result-label">NEXTSTEP AI</div>
                <h3>Here's what we found</h3>
            </div>
        `;

        const answer =
            document.createElement("div");

        answer.className = "result-answer";

        /*
         * IMPORTANT:
         * sources bhi renderer ko pass kar rahe hain
         * taaki answer ke andar related clickable links
         * show ho saken.
         */
        renderAIAnswer(
            answer,
            data.answer,
            data.sources
        );

        wrapper.appendChild(header);
        wrapper.appendChild(answer);

        content.appendChild(wrapper);

        /*
         * Keep existing source rendering too.
         * Nothing removed.
         */
        renderSources(data.sources, content);
    }

    /* EMPTY */

    else {

        content.innerHTML = `
            <div class="empty-result">
                <div class="empty-result-icon">✦</div>

                <h3>No direct results found</h3>

                <p>
                    Try describing your situation
                    in more detail.
                </p>
            </div>
        `;
    }

    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
}/* =========================================================
   AI ANSWER RENDERING
========================================================= */

function renderAIAnswer(container, rawAnswer, sources = []) {

    if (!container) return;

    let text = String(rawAnswer || "").trim();

    if (!text) {
        container.innerHTML = `
            <div class="ai-empty">
                No AI answer was generated.
            </div>
        `;
        return;
    }

    /* =====================================================
       STEP 1 — REMOVE DANGEROUS HTML / CODE FENCES
    ===================================================== */

    text = text
        .replace(/```html/gi, "")
        .replace(/```javascript/gi, "")
        .replace(/```js/gi, "")
        .replace(/```/g, "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
        .replace(/<object[\s\S]*?<\/object>/gi, "")
        .replace(/<embed[\s\S]*?>/gi, "")
        .trim();


    /* =====================================================
       STEP 2 — MARKDOWN LINKS
       [Google](https://google.com)
    ===================================================== */

    text = text.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi,
        function (_, label, url) {

            const safe = safeURL(url);

            if (!safe) {
                return label;
            }

            return `
                <a
                    href="${safe}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ai-link"
                >
                    ${label}
                </a>
            `;
        }
    );


    /* =====================================================
       STEP 3 — MAIN HEADINGS
       # Heading → H1
    ===================================================== */

    text = text.replace(
        /^#\s+(.+)$/gm,
        "<h1>$1</h1>"
    );


    /* =====================================================
       STEP 4 — SUB HEADINGS
       ## / ### / #### → H3
    ===================================================== */

    text = text.replace(
        /^#{2,6}\s+(.+)$/gm,
        "<h3>$1</h3>"
    );


    /* =====================================================
       STEP 5 — BOLD TEXT
    ===================================================== */

    text = text.replace(
        /\*\*([^*]+)\*\*/g,
        "<strong>$1</strong>"
    );


    /* =====================================================
       STEP 6 — ITALIC TEXT
    ===================================================== */

    text = text.replace(
        /(^|[^\*])\*([^*\n]+)\*(?!\*)/g,
        "$1<em>$2</em>"
    );


    /* =====================================================
       STEP 7 — COMMON AI SECTION HEADINGS

       Example:
       Eligibility:
       How to Apply:
       Important Dates:
    ===================================================== */

    const headingPatterns = [
        "Eligibility",
        "Eligibility Criteria",
        "How to Apply",
        "Application Process",
        "Important Dates",
        "Benefits",
        "Documents Required",
        "Required Documents",
        "Selection Process",
        "Who Can Apply",
        "Requirements",
        "Official Website",
        "Application Link",
        "Key Details",
        "Overview",
        "Features",
        "Deadline",
        "Contact",
        "Conclusion"
    ];

    headingPatterns.forEach(function (heading) {

        const regex = new RegExp(
            "^(" +
            escapeRegex(heading) +
            "):\\s*$",
            "gmi"
        );

        text = text.replace(
            regex,
            "<h3>$1</h3>"
        );
    });


    /* =====================================================
       STEP 8 — CONVERT TEXT TO HTML
    ===================================================== */

    const parser = new DOMParser();

    const doc = parser.parseFromString(
        `<div>${text}</div>`,
        "text/html"
    );

    const root = doc.body.firstElementChild;

    if (!root) {
        container.innerHTML = "";
        return;
    }


    /* =====================================================
       STEP 9 — SANITIZE GENERATED HTML
    ===================================================== */

    sanitizeAIHTML(root);


    /* =====================================================
       STEP 10 — AUTO LINK PLAIN URLs
    ===================================================== */

    linkifyTextNodes(root);


    /* =====================================================
       STEP 11 — CREATE FINAL AI UI
    ===================================================== */

    container.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "ai-answer-wrapper";


    /* =====================================================
       STEP 12 — PROCESS EACH ELEMENT
    ===================================================== */

    Array.from(root.childNodes).forEach(function (node) {

        /* -----------------------------------------------
           TEXT NODE
        ----------------------------------------------- */

        if (node.nodeType === Node.TEXT_NODE) {

            const value = node.textContent.trim();

            if (!value) return;

            const p = document.createElement("p");

            p.className = "ai-answer-text";

            p.textContent = value;

            wrapper.appendChild(p);

            return;
        }


        /* -----------------------------------------------
           H1 — MAIN HEADING
        ----------------------------------------------- */

        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.tagName === "H1"
        ) {

            const section =
                document.createElement("div");

            section.className =
                "ai-main-heading";

            section.appendChild(
                node.cloneNode(true)
            );

            wrapper.appendChild(section);

            return;
        }


        /* -----------------------------------------------
           H3 — SUB HEADING
        ----------------------------------------------- */

        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.tagName === "H3"
        ) {

            const section =
                document.createElement("div");

            section.className =
                "ai-section-heading";

            section.appendChild(
                node.cloneNode(true)
            );

            wrapper.appendChild(section);

            return;
        }


        /* -----------------------------------------------
           PARAGRAPH
        ----------------------------------------------- */

        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.tagName === "P"
        ) {

            const card =
                document.createElement("div");

            card.className =
                "ai-info-card";

            card.appendChild(
                node.cloneNode(true)
            );

            wrapper.appendChild(card);

            return;
        }


        /* -----------------------------------------------
           LISTS
        ----------------------------------------------- */

        if (
            node.nodeType === Node.ELEMENT_NODE &&
            (
                node.tagName === "UL" ||
                node.tagName === "OL"
            )
        ) {

            const listCard =
                document.createElement("div");

            listCard.className =
                "ai-list-card";

            listCard.appendChild(
                node.cloneNode(true)
            );

            wrapper.appendChild(listCard);

            return;
        }


        /* -----------------------------------------------
           BLOCKQUOTE
        ----------------------------------------------- */

        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.tagName === "BLOCKQUOTE"
        ) {

            const quote =
                document.createElement("div");

            quote.className =
                "ai-quote";

            quote.appendChild(
                node.cloneNode(true)
            );

            wrapper.appendChild(quote);

            return;
        }


        /* -----------------------------------------------
           LINKS / OTHER SAFE ELEMENTS
        ----------------------------------------------- */

        if (
            node.nodeType === Node.ELEMENT_NODE
        ) {

            const generic =
                document.createElement("div");

            generic.className =
                "ai-content-block";

            generic.appendChild(
                node.cloneNode(true)
            );

            wrapper.appendChild(generic);
        }
    });


    /* =====================================================
       STEP 13 — RELATED OFFICIAL LINKS
    ===================================================== */

    if (
        Array.isArray(sources) &&
        sources.length > 0
    ) {

        const validSources =
            sources.filter(function (source) {

                return (
                    source &&
                    typeof source.url === "string" &&
                    safeURL(source.url)
                );
            });


        if (validSources.length > 0) {

            const linksSection =
                document.createElement("div");

            linksSection.className =
                "ai-related-links";


            const heading =
                document.createElement("h3");

            heading.textContent =
                "Related Official Links";

            linksSection.appendChild(
                heading
            );


            const linksGrid =
                document.createElement("div");

            linksGrid.className =
                "ai-links-grid";


            validSources.forEach(function (source) {

                const url =
                    safeURL(source.url);

                if (!url) return;


                const linkCard =
                    document.createElement("a");

                linkCard.href = url;

                linkCard.target = "_blank";

                linkCard.rel =
                    "noopener noreferrer";

                linkCard.className =
                    "ai-source-card";


                const title =
                    source.title ||
                    source.name ||
                    source.label ||
                    "Open Official Link";


                linkCard.innerHTML = `
                    <div class="ai-source-title">
                        ${title}
                    </div>

                    <div class="ai-source-url">
                        ${url}
                    </div>

                    <div class="ai-source-arrow">
                        ↗
                    </div>
                `;


                linksGrid.appendChild(
                    linkCard
                );
            });


            linksSection.appendChild(
                linksGrid
            );

            wrapper.appendChild(
                linksSection
            );
        }
    }


    /* =====================================================
       STEP 14 — APPEND TO CONTAINER
    ===================================================== */

    container.appendChild(wrapper);


    /* =====================================================
       STEP 15 — ADD ANIMATION
    ===================================================== */

    requestAnimationFrame(function () {

        wrapper.classList.add(
            "ai-answer-visible"
        );

    });
}


/* =========================================================
   ESCAPE REGEX
========================================================= */

function escapeRegex(value) {

    return String(value).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}


/* =========================================================
   SAFE URL
========================================================= */

function safeURL(url) {

    try {

        const parsed = new URL(
            String(url),
            window.location.href
        );

        if (
            parsed.protocol !== "http:" &&
            parsed.protocol !== "https:"
        ) {
            return "";
        }

        return parsed.href;

    } catch (error) {

        return "";
    }
}


/* =========================================================
   SANITIZE AI HTML
========================================================= */

function sanitizeAIHTML(root) {

    if (!root) return;


    /* =====================================================
       ALLOWED TAGS
    ===================================================== */

    const allowedTags = new Set([
        "DIV",
        "P",
        "BR",
        "STRONG",
        "B",
        "EM",
        "I",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "UL",
        "OL",
        "LI",
        "A",
        "BLOCKQUOTE",
        "CODE",
        "PRE",
        "SPAN"
    ]);


    /* =====================================================
       REMOVE DANGEROUS ELEMENTS
    ===================================================== */

    root.querySelectorAll("*").forEach(function (element) {

        if (!allowedTags.has(element.tagName)) {

            element.replaceWith(
                document.createTextNode(
                    element.textContent || ""
                )
            );

            return;
        }


        /* =================================================
           REMOVE DANGEROUS ATTRIBUTES
        ================================================= */

        Array.from(element.attributes).forEach(
            function (attribute) {

                const name =
                    attribute.name.toLowerCase();

                if (
                    name.startsWith("on") ||
                    name === "style" ||
                    name === "srcdoc" ||
                    name === "formaction"
                ) {

                    element.removeAttribute(
                        attribute.name
                    );
                }
            }
        );


        /* =================================================
           HANDLE LINKS
        ================================================= */

        if (element.tagName === "A") {

            const href =
                element.getAttribute("href") || "";

            const safe =
                safeURL(href);

            if (!safe) {

                element.replaceWith(
                    document.createTextNode(
                        element.textContent || ""
                    )
                );

                return;
            }


            element.setAttribute(
                "href",
                safe
            );

            element.setAttribute(
                "target",
                "_blank"
            );

            element.setAttribute(
                "rel",
                "noopener noreferrer"
            );

            element.classList.add(
                "ai-link"
            );
        }
    });
}/* =========================================================
   LINKIFY PLAIN URLS
========================================================= */

function linkifyTextNodes(root) {

    if (!root) return;

    const walker =
        document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT
        );

    const nodes = [];

    let currentNode;

    while (
        currentNode =
            walker.nextNode()
    ) {
        nodes.push(currentNode);
    }


    nodes.forEach(function (node) {

        const parent =
            node.parentElement;

        if (!parent) return;


        /* -----------------------------------------------
           DON'T MODIFY EXISTING LINKS
        ----------------------------------------------- */

        if (
            parent.closest("a") ||
            parent.closest("code") ||
            parent.closest("pre")
        ) {
            return;
        }


        const text =
            node.textContent || "";


        /* -----------------------------------------------
           FIND HTTP / HTTPS URLS
        ----------------------------------------------- */

        const urlRegex =
            /(https?:\/\/[^\s<>"']+)/gi;


        if (!urlRegex.test(text)) {
            return;
        }


        urlRegex.lastIndex = 0;


        const fragment =
            document.createDocumentFragment();

        let lastIndex = 0;

        let match;


        while (
            (match = urlRegex.exec(text)) !== null
        ) {

            const rawURL =
                match[0];


            /*
             * Remove punctuation that commonly appears
             * after URLs in AI-generated text.
             */

            let cleanURL =
                rawURL.replace(
                    /[.,!?;:)\]}]+$/g,
                    ""
                );


            const safe =
                safeURL(cleanURL);


            if (!safe) {
                continue;
            }


            /* Text before URL */

            if (match.index > lastIndex) {

                fragment.appendChild(
                    document.createTextNode(
                        text.slice(
                            lastIndex,
                            match.index
                        )
                    )
                );
            }


            /* Clickable URL */

            const link =
                document.createElement("a");

            link.href = safe;

            link.target = "_blank";

            link.rel =
                "noopener noreferrer";

            link.className =
                "ai-link";

            link.textContent =
                cleanURL;


            fragment.appendChild(link);


            lastIndex =
                match.index +
                rawURL.length;
        }


        /* Remaining text */

        if (lastIndex < text.length) {

            fragment.appendChild(
                document.createTextNode(
                    text.slice(lastIndex)
                )
            );
        }


        node.parentNode.replaceChild(
            fragment,
            node
        );
    });
}


/* =========================================================
   PROFILE TEXT
========================================================= */

function buildProfileText() {

    const parts = [];


    if (userProfile.age) {
        parts.push(
            `Age: ${userProfile.age}`
        );
    }


    if (userProfile.college) {
        parts.push(
            `College: ${userProfile.college}`
        );
    }


    if (userProfile.degree) {
        parts.push(
            `Degree: ${userProfile.degree}`
        );
    }


    if (userProfile.branch) {
        parts.push(
            `Branch: ${userProfile.branch}`
        );
    }


    if (userProfile.year) {
        parts.push(
            `Year: ${userProfile.year}`
        );
    }


    if (userProfile.semester) {
        parts.push(
            `Semester: ${userProfile.semester}`
        );
    }


    if (userProfile.location) {
        parts.push(
            `Location: ${userProfile.location}`
        );
    }


    if (userProfile.academic) {
        parts.push(
            `Academic: ${userProfile.academic}`
        );
    }


    if (userProfile.category) {
        parts.push(
            `Category: ${userProfile.category}`
        );
    }


    return parts.join(" • ");
}


/* =========================================================
   DETAIL BOX
========================================================= */

function detailBox(label, value) {

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return "";
    }


    return `
        <div class="detail-box">

            <div class="detail-label">
                ${escapeHTML(label)}
            </div>

            <div class="detail-value">
                ${escapeHTML(value)}
            </div>

        </div>
    `;
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   RENDER SOURCES
========================================================= */

function renderSources(sources, container) {

    if (
        !Array.isArray(sources) ||
        sources.length === 0 ||
        !container
    ) {
        return;
    }


    const validSources =
        sources.filter(function (source) {

            return (
                source &&
                typeof source.url === "string" &&
                safeURL(source.url)
            );
        });


    if (validSources.length === 0) {
        return;
    }


    const section =
        document.createElement("div");

    section.className =
        "sources-section";


    const heading =
        document.createElement("h3");

    heading.textContent =
        "Sources";


    section.appendChild(
        heading
    );


    const sourceList =
        document.createElement("div");

    sourceList.className =
        "sources-list";


    validSources.forEach(
        function (source) {

            const url =
                safeURL(source.url);

            if (!url) return;


            const sourceLink =
                document.createElement("a");

            sourceLink.href = url;

            sourceLink.target = "_blank";

            sourceLink.rel =
                "noopener noreferrer";

            sourceLink.className =
                "source-link";


            const title =
                source.title ||
                source.name ||
                source.label ||
                url;


            sourceLink.innerHTML = `
                <span class="source-link-title">
                    ${escapeHTML(title)}
                </span>

                <span class="source-link-url">
                    ${escapeHTML(url)}
                </span>

                <span class="source-link-arrow">
                    ↗
                </span>
            `;


            sourceList.appendChild(
                sourceLink
            );
        }
    );


    section.appendChild(
        sourceList
    );


    container.appendChild(
        section
    );
}


/* =========================================================
   ERROR HANDLING
========================================================= */

function renderError(error) {

    const overlay =
        document.getElementById(
            "resultOverlay"
        );

    const content =
        document.getElementById(
            "resultContent"
        );

    if (!overlay || !content) {
        return;
    }


    let message =
        "Something went wrong while finding your benefits.";


    if (
        error &&
        error.name === "AbortError"
    ) {

        message =
            "The request took too long. Please try again.";
    }

    else if (
        error &&
        error.message
    ) {

        message =
            error.message;
    }


    content.innerHTML = `
        <div class="error-result">

            <div class="error-icon">
                !
            </div>

            <h3>
                Unable to load results
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                type="button"
                class="retry-button"
                onclick="closeResults(); discoverBenefits();"
            >
                Try Again
            </button>

        </div>
    `;


    overlay.classList.add("show");

    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CLOSE RESULTS
========================================================= */

function closeResults() {

    const overlay =
        document.getElementById(
            "resultOverlay"
        );

    if (overlay) {

        overlay.classList.remove(
            "show"
        );
    }


    document.body.style.overflow =
        "";


    if (abortController) {

        try {
            abortController.abort();
        }

        catch (error) {
            console.warn(error);
        }

        abortController = null;
    }
}


/* =========================================================
   CLOSE RESULTS ON BACKDROP CLICK
========================================================= */

const resultOverlay =
    document.getElementById(
        "resultOverlay"
    );


if (resultOverlay) {

    resultOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                resultOverlay
            ) {

                closeResults();
            }
        }
    );
}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeResults();
        }
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Make sure the page starts at the top.
         */

        window.scrollTo({
            top: 0,
            behavior: "auto"
        });


        /*
         * Profile button
         */

        const profileButton =
            document.getElementById(
                "useProfileBtn"
            );


        if (profileButton) {

            profileButton.addEventListener(
                "click",
                useProfile
            );
        }


        /*
         * Discovery button
         */

        const discoverButton =
            document.getElementById(
                "discoverBtn"
            );


        if (discoverButton) {

            discoverButton.addEventListener(
                "click",
                discoverBenefits
            );
        }


        /*
         * Result close button
         */

        const closeButton =
            document.getElementById(
                "closeResultsBtn"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeResults
            );
        }


        /*
         * Category cards
         */

        document
            .querySelectorAll(
                ".category-card"
            )
            .forEach(function (card) {

                card.addEventListener(
                    "click",
                    function () {

                        selectCategory(
                            card
                        );
                    }
                );
            });


        /*
         * Situation input:
         * Ctrl + Enter / Cmd + Enter
         * can start discovery.
         */

        const situationInput =
            document.getElementById(
                "situationInput"
            );


        if (situationInput) {

            situationInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" &&
                        (event.ctrlKey ||
                         event.metaKey)
                    ) {

                        event.preventDefault();

                        discoverBenefits();
                    }
                }
            );
        }
    }
);/* =========================================================
   GET ELEMENT
========================================================= */

function getElement(id) {

    return document.getElementById(id);
}


/* =========================================================
   SAFE JSON PARSE
========================================================= */

function safeJSONParse(value, fallback = null) {

    try {

        return JSON.parse(value);

    } catch (error) {

        return fallback;
    }
}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    const number =
        Number(
            String(value)
                .replace(/[₹,\s]/g, "")
        );

    if (Number.isNaN(number)) {
        return String(value);
    }

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(number);
}


/* =========================================================
   CLOSE RESULTS
========================================================= */

function closeResults() {

    const results =
        document.getElementById(
            "results"
        );

    if (!results) return;

    results.classList.remove(
        "show"
    );

    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            const modal =
                document.querySelector(
                    ".modal.active"
                );

            if (modal) {

                modal.classList.remove(
                    "active"
                );
            }
        }
    }
);


/* =========================================================
   SCHOLARSHIP FORMATTER
========================================================= */

function formatScholarshipData(
    scholarship
) {

    if (!scholarship) {
        return "";
    }

    let html = "";


    /* =====================================================
       SCHOLARSHIP NAME
    ===================================================== */

    if (
        scholarship.name ||
        scholarship.title
    ) {

        html += `
            <h3>
                ${safeText(
                    scholarship.name ||
                    scholarship.title
                )}
            </h3>
        `;
    }


    /* =====================================================
       PROVIDER
    ===================================================== */

    if (
        scholarship.provider ||
        scholarship.organization
    ) {

        html += `
            <div class="detail-box">
                <strong>Provider</strong>
                <p>
                    ${safeText(
                        scholarship.provider ||
                        scholarship.organization
                    )}
                </p>
            </div>
        `;
    }


    /* =====================================================
       ELIGIBILITY
    ===================================================== */

    if (
        scholarship.eligibility
    ) {

        html += `
            <div class="detail-box">
                <strong>Eligibility</strong>
                <p>
                    ${safeText(
                        scholarship.eligibility
                    )}
                </p>
            </div>
        `;
    }


    /* =====================================================
       AMOUNT
    ===================================================== */

    if (
        scholarship.amount ||
        scholarship.benefit
    ) {

        html += `
            <div class="detail-box">
                <strong>Benefit</strong>
                <p>
                    ${safeText(
                        scholarship.amount ||
                        scholarship.benefit
                    )}
                </p>
            </div>
        `;
    }


    /* =====================================================
       DEADLINE
    ===================================================== */

    if (
        scholarship.deadline
    ) {

        html += `
            <div class="detail-box">
                <strong>Deadline</strong>
                <p>
                    ${safeText(
                        scholarship.deadline
                    )}
                </p>
            </div>
        `;
    }


    /* =====================================================
       DESCRIPTION
    ===================================================== */

    if (
        scholarship.description
    ) {

        html += `
            <div class="detail-box">
                <strong>Description</strong>
                <p>
                    ${safeText(
                        scholarship.description
                    )}
                </p>
            </div>
        `;
    }


    /* =====================================================
       URL
    ===================================================== */

    if (
        scholarship.url
    ) {

        const url =
            safeURL(
                scholarship.url
            );

        if (url) {

            html += `
                <div class="detail-box">
                    <strong>Official Website</strong>

                    <p>
                        <a
                            href="${url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="ai-link"
                        >
                            Open Official Website ↗
                        </a>
                    </p>
                </div>
            `;
        }
    }


    return html;
}


/* =========================================================
   FORMAT SCHOLARSHIP LIST
========================================================= */

function renderScholarshipList(
    scholarships,
    container
) {

    if (
        !container ||
        !Array.isArray(scholarships)
    ) {
        return;
    }

    container.innerHTML = "";

    scholarships.forEach(
        function (scholarship) {

            if (!scholarship) {
                return;
            }

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "scholarship-card";

            const title =
                scholarship.name ||
                scholarship.title ||
                "Scholarship";

            card.innerHTML = `
                <h3>
                    ${safeText(title)}
                </h3>

                ${formatScholarshipData(
                    scholarship
                )}
            `;

            container.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   FORMAT GENERIC BENEFIT
========================================================= */

function formatBenefit(
    benefit
) {

    if (!benefit) {
        return "";
    }

    const title =
        benefit.title ||
        benefit.name ||
        "Benefit";

    const description =
        benefit.description ||
        benefit.details ||
        "";

    let html = `
        <div class="benefit-card">

            <h3>
                ${safeText(title)}
            </h3>
    `;

    if (description) {

        html += `
            <p>
                ${safeText(
                    description
                )}
            </p>
        `;
    }

    if (benefit.url) {

        const url =
            safeURL(
                benefit.url
            );

        if (url) {

            html += `
                <a
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ai-link"
                >
                    View Details ↗
                </a>
            `;
        }
    }

    html += `
        </div>
    `;

    return html;
}


/* =========================================================
   RENDER BENEFIT LIST
========================================================= */

function renderBenefitList(
    benefits,
    container
) {

    if (
        !container ||
        !Array.isArray(benefits)
    ) {
        return;
    }

    container.innerHTML = "";

    benefits.forEach(
        function (benefit) {

            const html =
                formatBenefit(
                    benefit
                );

            if (!html) {
                return;
            }

            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.innerHTML =
                html;

            container.appendChild(
                wrapper.firstElementChild
            );
        }
    );
}


/* =========================================================
   FINAL INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Existing page initialization
         * remains handled by the original
         * event listeners above.
         */


        /* Prepare already-rendered links */

        const aiContainers =
            document.querySelectorAll(
                ".ai-answer, #aiAnswer, .ai-content"
            );

        aiContainers.forEach(
            function (container) {

                prepareAIContent(
                    container
                );
            }
        );
    }
);


/* =========================================================
   END OF NEXTSTEP JAVASCRIPT
========================================================= */