sap.ui.define([
	"sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Controller, DateFormat, JSONModel) {
    "use strict";

    return Controller.extend("dzproject01.controller.Details", {
        onInit() {
			var oRouter = UIComponent.getRouterFor(this);

			oRouter.getRoute("details").attachPatternMatched(this.onPatternMatched, this);
			oRouter.getRoute("detailsNoList").attachPatternMatched(this.onPatternMatched, this);
			this.oActiveContext = null;
        },
		onPatternMatched : function (oEvent) {

            var sSource = jQuery.sap.getUriParameters().get("source");
            
			var oContext,
                sPath = "/Header('" + sSource + "')/Set" + oEvent.getParameter("arguments").key,
				oView = this.getView();
				
            oView.bindElement({
                path: sPath
            });

			oContext = oView.getBindingContext();
			
			oContext = oView.getModel().getKeepAliveContext(sPath, false,
				{$$patchWithoutSideEffects : true});

			oView.setBindingContext(oContext);
		
			this.setShowList(!oEvent.getParameter("config").pattern.endsWith("?noList"));
		    			
			var oModel = this.getView().getModel();
		},
        
        getKeyPredicate : function (oContext) {
			var sPath = oContext.getPath();

			return sPath.slice(sPath.indexOf("(", sPath.lastIndexOf("/")));
		},

		navTo : function (oContext, bShowList) {
			if (bShowList === undefined) {
				bShowList = this.getView().getModel("ui").getProperty("/bShowList");
			}

			UIComponent.getRouterFor(this)
				.navTo(bShowList ? "details" : "detailsNoList",
					{key : this.getKeyPredicate(oContext)}, true);
		},

		onShowList : function () {
			this.navTo(this.getView().getBindingContext(),
				!this.getView().getModel("ui").getProperty("/bShowList"));
		},

		setShowList : function (bShowList) {
			var oModel = this.getView().getModel("ui");

			oModel.setProperty("/bShowList", bShowList);
			oModel.setProperty("/sShowListIcon",
				bShowList ? "sap-icon://close-command-field" : "sap-icon://open-command-field");
			oModel.setProperty("/sShowListTooltip", bShowList ? "Hide HU" : "Show HU");
		},
		formatDateTime: function(dateTime) {
			var dt = DateFormat.getDateTimeInstance({ pattern: "EEEE, MM/dd/yyyy 'at' hh:mm:ss a" });
			var jsDateObject = dt.parse(dateTime);
			return dt.format(jsDateObject) 
		},
		onClickSpot: function (evt) {
			//evt.getSource().openDetailWindow("My Detail Window", "0", "0" );
		},
		onContextMenuSpot: function ( evt ) {
		}
    });
});