<?php
class InProgressCampaignViewModel {
    public function render() {
        ?>
        <!-- ko with: inProgressCampaignViewModel-->
        <div data-bind="visible: showInProgressCampaign" class="grouping ui-widget-content ui-corner-all">
            <div>
            <button data-bind="click: back" title="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all button-icon">
                <span class="icon-arrow-left2"></span>
            </button>
            <input type="button" data-bind="click: requestCreateEntry" value="<?php echo Translation::getString("newEntry"); ?>" class="ui-button ui-widget ui-corner-all" />
            <input type="button" data-bind="click: resetPhase, visible: showResetPhaseButton" value="<?php echo Translation::getString("newPhase"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
        
            <ul data-bind="visible: isMapCampaign">
                <li class="button-panel">
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('phaseStart'); ?>:</label>
                    <span data-bind="text: phaseStartDate"></span>
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('territoryBonus'); ?>:</label>
                    <span>
                        <span data-bind="text: availableTerritoryBonus"></span>
                        <button data-bind="click: showGiveTerritoryBonusDialog, tooltip: Translation.getString('giveTerritoryBonusTooltip')" class="ui-button ui-widget ui-corner-all inline-icon-button">
                            <span class="icon-upload"></span>
                        </button>
                    </span>
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('mandatoryAttacks'); ?>:</label>
                    <span data-bind="text: mandatoryAttacks"></span>
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('optionalAttacks'); ?>:</label>
                    <span data-bind="text: optionalAttacks"></span>
                </li>
                <!-- ko foreach: factionEntrySummaries -->
                <li class="data-list">
                    <label><span data-bind="text: factionName"></span> <?php echo Translation::getString('points'); ?>:</label>
                    <span data-bind="text: victoryPoints"></span>
                </li>
                <!-- /ko -->
            </ul>
            
            <?php
            $entryListWidget = new EntryListWidget();
            $entryListWidget->render();

            $giveTerritoryBonusToUserDialogWidget = new GiveTerritoryBonusToUserDialogWidget();
            $giveTerritoryBonusToUserDialogWidget->render();
            ?>            
        </div>
        
        <?php
        $createEntryWidget = new CreateEntryWidget();
        $createEntryWidget->render();
        ?>
        <!-- /ko -->
        <?php        
    }
}
?>