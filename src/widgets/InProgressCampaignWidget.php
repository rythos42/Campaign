<?php
class InProgressCampaignViewModel {
    public function render() {
        
        ?>
        <!-- ko with: inProgressCampaignViewModel-->
        <div data-bind="visible: showInProgressCampaign">
            <input type="button" data-bind="click: requestCreateEntry" value="<?php echo Translation::getString("createEntry"); ?>" class="ui-button ui-widget ui-corner-all" />
            <input type="button" data-bind="click: back" value="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all" />
            <input type="button" data-bind="click: resetPhase, visible: isMapCampaign" value="<?php echo Translation::getString("nextPhase"); ?>" class="ui-button ui-widget ui-corner-all" />
        
            <ul data-bind="visible: isMapCampaign">
                <li class="data-list">
                    <label><?php echo Translation::getString('territoryBonus'); ?>:</label>
                    <span data-bind="text: availableTerritoryBonus"></span>
                    <button data-bind="click: showGiveTerritoryBonusDialog, tooltip: Translation.getString('giveTerritoryBonusTooltip')" class="ui-button ui-widget ui-corner-all ui-button-icon-only outset-icon-button">
                        <span class="ui-icon ui-icon-caret-1-e"></span>
                    </button>
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('mandatoryAttacks'); ?>:</label>
                    <span data-bind="text: mandatoryAttacks"></span>
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('optionalAttacks'); ?>:</label>
                    <span data-bind="text: optionalAttacks"></span>
                </li>
            </ul>
            
            <?php
            $giveTerritoryBonusToUserDialogWidget = new GiveTerritoryBonusToUserDialogWidget();
            $giveTerritoryBonusToUserDialogWidget->render();
            ?>            
        </div>
        
        <?php
        $createEntryWidget = new CreateEntryWidget();
        $createEntryWidget->render();
        
        $entryListWidget = new EntryListWidget();
        $entryListWidget->render();
        ?>
        <!-- /ko -->
        <?php        
    }
}
?>