module.exports = class WorkspaceListView

	constructor: (@timeline) ->

		@clicks = @timeline.editor.clicks

		@node = document.createElement 'div'
		@node.classList.add 'timeflow-workspaceList'

		@timeline.node.appendChild @node