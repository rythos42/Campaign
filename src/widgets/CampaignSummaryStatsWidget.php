<?php
class CampaignSummaryStatsWidget {
    public function render() {
        ?>
        <!-- ko with: campaignSummaryStatsViewModel -->
        <ul data-bind="visible: hasJoinedCampaign">
            <li class="data-list" data-bind="visible: isMapCampaign">
                <label><?php echo Translation::getString('phaseStart'); ?>:</label>
                <span data-bind="text: phaseStartDate"></span>
            </li>
            <li class="data-list" data-bind="visible: isMapCampaign">
                <label><?php echo Translation::getString('territoryBonus'); ?>:</label>
                <span>
                    <span data-bind="text: availableTerritoryBonus"></span>
                    <button data-bind="click: showGiveTerritoryBonusDialog, tooltip: Translation.getString('giveTerritoryBonusTooltip'), visible: hasJoinedCampaign" class="ui-button ui-widget ui-corner-all inline-icon-button">
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
        <div class="join-to-see" data-bind="visible: !hasJoinedCampaign()">
            <?php echo Translation::getString('joinToSee'); ?>
        </div>
        
        <?php
        $giveTerritoryBonusToUserDialogWidget = new GiveTerritoryBonusToUserDialogWidget();
        $giveTerritoryBonusToUserDialogWidget->render();
        ?>
        <!-- /ko -->
        <?php
    }
}
?>