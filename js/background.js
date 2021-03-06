var migrate = function(data) {
	var ids = data.ActiveAppIds,
		columns = data.columns,
		widgets = data.ActiveAppSettings,
		prefs = data.prefs;

	var tabs = [
			{
				id: 1,
				name: "Home",
				columns: []
			}
		],
		settings = {},
		themes = [],
		theme = "",
		local = ["beach", "grass", "greenfalls", "greenwater", "header", "jupiter", "mountains", "ocean", "pebbles", "trees", "treetops", "wood"];

	if (prefs && prefs.bg) {
		if (prefs.bg.url && local.indexOf(theme = prefs.bg.url.replace("/images/bgs/", "").replace(".jpg", "")) !== -1) {
			if (theme !== "beach") {
				tabs[0].theme = theme;
			}
		}
		else {
			theme = {
				name: "Migrated Theme"
			};

			if (prefs.bg.url && prefs.bg.url !== "") {
				theme.image = prefs.bg.url;
			}

			if (prefs.bg.color && prefs.bg.color !== "#EEE") {
				theme.color = prefs.bg.color;
			}

			if (prefs.bg.pos && prefs.bg.pos !== "center" && prefs.bg.pos !== "top center") {
				theme.position = prefs.bg.pos;
			}

			if (prefs.bg.repeat && prefs.bg.repeat !== "no-repeat") {
				theme.repeat = prefs.bg.repeat;
			}

			if (prefs.bg.scale && prefs.bg.scale !== "cover") {
				theme.scaling = prefs.bg.scale;
			}

			if (prefs.bg.style && prefs.bg.style !== "scroll") {
				theme.fixed = prefs.bg.style;
			}

			themes.push(theme);

			tabs[0].theme = "custom0";
		}
	}

	if (prefs && prefs.layout) {
		if (prefs.layout["page-align"] && prefs.layout["page-align"] !== "0 auto") {
			if (prefs.layout["page-align"] == "0") {
				settings.align = "left";
			}
			else {
				settings.align = "right";
			}
		}

		if (prefs.layout["search-url"] && prefs.layout["search-url"] !== "https://www.google.com/search?q=%s") {
			settings["search-url"] = prefs.layout["search-url"];
		}

		if (prefs.layout["logo-image-url"] && prefs.layout["logo-image-url"] !== "/images/logo3w.png") {
			settings["logo-url"] = prefs.layout["logo-image-url"];
		}
	}


	columns.forEach(function(column, i) {
		var ncolumn = [];

		column.forEach(function(widget, i) {
			var id = ids[widget];

			if (id && widgets[widget] && migrators[ids[widget]]) {
				try {
					ncolumn.push(migrators[ids[widget]](widgets[widget]));
				}
				catch (e) {}
			}
			else if (id && migrators[ids[widget]]) {
				try {
					ncolumn.push(migrators[ids[widget]]({}));
				}
				catch (e) {}
			}
		});

		tabs[0].columns.push(ncolumn);
	});

	chrome.storage.local.clear(function() {
		chrome.storage.local.set({
			tabs: tabs,
			themes: themes,
			settings: settings
		});
	});
};

