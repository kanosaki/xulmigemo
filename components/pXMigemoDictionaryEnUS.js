/* This depends on: 
	pIXMigemoFileAccess
	pIXMigemoTextUtils
	pIXMigemoTextTransform
*/
var DEBUG = false;
 
var ObserverService = Components 
			.classes['@mozilla.org/observer-service;1']
			.getService(Components.interfaces.nsIObserverService);;

var Prefs = Components
			.classes['@mozilla.org/preferences;1']
			.getService(Components.interfaces.nsIPrefBranch);
 
function pXMigemoDictionary() {} 

pXMigemoDictionary.prototype = {
	lang : 'en-US',

	get contractID() {
		return '@piro.sakura.ne.jp/xmigemo/dictionary;1?lang='+this.lang;
	},
	get classDescription() {
		return 'This is a dictionary service for XUL/Migemo.';
	},
	get classID() {
		return Components.ID('{171e0e54-1def-11dc-8314-0800200c9a66}');
	},

	get wrappedJSObject() {
		return this;
	},
	 
	// pIXMigemoDictionary 
	 
	initialized : false, 
 
	RESULT_OK                      : 1, 
	RESULT_ERROR_INVALID_INPUT     : 2,
	RESULT_ERROR_ALREADY_EXIST     : 4,
	RESULT_ERROR_NOT_EXIST         : 8,
	RESULT_ERROR_NO_TARGET         : 16,
	RESULT_ERROR_INVALID_OPERATION : 32,
 
/* File I/O */ 
	 
	load : function() 
	{
		var file;
		var util = Components
					.classes['@piro.sakura.ne.jp/xmigemo/file-access;1']
					.getService(Components.interfaces.pIXMigemoFileAccess);
		var dicDir = util.getAbsolutePath(decodeURIComponent(escape(Prefs.getCharPref('xulmigemo.dicpath'))));

		var error = false;

		if (dicDir) {
			file = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(dicDir);
			file.append(this.lang+'.txt');
		}
		if (file && file.exists()) {
			this.list['system'] = util.readFrom(file, 'Shift_JIS');
		}
		else {
			this.list['system'] = '';
			error = true;
		}

		// ユーザー辞書
		if (dicDir) {
			file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(dicDir);
			file.append(this.lang+'.user.txt');
		}
		if (file && file.exists()) {
			mydump('user');
			this.list['user'] = util.readFrom(file, 'Shift_JIS');
		}
		else {
			this.list['user'] = '';
		}


		this.initialized = true;

		return !error;
	},
 
	reload : function() 
	{
		this.load();
	},
 
	saveUserDic : function() 
	{
		if (!('user' in this.list)) return;

		var file;
		var dicDir = decodeURIComponent(escape(Prefs.getCharPref('xulmigemo.dicpath')));
		if (!dicDir) return;

		file = Components
				.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(dicDir);
		file.append(this.lang+'.user.txt');

		var util = Components
					.classes['@piro.sakura.ne.jp/xmigemo/file-access;1']
					.getService(Components.interfaces.pIXMigemoFileAccess);
		util.writeTo(file, (this.list['user'] || ''), 'Shift_JIS');
	},
  
	addTerm : function(aInput, aTerm) 
	{
		return this.modifyDic(
			{
				input : String(arguments[0]),
				term  : String(arguments[1])
			},
			'add'
		);
	},
 
	removeTerm : function(aInput, aTerm) 
	{
		return this.modifyDic(
			{
				input : String(arguments[0]),
				term  : (arguments[1] ? String(arguments[1]) : null )
			},
			'remove'
		);
	},
  	
	// pIXMigemoDictionaryJa 
	 
	getDic : function() 
	{
		return this.list['system'];
	},
 
	getUserDic : function() 
	{
		return this.list['user'];
	},
  
	// internal 
	 
	list : [], 
 
	modifyDic : function(aTermSet, aOperation) 
	{
		if (
			!aOperation ||
			(aOperation != 'add' && aOperation != 'remove')
			)
			return this.RESULT_ERROR_INVALID_OPERATION;

		var XMigemoTextService = Components
				.classes['@piro.sakura.ne.jp/xmigemo/text-transform;1?lang=*']
				.getService(Components.interfaces.pIXMigemoTextTransform);
		var XMigemoTextUtils = Components
				.classes['@piro.sakura.ne.jp/xmigemo/text-utility;1']
				.getService(Components.interfaces.pIXMigemoTextUtils);

		var input = aTermSet.input ? String(aTermSet.input) : '' ;
		var term  = aTermSet.term ? String(aTermSet.term) : '' ;
		if (!input || !XMigemoTextService.isValidInput(input))
			return this.RESULT_ERROR_INVALID_INPUT;

		input = XMigemoTextService.normalizeInput(input);
		if (aTermSet) aTermSet.input = input;

		if (aOperation == 'add' && !term) {
			return this.RESULT_ERROR_NO_TARGET;
		}

		var systemDic = this.list['system'];
		var userDic   = this.list['user'];

		var regexp = new RegExp();

		if (aOperation == 'add') {
			// デフォルトの辞書に入っている単語は追加しない
			regexp.compile('^'+input+'\t(.+)$', 'm');
			if (regexp.test(systemDic)) {
				var terms = RegExp.$1.split('\t').join('\n');
				regexp.compile('^'+XMigemoTextUtils.sanitize(term)+'$', 'm');
				if (regexp.test(terms))
					return this.RESULT_ERROR_ALREADY_EXIST;
			}
		}

		regexp.compile('^'+input+'\t(.+)$', 'm');
		if (regexp.test(userDic)) {
			var terms = RegExp.$1.split('\t').join('\n');
			regexp.compile('^'+XMigemoTextUtils.sanitize(term)+'$', 'm');
			if ((aOperation == 'remove' && !term) || regexp.test(terms)) {
				// ユーザ辞書にすでに登録済みである場合
				switch (aOperation)
				{
					case 'add':
						return this.RESULT_ERROR_ALREADY_EXIST;

					case 'remove':
						if (term) {
							terms = terms.replace(regexp, '').replace(/\n\n+/g, '\n').split('\n').join('\t');
							mydump('terms:'+terms.replace(/\t/g, ' / '));
							if (terms) {
								regexp.compile('^('+input+'\t.+)$', 'm');
								regexp.test(userDic);
								entry = input + '\t' + terms.replace(/(^\t|\t$)/, '');
								this.list[key+'-user'] = userDic.replace(regexp, entry);
								break;
							}
						}

						regexp.compile('\n?^('+input+'\t.+)\n?', 'm');
						entry = input + '\t';
						this.list[key+'-user'] = userDic.replace(regexp, '');
						break;
				}
			}
			else {
				// ユーザ辞書にエントリはあるが、その語句は登録されていない場合
				switch (aOperation)
				{
					case 'add':
						regexp.compile('^('+input+'\t.+)$', 'm');
						regexp.test(userDic);
						entry = RegExp.$1 + '\t' + term;
						this.list[key+'-user'] = userDic.replace(regexp, entry);
						break;

					case 'remove':
						return this.RESULT_ERROR_NOT_EXIST;
				}
			}
		}
		else {
			// ユーザ辞書に未登録の場合
			switch (aOperation)
			{
				case 'add':
					entry = input + '\t' + term;
					this.list[key+'-user'] = [userDic, entry, '\n'].join('');
					break;

				case 'remove':
					return this.RESULT_ERROR_NOT_EXIST;
			}
		}

		this.saveUserDic();

		mydump('XMigemo:dictionaryModified('+aOperation+') '+entry);
		ObserverService.notifyObservers(this, 'XMigemo:dictionaryModified',
			[
				key,
				aOperation + '\t' + input + '\t' + term,
				entry
			].join('\n'));

		return this.RESULT_OK;
	},
  
	QueryInterface : function(aIID) 
	{
		if(!aIID.equals(Components.interfaces.pIXMigemoDictionary) &&
			!aIID.equals(Components.interfaces.pIXMigemoDictionaryJa) &&
			!aIID.equals(Components.interfaces.nsISupports))
			throw Components.results.NS_ERROR_NO_INTERFACE;
		return this;
	}
};
  
