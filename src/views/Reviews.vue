<template>
  <div class="section">
    <loader class="fill" v-if="loading" :message="loadingMessage"></loader>

    <nav-bar title="Reviews"></nav-bar>

    <v-flex xs12>
      <v-select
        solo
        label="Select an asset"
        v-model="selectedAsset"
        :items="assetsList"
        :menu-props="{closeOnContentClick: true, maxHeight: 350}">
      </v-select>
    </v-flex>

    <v-flex v-if="reviews.length > 0" xs12 class="mb-3">
      <v-expansion-panel popout>
        <v-expansion-panel-content
          expand-icon="$vuetify.icons.dropdown"
          id="content"
          v-for="(review,i) in filteredReviews"
          :key="i">
          <div slot="header">{{ review.heading }} - {{ review.packageName }} by {{ review.reviewer }}</div>
          <v-card>
            <v-card-text>
              <p>{{ review.body }}</p>
              <p class="text-xs-right ma-0">Rated <span class="review-stars" :title="review.stars + ' stars'"> {{ "&bigstar;".repeat(review.stars) }}</span> by {{ review.reviewer.length > 20 ? review.reviewer.substr(0, 20) + '...' : review.reviewer }}
                <v-icon width="16" height="16" @click.native="OpenLink(review.link)">$vuetify.icons.open</v-icon>
              </p>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>

    <snackbar :value="showSnackbar" :callback="GetReviewsData" />
  </div>
</template>

<script>
import axios from 'axios';
import * as X2JS from 'x2js';
import NavBar from "@/components/Navbar.vue";
import Snackbar from '@/components/Snackbar.vue';
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  activated() {
    if (!this.$store.getters.pubIdStatus)
      return this.RedirectToSettings(this.$router);
    else if (this.$store.getters.getReviewsFeed == null)
      return this.RedirectToSettings(this.$router, false);

    if (this.reviewsData == null)
      this.GetReviewsData();
  },
  data() {
    return {
      reviewsData: null,
      reviews: [],
      assetsList: [],
      selectedAsset: null,
      showSnackbar: false,
      loading: false,
      loadingMessage: 'Fetching reviews'
    }
  },
  computed: {
    filteredReviews() {
      return this.reviews.filter((review) => {
        return review.packageName === this.selectedAsset || this.selectedAsset === this.assetsList[0];
      });
    }
  },
  methods: {
    GetReviewsData() {
      let link = this.$store.getters.getReviewsFeed;

      this.loading = true;
      this.showSnackbar = false;

      axios.get(link, {
        timeout: 15000
      })
        .then((response) => {
          const x2js = new X2JS();

          this.reviewsData = x2js.xml2js(response.data);

          if (this.reviewsData == null || this.reviewsData.rss.channel.item == null) {
            return this.$swal('Error', 'No records found', 'error');
          }

          const packageNameRegex = /"(.*?)"/g;
          const headingRegex = /<h1>(.*?)<\/h1>/g;
          const paragraphRegex = /<p>(.*?)<\/p>/g;
          const starRegex = /&#9733;/g;

          const itemCount = this.reviewsData.rss.channel.item.length;
          const packageLinks = [];

          for (let x = 0; x < itemCount; x++) {
            packageNameRegex.lastIndex = 0;
            headingRegex.lastIndex = 0;
            paragraphRegex.lastIndex = 0;
            starRegex.lastIndex = 0;

            let title = this.reviewsData.rss.channel.item[x].title.replace(/\s+/g, ' ');

            if (title.toLowerCase().includes('reply to review'))
              continue;

            let description, packageName, reviewer, heading, body, rating, isUpdate, link, pubDate;

            try {
              description = this.reviewsData.rss.channel.item[x].description;

              packageName = packageNameRegex.exec(title)[1];
              reviewer = title.slice(title.indexOf('by') + 3);
              heading = headingRegex.exec(description)[1];
              body = paragraphRegex.exec(description)[1];
              rating = paragraphRegex.exec(description)[1];
              isUpdate = false;
              link = this.reviewsData.rss.channel.item[x].link;
              pubDate = this.reviewsData.rss.channel.item[x].pubDate;
            } catch {
              continue;
            }

            if (title.toLowerCase().includes('updated review'))
              isUpdate = true;

            if (packageName != null && !this.assetsList.includes(packageName, 0) && !packageLinks.includes(link, 0)) {
              this.assetsList.push(packageName);
              packageLinks.push(link);
            }

            packageName = this.assetsList[packageLinks.indexOf(link)];

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

            this.reviews.push(obj);
          }

          this.assetsList.sort();
          this.assetsList.unshift('All Assets');
          this.selectedAsset = this.assetsList[0];
        })
        .catch((error) => {
          console.log(error);
          this.showSnackbar = true;
        })
        .then(() => {
          this.loading = false;
        });
    }
  },
  components: {
    NavBar,
    Snackbar
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.section {
  overflow-y: auto !important;
}

#content {
  background-color: inherit;
}

.v-expansion-panel__header {
  padding: 10px;
}

p {
  .review-stars {
    color: #ff9800;
  }

  span.v-icon {
    color: $primary-color;
    cursor: pointer;
  }
}
</style>