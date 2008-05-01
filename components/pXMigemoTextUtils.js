var Prefs = Components 
			.classes['@mozilla.org/preferences;1']
			.getService(Components.interfaces.nsIPrefBranch);
 
function pXMigemoTextUtils() {} 

pXMigemoTextUtils.prototype = {
	get contractID() {
		return '@piro.sakura.ne.jp/xmigemo/text-utility;1';
	},
	get classDescription() {
		return 'This is a text utility service for XUL/Migemo.';
	},
	get classID() {
		return Components.ID('{71715174-1dd4-11dc-8314-0800200c9a66}');
	},

	get wrappedJSObject() {
		return this;
	},
	 
/* convert HTML to text */ 
	
	range2Text : function(aRange) 
	{
		var doc=aRange.startContainer.ownerDocument;
		var scrs=doc.getElementsByTagName("script");
		var trash=doc.createRange();
		var noscrs=doc.getElementsByTagName("noscript");
		if(Prefs.getBoolPref('javascript.enabled')){
			for(var i=0;i<noscrs.length;i++){
				trash.selectNode(noscrs[i]);
				trash.deleteContents();
			}
		}
		var str=new String();
		var tmp = doc.createRange();
		tmp.setStart(aRange.startContainer,aRange.startOffset);
		var tmp2 = doc.createRange();
		var st=aRange.startContainer;
		var en=aRange.endContainer;
		for(var i=0;i<scrs.length;i++){
			if(scrs[i].parentNode.tagName.toUpperCase()=="HEAD"){continue;}

			tmp2.selectNode(scrs[i]);
			if(aRange.compareBoundaryPoints(0,tmp2)==-1&&
			tmp2.compareBoundaryPoints(2,aRange)==-1){

			tmp.setEndBefore(scrs[i]);
			str+=tmp.toString();
			tmp.selectNode(scrs[i]);
			tmp.collapse(false);
			//tmp.setStartAfter(scrs[i]);�Ȃ����G���[���o��
			}
		}

		tmp.setEnd(aRange.endContainer,aRange.endOffset);
		str+=tmp.toString();
		return str;
	},
 
/* 
	body2text : function()
	{
		var scrs = document.getElementsByTagName("script");
		var tmp=document.createRange();
		var str="";
		tmp.setStartBefore(document.body);
		for(var i=0;i<scrs.length;i++){
			if(scrs[i].parentNode.tagName.toUpperCase()=="HEAD"){continue;}
			tmp.setEndBefore(scrs[i]);
			str+=tmp.toString();
			tmp.selectNode(scrs[i]);
			tmp.collapse(false);
			//tmp.setStartAfter(scrs[i]);�Ȃ����G���[���o��
		}
		tmp.setEndAfter(document.body);
		str+=tmp.toString();
		return str;
		//alert(str);
	},
*/
 
/* 
	//htmlToText(by flyson)
	htmlToText : function(aStr)
	{
	    var formatConverter = Components.classes["@mozilla.org/widget/htmlformatconverter;1"]
	                                .createInstance(Components.interfaces.nsIFormatConverter);
	    var fromStr = Components.classes["@mozilla.org/supports-string;1"]
	                                .createInstance(Components.interfaces.nsISupportsString);
	    fromStr.data = aStr;
	    var toStr = { value: null };

	    formatConverter.convert("text/html", fromStr, fromStr.toString().length,
	                            "text/unicode", toStr, {});
	    toStr = toStr.value.QueryInterface(Components.interfaces.nsISupportsString);
	    toStr = toStr.toString();
	    return toStr;
	},
*/
 
/* 
	htmlToPureText : function(aStr)
	{
	},
*/
  
/* manipulate regular expressions */ 
	
	sanitize : function(str) 
	{
		//	[]^.+*?$|{}\(),  ���K�\���̃��^�L�����N�^���G�X�P�[�v
		str = str.replace(/([\-\:\}\{\|\$\?\*\+\.\^\]\/\[\;\\\(\)])/g,"\\$1");
		return str;
	},
 
	sanitize2 : function(str) 
	{
		//	^.+*?${}\,
		str = str.replace(/([\-\:\}\{\$\?\*\+\.\^\/\;\\])/g,"\\$1");
		return str;
	},
 
	reverseRegExp : function(aExp) 
	{
		var tmp = aExp;
		tmp = tmp.replace(/\[\]\|/im,"")
				.replace(/(\([^\)]+\))\?/g, '[[OPERATOR-QUESTION]]$1') // for multiple terms
				.replace(/(\[[^\]]+\])\+/g, '[[OPERATOR-PLUS]]$1') // for multiple terms
				.replace(/(\[[^\]]+\])\*/g, '[[OPERATOR-STAR]]$1') // for multiple terms
				.replace(/(.)\?/g, '[[OPERATOR-QUESTION]]$1')
				.replace(/(.)\+/g, '[[OPERATOR-PLUS]]$1')
				.replace(/(.)\*/g, '[[OPERATOR-STAR]]$1')
				.replace(/\(/g,"[[OPERATOR-OPEN-PAREN]]")
				.replace(/\)/g,"(")
				.replace(/\[\[OPERATOR-OPEN-PAREN\]\]/g,")")
				.replace(/\[\[OPERATOR-QUESTION\]\]/g,"?")
				.replace(/\[\[OPERATOR-PLUS\]\]/g,"+")
				.replace(/\[\[OPERATOR-STAR\]\]/g,"*");
		tmp = tmp.replace(/\[([^\[]+?)\]/img,"\]$1\[").split("").reverse().join("")
		tmp = tmp.replace(/(.)\\/g,"\\$1");
		return tmp;
	},
  
