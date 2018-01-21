<?php
class PlayerListWidget {
    public function render() {
        ?>
        <!-- ko with: playerListViewModel -->
        <div data-bind="visible: isUserAdmin() && hasRequestingPlayers()">
            <h3><?php echo Translation::getString("awaitingApproval"); ?></h3>
            <table data-bind="stupidtable: {}">
                <thead>
                    <th></th>
                    <th data-sort="string"><?php echo Translation::getString("name"); ?></th>
                    <th data-sort="string"><?php echo Translation::getString("faction"); ?></th>
                </thead>
                <tbody data-bind="foreach: requestingPlayers">
                    <tr>
                        <td>
                            <button data-bind="click: approveJoinRequest, tooltip: Translation.getString('approve')" class="ui-button ui-widget ui-corner-all inline-icon-button">
                                <span class="icon-checkmark"></span>
                            </button>
                        </td>
                        <td data-bind="text: username" />
                        <td data-bind="text: factionName" />
                    <tr>
                </tbody>
            </table>
        </div>
        
        <h3><?php echo Translation::getString("inGame"); ?></h3>
        <table data-bind="stupidtable: {}">
            <thead>
                <th data-sort="string"><?php echo Translation::getString("name"); ?></th>
                <th data-sort="string"><?php echo Translation::getString("faction"); ?></th>
                <th data-sort="int"><?php echo Translation::getString("territoryBonus"); ?></th>
                <th data-sort="int"><?php echo Translation::getString("attacks"); ?></th>
                <th><?php echo ucfirst(Translation::getString("admin")); ?></th>
            </thead>
            <tbody data-bind="foreach: players">
                <tr>
                    <td data-bind="text: username" />
                    <td data-bind="text: factionName" />
                    <td data-bind="text: territoryBonus" />
                    <td data-bind="text: attacks" />
                    <td>
                        <!-- ko if: canChangeAdminStatus -->
                        <input type="checkbox" data-bind="checked: isPlayerAdmin" />
                        <!-- /ko -->
                        <!-- ko ifnot: canChangeAdminStatus -->
                        <span data-bind="css: { 'icon-cross': !isPlayerAdmin(), 'icon-checkmark': isPlayerAdmin }"></span>
                        <!-- /ko -->
                        <button data-bind="visible: isUserAdmin, click: giveTerritoryBonus, tooltip: Translation.getString('giveOneTerritoryBonusTooltip')" class="ui-button ui-widget ui-corner-all inline-icon-button">
                            <span class="icon-upload"></span>
                        </button>
                    </td>
                <tr>
            </tbody>
        </table>
        <!-- /ko -->
        <?php
    }
}
?>