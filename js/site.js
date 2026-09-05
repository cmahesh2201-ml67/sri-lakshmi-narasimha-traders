document.addEventListener("DOMContentLoaded", function () {
    var revealItems = document.querySelectorAll("section, .product-card, .brand-card, .gallery-item, .why-card, .contact-card, .service-area-card");

    revealItems.forEach(function (item) {
        item.classList.add("reveal");
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
    }

    var observer = new IntersectionObserver(function (entries, currentObserver) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
        observer.observe(item);
    });

    var gardenTrigger = document.querySelector(".garden-product-trigger");
    var gardenDetails = document.querySelector("#garden-details");
    if (gardenTrigger && gardenDetails) {
        var gardenSizeOptions = gardenDetails.querySelectorAll(".garden-size-option");
        var gardenTypeCards = gardenDetails.querySelectorAll(".garden-type-card");
        var gardenSelectedSize = gardenDetails.querySelector(".garden-selected-size");

        function selectGardenSize(size) {
            gardenSizeOptions.forEach(function (option) {
                var isSelected = option.dataset.size === size;
                option.classList.toggle("is-selected", isSelected);
                option.setAttribute("aria-pressed", String(isSelected));
            });
            gardenSelectedSize.textContent = size.charAt(0).toUpperCase() + size.slice(1) + " Garden Pipe";
            gardenTypeCards.forEach(function (card) {
                var isVisible = card.dataset.size === size;
                card.hidden = !isVisible;
                card.classList.toggle("is-selected", isVisible && card.dataset.type === "Braided");
            });
        }

        function selectGardenType(card) {
            gardenTypeCards.forEach(function (typeCard) {
                typeCard.classList.toggle("is-selected", typeCard === card);
            });
        }

        function openGardenDetails() {
            gardenDetails.hidden = false;
            gardenTrigger.setAttribute("aria-expanded", "true");
            gardenDetails.classList.add("is-open");
            document.body.classList.add("tank-modal-open");
        }

        function closeGardenDetails() {
            gardenDetails.classList.remove("is-open");
            gardenDetails.hidden = true;
            gardenTrigger.setAttribute("aria-expanded", "false");
            document.body.classList.remove("tank-modal-open");
            gardenTrigger.focus();
        }

        gardenTrigger.addEventListener("click", openGardenDetails);
        gardenTrigger.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openGardenDetails();
            }
        });
        gardenDetails.querySelector(".garden-details-close").addEventListener("click", closeGardenDetails);
        gardenDetails.addEventListener("click", function (event) {
            if (event.target === gardenDetails) {
                closeGardenDetails();
            }
        });
        gardenSizeOptions.forEach(function (option) {
            option.addEventListener("click", function () {
                selectGardenSize(option.dataset.size);
            });
        });
        gardenTypeCards.forEach(function (card) {
            card.addEventListener("click", function (event) {
                if (!event.target.closest(".garden-enquire")) {
                    selectGardenType(card);
                }
            });
            card.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectGardenType(card);
                }
            });
            card.querySelector(".garden-enquire").addEventListener("click", function () {
                var message = "Hello, I am interested in the " + card.dataset.size + " " + card.dataset.type + " Garden Pipe. Please provide the price and availability.";
                window.open("https://api.whatsapp.com/send?phone=919398945294&text=" + encodeURIComponent(message), "_blank", "noopener");
            });
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !gardenDetails.hidden) {
                closeGardenDetails();
            }
        });
    }

    var valvesTrigger = document.querySelector(".valves-product-trigger");
    var valvesDetails = document.querySelector("#valves-details");
    if (valvesTrigger && valvesDetails) {
        var valvesView = valvesDetails.querySelector("#valves-view");
        var valvesBreadcrumb = valvesDetails.querySelector("#valves-breadcrumb");
        var valvesTitle = valvesDetails.querySelector("#valves-details-title");
        var valvesIntro = valvesDetails.querySelector("#valves-details-intro");
        var valveState = { level: "root", material: "", handle: "", brand: "" };
        var pvcSizes = [["1/2 inch", "20 mm"], ["3/4 inch", "25 mm"], ["1 inch", "32 mm"], ["1 1/4 inch", "40 mm"], ["1 1/2 inch", "50 mm"], ["2 inch", "63 mm"], ["2 1/2 inch", "75 mm"], ["3 inch", "90 mm"], ["4 inch", "110 mm"]];
        var upvcSizes = [["1/2 inch", "20 mm"], ["3/4 inch", "25 mm"], ["1 inch", "32 mm"]];
        var cpvcSizes = [["3/4 inch", "20 mm"], ["1 inch", "25 mm"]];
        var footSizes = [["3/4 inch", "20 mm"], ["1 inch", "25 mm"], ["1 1/4 inch", "32 mm"], ["1 1/2 inch", "40 mm"], ["2 inch", "50 mm"], ["2 1/2 inch", "63 mm"], ["3 inch", "75 mm"], ["4 inch", "110 mm"]];

        function valveOption(label, value, image, alt) {
            return '<button class="valve-option-card" type="button" data-action="' + value + '"><span class="valve-option-image"><img src="' + image + '" alt="' + alt + '"></span><strong>' + label + '</strong><span class="valve-option-cta">Select &rarr;</span></button>';
        }

        function valveBack(level) {
            return '<button class="valve-back" type="button" data-action="' + level + '">&larr; Back</button>';
        }

        function valveSizeCards(sizes, productName, image) {
            return '<div class="valve-size-grid">' + sizes.map(function (size) {
                var label = productName + ", " + size[0] + " (" + size[1] + ")";
                return '<article class="valve-size-card"><div class="valve-size-image"><img src="' + image + '" alt="' + label + '"></div><h4>' + size[0] + '</h4><p>' + size[1] + '</p><button class="btn primary-btn valve-enquire" type="button" data-product="' + productName + '" data-size="' + size[0] + '" data-mm="' + size[1] + '">Enquire Now</button></article>';
            }).join("") + '</div>';
        }

        function renderValves() {
            var breadcrumb = ["Valves"];
            if (valveState.material) { breadcrumb.push(valveState.material); }
            if (valveState.handle) { breadcrumb.push(valveState.handle); }
            if (valveState.brand) { breadcrumb.push(valveState.brand); }
            valvesBreadcrumb.textContent = breadcrumb.join("  ");

            valvesBreadcrumb.textContent = breadcrumb.join(" > ");
            if (valveState.level === "root") {
                valvesTitle.textContent = "Valves";
                valvesIntro.textContent = "Select a valve category to view the available products.";
                valvesView.innerHTML = '<div class="valve-option-grid">' + valveOption("Ball Valves", "ball", "images/ball valves .jpg", "Ball Valves") + valveOption("Foot Valves", "foot", "images/foot valves.jpg", "Foot Valves") + '</div>';
                return;
            }

            if (valveState.level === "ball") {
                valvesTitle.textContent = "Ball Valves";
                valvesIntro.textContent = "Choose a material to view its valve options.";
                valvesView.innerHTML = valveBack("root") + '<div class="valve-option-grid">' + valveOption("PVC Ball Valves", "pvc", "images/ball valves .jpg", "PVC Ball Valve") + valveOption("UPVC Ball Valves", "upvc", "images/upvc ball valves.jpg", "UPVC Ball Valve") + valveOption("CPVC Ball Valves", "cpvc", "images/cpvc ball valve.jpg", "CPVC Ball Valve") + '</div>';
                return;
            }

            if (valveState.level === "pvc" || valveState.level === "upvc") {
                var materialName = valveState.level.toUpperCase();
                valvesTitle.textContent = materialName + " Ball Valves";
                valvesIntro.textContent = "Select a handle type to view the available sizes.";
                var singleImage = valveState.level === "pvc" ? "images/single hand ballvalves.jpg" : "images/upvc single hand.jpg";
                var doubleImage = valveState.level === "pvc" ? "images/double hand ball valves.jpg" : "images/upvc ball valves.jpg";
                valvesView.innerHTML = valveBack("ball") + '<div class="valve-option-grid">' + valveOption("Single Handle Ball Valve", "single", singleImage, materialName + " Single Handle Ball Valve") + valveOption("Double Handle Ball Valve", "double", doubleImage, materialName + " Double Handle Ball Valve") + '</div>';
                return;
            }

            if (valveState.level === "single" || valveState.level === "double") {
                var selectedHandle = valveState.handle;
                var selectedMaterial = valveState.material.toUpperCase();
                var sizeList = selectedMaterial === "PVC" ? pvcSizes : upvcSizes;
                var sizeImage = selectedMaterial === "PVC" ? (selectedHandle === "Single Handle" ? "images/single hand ballvalves.jpg" : "images/double hand ball valves.jpg") : (selectedHandle === "Single Handle" ? "images/upvc single hand.jpg" : "images/upvc ball valves.jpg");
                valvesTitle.textContent = selectedMaterial + " " + selectedHandle + " Ball Valve";
                valvesIntro.textContent = "Select a size to send an enquiry.";
                valvesView.innerHTML = valveBack(valveState.material.toLowerCase()) + valveSizeCards(sizeList, selectedMaterial + " " + selectedHandle + " Ball Valve", sizeImage);
                return;
            }

            if (valveState.level === "cpvc") {
                valvesTitle.textContent = "CPVC Ball Valves";
                valvesIntro.textContent = "Select a brand to view the available sizes.";
                valvesView.innerHTML = valveBack("ball") + '<div class="valve-option-grid valve-brand-grid">' + valveOption("Nandi", "nandi", "images/cpvc ball valve.jpg", "Nandi CPVC Ball Valve") + valveOption("Ashirvad", "ashirvad", "images/cpvc ball valve.jpg", "Ashirvad CPVC Ball Valve") + valveOption("Vaari", "vaari", "images/cpvc ball valve.jpg", "Vaari CPVC Ball Valve") + '</div>';
                return;
            }

            if (valveState.level === "brand") {
                valvesTitle.textContent = "CPVC " + valveState.brand + " Ball Valve";
                valvesIntro.textContent = "Select a size to send an enquiry.";
                valvesView.innerHTML = valveBack("cpvc") + valveSizeCards(cpvcSizes, "CPVC Ball Valve, " + valveState.brand + " brand", "images/cpvc ball valve.jpg");
                return;
            }

            if (valveState.level === "foot") {
                valvesTitle.textContent = "Foot Valves";
                valvesIntro.textContent = "Select a size to send an enquiry.";
                valvesView.innerHTML = valveBack("root") + valveSizeCards(footSizes, "Foot Valve", "images/foot valves.jpg");
            }
        }

        function openValvesDetails() {
            valveState = { level: "root", material: "", handle: "", brand: "" };
            renderValves();
            valvesDetails.hidden = false;
            valvesTrigger.setAttribute("aria-expanded", "true");
            valvesDetails.classList.add("is-open");
            document.body.classList.add("tank-modal-open");
        }

        function closeValvesDetails() {
            valvesDetails.classList.remove("is-open");
            valvesDetails.hidden = true;
            valvesTrigger.setAttribute("aria-expanded", "false");
            document.body.classList.remove("tank-modal-open");
            valvesTrigger.focus();
        }

        valvesTrigger.addEventListener("click", openValvesDetails);
        valvesTrigger.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openValvesDetails();
            }
        });
        valvesDetails.querySelector(".valves-details-close").addEventListener("click", closeValvesDetails);
        valvesDetails.addEventListener("click", function (event) {
            var actionElement = event.target.closest("[data-action]");
            if (actionElement) {
                var action = actionElement.dataset.action;
                if (action === "root") { valveState = { level: "root", material: "", handle: "", brand: "" }; }
                if (action === "ball") { valveState = { level: "ball", material: "", handle: "", brand: "" }; }
                if (action === "foot") { valveState = { level: "foot", material: "", handle: "", brand: "" }; }
                if (action === "pvc" || action === "upvc") { valveState = { level: action, material: action, handle: "", brand: "" }; }
                if (action === "cpvc") { valveState = { level: "cpvc", material: "CPVC", handle: "", brand: "" }; }
                if (action === "single" || action === "double") { valveState.level = action; valveState.handle = action === "single" ? "Single Handle" : "Double Handle"; }
                if (action === "nandi" || action === "ashirvad" || action === "vaari") { valveState.level = "brand"; valveState.brand = action.charAt(0).toUpperCase() + action.slice(1); }
                renderValves();
                return;
            }
            if (event.target === valvesDetails) { closeValvesDetails(); }
        });
        valvesDetails.addEventListener("click", function (event) {
            var enquireButton = event.target.closest(".valve-enquire");
            if (!enquireButton) { return; }
            var product = enquireButton.dataset.product;
            var message = product === "Foot Valve"
                ? "Hello, I am interested in the " + enquireButton.dataset.size + " (" + enquireButton.dataset.mm + ") Foot Valve. Please provide the price and availability."
                : "Hello, I am interested in the " + product + ", " + enquireButton.dataset.size + " (" + enquireButton.dataset.mm + "). Please provide the price and availability.";
            window.open("https://api.whatsapp.com/send?phone=919398945294&text=" + encodeURIComponent(message), "_blank", "noopener");
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !valvesDetails.hidden) { closeValvesDetails(); }
        });
    }

    var tankTrigger = document.querySelector(".tank-product-trigger");
    var tankDetails = document.querySelector("#tank-details");
    if (tankTrigger && tankDetails) {
        function openTankDetails() {
            tankDetails.hidden = false;
            tankTrigger.setAttribute("aria-expanded", "true");
            tankDetails.classList.add("is-open");
            document.body.classList.add("tank-modal-open");
        }

        function closeTankDetails() {
            tankDetails.classList.remove("is-open");
            tankDetails.hidden = true;
            tankTrigger.setAttribute("aria-expanded", "false");
            document.body.classList.remove("tank-modal-open");
            tankTrigger.focus();
        }

        tankTrigger.addEventListener("click", openTankDetails);
        tankTrigger.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openTankDetails();
            }
        });
        tankDetails.querySelector(".tank-details-close").addEventListener("click", closeTankDetails);
        tankDetails.addEventListener("click", function (event) {
            if (event.target === tankDetails) {
                closeTankDetails();
            }
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !tankDetails.hidden) {
                closeTankDetails();
            }
        });
    }

    var suctionTrigger = document.querySelector(".suction-product-trigger");
    var suctionDetails = document.querySelector("#suction-details");
    if (suctionTrigger && suctionDetails) {
        function openSuctionDetails() {
            suctionDetails.hidden = false;
            suctionTrigger.setAttribute("aria-expanded", "true");
            suctionDetails.classList.add("is-open");
            document.body.classList.add("tank-modal-open");
        }

        function closeSuctionDetails() {
            suctionDetails.classList.remove("is-open");
            suctionDetails.hidden = true;
            suctionTrigger.setAttribute("aria-expanded", "false");
            document.body.classList.remove("tank-modal-open");
            suctionTrigger.focus();
        }

        suctionTrigger.addEventListener("click", openSuctionDetails);
        suctionTrigger.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openSuctionDetails();
            }
        });
        suctionDetails.querySelector(".suction-details-close").addEventListener("click", closeSuctionDetails);
        suctionDetails.addEventListener("click", function (event) {
            if (event.target === suctionDetails) {
                closeSuctionDetails();
            }
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !suctionDetails.hidden) {
                closeSuctionDetails();
            }
        });
    }

    document.querySelectorAll(".tank-detail-card").forEach(function (card) {
        card.querySelector(".tank-enquire").addEventListener("click", function () {
            var capacity = card.dataset.capacity;
            var message = capacity === "5000"
                ? "Hello, I am interested in the 5000 litre ISI water tank for a government/project requirement. Please provide the price and availability."
                : "Hello, I am interested in the " + capacity + " litre water tank, 6 layer, White. Please provide the price and availability.";
            window.open("https://api.whatsapp.com/send?phone=919398945294&text=" + encodeURIComponent(message), "_blank", "noopener");
        });
    });

    document.querySelectorAll(".suction-detail-card").forEach(function (card) {
        card.querySelector(".suction-enquire").addEventListener("click", function () {
            var message = "Hello, I am interested in the " + card.dataset.inch + " (" + card.dataset.mm + ") Suction Pipe. Please provide the price and availability.";
            window.open("https://api.whatsapp.com/send?phone=919398945294&text=" + encodeURIComponent(message), "_blank", "noopener");
        });
    });
});