const packageSelection = elemByID('package-selection'),
  reviewsAccordion = elemByID('reviews-accordion');

const x2js = new X2JS();

let reviews = [],
  reviewPackages = [];

packageSelection.addEventListener('change', () => {
  UpdateReviewsAccordion(packageSelection.selectedIndex);
});

function OpenReviews() {
  if (pubID == null)
    return RedirectToSettings();

  if (reviewsFeed == null)
    return RedirectToSettings(false);

  SetActiveSection(reviewsSection);
  SetActiveButton(null);

  if (reviewsData == null)
    FetchReviewsData();
}

function FetchReviewsData() {
  xhrRequest(reviewsFeed, PopulateReviews, 'Fetching reviews', true);
}

function PopulateReviews() {
  reviewsData = x2js.xml_str2json(xhr.responseText);

  if (reviewsData.rss.channel.item == null)
    return;

  let packageNameRegex = /"(.*?)"/g;
  let headingRegex = /<h1>(.*?)<\/h1>/g;
  let paragraphRegex = /<p>(.*?)<\/p>/g;
  let starRegex = /&#9733;/g;

  let itemCount = reviewsData.rss.channel.item.length;
  let packageLinks = [];

  for (let x = 0; x < itemCount; x++) {
    packageNameRegex.lastIndex = 0;
    headingRegex.lastIndex = 0;
    paragraphRegex.lastIndex = 0;
    starRegex.lastIndex = 0;

    let title = reviewsData.rss.channel.item[x].title.replace(/\s+/g, ' ');

    if (title.toLowerCase().includes('reply to review'))
      continue;

    let description, packageName, reviewer, heading, body, rating, isUpdate, link, pubDate;

    try {
      description = reviewsData.rss.channel.item[x].description;

      packageName = packageNameRegex.exec(title)[1];
      reviewer = title.slice(title.indexOf('by') + 3);
      heading = headingRegex.exec(description)[1];
      body = paragraphRegex.exec(description)[1];
      rating = paragraphRegex.exec(description)[1];
      isUpdate = false;
      link = reviewsData.rss.channel.item[x].link;
      pubDate = reviewsData.rss.channel.item[x].pubDate;
    } catch {
      continue;
    }

    if (title.toLowerCase().includes('updated review'))
      isUpdate = true;

    if (packageName != null && !reviewPackages.includes(packageName, 0) && !packageLinks.includes(link, 0)) {
      reviewPackages.push(packageName);
      packageLinks.push(link);
    }

    packageName = reviewPackages[packageLinks.indexOf(link)];

    let obj = {
      title,
      packageName,
      reviewer,
      heading,
      body,
      stars: rating.match(starRegex).length,
      isUpdate,
      link,
      pubDate
    }

    reviews.push(obj);
  }

  reviewPackages.sort();

  reviewPackages.forEach((pkg) => {
    let parent = document.createElement("option");
    let textNode = document.createTextNode(pkg);
    parent.appendChild(textNode);

    packageSelection.appendChild(parent);
  });

  UpdateReviewsAccordion();
}

function UpdateReviewsAccordion(index = 0) {
  while (reviewsAccordion.firstChild) {
    reviewsAccordion.removeChild(reviewsAccordion.firstChild);
  }

  reviews.forEach(item => {
    if (index === 0 || item.packageName.toLowerCase() == packageSelection.options[index].innerText.toLowerCase())
      reviewsAccordion.insertAdjacentHTML('beforeend', `<li><h5 class="${item.isUpdate ? 'update': ''}">${item.heading} - ${item.packageName} by ${item.reviewer}</h5><p class="text-dark mb-1">${item.body}</p><p class="justify-right mb-0">Rated <span title="${item.stars} stars">${"&bigstar;".repeat(item.stars)}</span> by ${item.reviewer.length >25 ? item.reviewer.substr(0,25)+'...' : item.reviewer} (<a href="${item.link}" target="_blank">Link</a>)</p><p class="justify-right" title="${new Date(item.pubDate).toLocaleDateString(navigator.language, dateOptions)}">${humanized_time_span(item.pubDate)}</p></li>`);
  });

  SetupTitleClick();
}

function SetupTitleClick() {
  let reviewTitles = elemQuerySelectorAll('#reviews-accordion h5');

  reviewTitles.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      } else {
        let curActive = item.closest('#reviews-accordion').querySelector('h5.active');

        if (curActive != null)
          curActive.classList.remove('active');

        item.classList.add('active');
      }
    });
  })
}