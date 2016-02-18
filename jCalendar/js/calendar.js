(function($){
	$.widget("mome.calendar", {
		options:{
			month: new Date().getMonth(),
			year: new Date().getFullYear(),
			showDayDetails: false,
			workingHours: 8,
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			dayNamesShort: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
			events: [{
				'id': 0,
				'startdate': new Date(),
				'enddate': (function(){d=new Date();d.setDate(d.getDate()+1);return d;})(),
				'name': 'Demo event',
				'description': 'Demo event thats starts today and lasts 2 days.'
			},
			{
				'id': 1,
				'startdate': (function(){d=new Date();d.setDate(d.getDate()+1);return d;})(),
				'enddate': (function(){d=new Date();d.setDate(d.getDate()+1);return d;})(),
				'name': 'Demo event 2',
				'description': 'Demo event thats starts tomorrow and lasts 1 day.'
			}],
		},
		add_event: function(event){
			this.options.events.push(event);
			$('.selected').click();
			this._show_day_events(this.calendar_days);
		},
		_create: function(){
			this.element.addClass('calendar-wrapper');
			this.element.html('');
			this.element.append(this._init_calendar());
			
			$('#day-'+today.getDate()+'-'+ today.getMonth() + '-' +today.getFullYear()).click();
		},
		_init_calendar: function(){
			var calendar_wrapper = $('<div />').addClass('container');
			var external_row = $('<div />').addClass('row');
			calendar_wrapper.append(external_row);

			var calendar_external_col;
			if (this.options.showDayDetails){
				calendar_external_col = $('<div />').addClass('col-md-8 col-xs-12');
			} else {
				calendar_external_col = $('<div />').addClass('col-md-12');
			}
			external_row.append(calendar_external_col);

			/* Calendar header */
			var calendar_header = $('<div />').addClass('row').addClass('calendar-header');

			var calendar_header_previous = $('<div />').addClass('calendar-col-1').attr('id', 'calendar-previous');
			calendar_header_previous.append($('<span />').addClass('glyphicon glyphicon-chevron-left'));

			var calendar_header_month = $('<div />').addClass('calendar-col-5 calendar-month');
			calendar_header_month.html(this._get_calendar_header());
			
			var calendar_header_next = $('<div />').addClass('calendar-col-1').attr('id', 'calendar-next');
			calendar_header_next.append($('<span />').addClass('glyphicon glyphicon-chevron-right'));
			
			calendar_header.append(calendar_header_previous);
			calendar_header.append(calendar_header_month);
			calendar_header.append(calendar_header_next);

			calendar_external_col.append(calendar_header);

			/* Day names */
			var calendar_weekdays = $('<div />').addClass('row calendar-weekdays');
			$.each(this.options.dayNamesShort, function(i, e){
				calendar_weekdays.append($('<div />').addClass('calendar-col-1').html(e));
				
			});
			calendar_external_col.append(calendar_weekdays);

			/* Days */
			calendar_days = $('<div />').addClass('calendar-days');
			$.each(this._get_calendar_days(), function(i, e){
				calendar_days.append(e);
			});
			this.calendar_days = calendar_days;
			calendar_external_col.append(this.calendar_days);

			/* Show Events */
			this._show_day_events(this.calendar_days);
			
			
			/* Day Details */
			if (this.options.showDayDetails){
				external_row.append(this._get_calendar_day_details());
			}

			
			/* Actions */
			var this_elem = this;
			calendar_header_previous.click(function(){
				this_elem.options.month -= 1;
				if (this_elem.options.month < 0){
					this_elem.options.month = 11;
					this_elem.options.year -= 1;
				}
				calendar_header_month.html(this_elem._get_calendar_header());
				calendar_days.html('');
				$.each(this_elem._get_calendar_days(), function(i, e){
					calendar_days.append(e);
				});
				this_elem._addDayDetailsClick(calendar_days);
				this_elem._show_day_events(calendar_days);
				this_elem._hide_day_details();
				
			});
			
			calendar_header_next.click(function(){
				this_elem.options.month += 1;
				if (this_elem.options.month >= 12){
					this_elem.options.month = 0;
					this_elem.options.year += 1;
				}
				calendar_header_month.html(this_elem._get_calendar_header());
				calendar_days.html('');
				$.each(this_elem._get_calendar_days(), function(i, e){
					calendar_days.append(e);
				});
				this_elem._addDayDetailsClick(calendar_days);
				this_elem._show_day_events(calendar_days);
				this_elem._hide_day_details();
			});


			if (this.options.showDayDetails){
				this._addDayDetailsClick(calendar_days);
			}
			return calendar_wrapper;
		},
		_get_calendar_header: function(){
			return this.options.monthNames[this.options.month] + ' ' + this.options.year;
		},
		_get_calendar_days: function(){
			var calendar_days = [];

			var firstDayOfMonth = new Date(this.options.year, this.options.month, 1).getDay();
			if (firstDayOfMonth == 0){
				firstDayOfMonth = 7; //getDay() returns the day of the week from 0=Sunday to 6=Saturday
			}

			var lastDayOfMonth;
			var nextMonth;
			var nextMonthYear;
			var previousMonth;
			var previousMonthYear;
			
			if (this.options.month < 11){
				lastDayOfMonth = new Date(this.options.year, this.options.month+1,0).getDate();
				nextMonth = this.options.month+1;
				nextMonthYear = this.options.year;
			} else {
				lastDayOfMonth = new Date(this.options.year+1, 0,0).getDate();
				nextMonth = 0;
				nextMonthYear = this.options.year+1;
			}
			
			if (this.options.month > 0){
				previousMonth = this.options.month-1;
				previousMonthYear = this.options.year;
			} else {
				previousMonth = 11;
				previousMonthYear = this.options.year-1;
			}
			
			var lastDayOfPreviousMonth = new Date(this.options.year, this.options.month,0).getDate();			
			
			var dayNumber = 1;
			var dayNextMonth = 1;
			today = new Date();
			
			while( dayNumber <= lastDayOfMonth){
				var calendar_days_row = $('<div />').addClass('row');
				for (i = 1; i <= 7; i++){
					var calendar_days_row_item = $('<div />').addClass('calendar-col-1');
					if (dayNumber == 1 && firstDayOfMonth > i){
						//The month has not started yet
						dayPreviousMonth = lastDayOfPreviousMonth-(firstDayOfMonth-i)+1;
						calendar_days_row_item.addClass('nomonthday').append(this._get_calendar_day_item(dayPreviousMonth));
						currentDate = dayPreviousMonth+'-'+previousMonth+'-'+previousMonthYear;
					} else if (dayNumber > lastDayOfMonth){
						//The month has already finished
						calendar_days_row_item.addClass('nomonthday').append(this._get_calendar_day_item(dayNextMonth));
						currentDate = dayNextMonth+'-'+nextMonth+'-'+nextMonthYear;
						dayNextMonth +=1;
					} else {
						if (i >= 6){
							calendar_days_row_item.addClass('noworkingday');
						} else {
							calendar_days_row_item.addClass('calendar-day');
						}
						calendar_days_row_item.append(this._get_calendar_day_item(dayNumber));
						calendar_days_row_item.attr('data-daynumber', dayNumber);
						if (today.getDate() == dayNumber && today.getMonth() == this.options.month && today.getFullYear()==this.options.year){
							calendar_days_row_item.addClass('today');
						}
						currentDate = dayNumber+'-'+this.options.month+'-'+this.options.year;
						dayNumber +=1;
					}
					calendar_days_row_item.attr('id', 'day-'+currentDate);
					calendar_days_row.append(calendar_days_row_item);
				}
				calendar_days.push(calendar_days_row);
			}
			
			return calendar_days;
		},
		_get_calendar_day_item: function(day){
			var day_item_number = $('<div />').addClass('calendar-day-item-number').html(day);
			var day_item_events = $('<div />').addClass('calendar-day-item-events');
			return [day_item_number, day_item_events];
		},
		_get_calendar_day_details: function(){
			var calendar_daydetails_col = $('<div />').addClass('col-md-4 col-xs-12');
			var calendar_daydetails_wrapper = $('<div />').attr('style', 'display:none').addClass('row calendar-day-details');
			calendar_daydetails_col.append(calendar_daydetails_wrapper);
			var calendar_selected_day = $('<span />').addClass('selected_day');
			var calendar_selected_month = $('<span />').addClass('selected_month');
			var calendar_selected = $('<p />').addClass('calendar-selected-date col-xs-12');
			calendar_selected.append(['Details for ', calendar_selected_month, ' ', calendar_selected_day, ':']);
			
			calendar_daydetails_wrapper.append(calendar_selected);
			//calendar_daydetails_wrapper.append(this._get_calendar_day_detail_item());
			
			return calendar_daydetails_col;
		},
		_get_calendar_day_detail_item: function(){
			calendar_daydetails_item = $('<div />').addClass('calendar-day-details-item col-xs-12');
			
			event_name = $('<h2 />').addClass('selected_event_name');
			calendar_daydetails_item.append(event_name);

			event_description = $('<p />').addClass('selected_event_description');
			calendar_daydetails_item.append(event_description);
			
			event_startdate = $('<div />').addClass('selected_event_startdate');
			calendar_daydetails_item.append(event_startdate);
			
			event_enddate = $('<div />').addClass('selected_event_enddate');
			calendar_daydetails_item.append(event_enddate);
			
			return calendar_daydetails_item;
		},
		_show_day_events: function(calendar_days){
			var opt = this.options;
			
			$.each(calendar_days.children(), function(i, e){
				$.each($(e).children(), function(i, e2){
					var currentDate = new Date(opt.year, opt.month, $(e2).attr('data-daynumber'));
					event_count = 0;
					for (i=0;i<opt.events.length;i++){
						event_startdate = new Date(opt.events[i].startdate.getFullYear(), opt.events[i].startdate.getMonth(), opt.events[i].startdate.getDate());
						event_enddate = new Date(opt.events[i].enddate.getFullYear(), opt.events[i].enddate.getMonth(), opt.events[i].enddate.getDate());
						if (event_startdate <= currentDate && event_enddate >= currentDate){
							event_count += 1;
						}
					}
					
					if (event_count > 0){
						$(e2).addClass('event');
						var event_text = event_count + ' event'
						if (event_count > 1){
							event_text += 's'
						}
						
						$(e2).children('.calendar-day-item-events').html(event_text);
					}
				});
			});
		},
		_hide_day_details: function(){
			//Clear selected class from the previous selected day
			$('.calendar_day').removeClass('selected');
			
			$('.calendar-day-details').hide();
		},
		_addDayDetailsClick: function(calendar_days){
			var opt = this.options;
			var day_detail_item = this._get_calendar_day_detail_item();
			var cal = this;
			
			$.each(calendar_days.children(), function(i, e){
				$.each($(e).children(), function(i, e2){
					$(e2).click(function(){
						if ($(this).attr('data-daynumber')){
							
							//Clear previous calendar_day_details_items
							$('.calendar-day-details').children('.calendar-day-details-item').each(function(i,e){$(e).remove();});
							
							//Clear selected class from the previous selected day
							$('.calendar-day').removeClass('selected');
							
							//Set selected class to the current day
							$(this).addClass('selected');
							
							//Set the selected date in the details div
							this_id = $(this).attr('id').split('-');
							selected_date = new Date(this_id[3],this_id[2], this_id[1]);
							$('.selected_day').html($(this).attr('data-daynumber'));
							$('.selected_month').html(opt.monthNames[opt.month]);
							
							//Look for events in the selected date
							event_found = false;
							for (i=0; i < opt.events.length; i++){
								e_startdate = new Date(opt.events[i].startdate.getFullYear(), opt.events[i].startdate.getMonth(), opt.events[i].startdate.getDate());
								e_enddate = new Date(opt.events[i].enddate.getFullYear(), opt.events[i].enddate.getMonth(), opt.events[i].enddate.getDate());
								if (e_startdate <= selected_date && e_enddate >= selected_date){
									//An event has been found, append a calendar_day_details_item with its information
									var day_detail_item_cpy = day_detail_item.clone();
									$(day_detail_item_cpy).children('.selected_event_name').html(opt.events[i].name);
									$(day_detail_item_cpy).children('.selected_event_description').html(opt.events[i].description);
									$(day_detail_item_cpy).children('.selected_event_startdate').html(['Start date: ', cal._format_date(opt.events[i].startdate)]);
									$(day_detail_item_cpy).children('.selected_event_enddate').html(['End date: ', cal._format_date(opt.events[i].enddate)]);
									$('.calendar-day-details').append(day_detail_item_cpy);
									event_found = true;
								}
							}
							
							//If selected day has any event, show the day_details div
							if (!event_found){
								$('.calendar-day-details').hide();
							} else {
								$('.calendar-day-details').show();
							}
						}
					});
				});
			});
		},
		_format_date: function(date){
			return date.getDate()+'/'+date.getMonth()+1+'/'+date.getFullYear();
		}

	});
})(jQuery);