/* Restore selection after "highlight all" */ 
	 
	getFoundRange : function(aFrame) 
	{
		var docShell = aFrame
			.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIWebNavigation)
			.QueryInterface(Components.interfaces.nsIDocShell);
		var selCon = docShell
			.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsISelectionDisplay)
			.QueryInterface(Components.interfaces.nsISelectionController);
		if (selCon.getDisplaySelection() == selCon.SELECTION_ATTENTION) {
			var sel   = aFrame.getSelection();
			var range = sel.getRangeAt(0);
			return range;
		}
		return null;
	},
 
	isRangeOverlap : function(aBaseRange, aTargetRange) 
	{
		if (!aBaseRange || !aTargetRange) return false;

		return (
			aBaseRange.compareBoundaryPoints(aBaseRange.START_TO_START, aTargetRange) >= 0 &&
			aBaseRange.compareBoundaryPoints(aBaseRange.END_TO_END, aTargetRange) <= 0
		) || (
			aTargetRange.compareBoundaryPoints(aBaseRange.START_TO_START, aBaseRange) >= 0 &&
			aTargetRange.compareBoundaryPoints(aBaseRange.END_TO_END, aBaseRange) <= 0
		);
	},
 
	delayedSelect : function(aNode, aSelectLength, aIsHighlight) 
	{
		/*
			���݂̑I��͈͂̎n�_���Anormalize()��̃e�L�X�g�m�[�h�̒���
			�������ڂɂȂ邩�����߂�
		*/
		var startNodeInfo = this.countPreviousText(aNode.previousSibling);
		var startOffset = startNodeInfo.count;

		/*
			normalize()��̃e�L�X�g�m�[�h���A�e�m�[�h�̉��Ԗڂ̎q�m�[�h��
			�Ȃ邩�����߂�i�����\����������Ԃ�z��j
		*/
		var childCount = 0;
		this.countPreviousText(aNode);
		while (startNodeInfo.lastNode && startNodeInfo.lastNode.previousSibling)
		{
			startNodeInfo = this.countPreviousText(startNodeInfo.lastNode.previousSibling);
			childCount++;
		}

		if (startOffset || childCount || this.countNextText(aNode).lastNode != aNode) {
			// normalize()�ɂ���đI��͈͂̎n�_�E�I�_���ς��ꍇ
			if (this.delayedSelectTimer) {
				this.delayedSelectTimer.cancel();
				this.delayedSelectTimer = null;
			}
			this.delayedSelectTimer = Components
				.classes['@mozilla.org/timer;1']
				.createInstance(Components.interfaces.nsITimer);
	        this.delayedSelectTimer.init(
				this.createDelayedSelectObserver(aNode.parentNode, startOffset, childCount, aSelectLength, aIsHighlight),
				1,
				Components.interfaces.nsITimer.TYPE_ONE_SHOT
			);
		}
		else {
			var doc = aNode.ownerDocument;
			var selectRange = doc.createRange();
			if (aNode.nodeType == aNode.ELEMENT_NODE) {
				selectRange.selectNodeContents(aNode);
			}
			else if (aSelectLength) {
				selectRange.setStart(aNode, 0);
				var endNode = aNode;
				var offset = aSelectLength;
				while (endNode.textContent.length < offset)
				{
					offset -= endNode.textContent.length;
					node = this.getNextTextNode(endNode);
					if (!node) break;
					endNode = node;
				}
				selectRange.setEnd(endNode, offset);
			}
			else {
				selectRange.selectNode(aNode);
			}
			var sel = doc.defaultView.getSelection();
			sel.removeAllRanges();
			sel.addRange(selectRange);
			this.setSelectionLook(doc, aIsHighlight);
		}
	},
	 
	delayedSelectTimer : null, 
 
	// �m�[�h�̍č\�z���I�������őI��͈͂𕜌�����
	createDelayedSelectObserver : function(aStartParent, aStartOffset, aChildCount, aSelectLength, aIsHighlight) 
	{
		return ({
			owner       : this,
			parent      : aStartParent,
			startOffset : aStartOffset,
			childCount  : aChildCount,
			length      : aSelectLength,
			highlight   : aIsHighlight,
			observe     : function(aSubject, aTopic, aData)
			{
				if (aTopic != 'timer-callback') return;

				var doc = this.parent.ownerDocument;

				// �I��͈͂̎n�_���܂ރe�L�X�g�m�[�h�܂ňړ�
				var startNode = this.parent.firstChild;
				var startNodeInfo;
				while (this.childCount--)
				{
					startNodeInfo = this.owner.countNextText(startNode);
					startNode = startNodeInfo.lastNode.nextSibling;
				}

				var node;
				var startOffset = this.startOffset;
				var selectRange = doc.createRange();
				if (startOffset) {
					// �n�_�̈ʒu�܂ňړ����āA�n�_��ݒ�
					while (startNode.textContent.length <= startOffset)
					{
						startOffset -= startNode.textContent.length;
						node = this.owner.getNextTextNode(startNode);
						if (!node) break;
						startNode = node;
					}
					selectRange.setStart(startNode, startOffset);
				}
				else {
					selectRange.setStartBefore(this.parent.firstChild);
				}

				var endNode = startNode;
				var offset = this.length;
				while (endNode.textContent.length <= offset)
				{
					offset -= endNode.textContent.length;
					node = this.owner.getNextTextNode(endNode);
					if (!node) break;
					endNode = node;
				}
				if (endNode == startNode) offset += startOffset;
				selectRange.setEnd(endNode, offset);

				var sel = doc.defaultView.getSelection();
				sel.removeAllRanges();
				sel.addRange(selectRange);
				this.owner.setSelectionLook(doc, this.highlight);

				this.owner.delayedSelectTimer.cancel();
				this.owner.delayedSelectTimer = null;
			}
		});
	},
 
	/* 
		�����\���̗L�閳���𖳎����āA�I�[�ɂ���e�L�X�g�m�[�h�ƁA
		�����܂ł́inormalize()�ɂ���Č��������ł��낤�j�e�L�X�g�m�[�h��
		�����̘a�𓾂�B
		�����\���p�̗v�f�͏�Ƀe�L�X�g�m�[�h�̒���ɂ������꓾�Ȃ��̂ŁA
		�u�����\���p�̗v�f�����遁�����\�����������ꂽ�炻���̓e�L�X�g�m�[�h�ɂȂ�v
		�Ɣ��f���邱�Ƃ��ł���B
	*/
	countPreviousText : function(aNode)
	{
		var count = 0;
		var node = aNode;
		while (this.isTextNodeOrHighlight(node))
		{
			aNode = node;
			count += aNode.textContent.length;
			var node = aNode.previousSibling;
			if (!node) break;
		}
		return { lastNode : aNode, count : count };
	},
 
	countNextText : function(aNode) 
	{
		var count = 0;
		var node = aNode;
		while (this.isTextNodeOrHighlight(node))
		{
			aNode = node;
			count += aNode.textContent.length;
			var node = aNode.nextSibling;
			if (!node) break;
		}
		return { lastNode : aNode, count : count };
	},
 
	isTextNodeOrHighlight : function(aNode) 
	{
		return aNode && (
				aNode.nodeType == aNode.TEXT_NODE ||
				(
					aNode.nodeType == aNode.ELEMENT_NODE &&
					(
						aNode.getAttribute('id') == '__firefox-findbar-search-id' ||
						aNode.getAttribute('class') == '__firefox-findbar-search'
					)
				)
			);
	},
 
	getNextTextNode : function(aNode) 
	{
		if (!aNode) return null;
		aNode = aNode.nextSibling || aNode.parentNode.nextSibling;
		if (!aNode) return null;
		if (aNode.nodeType != aNode.TEXT_NODE)
			aNode = aNode.firstChild;
		return !aNode ? null :
				aNode.nodeType == aNode.TEXT_NODE ? aNode :
				this.getNextTextNode(aNode);
	},
 
	setSelectionLook : function(aDocument, aChangeColor) 
	{
		var selCon;
		if (aDocument.foundEditable) {
			var editor = aDocument.foundEditable.QueryInterface(Components.interfaces.nsIDOMNSEditableElement).editor;
			selCon = editor.selectionController;

			if (aChangeColor) {
				selCon.setDisplaySelection(selCon.SELECTION_ATTENTION);
			}else{
				selCon.setDisplaySelection(selCon.SELECTION_ON);
			}
			try {
				selCon.repaintSelection(selCon.SELECTION_NORMAL);
			}
			catch(e) {
			}
		}

		var docShell = this.getDocShellForFrame(aDocument.defaultView);
		selCon = docShell
			.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsISelectionDisplay)
			.QueryInterface(Components.interfaces.nsISelectionController);

		if (aChangeColor) {
			selCon.setDisplaySelection(selCon.SELECTION_ATTENTION);
		}else{
			selCon.setDisplaySelection(selCon.SELECTION_ON);
		}
		try {
			selCon.repaintSelection(selCon.SELECTION_NORMAL);
		}
		catch(e) {
		}
	},
	getDocShellForFrame : function(aFrame)
	{
		return aFrame
				.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
				.getInterface(Components.interfaces.nsIWebNavigation)
				.QueryInterface(Components.interfaces.nsIDocShell);
	},
 	  
	QueryInterface : function(aIID) 
	{
		if(!aIID.equals(Components.interfaces.pIXMigemoTextUtils) &&
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
			CID        : pXMigemoTextUtils.prototype.classID,
			contractID : pXMigemoTextUtils.prototype.contractID,
			className  : pXMigemoTextUtils.prototype.classDescription,
			factory    : {
				createInstance : function (aOuter, aIID)
				{
					if (aOuter != null)
						throw Components.results.NS_ERROR_NO_AGGREGATION;
					return (new pXMigemoTextUtils()).QueryInterface(aIID);
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
 