var migrators = {
	1: function(s) {
		var ret = {
			id: 1,
			size: 3,
			config: {}
		};

		if (s.location) {
			ret.config.title = s.location;
			ret.config.location = s.location;
		}
		
		if (s.units && s.units == "c") {
			ret.config.units = "metric";
		}

		return ret;
	},
	2: function(s) {
		return {
			id: 2,
			size: 2
		};
	},
	3: function(s) {
		var ret = {
			id: 3,
			size: 3,
			config: {
			}
		};

		if (s.profile) {
			ret.config.profile = s.profile;
		}

		return ret;
	},
	4: function(s) {
		var ret = {
			id: 4,
			size: 3,
			config: {
			}
		};

		if (s.title && s.title !== "News") {
			ret.config.title = s.title;
		}

		if (s.edition && s.edition !== "&ned=us") {
			ret.config.edition = s.edition.replace("&ned=", "");
		}

		if (s.topic && s.topic !== "") {
			ret.config.topic = s.topic.replace("&tc=", "");
		}

		if (s.footerLink && s.footerLink !== "http://news.google.com") {
			ret.config.link = s.footerLink;
		}

		if (s.source && s.source.indexOf("https://news.google.com/news/feeds?output=rss") !== 0) {
			ret.config.custom = s.source;
		}

		return ret;
	},
	5: function(s) {
		return {
			id: 5,
			size: 2
		};
	},
	6: function(s) {
		return {
			id: 6,
			size: 2
		};
	},
	7: function(s) {
		var ret = {
			id: 7,
			size: 5,
			config: {}
		};

		if (s.height && s.height !== "400px") {
			ret.config.height = parseInt(s.height.replace("px", ""));
		}

		if (s.url && s.url !== "http://mail.google.com/mail/mu/mp/?source=ig&mui=igh") {
			ret.config.url = s.url;
		}

		if (s.padding && s.padding !== false) {
			ret.config.padding = "true";
		}

		return ret;
	},
	8: function(s) {
		var ret = {
			id: 8,
			size: 5,
			config: {}
		};

		if (s.source && s.source !== "") {
			ret.config.url = s.source;
		}

		if (s.title && s.title !== "") {
			ret.config.title = s.title;
		}

		if (s.images && s.images !== true) {
			ret.config.images = "false";
		}

		return ret;
	},
	9: function(s) {
		var ret = {
			id: 9,
			size: 2,
			config: {}
		};

		if (s.home && s.home.address && s.home.address !== "" && s.home.address !== "1601 Willow Rd, Menlo Park, CA 94025-1452") {
			ret.config.home = s.home.address;
		}

		if (s.work && s.work.address && s.work.address !== "" && s.work.address !== "1600 Amphitheatre Pkwy, Mountain View, CA 94043-1351") {
			ret.config.work = s.work.address;
		}

		return ret;
	},
	10: function(s) {
		var ret = {
			id: 10,
			size: 5,
			config: {}
		};

		if (s.calendar && s.calendar !== "") {
			ret.config.calendar = s.calendar;
		}

		if (s.num) {
			ret.config.events = s.num;
		}

		return ret;
	},
	11: function(s) {
		return {
			id: 11,
			size: 5
		};
	},
	12: function(s) {
		var ret = {
			id: 12,
			size: 5,
			config: {}
		};

		if (s.num) {
			ret.config.show = s.num;
		}

		return ret;
	},
	13: function(s) {
		var ret = {
			id: 13,
			size: 5,
			data: {}
		};

		if (s.title && s.title !== "Welcome Note") {
			d = document.createElement("div");

			d.innerHTML = s.title;

			ret.data.title = d.innerText;
		}

		if (s.content && s.content !== "") {
			ret.data.content = s.content;
		}

		return ret;
	}
};

chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == "install") {
		var link = document.createElement("a");

		link.setAttribute("href", "chrome-extension://" + chrome.app.getDetails().id + "/index.html");
		link.setAttribute("target", "_blank");

		chrome.storage.sync.get(function(d) {
			if (d.tabs) {
				chrome.storage.local.set(d);
			}
			else {
				localStorage["installed"] = "true";

				link.click();
			}
		});
	}
	else if (details.reason == "update") {
		if (details.previousVersion.indexOf("2") === 0 && !localStorage["help"]) {
			//localStorage["help"] = "true";
			//localStorage["whatsNew"] = "true";
		}
		else {
			chrome.storage.local.get(function(d) {
				if (d.ActiveAppIds) {
					migrate(d);

					localStorage["updated"] = "true";
				}
				else {
					//localStorage["whatsNew"] = "true";
				}
			});
		}
	}
});

chrome.webRequest.onHeadersReceived.addListener(
	function(info) {
		var headers = info.responseHeaders;

		for (var i = headers.length - 1; i >= 0; --i) {
			var header = headers[i].name.toLowerCase();

			if (header == "x-frame-options" || header == "frame-options") {
				headers.splice(i, 1);
			}
		}
		
		return {
			responseHeaders: headers
		};
	},
	{
		urls: [ "*://*/*" ],
		types: [ "sub_frame" ]
	},
	["blocking", "responseHeaders"]
);

var setReload = function() {
	setTimeout(function() {
		location.reload();
	}, 100);
};