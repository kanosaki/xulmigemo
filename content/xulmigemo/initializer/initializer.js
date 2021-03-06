
function startDownload()
{
	document.documentElement.canRewind = false;
	document.documentElement.canAdvance = false;

	var status = document.getElementById('download-status');
	var bar    = document.getElementById('download-progress');
	var clearStatus = function() {
			var range = document.createRange();
			range.selectNodeContents(status);
			range.deleteContents();
			range.detach();
		};



	XMigemoFileDownloader.progressListener = {
		percent : -1,

		onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus)
		{
			if (this.percent >= 100) {
				clearStatus();
				text = status.getAttribute('label-install');
				status.appendChild(document.createTextNode(text));
			}
		},
		onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress)
		{
			if (aMaxTotalProgress > 0) {
				this.percent = Math.floor((aCurTotalProgress*100.0)/aMaxTotalProgress);
				if (this.percent > 100) this.percent = 100;
			}
			else {
				this.percent = -1;
			}
			clearStatus();
			if (this.percent >= 0) {
				text = status.getAttribute('label-download-progress');
				status.appendChild(document.createTextNode(text.replace(/%s/i, this.percent)));

				bar.setAttribute('type', 'determined');
				bar.setAttribute('value', this.percent+'%');
			}
			else {
				text = status.getAttribute('label-download');
				status.appendChild(document.createTextNode(text));

				bar.setAttribute('type', 'undetermined');
				bar.removeAttribute('value');
			}
		},
		onLocationChange: function()
		{
		},
		onStatusChange: function()
		{
		},
		onSecurityChange: function()
		{
		}
	};
	XMigemoFileDownloader.onCompleteListener = function() {
		bar.setAttribute('hidden', true);
		clearStatus();
		var text = status.getAttribute('label-complete');
		status.appendChild(document.createTextNode(text));

		document.documentElement.canAdvance = true;
	};
	XMigemoFileDownloader.onErrorListener = function(aError) {
		mydump(aError);
		bar.setAttribute('hidden', true);
		clearStatus();
		var text = status.getAttribute('label-error');
		status.appendChild(document.createTextNode(text));

		document.documentElement.canAdvance = true;
	};

	try {
		XMigemoFileDownloader.downloadDictionary();
	}
	catch(e) {
	}
}




function chooseFolder()
{
	var XMigemoDicManager = Components
				.classes['@piro.sakura.ne.jp/xmigemo/dictionary-manager;1']
				.getService(Components.interfaces.xmIXMigemoDicManager);

	var path = XMigemoDicManager.showDirectoryPicker(null);
	if (path) {
		document.getElementById('choose-path').value = path;
		document.documentElement.canAdvance = true;
	}
}

function saveChosenFolder()
{
	var utils = Components
			.classes['@piro.sakura.ne.jp/xmigemo/file-access;1']
			.getService(Components.interfaces.xmIXMigemoFileAccess);

	XMigemoService.setPref('xulmigemo.dicpath', '');
	XMigemoService.setPref('xulmigemo.dicpath-relative', '');
	var path = document.getElementById('choose-path').value;
	XMigemoService.setPref('xulmigemo.dicpath', path);
	XMigemoService.setPref('xulmigemo.dicpath-relative', utils.getRelativePath(path));
}


function onWizardCheckChange(aShouldShow)
{
	XMigemoService.setPref('xulmigemo.dictionary.useInitializeWizard', aShouldShow);
}


function mydump()
{
	dump(Array.slice(arguments).join(' ')+'\n');
}
