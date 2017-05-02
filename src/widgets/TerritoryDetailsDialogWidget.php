<?php
class TerritoryDetailsDialogWidget {
    public function render() {
        ?>
        <!-- ko with: territoryDetailsDialogViewModel -->
        <div data-bind="dialog: { title: dialogTitle, width: 300}, dialogOpenClose: dialogOpenClose">
            <ul>
                <li class="data-list">
                    <label><?php echo Translation::getString('tags'); ?>:</label> <span data-bind="text: tags"></span>
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('ownedBy'); ?>:</label> <span data-bind="text: ownedBy"></span>
                </li>
                <!-- ko foreach: attackingPlayers -->
                <li class="data-list">
                    <label><?php echo Translation::getString('attackedBy'); ?>:</label> <span data-bind="text: playerName"></span>
                </li>
                <!-- /ko -->
                <!-- ko foreach: defendingPlayers -->
                <li class="data-list">
                    <label><?php echo Translation::getString('defendedBy'); ?>:</label> <span data-bind="text: playerName"></span>
                </li>
                <!-- /ko -->
                <li class="button-panel">
                    <input type="button" data-bind="click: played" value="<?php echo Translation::getString("played"); ?>" class="ui-button ui-widget ui-corner-all" />
                    <input type="button" data-bind="click: attack, visible: canBeAttacked" value="<?php echo Translation::getString("attack"); ?>" class="ui-button ui-widget ui-corner-all" />
                    <input type="button" data-bind="click: defend, visible: canBeDefended" value="<?php echo Translation::getString("defend"); ?>" class="ui-button ui-widget ui-corner-all" />
                    <input type="button" data-bind="click: cancel" value="<?php echo Translation::getString("cancel"); ?>" class="ui-button ui-widget ui-corner-all" />
                </li>
            </ul>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>