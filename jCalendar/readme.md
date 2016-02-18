#jCalendar
###jQuery plugin to show a Calendar using the bootstrap library
In this project a jQuery plugin to display a calendar can be found. The required files for this plugin are:
* css/calendar.css
* js/calendar.js

In index.html there is an example of how to display the calendar and add an event.

The plugin has some settings that can be customized:
* month : The month to be displayed. Default value is current month.
* year: The year to be displayed. Default value is current year.
* showDayDetails: If true, it displays a panel with the details for a day. Default value is false.
* monthNames: An array with the names of the months. Default value is ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].
* dayNamesShort: An array with short names of the dyas to display in the header of the calendar. Default value is ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].
* events: An array containing events to show in the calendar. An event is a javascript object with the following properties:
*   id
*   name
*   description
*   startdate
*   enddate
