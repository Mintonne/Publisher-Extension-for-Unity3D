# Changelog
All notable changes to this project will be documented in this file.

## 1.1.2
### Fixed
- Silent errors when loading the Sales and Download pages.
- Snackbar timeout error.

## 1.1.1
### Fixed
- Axios vulnerability warning.

## 1.1.0
### Changed
- Reduced addon size (Removed Vuetify color pack and .woff font files)

## 1.0.3
## Changed
- Added reviews sidebar icon.

## 1.0.2
### Fixed
- [Background] Start the FetchReviewsData request immediately after the FetchSalesInfo request is completed successfully.

## 1.0.1
### Changed
- Hide tooltip if the sort order is set to quantity.

### Fixed
- A rare bug that caused package sorting to fail.

## 1.0.0
### Added
- A red strip on the package tiles if the package has refund/chargeback.
- Sales tooltip to the package tiles. (You can toggle it from the settings)
- Scrollable date picker.

### Changed
- Switched to Vue.js and Vuetify.
- Use localstorage instead of Chrome storage API.
- Revenue icon.

## 0.9.3
### Fixed
- A bug that prevented the extension from refreshing the months data when the year changes.


## 0.9.2
### Fixed
- Skip reviews with malformed data.

## 0.9.1
### Changed
- Get Reviews Link instead of API Key. (The previously saved API key will be deleted from storage when you open the extension)

## 0.9
###Added
- Reviews section and notifications.

### Fixed
- The sidebar and dashboard are no longer user selectable.

## 0.8
### Fixed
- A bug that reset the saved sales data to zero if the data array from the server is empty.

## 0.7
### Removed
- Tabs permission.

## 0.6
### Added
- 2 new permissions added. (contextMenus & tabs)
- Verify invoice context menu.
- Open extension in a new window.

### Fixed
- Disable 'Save Chart' functionality if the chart is null.

## 0.5
### Added
- Trend analysis page.

### Fixed
- A bug that caused the date parser to return a null date when parsing the revenue description text.

## 0.4
### Added
- Free downloads section.

### Changed
- Timeout increased to 15 seconds to cater for the slower downloads API endpoint.
- Renamed a few variables.

### Fixed
- Text sort order.

## 0.3
### Added
- Sliding carousel to the sale and revenue info cards.
- More info cards added to the sales and revenue pages.
- Sidebar animation toggle.
- Save the last selected sort order.
- A tooltip to the package card badge.
- Check for new sales, refunds & chargebacks immediately after launch.

### Changed
- Show 'Net Revenue' instead of 'Gross Revenue' throughout the UI.
- Show zero sales instead of error popup if you have not made any sales.
- Increased the maximum number of sales that can appear on the package card badge to 999. Anything more will show as 999+.
- Show sales trend for the last 6 months on the revenue page.

### Fixed
- Scrollbars are now interactable.

## 0.2
### Added
- Extension icons.

## 0.1
- First release.















































