sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("inicial.controller.Gannt", {
		onInit: function () {
            
		},
		onShapeResize: function (oEvent) {
			var oShape = oEvent.getParameter("shape");
			var aNewTime = oEvent.getParameter("newTime");
			var sBindingPath = oShape.getBindingContext().getPath();
			var oTableGantt = this.getView().byId("gantt1");
			var oDataModel = oTableGantt.getModel();
			oDataModel.setProperty(sBindingPath + "/StartDate", aNewTime[0], true);
			oDataModel.setProperty(sBindingPath + "/EndDate", aNewTime[1], true);
			this.getView().getModel().submitChanges();
		},
		onShapeDrop: function(oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			var oDataModel = oTableGantt.getModel();
			var oNewDateTime = oEvent.getParameter("newDateTime");
			var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
			var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");
			var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
			var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
			var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
			if (oTableGantt.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.End) {
				iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
			}

			var getBindingContextPath = function (sShapeUid) {
				var oParsedUid = sap.gantt.misc.Utility.parseUid(sShapeUid);
				return oParsedUid.shapeDataName;
			};

			Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
				var sPath = getBindingContextPath(sShapeUid);
				var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
				var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
				var oNewDateTime = new Date(oOldDateTime.getTime() + iMoveWidthInMs);
				var oNewEndDateTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
				oDataModel.setProperty(sPath + "/StartDate", oNewDateTime, true);
				oDataModel.setProperty(sPath + "/EndDate", oNewEndDateTime, true);
			});
			this.getView().getModel().submitChanges();
		},
		handleExpandShape: function (oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			var oTable = oTableGantt.getTable();
			var aSelectedRows = oTable.getSelectedIndices();
			oTable.expand(aSelectedRows);
		},

		handleCollapseShape: function (oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			var oTable = oTableGantt.getTable();
			var aSelectedRows = oTable.getSelectedIndices();
			oTable.collapse(aSelectedRows);
		}
	});
});