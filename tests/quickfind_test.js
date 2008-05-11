// 文字列等に非ASCII文字を使う場合は、ファイルのエンコーディングを
// UTF-8にしてください。

utils.include(baseURL+'common.inc');

var quickFindTest = new TestCase('クイックMigemo検索のテスト', {runStrategy: 'async'});

quickFindTest.tests = {
	setUp : function() {
		yield utils.setUpTestWindow();

		var retVal = utils.addTab(keyEventTest);
		yield retVal;
		commonSetUp(retVal);
		yield wait;
		assert.isTrue(XMigemoUI.findBarHidden);
	},

	tearDown : function() {
		commonTearDown();
	},

	'自動開始→自動終了': function() {
		XMigemoUI.autoStartQuickFind = true;

		var findTerm = 'nihongo';

		var key = { charCode : findTerm.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals(findTerm.charAt(0), XMigemoUI.findTerm);
		assert.notEquals('notfound', findField.getAttribute('status'));
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));

		yield XMigemoUI.timeout + wait;
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isTrue(XMigemoUI.findBarHidden);

		eval(findCommand);
		yield wait;
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));
	},

	'自動開始→手動終了（BS）': function() {
		XMigemoUI.autoStartQuickFind = true;

		var findTerm = 'nihongo';

		var key = { charCode : findTerm.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals(findTerm.charAt(0), XMigemoUI.findTerm);
		assert.notEquals('notfound', findField.getAttribute('status'));
		assert.isFalse(XMigemoUI.findBarHidden);

		action.inputTextToField(findField, '');
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isFalse(XMigemoUI.findBarHidden);

		key = { keyCode : Components.interfaces.nsIDOMKeyEvent.DOM_VK_BACK_SPACE };
		action.fireKeyEventOnElement(findField, key);
		yield wait;
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isTrue(XMigemoUI.findBarHidden);

		eval(findCommand);
		yield wait;
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));
	},

	'自動開始→手動終了（ESC）': function() {
		XMigemoUI.autoStartQuickFind = true;

		var findTerm = 'nihongo';

		var key = { charCode : findTerm.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals(findTerm.charAt(0), XMigemoUI.findTerm);
		assert.notEquals('notfound', findField.getAttribute('status'));
		assert.isFalse(XMigemoUI.findBarHidden);

		key = { keyCode : Components.interfaces.nsIDOMKeyEvent.DOM_VK_ESCAPE };
		action.fireKeyEventOnElement(findField, key);
		yield wait;
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isTrue(XMigemoUI.findBarHidden);

		eval(findCommand);
		yield wait;
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));
	},

	'自動開始→手動終了（画面クリック）': function() {
		XMigemoUI.autoStartQuickFind = true;

		var findTerm = 'nihongo';

		var key = { charCode : findTerm.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals(findTerm.charAt(0), XMigemoUI.findTerm);
		assert.notEquals('notfound', findField.getAttribute('status'));
		assert.isFalse(XMigemoUI.findBarHidden);

		action.fireMouseEventOnElement(content.document.documentElement);
		yield wait;
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isTrue(XMigemoUI.findBarHidden);

		eval(findCommand);
		yield wait;
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));
	},

	'自動開始の時に手動開始を試みた場合': function() {
		XMigemoUI.autoStartQuickFind = true;

		var key = { charCode : '/'.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('/', XMigemoUI.findTerm);
		assert.isFalse(XMigemoUI.findBarHidden);
	},

	'手動開始→自動終了': function() {
		var findTerm = 'nihongo';

		var key = { charCode : '/'.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('', XMigemoUI.findTerm);
		assert.notEquals('notfound', findField.getAttribute('status'));
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));

		yield XMigemoUI.timeout + wait;
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isTrue(XMigemoUI.findBarHidden);

		eval(findCommand);
		yield wait;
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));
	},

	'手動開始→手動終了（BS）': function() {
		var findTerm = 'nihongo';

		var key = { charCode : '/'.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('', XMigemoUI.findTerm);
		assert.notEquals('notfound', findField.getAttribute('status'));
		assert.isFalse(XMigemoUI.findBarHidden);

		key = { keyCode : Components.interfaces.nsIDOMKeyEvent.DOM_VK_BACK_SPACE };
		action.fireKeyEventOnElement(findField, key);
		yield wait;
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isTrue(XMigemoUI.findBarHidden);

		eval(findCommand);
		yield wait;
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));
	},

	'手動開始→手動終了（ESC）': function() {
		var findTerm = 'nihongo';

		var key = { charCode : '/'.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('', XMigemoUI.findTerm);
		assert.notEquals('notfound', findField.getAttribute('status'));
		assert.isFalse(XMigemoUI.findBarHidden);

		key = { keyCode : Components.interfaces.nsIDOMKeyEvent.DOM_VK_ESCAPE };
		action.fireKeyEventOnElement(findField, key);
		yield wait;
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isTrue(XMigemoUI.findBarHidden);

		eval(findCommand);
		yield wait;
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));
	},

	'手動開始→手動終了（画面クリック）': function() {
		var findTerm = 'nihongo';

		var key = { charCode : '/'.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('', XMigemoUI.findTerm);
		assert.notEquals('notfound', findField.getAttribute('status'));
		assert.isFalse(XMigemoUI.findBarHidden);

		action.fireMouseEventOnElement(content.document.documentElement);
		content.focus();
		yield wait;
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isTrue(XMigemoUI.findBarHidden);

		eval(findCommand);
		yield wait;
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));
	},

	'手動開始の時に自動開始を試みた場合': function() {
		var key = { charCode : 'n'.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.isTrue(XMigemoUI.findBarHidden);
	},

	'文字入力操作でタイマーが正しくリセットされるか': function() {
		XMigemoUI.autoStartQuickFind = true;

		var findTerm = 'nihongoNoTekisuto';

		var key = { charCode : findTerm.charCodeAt(0) };
		action.fireKeyEventOnElement(content.document.documentElement, key);
		yield wait;
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.equals(findTerm.charAt(0), XMigemoUI.findTerm);
		assert.notEquals('notfound', findField.getAttribute('status'));
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));

		var startAt = (new Date()).getTime();

		var lastInput = XMigemoUI.findTerm;
		for (var i = 1, maxi = findTerm.length+1; i < maxi; i++)
		{
			key = { charCode : findTerm.charCodeAt(i) };
			action.fireKeyEventOnElement(findField, key);
			yield wait;
			assert.equals(lastInput, XMigemoUI.findTerm);
			action.inputTextToField(findField, findTerm.substring(0, i));
			yield wait;
			lastInput = XMigemoUI.findTerm;
			if (((new Date()).getTime() - startAt) > XMigemoUI.timeout) break;
		}
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));

		action.inputTextToField(findField, findTerm);
		yield wait;
		startAt = (new Date()).getTime();

		lastInput = XMigemoUI.findTerm;
		key = { keyCode : Components.interfaces.nsIDOMKeyEvent.DOM_VK_BACK_SPACE };
		for (var i = findTerm.length; i > 0; i--)
		{
			action.fireKeyEventOnElement(findField, key);
			yield wait;
			assert.equals(lastInput, XMigemoUI.findTerm);
			action.inputTextToField(findField, findTerm.substring(0, i));
			yield wait;
			lastInput = XMigemoUI.findTerm;
			if (((new Date()).getTime() - startAt) > XMigemoUI.timeout) break;
		}
		assert.equals(XMigemoUI.FIND_MODE_MIGEMO, XMigemoUI.findMode);
		assert.isFalse(XMigemoUI.findBarHidden);
		assert.notEquals('true', XMigemoUI.timeoutIndicatorBox.getAttribute('hidden'));
	}
};
