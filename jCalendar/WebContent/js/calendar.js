(function($){
	$.widget("mome.calendar", {
		options:{
			month: new Date().getMonth(),
			year: new Date().getFullYear(),
			showDayDetails: false,
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			dayNamesShort: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
		},
		_create: function(){

			this.element.addClass('calendar-wrapper');
			this.element.html('');
			this.element.append(this._init_calendar());

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
			var calendar_days = $('<div />').addClass('calendar-days');
			$.each(this._get_calendar_days(), function(i, e){
				calendar_days.append(e);
			});
			calendar_external_col.append(calendar_days);

			/* Day Details */
			var calendar_selected_day;
			var calendar_selected_month;
			if (this.options.showDayDetails){
				var calendar_daydetails_col = $('<div />').addClass('col-md-4 col-xs-12');
				calendar_selected_day = $('<span />').attr('id', 'selected_day');
				calendar_selected_month = $('<span />').attr('id', 'selected_month');
				var calendar_selected = $('<p />').attr({'id':'selected_day', 'style': 'display:none'});
				calendar_selected.append(['Details for ', calendar_selected_month, ' ', calendar_selected_day, ':']);
				calendar_daydetails_col.append(calendar_selected);
				external_row.append(calendar_daydetails_col);
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
				this_elem._addDayDetailsClick(calendar_days, calendar_selected_day, calendar_selected_month, calendar_selected);
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
				this_elem._addDayDetailsClick(calendar_days, calendar_selected_day, calendar_selected_month, calendar_selected);
			});


			if (this.options.showDayDetails){
				this._addDayDetailsClick(calendar_days, calendar_selected_day, calendar_selected_month, calendar_selected);
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
			if (this.options.month < 11){
				lastDayOfMonth = new Date(this.options.year, this.options.month+1,0).getDate();
			} else {
				lastDayOfMonth = new Date(this.options.year+1, 0,0).getDate();
			}
			var lastDayOfPreviousMonth = new Date(this.options.year, this.options.month,0).getDate();			
			
			var dayNumber = 1;
			var dayNextMonth = 1;
			while( dayNumber <= lastDayOfMonth){
				var calendar_days_row = $('<div />').addClass('row');
				for (i = 1; i <= 7; i++){
					var calendar_days_row_item = $('<div />').addClass('calendar-col-1');
					if (dayNumber == 1 && firstDayOfMonth > i){
						//The month has not started yet
						calendar_days_row_item.addClass('nomonthday').html(lastDayOfPreviousMonth-(firstDayOfMonth-i)+1);
					} else if (dayNumber > lastDayOfMonth){
						//The month has already finished
						calendar_days_row_item.addClass('nomonthday').html(dayNextMonth);
						dayNextMonth +=1;
					} else {
						if (i >= 6){
							calendar_days_row_item.addClass('noworkingday');
						} else {
							calendar_days_row_item.addClass('calendar_day');
						}
						calendar_days_row_item.html(dayNumber);
						calendar_days_row_item.attr('data-daynumber', dayNumber);
						dayNumber +=1;
					}
					calendar_days_row.append(calendar_days_row_item);
				}
				calendar_days.push(calendar_days_row);
			}
			return calendar_days;
		},
		_addDayDetailsClick: function(calendar_days, calendar_selected_day, calendar_selected_month, calendar_selected){
			var opt = this.options;
			$.each(calendar_days.children(), function(i, e){
				$.each($(e).children(), function(i, e2){
					$(e2).click(function(){
						if ($(this).attr('data-daynumber')){
							calendar_selected_day.html($(this).attr('data-daynumber'));
							calendar_selected_month.html(opt.monthNames[opt.month]);
							calendar_selected.show();
						}
					});
				});
			});
		}

	});

})(jQuery);