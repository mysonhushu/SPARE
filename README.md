# SPARE
### Static Page AJAX to Replace Elements -- a lightweight client-side library

It's a lightweight client-side AJAX framework which requires no server-side support.  In fact, the case it's optimized for is when the server provides plain static HTML.  It's also super easy to use: you only call one method.

How it's designed to work was inspired by ASP.Net's UpdatePanel control, but as implemented, it's even more similar to jQuery's `load()` method, at much lower cost (and as a tradeoff, less support for downlevel browsers).

To use it, you give it the ID of any element on your page (which we will call the target), the URL of a new page, and an ID on that page.  It replaces the contents of the local document's target element with the content of the named element on the new page.  SPARE is most seamlessly used when you have a site design where many pages share common markup for headers, navigation, and so on, and the real differences are in a bounded content area.  SPARE lets you load new content into that area without refreshing the rest of the page.  In this use case, often the two IDs will be the same.

You can just as easily select content from pages not resembling the calling page.  You can optionally send POST data as well.  Another option is to display intermediate content (e.g. "Loading...") during the transaction.  And there's an option to invoke callback functions on success or failure.  None of these is required for basic usage.  And if the URL you give returns a page fragment, so you don't have to select an element within it, that's even simpler.  That mode will even work with some old browsers where SPARE doesn't support whole-page mode with a second ID, such as IE 7.

--------

The Javascript API consists of an object named SPARE with two public methods.  Note that you do not use a new operator to instantiate SPARE; there's just the one static object.  The main method you’ll use is SPARE.replaceElement, which takes the following arguments, all of string type unless stated otherwise:

> `elementID` (required): the DOM ID of the target element in your document, which will have its contents replaced.  If the ID is not found in your document, SPARE throws an immediate exception.

> `pageURL` (required): the web address of the HTML content to be used for that replacement.  This can be a relative URL for content on the same site as the current page.  (Cross-domain URLs are commonly blocked by browser security anyway.)

> `newElementID`:  the DOM ID of the element within the downloaded page which will be the source of the replacement content.  If you don't provide any value, then it puts the entire content returned by the URL into your target element.  This is only appropriate if the server is set up to return fragmentary pages, instead of complete ones with <html> tags.  If a complete page is received, it will use the content of the `<body>` tag.

> `postData`: values to be sent to the URL as form arguments, which must be already formatted suitably.  If null or undefined, it requests the page with a simple GET.  Note: at present SPARE supports only form-urlencoded data, not multipart posts, so you can’t do file uploads.

> `onSuccess`: a function to be invoked after the new content is successfully loaded.  If you pass a string, it will be executed with eval().  If it's a function object, it will be passed the onSuccessFailureData value described below.  If defaulted, no action is taken aside from updating the content of your target element.

> `onFailure`: similar, but invoked if there's a failure in loading the new content.  The second argument passed to it is an HTTP result number, such as 404 for page not found, and the third is the text of the error message received.  The error number may also be negative, if SPARE fails to use the content after a successful download.  -1 means that newElementID was not found, and -2 means an unexpected error in processing the content.  If the onFailure argument is not given, the default failure behavior is to navigate the browser window to the URL passed in.  This is an appropriate fallback if you're just using AJAX to smooth transitions of content.  This default behavior will not be useful if the server is returning only fragmentary pages.

> `onSuccessFailureData`: an arbitrary object which is passed as the first argument to whichever of onSuccess or onFailure is invoked, so you can give them some context.

> `transitionalContentID`: the DOM ID of an element in your document (normally one which is hidden from view) which contains some sort of placeholder content to be displayed while waiting for the new material to download.  That element's content is copied into the target element before the download starts, and is replaced in turn when it completes.  If left undefined, the default behavior is to leave the original content in place while downloading.  You can set a default value globally by assigning the ID string to the global variable SPARE.transitionalContentID.

> `timeout`: a number.  If the new data doesn't download within this many seconds, the operation fails.  The default value is 30, and the supported range is from 1 to 3600.  You can set a different default globally by putting a number in the global variable SPARE.timeout.

--------

The second public method is SPARE.supportLevel, which takes no arguments.  It returns a number indicating how well SPARE expects to work in the current browser environment.  It’s a good practice to check this before invoking replaceElement, and fall back to a non-AJAX approach if the value it returns is too low.  The values it can return are:

0:  This browser has insufficient support and SPARE will not operate at all.

1:  This browser has very limited support, and SPARE will only be able to download page fragments.  In other words, you cannot use the newElementID parameter.

2:  This browser has enough support that all features of SPARE should function.

3:  This browser supports the latest standards and SPARE will function at its best.

IMPORTANT:  It is easier than you think to get into a state where your supportLevel value is 1, and AJAX with newElementID doesn’t work.  This doesn’t just happen if your user is running something ancient like IE 7 — it will happen even in IE 10 if your page provokes IE into Compatibility View mode!  Make sure your markup is up to snuff so IE uses Standards mode.  If you want AJAX on funky pages with markup for archaic browsers, use jQuery.

