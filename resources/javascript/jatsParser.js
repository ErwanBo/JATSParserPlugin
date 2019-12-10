// Navigation inside an article

(function () {
	var navbar = document.getElementById("jatsParser__navbarItems");
	var sectionTitles = document.getElementsByClassName("article-section-title");

	var hasSubtitles = 0;
	var intranav;

	for (var i = 0; i < sectionTitles.length; i++) {
		var sectionTitle = sectionTitles.item(i);

		if (sectionTitle.tagName === "H2") {
			sectionTitle.setAttribute("id", "title-" + i);
			var newNavItem = document.createElement("A");
			newNavItem.setAttribute("class", "jatsParser__nav-link");
			newNavItem.setAttribute("href", "#title-" + i);
			var newNavItemText = document.createTextNode(sectionTitle.textContent);
			newNavItem.appendChild(newNavItemText);
			navbar.appendChild(newNavItem);
			hasSubtitles = 0;
		} else if (sectionTitle.tagName === "H3") {
			hasSubtitles++;
			sectionTitle.setAttribute("id", "title-" + i);

			if (hasSubtitles === 1) {
				intranav = document.createElement("NAV");
				intranav.setAttribute("class", "jatsParser__subnavbar-items");
				navbar.appendChild(intranav);
			}

			var newSubNavItem = document.createElement("A");
			newSubNavItem.setAttribute("class", "jatsParser__subnav-link");
			newSubNavItem.setAttribute("href", "#title-" + i);
			var newSubNavItemText = document.createTextNode(sectionTitle.textContent);
			newSubNavItem.appendChild(newSubNavItemText);
			intranav.appendChild(newSubNavItem);
		}
	}

})();

// Show author affiliation under authors list on click

(function () {

	var authorStrings = document.getElementsByClassName("jatsParser__meta-author-string-href");
	for (var i = 0; i < authorStrings.length; i++) {
		var authorString = authorStrings.item(i);
		authorString.addEventListener("click", function (event) {
			event.preventDefault();
			var elementId = this.getAttribute("href").replace("#", "");

			var authorsDetails = document.getElementsByClassName("jatsParser__details-author");
			for (var y = 0; y < authorsDetails.length; y++) {
				var authorsDetail = authorsDetails.item(y);

				if (authorsDetail.getAttribute("id") === ("jatsParser__" + elementId) && authorsDetail.classList.contains("jatsParser__hideAuthor")) {
					authorsDetail.classList.remove("jatsParser__hideAuthor");
				} else {
					authorsDetail.classList.add("jatsParser__hideAuthor");
				}
			}

			for (var x = 0; x < authorStrings.length; x++) {
				var authorString2 = authorStrings.item(x);

				if (authorString2.getAttribute("href") === ("#" + elementId) && !authorString2.classList.contains("active")) {
					authorString2.classList.add("active");
					for (var z = 0; z < authorString2.childNodes.length; z++) {
						var authorString2Child = authorString2.childNodes[z];
						if (authorString2Child.classList.contains("jatsParser__symbol-plus")) {
							authorString2Child.classList.add("jatsParser__hide");
						}

						if (authorString2Child.classList.contains("jatsParser__symbol-minus")) {
							authorString2Child.classList.remove("jatsParser__hide");
						}
					}
				} else if (authorString2.getAttribute("href") !== ("#" + elementId) || authorString2.classList.contains("active")) {
					authorString2.classList.remove("active");
					for (var j = 0; j < authorString2.childNodes.length; j++) {
						var authorString3Child = authorString2.childNodes[j];
						if (authorString3Child.classList.contains("jatsParser__symbol-plus")) {
							authorString3Child.classList.remove("jatsParser__hide");
						}

						if (authorString3Child.classList.contains("jatsParser__symbol-minus")) {
							authorString3Child.classList.add("jatsParser__hide");
						}
					}
				}

			}
		});
	}
})();

// Bio modal

(function () {
	var modals = document.getElementsByClassName("jatsParser__modal-bio");
	var links = document.getElementsByClassName("jatsParser__details-bio-toggle");
	for (var i = 0; i < links.length; i++) {
		var link = links.item(i);

		link.onclick = function(event) {
			event.preventDefault();
			for (var j = 0; j < modals.length; j++) {
				var modal = modals.item(j);
				var linkHref = this.getAttribute("href").replace("#", "");
				var modalId = modal.getAttribute("id");
				if (linkHref === modalId) {
					modal.style.display = "block";
				}
			}
		};
	}

	var closeLinks = document.getElementsByClassName("jatsParser__close");
	for (var z = 0; z < closeLinks.length; z++) {
		closeLinks.item(z).onclick = function () {
			for (var x = 0; x < modals.length; x++) {
				modals.item(x).style.display = "none";
			}
		};
	}

	window.onclick = function(event) {
		for (var c = 0; c < modals.length; c++) {
			if (event.target === modals.item(c)) {
				modals.item(c).style.display = "none";
			}
		}
	};
})();

// ScrollSpy

