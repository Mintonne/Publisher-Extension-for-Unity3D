#Changelog
All notable changes to this project will be documented in this file.

## 0.6
###Added
- 2 new permissions added. (contextMenus & tabs)
- Verify invoice context menu.
- Open extension in a new window.

###Fixed
- Disable 'Save Chart' functionality if the chart is null.

## 0.5
###Added
- Trend analysis page.
- FileSaver.js library.
- Title tags to HTML files.

###Changed
- Moved functions from main.js to functions.js.

###Fixed
- A bug that caused the date parser to return a null date when parsing the revenue description text.

## 0.4
###Added
- Free downloads section.

###Changed
- Timeout increased to 15 seconds to cater for the slower downloads API endpoint.
- Renamed a few variables.

###Fixed
- Text sort order.

## 0.3
###Added
- Sliding carousel to the sale and revenue info cards.
- More info cards added to the sales and revenue pages.
- Sidebar animation toggle.
- Save the last selected sort order.
- A tooltip to the package card badge.
- Check for new sales, refunds & chargebacks immediately after launch.

###Changed
- Show 'Net Revenue' instead of 'Gross Revenue' throughout the UI.
- Show zero sales instead of error popup if you have not made any sales.
- Increased the maximum number of sales that can appear on the package card badge to 999. Anything more will show as 999+.
- Show sales trend for the last 6 months on the revenue page.

###Fixed
- Scrollbars are now interactable.

## 0.2
###Added
- Extension icons.

## 0.1
- First release.















































