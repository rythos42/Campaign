<?php
class InProgressCampaignViewModel {
    public function render() {
        ?>
        <!-- ko with: inProgressCampaignViewModel-->
        <div data-bind="visible: showInProgressCampaign" class="grouping ui-widget-content ui-corner-all">
            <div class="top-button-panel">
                <button data-bind="click: back, tooltip: '<?php echo Translation::getString("back"); ?>'" class="ui-button ui-widget ui-corner-all button-icon">
                    <span class="icon-arrow-left2"></span>
                </button>
                <input type="button" data-bind="click: joinCampaign, visible: !joinedCampaign()" value="<?php echo Translation::getString("join"); ?>" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: requestCreateEntry, visible: joinedCampaign" value="<?php echo Translation::getString("newEntry"); ?>" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: resetPhase, visible: showResetPhaseButton" value="<?php echo Translation::getString("newPhase"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
        
            <ul data-bind="visible: joinedCampaign">
                <li>
                    <h3><?php echo Translation::getString("campaign"); ?></h3>
                </li>
                <li class="data-list" data-bind="visible: isMapCampaign">
                    <label><?php echo Translation::getString('phaseStart'); ?>:</label>
                    <span data-bind="text: phaseStartDate"></span>
                </li>
                <li class="data-list" data-bind="visible: isMapCampaign">
                    <label><?php echo Translation::getString('territoryBonus'); ?>:</label>
                    <span>
                        <span data-bind="text: availableTerritoryBonus"></span>
                        <button data-bind="click: showGiveTerritoryBonusDialog, tooltip: Translation.getString('giveTerritoryBonusTooltip'), visible: joinedCampaign" class="ui-button ui-widget ui-corner-all inline-icon-button">
                            <span class="icon-upload"></span>
                        </button>
                    </span>
                </li>
                <li class="data-list" data-bind="visible: isMapCampaign">
                    <label><?php echo Translation::getString('mandatoryAttacks'); ?>:</label>
                    <span data-bind="text: mandatoryAttacks"></span>
                </li>
                <li class="data-list" data-bind="visible: isMapCampaign">
                    <label><?php echo Translation::getString('optionalAttacks'); ?>:</label>
                    <span data-bind="text: optionalAttacks"></span>
                </li>
                <!-- ko foreach: factionEntrySummaries -->
                <li class="data-list">
                    <label><span data-bind="text: factionName"></span> <?php echo Translation::getString('vps'); ?>:</label>
                    <span data-bind="text: victoryPoints"></span>
                </li>
                <!-- /ko -->
            </ul>
            
            <div data-bind="tab: {}" class="ui-widget ui-corners-all ui-widget-content">
                <ul>
                    <li><a href="#EntriesTab"><?php echo Translation::getString("entries"); ?></a></li>
                    <li><a href="#PlayersTab"><?php echo Translation::getString("players"); ?></a></li>
                </ul>
                <div id="EntriesTab">
                    <?php
                    $entryListWidget = new EntryListWidget();
                    $entryListWidget->render();
                    ?>
                </div>
                <div id="PlayersTab">
                    <?php
                    $playerListWidget = new PlayerListWidget();
                    $playerListWidget->render();
                    ?>
                </div>
            </div>
            <?php
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