(function () {

	function trackElement(headLvl, navLvl) {
		// sections position
		var sectionTitles = document.getElementsByClassName("article-section-title");
		var arrayReturn = sectionTitlePos(sectionTitles, headLvl);
		var closestToZeroElement = arrayReturn[0];
		var minimum = arrayReturn[1];

		var navItems = document.getElementsByClassName(navLvl);

		if (closestToZeroElement != null) {
			var closestToZeroElementId = closestToZeroElement.getAttribute("id");

			for (var y = 0; y < navItems.length; y++) {
				var navItem = navItems.item(y);

				var linkTo = navItem.getAttribute("href").trim().substr(1);
				if (linkTo === closestToZeroElementId) {
					if (navItem.classList.contains("active")) {
						return;
					}
				}

				if (navItem.classList.contains("active")) {
					navItem.classList.remove("active");
				}

				if (linkTo === closestToZeroElementId) {
					navItem.classList.add("active");
				}
			}

		} else if (minimum === 1) {
			for (var z = 0; z < navItems.length; z++) {
				if (navItems.item(z).classList.contains("active")) {
					navItems.item(z).classList.remove("active");
				}
			}
		}

	}

	/* do not trigger scroll listening too often */
	var ticking = false;

	window.addEventListener("scroll", function(e) {

		if (!ticking) {
			window.setTimeout(function() {
				trackElement("H2", "jatsParser__nav-link");
				trackElement("H3", "jatsParser__subnav-link");
				ticking = false;
			}, 500);

			ticking = true;
		}
	});

	function sectionTitlePos(sectionTitles, headingLevel) {
		var closestToZeroElement = null;
		var minimum = 1;
		for (var i = 0; i < sectionTitles.length; i++) {
			var sectionTitle = sectionTitles.item(i);
			if (sectionTitle.tagName === headingLevel) {
				var rect = sectionTitle.getBoundingClientRect();
				if (rect.top >= 1) {
					continue;
				}

				if (minimum === 1 || rect.top > minimum) {
					closestToZeroElement = sectionTitle;
					minimum = rect.top;
				}
			}
		}

		return [closestToZeroElement, minimum];
	}
})();

// Accordion for small screens.
(function () {
	var widthMarkerClass = "jatsparser__article-mobile-view";
	var hideElClass = "jatsParser__hide";
	var hideSectionContentClass = "jatsParser__hide-content";
	var clickEvent = false;
	accordionEventResize(); // only on page load
	accordionClick();
	window.addEventListener("resize", function () {
		accordionEventResize();
		accordionClick();
	}, false);

	function accordionEventResize() {
		var articleWrapperEl = document.getElementById("jatsParserFullText");
		var widthLimit = 992;

		if (window.innerWidth < widthLimit && !articleWrapperEl.classList.contains(widthMarkerClass)) {
			articleWrapperEl.classList.add(widthMarkerClass);

			// add accordion-associated classes
			var eles = document.querySelectorAll("h2.article-section-title");
			for (var x = 0; x < eles.length; x++) {
				if (!eles.item(x).classList.contains(hideSectionContentClass)) {
					toggleElementRecursively(eles.item(x));
				}
			}

		} else if (window.innerWidth >= widthLimit && articleWrapperEl.classList.contains(widthMarkerClass)) {
			articleWrapperEl.classList.remove(widthMarkerClass);

			// remove accordion-associated classes
			var els = document.querySelectorAll("h2.article-section-title");
			for (var i = 0; i < els.length; i++) {
				if (els.item(i).classList.contains(hideSectionContentClass)) {
					toggleElementRecursively(els.item(i));
				}
			}
		}
	}

	function accordionClick() {
		var els = document.querySelectorAll("." + widthMarkerClass + " " + "h2.article-section-title");
		if (els.length === 0) {
			return false;
		}

		for (var i = 0; i < els.length; i++) {
			var articleWrapperEl = document.getElementById("jatsParserFullText");
			if (articleWrapperEl.classList.contains(widthMarkerClass) && !clickEvent) {
				els.item(i).addEventListener("click", function () {
					clickEvent = true;
					hideSectionContent(els, this);
					toggleElementRecursively(this);

					// Scroll to clicked active element (section title)
					if (!this.classList.contains(hideSectionContentClass)) {
						this.scrollIntoView();
					}

				});
			}
		}
	}

	function toggleElementRecursively(sectionTitleEl) {
		if (sectionTitleEl.tagName === "H2") {
			if (sectionTitleEl.classList.contains(hideSectionContentClass)) {
				sectionTitleEl.classList.remove(hideSectionContentClass);
			} else {
				sectionTitleEl.classList.add(hideSectionContentClass);
			}
		}

		var nextSibling = sectionTitleEl.nextElementSibling;
		if (nextSibling && nextSibling.tagName !== "H2") {
			if (nextSibling.classList.contains(hideElClass)) {
				nextSibling.classList.remove(hideElClass);
				toggleElementRecursively(nextSibling);
			} else {
				nextSibling.classList.add(hideElClass);
				toggleElementRecursively(nextSibling);
			}
		}
	}

	function hideSectionContent(els, elIgnore) {
		for (var i = 0; i < els.length; i++) {
			if (elIgnore) {
				var elIgnoreId = elIgnore.getAttribute("id");
				if (els.item(i).getAttribute("id") === elIgnoreId) {
					continue;
				}
			}

			if (!els.item(i).classList.contains(hideSectionContentClass)) {
				toggleElementRecursively(els.item(i));
			}
		}
	}

})();
