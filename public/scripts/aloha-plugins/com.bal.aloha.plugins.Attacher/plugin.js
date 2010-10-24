/*
	Aloha Attacher Plugin
	Copyright (C) 2010 by Benjamin Athur Lupton - http://www.balupton.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
(function(window,undefined){
	
	// Extract
	var	GENETICS = window.GENTICS,
		jQuery = window.jQuery;
	
	// Create
	GENTICS.Aloha.Attacher = new GENTICS.Aloha.Plugin('com.bal.aloha.plugins.Attacher');
	eu.iksproject.LoaderPlugin.loadAsset('com.bal.aloha.plugins.Attacher', 'resources/style', 'css');
	
	// Extend
	jQuery.extend(GENTICS.Aloha.Attacher,{
		scope: 'GENTICS.Aloha.continuoustext',
		languages: ['en','de'],
		Buttons: null,
		Events: null,
		Modals: null,
		getModal: function(name){
			this.getModals();
			return this.Modals[name]||undefined;
		},
		getModals: function(){
			return this.Modals || (this.Modals = {
				attachImageModal: new Ext.Window({
					layout: 'fit',
					width: 500,
					height: 300,
					closeAction: 'hide',
					plain: true,
					html: 'asdasd'
				})
			});
		},
		getButton: function(name){
			this.getButtons();
			return this.Buttons[name]||undefined;
		},
		getButtons: function(){
			return this.Buttons || (this.Buttons = {
				attachImage: new GENTICS.Aloha.ui.Button({
					iconClass: 'GENTICS_button BAL_button_attach_image',
					size: 'small',
					tooltip: GENTICS.Aloha.i18n(GENTICS.Aloha.Attacher, 'attach.image'),
					group: 1,
					onclick: function() {
						var Modal = GENTICS.Aloha.Attacher.getModal('attachImageModal');
						Modal.show();
						GENTICS.Aloha.FloatingMenu.obj.hide();
					}
				})
			});
		},
		getEvent: function(name){
			this.getEvents();
			return this.Events[name];
		},
		getEvents: function(){
			return this.Events || (this.Events = {
				// No Events
			});
		},
		init: function(){
			// Fetch
			var	Buttons = GENTICS.Aloha.Attacher.getButtons(),
				Events = GENTICS.Aloha.Attacher.getEvents();
				scope = GENTICS.Aloha.Attacher.scope;
			
			// Init
			GENTICS.Aloha.FloatingMenu.createScope(scope);
			
			// Apply Buttons
			jQuery.each(Buttons,function(button,Button){
				GENTICS.Aloha.FloatingMenu.addButton(
					GENETICS.Aloha.Attacher.scope,
					Button,
					GENTICS.Aloha.i18n(GENTICS.Aloha.Attacher, 'floatingmenu.tab.insert'),
					Button.group
				);
			});
	
			// Apply Events
			jQuery.each(Events,function(event,Event){
				GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha, event, Event);
			});
		}
	});
	
})(window);