var gModule = { 
	_firstTime: true,

	registerSelf : function (aComponentManager, aFileSpec, aLocation, aType)
	{
		if (this._firstTime) {
			this._firstTime = false;
			throw Components.results.NS_ERROR_FACTORY_REGISTER_AGAIN;
		}
		aComponentManager = aComponentManager.QueryInterface(Components.interfaces.nsIComponentRegistrar);
		for (var key in this._objects) {
			var obj = this._objects[key];
			aComponentManager.registerFactoryLocation(obj.CID, obj.className, obj.contractID, aFileSpec, aLocation, aType);
		}
	},

	getClassObject : function (aComponentManager, aCID, aIID)
	{
		if (!aIID.equals(Components.interfaces.nsIFactory))
			throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

		for (var key in this._objects) {
			if (aCID.equals(this._objects[key].CID))
				return this._objects[key].factory;
		}

		throw Components.results.NS_ERROR_NO_INTERFACE;
	},

	_objects : {
		manager : {
			CID        : pXMigemoDictionary.prototype.classID,
			contractID : pXMigemoDictionary.prototype.contractID,
			className  : pXMigemoDictionary.prototype.classDescription,
			factory    : {
				createInstance : function (aOuter, aIID)
				{
					if (aOuter != null)
						throw Components.results.NS_ERROR_NO_AGGREGATION;
					return (new pXMigemoDictionary()).QueryInterface(aIID);
				}
			}
		}
	},

	canUnload : function (aComponentManager)
	{
		return true;
	}
};

function NSGetModule(compMgr, fileSpec)
{
	return gModule;
}
 
function mydump(aString) 
{
	if (DEBUG)
		dump((aString.length > 20 ? aString.substring(0, 20) : aString )+'\n');
}
 
